const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory product storage with sample data
let products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    description: 'High-quality wireless headphones with noise cancellation',
    price: 79.99,
    category: 'Electronics',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop'
  },
  {
    id: 2,
    name: 'Smart Watch',
    description: 'Fitness tracking smartwatch with heart rate monitor',
    price: 199.99,
    category: 'Electronics',
    stock: 30,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop'
  },
  {
    id: 3,
    name: 'Running Shoes',
    description: 'Comfortable running shoes for daily exercise',
    price: 89.99,
    category: 'Sports',
    stock: 100,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop'
  },
  {
    id: 4,
    name: 'Backpack',
    description: 'Durable backpack with laptop compartment',
    price: 49.99,
    category: 'Accessories',
    stock: 75,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=300&fit=crop'
  },
  {
    id: 5,
    name: 'Coffee Maker',
    description: 'Automatic coffee maker with timer',
    price: 129.99,
    category: 'Home',
    stock: 25,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=300&h=300&fit=crop'
  }
];

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'product-service' });
});

// Get all products
app.get('/products', (req, res) => {
  const { category, search } = req.query;

  let filteredProducts = products;

  // Filter by category
  if (category) {
    filteredProducts = filteredProducts.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Search by name
  if (search) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  res.json(filteredProducts);
});

// Get product by ID
app.get('/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
});

// Get all categories
app.get('/categories', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json(categories);
});

// Add product (for admin service)
app.post('/products', (req, res) => {
  const { name, description, price, category, stock, image } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Name, price, and category are required' });
  }

  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name,
    description: description || '',
    price: parseFloat(price),
    category,
    stock: stock || 0,
    image: image || 'https://via.placeholder.com/300x300?text=Product'
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Update product (for admin service)
app.put('/products/:id', (req, res) => {
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const { name, description, price, category, stock, image } = req.body;

  products[productIndex] = {
    ...products[productIndex],
    name: name || products[productIndex].name,
    description: description || products[productIndex].description,
    price: price !== undefined ? parseFloat(price) : products[productIndex].price,
    category: category || products[productIndex].category,
    stock: stock !== undefined ? stock : products[productIndex].stock,
    image: image || products[productIndex].image
  };

  res.json(products[productIndex]);
});

// Delete product (for admin service)
app.delete('/products/:id', (req, res) => {
  const productIndex = products.findIndex(p => p.id === parseInt(req.params.id));

  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }

  products.splice(productIndex, 1);
  res.json({ message: 'Product deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Product Service running on port ${PORT}`);
});
