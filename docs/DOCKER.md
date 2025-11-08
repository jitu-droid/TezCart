# TezCart Docker Deployment Guide

## Prerequisites
- Docker Desktop installed and running
- Docker Compose installed (comes with Docker Desktop)

## Quick Start with Docker

### 1. Build and Start All Services

```powershell
# Build all Docker images and start containers
docker-compose up --build
```

This single command will:
- Build Docker images for all 7 services
- Create a Docker network for inter-service communication
- Start all containers in the correct order
- Show logs from all services

### 2. Run in Detached Mode (Background)

```powershell
# Start services in background
docker-compose up -d --build

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f api-gateway
```

### 3. Stop All Services

```powershell
# Stop all containers
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

## Access the Application

Once all containers are running:

- **Frontend**: http://localhost:8080
- **API Gateway**: http://localhost:3000
- **User Service**: http://localhost:3001
- **Product Service**: http://localhost:3002
- **Cart Service**: http://localhost:3003
- **Order Service**: http://localhost:3004
- **Admin Service**: http://localhost:3005

## Useful Docker Commands

### Check Running Containers
```powershell
docker ps
```

### View Service Logs
```powershell
# All services
docker-compose logs

# Specific service
docker-compose logs user-service

# Follow logs (real-time)
docker-compose logs -f api-gateway
```

### Restart a Specific Service
```powershell
docker-compose restart user-service
```

### Rebuild a Specific Service
```powershell
docker-compose up -d --build user-service
```

### Stop a Specific Service
```powershell
docker-compose stop user-service
```

### Execute Commands in a Container
```powershell
docker-compose exec user-service sh
```

### Remove All Containers and Images
```powershell
# Stop and remove containers
docker-compose down

# Remove all TezCart images
docker images | Select-String "tezcart" | ForEach-Object { docker rmi $_.ToString().Split()[2] }
```

## Docker Network

All services communicate through a bridge network named `tezcart-network`. Services can reach each other using their service names:

- `http://user-service:3001`
- `http://product-service:3002`
- `http://cart-service:3003`
- etc.

## Volume Management

Currently, all data is stored in-memory within containers. If you restart containers, all data will be lost. This is intentional for the prototype.

## Troubleshooting

### Port Already in Use
If you get a port conflict error:
```powershell
# Find process using the port
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Container Won't Start
```powershell
# Check container logs
docker-compose logs user-service

# Check container status
docker ps -a
```

### Service Can't Connect to Another Service
- Ensure all services are on the same network
- Use service names (not localhost) for inter-service communication
- Check the API Gateway environment variables

### Out of Disk Space
```powershell
# Clean up unused Docker resources
docker system prune -a

# Remove all stopped containers
docker container prune

# Remove all unused images
docker image prune -a
```

## Production Considerations

For a production deployment, consider:

1. **Use Docker volumes** for data persistence
2. **Add health checks** to docker-compose.yml
3. **Implement proper logging** with log aggregation
4. **Use Docker secrets** for sensitive data
5. **Set resource limits** (memory, CPU)
6. **Use production-grade databases** instead of in-memory storage
7. **Add reverse proxy** (nginx) for better routing
8. **Implement monitoring** (Prometheus, Grafana)

## Docker Compose Services Overview

| Service | Container Name | Port | Dependencies |
|---------|---------------|------|--------------|
| API Gateway | tezcart-api-gateway | 3000 | All services |
| User Service | tezcart-user-service | 3001 | None |
| Product Service | tezcart-product-service | 3002 | None |
| Cart Service | tezcart-cart-service | 3003 | None |
| Order Service | tezcart-order-service | 3004 | None |
| Admin Service | tezcart-admin-service | 3005 | Product, Order |
| Frontend | tezcart-frontend | 8080 | API Gateway |

## Next Steps

After Docker setup, proceed to Kubernetes deployment (Phase 5) for orchestration at scale.
