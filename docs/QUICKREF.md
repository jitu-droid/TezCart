# TezCart - Quick Reference Card

## 🚀 Quick Start Commands

### Docker (Recommended)
```powershell
docker-compose up --build          # Start all services
docker-compose up -d --build       # Start in background
docker-compose down                # Stop all services
docker-compose logs -f             # View logs
docker ps                          # Check running containers
```

### Local Development
```powershell
.\install-dependencies.ps1         # Install all dependencies
# Then start each service in separate terminals with: npm start
```

## 🌐 Application URLs

| Service | Local Dev | Docker |
|---------|-----------|--------|
| Frontend | http://localhost:3007 | http://localhost:8080 |
| API Gateway | http://localhost:3000 | http://localhost:3000 |
| User Service | http://localhost:3001 | http://localhost:3001 |
| Product Service | http://localhost:3002 | http://localhost:3002 |
| Cart Service | http://localhost:3003 | http://localhost:3003 |
| Order Service | http://localhost:3004 | http://localhost:3004 |
| Admin Service | http://localhost:3005 | http://localhost:3005 |

## 👤 Test Credentials

### Regular User
Create your own via registration at `/register`

### Admin
- Username: `admin`
- Password: `admin123`

## 📋 Service Ports

- 3000: API Gateway (main entry point)
- 3001: User Service
- 3002: Product Service
- 3003: Cart Service
- 3004: Order Service
- 3005: Admin Service
- 3007: Frontend (local) / 8080 (Docker)

## 🔧 Useful Commands

### Docker Compose
```powershell
docker-compose build               # Build images
docker-compose up                  # Start (foreground)
docker-compose up -d               # Start (background)
docker-compose down                # Stop and remove containers
docker-compose down -v             # Stop and remove volumes
docker-compose ps                  # List containers
docker-compose logs SERVICE        # View service logs
docker-compose restart SERVICE     # Restart specific service
docker-compose exec SERVICE sh     # Access container shell
```

### Docker Control Script
```powershell
.\docker-control.ps1 start         # Start all services
.\docker-control.ps1 stop          # Stop all services
.\docker-control.ps1 restart       # Restart all services
.\docker-control.ps1 logs          # View logs
.\docker-control.ps1 status        # Check status
.\docker-control.ps1 clean         # Clean up
```

## 🐛 Troubleshooting

### Port in Use
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Clean Docker
```powershell
docker system prune -a
docker-compose down -v
```

### Check Logs
```powershell
docker-compose logs SERVICE_NAME
docker-compose logs -f             # Follow mode
```

### Rebuild Service
```powershell
docker-compose up -d --build SERVICE_NAME
```

## 📁 Project Structure

```
TezCart/
├── services/               # Backend microservices
│   ├── user-service/      # Port 3001
│   ├── product-service/   # Port 3002
│   ├── cart-service/      # Port 3003
│   ├── order-service/     # Port 3004
│   ├── admin-service/     # Port 3005
│   └── api-gateway/       # Port 3000
├── frontend/              # React app
├── kubernetes/            # K8s configs
├── docs/                  # Documentation
└── docker-compose.yml     # Docker orchestration
```

## 🎯 Sample API Calls

### Register User
```powershell
curl -X POST http://localhost:3000/api/users/register `
  -H "Content-Type: application/json" `
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login
```powershell
curl -X POST http://localhost:3000/api/users/login `
  -H "Content-Type: application/json" `
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get Products
```powershell
curl http://localhost:3000/api/products
```

### Get Categories
```powershell
curl http://localhost:3000/api/categories
```

## 📚 Documentation

- [Complete Setup Guide](SETUP.md)
- [Docker Deployment](DOCKER.md)
- [API Documentation](API.md)
- [Main README](../README.md)

## ✅ Testing Checklist

- [ ] All services start successfully
- [ ] Frontend loads without errors
- [ ] User registration works
- [ ] User login works
- [ ] Products display on catalog page
- [ ] Can add items to cart
- [ ] Cart updates correctly
- [ ] Can place orders
- [ ] Orders show in history
- [ ] Admin login works
- [ ] Admin can manage products
- [ ] Admin can view orders

## 🎓 For Academic Demo

### Show & Tell:
1. Architecture (microservices diagram)
2. Docker Compose (orchestration)
3. Service communication
4. API Gateway pattern
5. User flow demo
6. Admin flow demo
7. Docker logs & containers
8. Scalability discussion

### Key Points:
- Microservices architecture
- Containerization with Docker
- Service-to-service communication
- RESTful API design
- Modern React frontend
- Easy deployment & scaling

---

**Quick Access**: Keep this file open during development/demo!
