const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3004;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory order storage
const orders = [];

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'order-service' });
});

// Create order
app.post('/orders', (req, res) => {
  const { userId, items, total, shippingAddress } = req.body;

  if (!userId || !items || items.length === 0) {
    return res.status(400).json({ error: 'User ID and items are required' });
  }

  const order = {
    id: orders.length + 1,
    userId,
    items,
    total: parseFloat(total),
    shippingAddress: shippingAddress || 'Default Address',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  orders.push(order);

  res.status(201).json({
    message: 'Order created successfully',
    order
  });
});

// Get all orders for a user
app.get('/orders/user/:userId', (req, res) => {
  const { userId } = req.params;
  const userOrders = orders.filter(order => order.userId === parseInt(userId));

  res.json(userOrders);
});

// Get specific order
app.get('/orders/:orderId', (req, res) => {
  const order = orders.find(o => o.id === parseInt(req.params.orderId));

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json(order);
});

// Get all orders (for admin)
app.get('/orders', (req, res) => {
  res.json(orders);
});

// Update order status (for admin)
app.put('/orders/:orderId/status', (req, res) => {
  const { status } = req.body;
  const orderIndex = orders.findIndex(o => o.id === parseInt(req.params.orderId));

  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  orders[orderIndex].status = status;
  orders[orderIndex].updatedAt = new Date();

  res.json({
    message: 'Order status updated',
    order: orders[orderIndex]
  });
});

// Permanently delete an order (hard delete) - only allowed for cancelled orders for safety
app.delete('/orders/:orderId/hard', (req, res) => {
  const orderIndex = orders.findIndex(o => o.id === parseInt(req.params.orderId));

  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  // Optional guard: only allow deleting cancelled orders
  if (orders[orderIndex].status !== 'cancelled') {
    return res.status(400).json({ error: 'Only cancelled orders can be deleted' });
  }

  const [removed] = orders.splice(orderIndex, 1);

  res.json({
    message: 'Order deleted',
    order: removed
  });
});

// Cancel order
app.delete('/orders/:orderId', (req, res) => {
  const orderIndex = orders.findIndex(o => o.id === parseInt(req.params.orderId));

  if (orderIndex === -1) {
    return res.status(404).json({ error: 'Order not found' });
  }

  orders[orderIndex].status = 'cancelled';
  orders[orderIndex].updatedAt = new Date();

  res.json({
    message: 'Order cancelled',
    order: orders[orderIndex]
  });
});

app.listen(PORT, () => {
  console.log(`Order Service running on port ${PORT}`);
});
