# TezCart - Complete Setup Guide

## Phase 1: Project Setup ✅ COMPLETED

### What We Built:
- ✅ Complete microservices architecture (6 services + API Gateway)
- ✅ React frontend with routing and state management
- ✅ In-memory data storage for all services
- ✅ JWT authentication for users
- ✅ Sample product data pre-loaded
- ✅ Complete API endpoints for all features

### Project Structure:
```
TezCart/
├── services/
│   ├── user-service/          # Authentication & user management
│   ├── product-service/       # Product catalog
│   ├── cart-service/          # Shopping cart operations
│   ├── order-service/         # Order processing
│   ├── admin-service/         # Admin dashboard
│   └── api-gateway/           # Request routing
├── frontend/                   # React UI
├── kubernetes/                 # K8s configs (Phase 5)
├── docs/                       # Documentation
├── docker-compose.yml          # Docker orchestration
└── README.md
```

---

## Phase 2: Dockerization ✅ COMPLETED

### What We Built:
- ✅ Dockerfiles for all 7 services
- ✅ Multi-stage build for frontend (Node + Nginx)
- ✅ Docker Compose configuration with networking
- ✅ .dockerignore files for optimized builds
- ✅ Docker control scripts for easy management

### Docker Services:
| Service | Port | Container Name |
|---------|------|----------------|
| Frontend | 8080 | tezcart-frontend |
| API Gateway | 3000 | tezcart-api-gateway |
| User Service | 3001 | tezcart-user-service |
| Product Service | 3002 | tezcart-product-service |
| Cart Service | 3003 | tezcart-cart-service |
| Order Service | 3004 | tezcart-order-service |
| Admin Service | 3005 | tezcart-admin-service |

---

## Getting Started

### Prerequisites
1. **Node.js** (v16 or higher) - for local development
2. **Docker Desktop** - for containerized deployment
3. **Git** (optional) - for version control

### Installation Steps

#### Option A: Docker (Recommended for Demo)

1. **Install Docker Desktop**
   - Download from https://www.docker.com/products/docker-desktop
   - Install and start Docker Desktop

2. **Navigate to Project**
   ```powershell
   cd C:\Users\Anirjit\Desktop\TezCart
   ```

3. **Start All Services**
   ```powershell
   docker-compose up --build
   ```
   
4. **Access Application**
   - Open browser: http://localhost:8080
   - API Gateway: http://localhost:3000

5. **View Logs**
   ```powershell
   # All services
   docker-compose logs -f
   
   # Specific service
   docker-compose logs -f api-gateway
   ```

6. **Stop Services**
   ```powershell
   docker-compose down
   ```

#### Option B: Local Development

1. **Install Dependencies**
   ```powershell
   .\install-dependencies.ps1
   ```

2. **Start Services** (Open 7 terminal windows)
   ```powershell
   # Terminal 1
   cd services\user-service
   npm start
   
   # Terminal 2
   cd services\product-service
   npm start
   
   # Terminal 3
   cd services\cart-service
   npm start
   
   # Terminal 4
   cd services\order-service
   npm start
   
   # Terminal 5
   cd services\admin-service
   npm start
   
   # Terminal 6
   cd services\api-gateway
   npm start
   
   # Terminal 7
   cd frontend
   npm start
   ```

3. **Access Application**
   - Frontend: http://localhost:3007
   - API Gateway: http://localhost:3000

---

## Testing the Application

### User Flow Test
1. Open http://localhost:8080 (Docker) or http://localhost:3007 (Local)
2. Click "Register" and create an account
3. Browse products on the Products page
4. Add items to cart
5. View cart and checkout
6. View order history

### Admin Flow Test
1. Login with:
   - Username: `admin`
   - Password: `admin123`
2. Add/edit/delete products
3. View all orders
4. Update order status

### API Testing with cURL/Postman
```powershell
# Health check
curl http://localhost:3000/health

# Get all products
curl http://localhost:3000/api/products

# Register user
curl -X POST http://localhost:3000/api/users/register `
  -H "Content-Type: application/json" `
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

---

## Common Issues & Solutions

### Port Already in Use
```powershell
# Find and kill process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Docker Build Fails
```powershell
# Clean Docker system
docker system prune -a

# Rebuild from scratch
docker-compose build --no-cache
```

### Cannot Connect to Services
- Ensure all services are running
- Check Docker containers: `docker ps`
- Check logs: `docker-compose logs`

### Frontend Can't Reach API
- For Docker: API should be at http://localhost:3000
- For Local: API should be at http://localhost:3000
- Check CORS settings if getting CORS errors

---

## Project Demo Tips

### For Presentation:
1. **Use Docker** - easier to demo, one command to start
2. **Pre-build images** before presentation to save time
3. **Have sample data** ready (already included)
4. **Prepare scenarios**:
   - User registration and shopping
   - Admin product management
   - Order tracking

### Demo Script:
1. Start with architecture diagram (show microservices)
2. Show docker-compose.yml (explain orchestration)
3. Start services: `docker-compose up`
4. Demo user flow (register → shop → order)
5. Demo admin flow (manage products/orders)
6. Show Docker containers: `docker ps`
7. Show logs: `docker-compose logs`
8. Explain Kubernetes readiness (next phase)

---

## Next Steps

### Phase 3: Testing & Refinement
- Add error handling
- Improve UI/UX
- Add loading states
- Implement better validation

### Phase 4: Kubernetes Deployment
- Create Deployment manifests
- Create Service manifests
- Set up Ingress
- Configure scaling
- Test on Minikube

### Phase 5: Documentation & Polish
- Create architecture diagrams
- Record demo video
- Write deployment guide
- Prepare presentation

---

## Development Commands Reference

### Docker Commands
```powershell
# Build images
docker-compose build

# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart service
docker-compose restart user-service

# Remove everything
docker-compose down -v
```

### NPM Commands (Local Dev)
```powershell
# Install dependencies
npm install

# Start service
npm start

# Start with auto-reload
npm run dev
```

### Useful PowerShell Commands
```powershell
# Check Node version
node --version

# Check npm version
npm --version

# Check Docker version
docker --version

# List running containers
docker ps

# List all containers
docker ps -a

# View Docker images
docker images
```

---

## Resources

- [Docker Documentation](https://docs.docker.com/)
- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev/)
- [Express Documentation](https://expressjs.com/)

---

## Support & Troubleshooting

If you encounter any issues:
1. Check the logs first
2. Verify all prerequisites are installed
3. Ensure ports are not in use
4. Try rebuilding Docker images
5. Check Docker Desktop is running

---

**Project Status**: Phase 2 Complete ✅
**Ready for**: Docker deployment and testing
**Next Phase**: Kubernetes orchestration
