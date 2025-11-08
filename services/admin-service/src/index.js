const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3005;

// Service URLs (can be configured via environment variables)
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002';
const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || 'http://localhost:3004';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Simple admin credentials (hardcoded for prototype)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'admin-service' });
});

// Admin login
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
    res.json({
      message: 'Login successful',
      token: 'admin-token-' + Date.now(),
      admin: { username: 'admin' }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Product Management - proxies to product service

// Get all products
app.get('/admin/products', async (req, res) => {
  try {
    const response = await axios.get(`${PRODUCT_SERVICE_URL}/products`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Add product
app.post('/admin/products', async (req, res) => {
  try {
    const response = await axios.post(`${PRODUCT_SERVICE_URL}/products`, req.body);
    res.status(201).json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product' });
  }
});

// Update product
app.put('/admin/products/:id', async (req, res) => {
  try {
    const response = await axios.put(`${PRODUCT_SERVICE_URL}/products/${req.params.id}`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
app.delete('/admin/products/:id', async (req, res) => {
  try {
    const response = await axios.delete(`${PRODUCT_SERVICE_URL}/products/${req.params.id}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// Order Management - proxies to order service

// Get all orders
app.get('/admin/orders', async (req, res) => {
  try {
    const response = await axios.get(`${ORDER_SERVICE_URL}/orders`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status
app.put('/admin/orders/:id/status', async (req, res) => {
  try {
    const response = await axios.put(`${ORDER_SERVICE_URL}/orders/${req.params.id}/status`, req.body);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Dashboard stats
app.get('/admin/stats', async (req, res) => {
  try {
    const [productsRes, ordersRes] = await Promise.all([
      axios.get(`${PRODUCT_SERVICE_URL}/products`),
      axios.get(`${ORDER_SERVICE_URL}/orders`)
    ]);

    const products = productsRes.data;
    const orders = ordersRes.data;

    const stats = {
      totalProducts: products.length,
      totalOrders: orders.length,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
      totalRevenue: orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

app.listen(PORT, () => {
  console.log(`Admin Service running on port ${PORT}`);
});
