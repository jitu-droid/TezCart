# TezCart API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication. Use the token received from login/register:

```
Authorization: Bearer <token>
```

## User Endpoints

### Register User
```
POST /api/users/register

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "User registered successfully",
  "token": "jwt-token",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

### Login
```
POST /api/users/login

Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "jwt-token",
  "user": {
    "id": 1,
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

### Get Profile
```
GET /api/users/profile
Headers: Authorization: Bearer <token>

Response:
{
  "id": 1,
  "email": "john@example.com",
  "name": "John Doe",
  "createdAt": "2025-11-02T..."
}
```

## Product Endpoints

### Get All Products
```
GET /api/products
Query params: ?category=Electronics&search=laptop

Response:
[
  {
    "id": 1,
    "name": "Wireless Headphones",
    "description": "High-quality wireless headphones",
    "price": 79.99,
    "category": "Electronics",
    "stock": 50,
    "image": "url"
  }
]
```

### Get Product by ID
```
GET /api/products/:id

Response:
{
  "id": 1,
  "name": "Wireless Headphones",
  "description": "High-quality wireless headphones",
  "price": 79.99,
  "category": "Electronics",
  "stock": 50,
  "image": "url"
}
```

### Get Categories
```
GET /api/categories

Response:
["Electronics", "Sports", "Home", "Accessories"]
```

## Cart Endpoints

### Get Cart
```
GET /api/cart/:userId

Response:
{
  "userId": "1",
  "items": [
    {
      "productId": 1,
      "name": "Wireless Headphones",
      "price": 79.99,
      "quantity": 2,
      "image": "url"
    }
  ],
  "total": "159.98",
  "itemCount": 2
}
```

### Add to Cart
```
POST /api/cart/:userId/add

Body:
{
  "productId": 1,
  "name": "Wireless Headphones",
  "price": 79.99,
  "quantity": 1,
  "image": "url"
}

Response:
{
  "message": "Item added to cart",
  "cart": { ... }
}
```

### Remove from Cart
```
DELETE /api/cart/:userId/item/:productId

Response:
{
  "message": "Item removed from cart",
  "cart": { ... }
}
```

### Clear Cart
```
DELETE /api/cart/:userId

Response:
{
  "message": "Cart cleared",
  "cart": { ... }
}
```

## Order Endpoints

### Create Order
```
POST /api/orders

Body:
{
  "userId": 1,
  "items": [...],
  "total": 159.98,
  "shippingAddress": "123 Main St"
}

Response:
{
  "message": "Order created successfully",
  "order": {
    "id": 1,
    "userId": 1,
    "items": [...],
    "total": 159.98,
    "status": "pending",
    "createdAt": "2025-11-02T..."
  }
}
```

### Get User Orders
```
GET /api/orders/user/:userId

Response:
[
  {
    "id": 1,
    "userId": 1,
    "items": [...],
    "total": 159.98,
    "status": "pending",
    "createdAt": "2025-11-02T..."
  }
]
```

### Get Order by ID
```
GET /api/orders/:orderId

Response:
{
  "id": 1,
  "userId": 1,
  "items": [...],
  "total": 159.98,
  "status": "pending"
}
```

## Admin Endpoints

### Admin Login
```
POST /api/admin/login

Body:
{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "message": "Login successful",
  "token": "admin-token",
  "admin": { "username": "admin" }
}
```

### Manage Products
```
GET    /api/admin/products
POST   /api/admin/products
PUT    /api/admin/products/:id
DELETE /api/admin/products/:id
```

### Manage Orders
```
GET /api/admin/orders
PUT /api/admin/orders/:id/status

Body:
{
  "status": "processing" // pending, processing, shipped, delivered, cancelled
}
```

### Get Dashboard Stats
```
GET /api/admin/stats

Response:
{
  "totalProducts": 5,
  "totalOrders": 10,
  "pendingOrders": 3,
  "totalRevenue": "1599.80"
}
```

## Error Responses

All errors follow this format:
```json
{
  "error": "Error message description"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error
