const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory cart storage (userId -> cart items)
const carts = {};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'cart-service' });
});

// Get cart for user
app.get('/cart/:userId', (req, res) => {
  const { userId } = req.params;
  const cart = carts[userId] || [];
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  res.json({
    userId,
    items: cart,
    total: total.toFixed(2),
    itemCount: cart.reduce((sum, item) => sum + item.quantity, 0)
  });
});

// Add item to cart
app.post('/cart/:userId/add', (req, res) => {
  const { userId } = req.params;
  const { productId, name, price, quantity, image } = req.body;

  if (!productId || !name || !price) {
    return res.status(400).json({ error: 'Product details are required' });
  }

  if (!carts[userId]) {
    carts[userId] = [];
  }

  // Check if item already exists in cart
  const existingItemIndex = carts[userId].findIndex(item => item.productId === productId);

  if (existingItemIndex !== -1) {
    // Update quantity
    carts[userId][existingItemIndex].quantity += quantity || 1;
  } else {
    // Add new item
    carts[userId].push({
      productId,
      name,
      price: parseFloat(price),
      quantity: quantity || 1,
      image: image || 'https://via.placeholder.com/100x100?text=Product'
    });
  }

  const total = carts[userId].reduce((sum, item) => sum + (item.price * item.quantity), 0);

  res.json({
    message: 'Item added to cart',
    cart: {
      userId,
      items: carts[userId],
      total: total.toFixed(2),
      itemCount: carts[userId].reduce((sum, item) => sum + item.quantity, 0)
    }
  });
});

// Update item quantity
app.put('/cart/:userId/item/:productId', (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  if (!carts[userId]) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const itemIndex = carts[userId].findIndex(item => item.productId === parseInt(productId));

  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found in cart' });
  }

  if (quantity <= 0) {
    // Remove item if quantity is 0 or less
    carts[userId].splice(itemIndex, 1);
  } else {
    carts[userId][itemIndex].quantity = quantity;
  }

  const total = carts[userId].reduce((sum, item) => sum + (item.price * item.quantity), 0);

  res.json({
    message: 'Cart updated',
    cart: {
      userId,
      items: carts[userId],
      total: total.toFixed(2),
      itemCount: carts[userId].reduce((sum, item) => sum + item.quantity, 0)
    }
  });
});

// Remove item from cart
app.delete('/cart/:userId/item/:productId', (req, res) => {
  const { userId, productId } = req.params;

  if (!carts[userId]) {
    return res.status(404).json({ error: 'Cart not found' });
  }

  const itemIndex = carts[userId].findIndex(item => item.productId === parseInt(productId));

  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found in cart' });
  }

  carts[userId].splice(itemIndex, 1);

  const total = carts[userId].reduce((sum, item) => sum + (item.price * item.quantity), 0);

  res.json({
    message: 'Item removed from cart',
    cart: {
      userId,
      items: carts[userId],
      total: total.toFixed(2),
      itemCount: carts[userId].reduce((sum, item) => sum + item.quantity, 0)
    }
  });
});

// Clear cart
app.delete('/cart/:userId', (req, res) => {
  const { userId } = req.params;
  carts[userId] = [];

  res.json({
    message: 'Cart cleared',
    cart: {
      userId,
      items: [],
      total: '0.00',
      itemCount: 0
    }
  });
});

app.listen(PORT, () => {
  console.log(`Cart Service running on port ${PORT}`);
});
