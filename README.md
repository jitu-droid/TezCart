# TezCart - E-Commerce Microservices Application

A prototype e-commerce web application built with microservices architecture, containerized with Docker, and orchestrated using Kubernetes.

##  Architecture

TezCart consists of the following microservices:

- **API Gateway** (Port 3000) - Routes requests to microservices
- **User Service** (Port 3001) - User authentication and management
- **Product Service** (Port 3002) - Product catalog management
- **Cart Service** (Port 3003) - Shopping cart operations
- **Order Service** (Port 3004) - Order processing
- **Admin Service** (Port 3005) - Admin dashboard operations
- **Frontend** (Port 3007) - React-based user interface

##  Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Docker (for containerization)
- Kubernetes/Minikube (for orchestration)

##  Getting Started

### Option 1: Docker (Recommended) 

**Easiest way to run the entire application:**

```powershell
# Start all services with Docker Compose
docker-compose up --build
```

Access the application at:
- Frontend: http://localhost:8080
- API Gateway: http://localhost:3000

**Docker Control Script:**
```powershell
# Start all services
.\docker-control.ps1 start

# Stop all services
.\docker-control.ps1 stop

# View logs
.\docker-control.ps1 logs

# Check status
.\docker-control.ps1 status
```

See [Docker Deployment Guide](docs/DOCKER.md) for detailed instructions.

---

### Option 2: Local Development (Without Docker)

**1. Install All Dependencies:**

```powershell
# Run the installation script
.\install-dependencies.ps1
```

**2. Run Services Locally:**

Open separate terminal windows for each service:

**Terminal 1 - User Service:**
```powershell
cd services/user-service
npm start
```

**Terminal 2 - Product Service:**
```powershell
cd services/product-service
npm start
```

**Terminal 3 - Cart Service:**
```powershell
cd services/cart-service
npm start
```

**Terminal 4 - Order Service:**
```powershell
cd services/order-service
npm start
```

**Terminal 5 - Admin Service:**
```powershell
cd services/admin-service
npm start
```

**Terminal 6 - API Gateway:**
```powershell
cd services/api-gateway
npm start
```

**Terminal 7 - Frontend:**
```powershell
cd frontend
npm start
```

**3. Access the Application:**

- Frontend: http://localhost:3007
- API Gateway: http://localhost:3000
- Individual services run on ports 3001-3005

---

##  Features

### User Features
- User registration and login
- Browse product catalog
- Search products by name
- Filter products by category
- Add items to shopping cart
- View and modify cart
- Place orders
- View order history

### Admin Features
- Admin login (username: `admin`, password: `admin123`)
- Add/Edit/Delete products
- View all orders
- Update order status
- Dashboard statistics

## 📚 API Endpoints

### User Service (via /api/users)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /profile` - Get user profile

### Product Service (via /api/products)
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `GET /categories` - Get all categories

### Cart Service (via /api/cart)
- `GET /cart/:userId` - Get user's cart
- `POST /cart/:userId/add` - Add item to cart
- `PUT /cart/:userId/item/:productId` - Update item quantity
- `DELETE /cart/:userId/item/:productId` - Remove item
- `DELETE /cart/:userId` - Clear cart

### Order Service (via /api/orders)
- `POST /orders` - Create order
- `GET /orders/user/:userId` - Get user orders
- `GET /orders/:orderId` - Get specific order

### Admin Service (via /api/admin)
- `POST /admin/login` - Admin login
- `GET /admin/products` - Get all products
- `POST /admin/products` - Add product
- `PUT /admin/products/:id` - Update product
- `DELETE /admin/products/:id` - Delete product
- `GET /admin/orders` - Get all orders
- `PUT /admin/orders/:id/status` - Update order status
- `GET /admin/stats` - Dashboard statistics

See [API Documentation](docs/API.md) for complete API reference.

##  Docker Deployment

### Quick Start
```powershell
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d --build

# Stop all services
docker-compose down
```

### Features
-  All services containerized
-  Docker Compose orchestration
-  Multi-stage builds for optimized images
-  Internal networking for service communication
-  Easy scaling and deployment

See [Docker Deployment Guide](docs/DOCKER.md) for detailed instructions.

##  Kubernetes Deployment

### Quick Start
```powershell
# Deploy to Kubernetes (automated)
.\k8s\deploy.ps1

# Or manual deployment
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/deployments/
kubectl apply -f k8s/services/
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa/
```

### Features
-  Complete Kubernetes manifests
-  Namespace isolation (tezcart)
-  ConfigMap for configuration
-  Secrets for sensitive data
-  Health probes (liveness & readiness)
-  Resource limits and requests
-  Horizontal Pod Autoscaling (HPA)
-  LoadBalancer services for external access
-  Ingress for routing
-  2 replicas per service (1 for admin)

### Access Application
```powershell
# Using minikube
minikube service frontend -n tezcart --url
minikube service api-gateway -n tezcart --url

# Using port-forwarding
kubectl port-forward -n tezcart service/frontend 8080:80
kubectl port-forward -n tezcart service/api-gateway 3000:3000
```

See [Kubernetes Deployment Guide](k8s/README.md) for comprehensive instructions.

##  Project Structure

```
TezCart/
├── services/
│   ├── user-service/
│   ├── product-service/
│   ├── cart-service/
│   ├── order-service/
│   ├── admin-service/
│   └── api-gateway/
├── frontend/
├── kubernetes/
│   ├── deployments/
│   └── services/
├── docs/
└── README.md
```

##  Security Note

This is a prototype application for educational purposes. In a production environment:
- Use proper authentication and authorization
- Implement HTTPS
- Use secure password hashing (bcrypt is used but enhance it)
- Implement rate limiting
- Add input validation and sanitization
- Use environment variables for sensitive data
- Implement proper error handling

##  Testing

To test the application:
1. Start all services
2. Open http://localhost:3007
3. Register a new account
4. Browse products and add to cart
5. Place an order
6. Login as admin (admin/admin123) at admin panel

##  Development Notes

- All services use in-memory storage (no persistent database)
- Data will be lost when services restart
- This is intentional for prototype simplicity
- Production version should use MongoDB or similar

##  Contributing

This is an academic project. Feel free to fork and enhance!

##  License

ISC License - Free to use for educational purposes
