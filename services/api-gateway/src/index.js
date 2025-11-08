const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
// Important: Do NOT use express.json() before proxying requests.
// It consumes the request body stream, which breaks proxying of JSON POSTs
// (causes upstream timeouts like 408 due to content-length mismatch).

// Service URLs
const services = {
  user: process.env.USER_SERVICE_URL || 'http://localhost:3001',
  product: process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002',
  cart: process.env.CART_SERVICE_URL || 'http://localhost:3003',
  order: process.env.ORDER_SERVICE_URL || 'http://localhost:3004',
  admin: process.env.ADMIN_SERVICE_URL || 'http://localhost:3005'
};

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'api-gateway',
    timestamp: new Date().toISOString()
  });
});

// Gateway info
app.get('/', (req, res) => {
  res.json({
    message: 'TezCart API Gateway',
    version: '1.0.0',
    services: {
      user: '/api/users',
      product: '/api/products',
      cart: '/api/cart',
      order: '/api/orders',
      admin: '/api/admin'
    }
  });
});

// Proxy configurations
const proxyOptions = {
  changeOrigin: true,
  logLevel: 'debug',
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Service unavailable' });
  }
};

// User Service routes
app.use('/api/users', createProxyMiddleware({
  ...proxyOptions,
  target: services.user,
  pathRewrite: {
    '^/api/users': ''
  }
}));

// Product Service routes
app.use('/api/products', createProxyMiddleware({
  ...proxyOptions,
  target: services.product,
  pathRewrite: {
    '^/api/products': '/products'
  }
}));

app.use('/api/categories', createProxyMiddleware({
  ...proxyOptions,
  target: services.product,
  pathRewrite: {
    '^/api/categories': '/categories'
  }
}));

// Cart Service routes
app.use('/api/cart', createProxyMiddleware({
  ...proxyOptions,
  target: services.cart,
  pathRewrite: {
    '^/api/cart': '/cart'
  }
}));

// Order Service routes
app.use('/api/orders', createProxyMiddleware({
  ...proxyOptions,
  target: services.order,
  pathRewrite: {
    '^/api/orders': '/orders'
  }
}));

// Admin Service routes
app.use('/api/admin', createProxyMiddleware({
  ...proxyOptions,
  target: services.admin,
  pathRewrite: {
    '^/api/admin': '/admin'
  }
}));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log('Routing to services:');
  console.log(`  User Service: ${services.user}`);
  console.log(`  Product Service: ${services.product}`);
  console.log(`  Cart Service: ${services.cart}`);
  console.log(`  Order Service: ${services.order}`);
  console.log(`  Admin Service: ${services.admin}`);
});
