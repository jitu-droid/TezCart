import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, Navigate, useNavigate } from 'react-router-dom';
import './App.css';

// Helpers
const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(value || 0));

// Simple API service
const API_BASE_URL = 'http://localhost:3000/api';

const api = {
  login: (email, password) => 
    fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    }),
  register: (name, email, password) => 
    fetch(`${API_BASE_URL}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    }),
  getProducts: () => 
    fetch(`${API_BASE_URL}/products`),
  getProduct: (id) => 
    fetch(`${API_BASE_URL}/products/${id}`),
  getCart: (userId) => 
    fetch(`${API_BASE_URL}/cart/${userId}`),
  addToCart: (userId, product) => 
    fetch(`${API_BASE_URL}/cart/${userId}/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    }),
  removeFromCart: (userId, productId) => 
    fetch(`${API_BASE_URL}/cart/${userId}/item/${productId}`, {
      method: 'DELETE'
    }),
  createOrder: (userId, items, total) => 
    fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, items, total })
    }),
  getOrders: (userId) => 
    fetch(`${API_BASE_URL}/orders/user/${userId}`),
  // Cancel order (Order Service expects DELETE /orders/:orderId)
  cancelOrder: (orderId) =>
    fetch(`${API_BASE_URL}/orders/${orderId}`, {
      method: 'DELETE'
    }),
  // Hard delete a cancelled order
  deleteOrder: (orderId) =>
    fetch(`${API_BASE_URL}/orders/${orderId}/hard`, {
      method: 'DELETE'
    })
};

// Auth Context
const AuthContext = React.createContext(null);

// Toast Context
const ToastContext = React.createContext(null);

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    // Theme init
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      <ToastContext.Provider value={{ showToast }}>
        <Router>
          <div className="App">
            <Header theme={theme} onToggleTheme={toggleTheme} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<Orders />} />
            </Routes>
            <Footer />
            {toast && (
              <div className={`toast ${toast.type}`}>
                <span className="toast-icon">✓</span>
                <span className="toast-message">{toast.message}</span>
              </div>
            )}
          </div>
        </Router>
      </ToastContext.Provider>
    </AuthContext.Provider>
  );
}

function Header({ theme, onToggleTheme }) {
  const { user, logout } = React.useContext(AuthContext);

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <NavLink to="/" className="logo">TezCart</NavLink>
          <div className="nav-links">
            <NavLink to="/products" className={({isActive}) => isActive ? 'active' : undefined}>Products</NavLink>
            {user ? (
              <>
                <NavLink to="/cart" className={({isActive}) => isActive ? 'active' : undefined}>Cart</NavLink>
                <NavLink to="/orders" className={({isActive}) => isActive ? 'active' : undefined}>Orders</NavLink>
                <span>Hello, {user.name}</span>
                <button onClick={logout} className="btn btn-secondary">Logout</button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={({isActive}) => isActive ? 'active' : undefined}>Login</NavLink>
                <NavLink to="/register" className={({isActive}) => isActive ? 'active' : undefined}>Register</NavLink>
              </>
            )}
            <button aria-label="Toggle theme" className="theme-toggle" onClick={onToggleTheme}>
              {theme === 'dark' ? (
                // Sun icon
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
              ) : (
                // Moon icon
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
              )}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

function Home() {
  return (
    <div className="container">
      <div className="hero">
        <h1>Shop better. Simpler. Faster.</h1>
        <p>Curated essentials with a minimal, distraction‑free shopping experience.</p>
        <Link to="/products" className="btn btn-primary">Start shopping</Link>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="brand">TezCart</div>
        <div className="links">
          <a href="/products">Products</a>
          <a href="/orders">Orders</a>
        </div>
        <div className="copyright">© {new Date().getFullYear()} TezCart. All rights reserved.</div>
      </div>
    </footer>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = React.useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.login(email, password);
      const data = await res.json();
      if (res.ok) {
        login(data.user);
        window.location.href = '/products';
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '400px', margin: '50px auto' }}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          {error && <div className="error">{error}</div>}
          <button type="submit" className="btn btn-primary">Login</button>
        </form>
        <p style={{ marginTop: '20px' }}>
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = React.useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.register(name, email, password);
      const data = await res.json();
      if (res.ok) {
        login(data.user);
        window.location.href = '/products';
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '400px', margin: '50px auto' }}>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
          />
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
          {error && <div className="error">{error}</div>}
          <button type="submit" className="btn btn-primary">Register</button>
        </form>
        <p style={{ marginTop: '20px' }}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

function Products() {
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const { user } = React.useContext(AuthContext);
  const { showToast } = React.useContext(ToastContext);

  useEffect(() => {
    api.getProducts()
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        // Initialize quantities to 1 for all products
        const initialQty = {};
        data.forEach(p => initialQty[p.id] = 1);
        setQuantities(initialQty);
      })
      .catch(err => console.error(err));
  }, []);

  const handleQuantityChange = (productId, delta) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta)
    }));
  };

  const handleAddToCart = async (product) => {
    if (!user) {
      alert('Please login to add items to cart');
      return;
    }

    try {
      const res = await api.addToCart(user.id, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: quantities[product.id] || 1,
        image: product.image
      });
      if (res.ok) {
        showToast(`Added ${quantities[product.id]} ${product.name} to cart!`);
        // Reset quantity to 1 after adding
        setQuantities(prev => ({ ...prev, [product.id]: 1 }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1>Products</h1>
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img
              src={product.image}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = `https://picsum.photos/seed/${encodeURIComponent(product.name)}/300/200`;
              }}
            />
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p className="price">{formatCurrency(product.price)}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
              <button 
                onClick={() => handleQuantityChange(product.id, -1)}
                className="btn btn-secondary"
                style={{ padding: '5px 12px', minWidth: '40px' }}
              >
                -
              </button>
              <span style={{ fontSize: '18px', fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>
                {quantities[product.id] || 1}
              </span>
              <button 
                onClick={() => handleQuantityChange(product.id, 1)}
                className="btn btn-secondary"
                style={{ padding: '5px 12px', minWidth: '40px' }}
              >
                +
              </button>
            </div>
            <button 
              onClick={() => handleAddToCart(product)}
              className="btn btn-primary"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Cart() {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [message, setMessage] = useState('');
  const { user } = React.useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadCart();
    }
  }, [user]);

  const loadCart = async () => {
    try {
      const res = await api.getCart(user.id);
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await api.removeFromCart(user.id, productId);
      loadCart();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckout = async () => {
    if (cart.items.length === 0) {
      alert('Cart is empty');
      return;
    }

    try {
      const res = await api.createOrder(user.id, cart.items, cart.total);
      if (res.ok) {
        setMessage('Order placed successfully!');
        loadCart();
        // Use client-side navigation to avoid full page reload (prevents dev server disconnect)
        setTimeout(() => navigate('/orders'), 800);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container">
      <h1>Shopping Cart</h1>
      {message && <div className="success">{message}</div>}
      {cart.items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cart.items.map(item => (
            <div key={item.productId} className="cart-item">
              <img
                src={item.image}
                alt={item.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://picsum.photos/seed/${encodeURIComponent(item.name)}/300/200`;
                }}
              />
              <div>
                <h3>{item.name}</h3>
                <p>Quantity: {item.quantity}</p>
                <p>
                  {formatCurrency(item.price)} x {item.quantity} = {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
              <button 
                onClick={() => handleRemove(item.productId)}
                className="btn btn-danger"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="cart-total">
            <h2>Total: {formatCurrency(Number(cart.total))}</h2>
            <button onClick={handleCheckout} className="btn btn-primary">
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [message, setMessage] = useState('');
  const { user } = React.useContext(AuthContext);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = () => {
    api.getOrders(user.id)
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error(err));
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const res = await api.cancelOrder(orderId);
      if (res.ok) {
        setMessage('Order cancelled successfully!');
        setTimeout(() => setMessage(''), 3000);
        loadOrders();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to cancel order');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to cancel order');
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Delete this order permanently? This action cannot be undone.')) {
      return;
    }

    try {
      const res = await api.deleteOrder(orderId);
      if (res.ok) {
        setMessage('Order deleted');
        setTimeout(() => setMessage(''), 3000);
        loadOrders();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete order');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete order');
    }
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container">
      <h1>My Orders</h1>
      {message && <div className="success">{message}</div>}
      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="card">
            <h3>Order #{order.id}</h3>
            <p>Status: <span className={`status-${order.status}`}>{order.status}</span></p>
            <p>Total: {formatCurrency(order.total)}</p>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <h4>Items:</h4>
            <div style={{ marginBottom: '20px' }}>
              {order.items.map((item, idx) => (
                <div key={idx} className="order-item">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = `https://picsum.photos/seed/${encodeURIComponent(item.name)}/300/200`;
                    }}
                  />
                  <div className="order-item-details">
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.quantity}</p>
                    <p className="price">{formatCurrency(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
            {order.status !== 'cancelled' && order.status !== 'delivered' && (
              <button 
                onClick={() => handleCancelOrder(order.id)}
                className="btn btn-danger"
                style={{ marginTop: '10px' }}
              >
                Cancel Order
              </button>
            )}
            {order.status === 'cancelled' && (
              <button
                onClick={() => handleDeleteOrder(order.id)}
                className="btn btn-secondary"
                style={{ marginTop: '10px', marginLeft: '10px' }}
              >
                Delete Order
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default App;
