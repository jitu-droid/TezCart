# TezCart - Kubernetes Deployment Guide

This guide will help you deploy TezCart microservices to a Kubernetes cluster.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Docker Desktop** (for building images)
- **kubectl** (Kubernetes CLI)
- **minikube** or **kind** (for local testing) OR a cloud Kubernetes cluster (AWS EKS, GCP GKE, Azure AKS)

### Verify Prerequisites

```powershell
# Check Docker
docker --version

# Check kubectl
kubectl version --client

# Check minikube (if using)
minikube version
```

## Architecture Overview

TezCart consists of:
- **5 Backend Microservices**: User, Product, Cart, Order, Admin
- **1 API Gateway**: Routes all `/api/*` requests
- **1 Frontend**: React SPA served via Nginx

All services run in the `tezcart` namespace with:
- Health probes (liveness & readiness)
- Resource limits
- Horizontal Pod Autoscaling (HPA)
- LoadBalancer services for external access

## Step 1: Start Kubernetes Cluster

### Option A: Minikube (Recommended for local development)

```powershell
# Start minikube
minikube start --cpus=4 --memory=8192

# Enable ingress addon (for Ingress support)
minikube addons enable ingress

# Enable metrics-server (for HPA)
minikube addons enable metrics-server
```

### Option B: kind (Kubernetes in Docker)

```powershell
kind create cluster --name tezcart
```

### Option C: Cloud Cluster
Use your cloud provider's CLI to create a cluster (e.g., `eksctl`, `gcloud`, `az aks`).

## Step 2: Build Docker Images

Build all Docker images with tags:

```powershell
# Navigate to project root
cd c:\Users\Anirjit\Desktop\TezCart

# Build all service images
docker build -t tezcart/user-service:latest ./services/user-service
docker build -t tezcart/product-service:latest ./services/product-service
docker build -t tezcart/cart-service:latest ./services/cart-service
docker build -t tezcart/order-service:latest ./services/order-service
docker build -t tezcart/admin-service:latest ./services/admin-service
docker build -t tezcart/api-gateway:latest ./services/api-gateway
docker build -t tezcart/frontend:latest ./frontend

# Verify images
docker images | Select-String "tezcart"
```

### For Minikube: Load Images into Minikube

```powershell
# Load images into minikube's Docker daemon
minikube image load tezcart/user-service:latest
minikube image load tezcart/product-service:latest
minikube image load tezcart/cart-service:latest
minikube image load tezcart/order-service:latest
minikube image load tezcart/admin-service:latest
minikube image load tezcart/api-gateway:latest
minikube image load tezcart/frontend:latest
```

**Note**: For cloud clusters, push images to a container registry (Docker Hub, ECR, GCR, ACR) and update image names in deployment manifests.

## Step 3: Deploy to Kubernetes

Deploy resources in the correct order:

### 3.1 Create Namespace

```powershell
kubectl apply -f k8s/namespace.yaml
```

Verify:
```powershell
kubectl get namespaces
```

### 3.2 Apply ConfigMap and Secrets

```powershell
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
```

Verify:
```powershell
kubectl get configmap -n tezcart
kubectl get secrets -n tezcart
```

### 3.3 Deploy Services (Deployments)

```powershell
# Apply all deployments
kubectl apply -f k8s/deployments/
```

Verify:
```powershell
# Watch pods starting up
kubectl get pods -n tezcart -w

# Check deployment status
kubectl get deployments -n tezcart
```

### 3.4 Create Services

```powershell
# Apply all services
kubectl apply -f k8s/services/
```

Verify:
```powershell
kubectl get services -n tezcart
```

### 3.5 Apply Ingress (Optional)

```powershell
kubectl apply -f k8s/ingress.yaml
```

Verify:
```powershell
kubectl get ingress -n tezcart
```

### 3.6 Apply HPA (Optional)

```powershell
# Apply all HPA manifests
kubectl apply -f k8s/hpa/
```

Verify:
```powershell
kubectl get hpa -n tezcart
```

## Step 4: Access the Application

### Option A: Using LoadBalancer Services (Minikube)

Get the LoadBalancer service URLs:

```powershell
# Get API Gateway URL
minikube service api-gateway -n tezcart --url

# Get Frontend URL
minikube service frontend -n tezcart --url
```

Open the frontend URL in your browser.

### Option B: Using Port Forwarding

```powershell
# Forward API Gateway
kubectl port-forward -n tezcart service/api-gateway 3000:3000

# In another terminal, forward Frontend
kubectl port-forward -n tezcart service/frontend 8080:80
```

Access the app at `http://localhost:8080`

### Option C: Using Ingress (if configured)

Add `tezcart.local` to your hosts file:

**Windows**: Edit `C:\Windows\System32\drivers\etc\hosts`

```
<minikube-ip> tezcart.local
```

Get minikube IP:
```powershell
minikube ip
```

Then access: `http://tezcart.local`

## Step 5: Verify Deployment

### Check Pod Status

```powershell
# List all pods
kubectl get pods -n tezcart

# Check pod logs
kubectl logs -n tezcart <pod-name>

# Describe pod for events
kubectl describe pod -n tezcart <pod-name>
```

### Test Service Endpoints

```powershell
# Test API Gateway health
kubectl exec -n tezcart -it <api-gateway-pod> -- wget -qO- http://localhost:3000/health

# Test User Service health
kubectl exec -n tezcart -it <user-service-pod> -- wget -qO- http://localhost:3001/health
```

### Check HPA Status

```powershell
kubectl get hpa -n tezcart
```

## Monitoring and Logging

### View Logs

```powershell
# Stream logs from a pod
kubectl logs -f -n tezcart <pod-name>

# View logs from all pods of a deployment
kubectl logs -n tezcart -l app=user-service --tail=50
```

### Check Resource Usage

```powershell
# Top nodes
kubectl top nodes

# Top pods
kubectl top pods -n tezcart
```

## Scaling

### Manual Scaling

```powershell
# Scale a deployment
kubectl scale deployment user-service -n tezcart --replicas=3
```

### HPA Autoscaling

HPA automatically scales based on CPU/Memory:
- **Min Replicas**: 2
- **Max Replicas**: 5
- **CPU Threshold**: 70%
- **Memory Threshold**: 80%

## Cleanup

To remove all TezCart resources:

```powershell
# Delete namespace (removes all resources)
kubectl delete namespace tezcart

# Or delete individual resources
kubectl delete -f k8s/hpa/
kubectl delete -f k8s/ingress.yaml
kubectl delete -f k8s/services/
kubectl delete -f k8s/deployments/
kubectl delete -f k8s/configmap.yaml
kubectl delete -f k8s/secrets.yaml
kubectl delete -f k8s/namespace.yaml
```

## Troubleshooting

### Pods Not Starting

```powershell
# Check pod events
kubectl describe pod -n tezcart <pod-name>

# Check logs
kubectl logs -n tezcart <pod-name>

# Common issues:
# - ImagePullBackOff: Image not available (push to registry or load into minikube)
# - CrashLoopBackOff: Application error (check logs)
```

### Services Not Accessible

```powershell
# Check service endpoints
kubectl get endpoints -n tezcart

# Check if pods are ready
kubectl get pods -n tezcart

# Test internal connectivity
kubectl run -n tezcart test-pod --rm -it --image=busybox -- wget -qO- http://api-gateway:3000/health
```

### HPA Not Working

```powershell
# Check metrics-server
kubectl get pods -n kube-system | Select-String "metrics-server"

# Enable metrics-server in minikube
minikube addons enable metrics-server

# Check HPA status
kubectl describe hpa -n tezcart <hpa-name>
```

### Ingress Not Working

```powershell
# Check ingress controller
kubectl get pods -n ingress-nginx

# Enable ingress in minikube
minikube addons enable ingress

# Check ingress status
kubectl describe ingress -n tezcart tezcart-ingress
```

## Environment Variables

All services use environment variables from ConfigMap and Secrets:

**ConfigMap** (`k8s/configmap.yaml`):
- Service URLs (Kubernetes DNS)
- Service ports

**Secrets** (`k8s/secrets.yaml`):
- `JWT_SECRET`: JWT signing secret
- `ADMIN_USERNAME`: Admin username
- `ADMIN_PASSWORD`: Admin password

To update secrets:
```powershell
# Edit secret
kubectl edit secret tezcart-secrets -n tezcart

# Or delete and recreate
kubectl delete secret tezcart-secrets -n tezcart
kubectl apply -f k8s/secrets.yaml
```

## Production Considerations

For production deployments:

1. **Use a Container Registry**: Push images to Docker Hub, ECR, GCR, or ACR
2. **Update ImagePullPolicy**: Change to `Always` in deployments
3. **Use Persistent Storage**: Add PersistentVolumeClaims for database services
4. **Enable TLS**: Configure TLS certificates in Ingress
5. **Implement Network Policies**: Restrict pod-to-pod communication
6. **Use Secrets Management**: Integrate with AWS Secrets Manager, Azure Key Vault, etc.
7. **Set Up Monitoring**: Install Prometheus and Grafana
8. **Configure Logging**: Set up ELK stack or cloud logging
9. **Implement Backup**: Regular etcd backups
10. **CI/CD Pipeline**: Automate builds and deployments with GitHub Actions, Jenkins, etc.

## Testing Checklist

- [ ] All pods running (`kubectl get pods -n tezcart`)
- [ ] Services created (`kubectl get services -n tezcart`)
- [ ] Ingress configured (`kubectl get ingress -n tezcart`)
- [ ] HPA active (`kubectl get hpa -n tezcart`)
- [ ] Frontend accessible via browser
- [ ] User registration works
- [ ] User login works
- [ ] Products display correctly
- [ ] Add to cart functionality works
- [ ] Checkout creates orders
- [ ] Admin panel accessible

## Useful Commands

```powershell
# Get all resources in namespace
kubectl get all -n tezcart

# Restart a deployment (rolling restart)
kubectl rollout restart deployment/user-service -n tezcart

# Check rollout status
kubectl rollout status deployment/user-service -n tezcart

# Execute command in pod
kubectl exec -n tezcart -it <pod-name> -- /bin/sh

# Copy files from pod
kubectl cp tezcart/<pod-name>:/app/logs ./logs

# View events
kubectl get events -n tezcart --sort-by='.lastTimestamp'
```

## Support

For issues or questions:
1. Check pod logs: `kubectl logs -n tezcart <pod-name>`
2. Check pod events: `kubectl describe pod -n tezcart <pod-name>`
3. Review troubleshooting section above
4. Check Kubernetes documentation: https://kubernetes.io/docs/

---

**Congratulations!** 🎉 You've successfully deployed TezCart to Kubernetes!
