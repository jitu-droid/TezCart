# TezCart Kubernetes Quick Reference

## 🚀 Deployment Commands

```powershell
# Quick deploy (automated)
.\k8s\deploy.ps1

# Manual deploy
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/deployments/
kubectl apply -f k8s/services/
kubectl apply -f k8s/ingress.yaml
kubectl apply -f k8s/hpa/
```

## 🧹 Cleanup Commands

```powershell
# Automated cleanup
.\k8s\cleanup.ps1

# Quick cleanup
kubectl delete namespace tezcart

# Manual cleanup
kubectl delete -f k8s/hpa/
kubectl delete -f k8s/ingress.yaml
kubectl delete -f k8s/services/
kubectl delete -f k8s/deployments/
kubectl delete -f k8s/configmap.yaml
kubectl delete -f k8s/secrets.yaml
kubectl delete -f k8s/namespace.yaml
```

## 📊 Monitoring Commands

```powershell
# Get all resources
kubectl get all -n tezcart

# Get pods
kubectl get pods -n tezcart

# Watch pods (live updates)
kubectl get pods -n tezcart -w

# Get services
kubectl get services -n tezcart

# Get deployments
kubectl get deployments -n tezcart

# Get HPA status
kubectl get hpa -n tezcart

# Get ingress
kubectl get ingress -n tezcart

# Get events
kubectl get events -n tezcart --sort-by='.lastTimestamp'
```

## 🔍 Debugging Commands

```powershell
# View pod logs
kubectl logs -n tezcart <pod-name>

# Follow logs (live)
kubectl logs -f -n tezcart <pod-name>

# View logs from all pods of a deployment
kubectl logs -n tezcart -l app=user-service

# Describe pod (detailed info + events)
kubectl describe pod -n tezcart <pod-name>

# Describe deployment
kubectl describe deployment -n tezcart user-service

# Describe service
kubectl describe service -n tezcart user-service

# Execute command in pod
kubectl exec -n tezcart -it <pod-name> -- /bin/sh

# Test health endpoint
kubectl exec -n tezcart -it <pod-name> -- wget -qO- http://localhost:3001/health
```

## 🌐 Access Commands

```powershell
# Get LoadBalancer URLs (minikube)
minikube service frontend -n tezcart --url
minikube service api-gateway -n tezcart --url

# Port forward frontend
kubectl port-forward -n tezcart service/frontend 8080:80

# Port forward API gateway
kubectl port-forward -n tezcart service/api-gateway 3000:3000

# Port forward to specific pod
kubectl port-forward -n tezcart <pod-name> 3001:3001

# Get minikube IP
minikube ip

# Open service in browser (minikube)
minikube service frontend -n tezcart
```

## 🔄 Update Commands

```powershell
# Restart deployment (rolling restart)
kubectl rollout restart deployment/user-service -n tezcart

# Check rollout status
kubectl rollout status deployment/user-service -n tezcart

# View rollout history
kubectl rollout history deployment/user-service -n tezcart

# Rollback to previous version
kubectl rollout undo deployment/user-service -n tezcart

# Update image
kubectl set image deployment/user-service user-service=tezcart/user-service:v2 -n tezcart

# Edit deployment
kubectl edit deployment user-service -n tezcart

# Edit configmap
kubectl edit configmap tezcart-config -n tezcart

# Edit secret
kubectl edit secret tezcart-secrets -n tezcart
```

## 📈 Scaling Commands

```powershell
# Manual scale
kubectl scale deployment user-service -n tezcart --replicas=3

# Check HPA status
kubectl get hpa -n tezcart

# Describe HPA
kubectl describe hpa user-service-hpa -n tezcart

# View resource usage
kubectl top nodes
kubectl top pods -n tezcart
```

## 🛠️ Build Commands

```powershell
# Build all images
docker build -t tezcart/user-service:latest ./services/user-service
docker build -t tezcart/product-service:latest ./services/product-service
docker build -t tezcart/cart-service:latest ./services/cart-service
docker build -t tezcart/order-service:latest ./services/order-service
docker build -t tezcart/admin-service:latest ./services/admin-service
docker build -t tezcart/api-gateway:latest ./services/api-gateway
docker build -t tezcart/frontend:latest ./frontend

# Load images to minikube
minikube image load tezcart/user-service:latest
minikube image load tezcart/product-service:latest
minikube image load tezcart/cart-service:latest
minikube image load tezcart/order-service:latest
minikube image load tezcart/admin-service:latest
minikube image load tezcart/api-gateway:latest
minikube image load tezcart/frontend:latest
```

## 🎛️ Minikube Commands

```powershell
# Start minikube
minikube start --cpus=4 --memory=8192

# Stop minikube
minikube stop

# Delete minikube cluster
minikube delete

# Check status
minikube status

# Enable addons
minikube addons enable ingress
minikube addons enable metrics-server

# SSH into minikube
minikube ssh

# Get dashboard
minikube dashboard
```

## 🧪 Testing Commands

```powershell
# Wait for pods to be ready
kubectl wait --for=condition=ready pod -l app -n tezcart --timeout=300s

# Create test pod
kubectl run -n tezcart test-pod --rm -it --image=busybox -- /bin/sh

# Test internal service connectivity
kubectl run -n tezcart test-pod --rm -it --image=busybox -- wget -qO- http://user-service:3001/health

# Copy files from pod
kubectl cp tezcart/<pod-name>:/app/logs ./logs

# Copy files to pod
kubectl cp ./config.json tezcart/<pod-name>:/app/config.json
```

## 📝 Config Commands

```powershell
# View configmap
kubectl get configmap tezcart-config -n tezcart -o yaml

# View secrets (base64 encoded)
kubectl get secret tezcart-secrets -n tezcart -o yaml

# Decode secret
kubectl get secret tezcart-secrets -n tezcart -o jsonpath='{.data.JWT_SECRET}' | base64 --decode

# Create secret from literal
kubectl create secret generic my-secret --from-literal=key=value -n tezcart

# Create configmap from file
kubectl create configmap my-config --from-file=config.json -n tezcart
```

## 🔐 Context & Namespace Commands

```powershell
# Get current context
kubectl config current-context

# List all contexts
kubectl config get-contexts

# Switch context
kubectl config use-context minikube

# Set default namespace
kubectl config set-context --current --namespace=tezcart

# View namespaces
kubectl get namespaces
```

## 🆘 Emergency Commands

```powershell
# Delete stuck pod
kubectl delete pod <pod-name> -n tezcart --force --grace-period=0

# Cordon node (prevent scheduling)
kubectl cordon <node-name>

# Drain node (evict all pods)
kubectl drain <node-name> --ignore-daemonsets --delete-emptydir-data

# Uncordon node (allow scheduling)
kubectl uncordon <node-name>

# Get component status
kubectl get componentstatuses
```

## 📚 Useful One-Liners

```powershell
# Get pod names only
kubectl get pods -n tezcart -o jsonpath='{.items[*].metadata.name}'

# Get pod IPs
kubectl get pods -n tezcart -o wide

# Count running pods
kubectl get pods -n tezcart --field-selector=status.phase=Running --no-headers | Measure-Object | Select-Object Count

# Delete all evicted pods
kubectl get pods -n tezcart | Select-String "Evicted" | ForEach-Object { $_.Line.Split()[0] } | ForEach-Object { kubectl delete pod $_ -n tezcart }

# Get all container images
kubectl get pods -n tezcart -o jsonpath='{.items[*].spec.containers[*].image}'

# Get all pod restarts
kubectl get pods -n tezcart -o jsonpath='{range .items[*]}{.metadata.name}{"\t"}{.status.containerStatuses[0].restartCount}{"\n"}{end}'
```

## 🎯 TezCart Specific

```powershell
# Check all TezCart services health
kubectl get pods -n tezcart -l app

# View API Gateway logs
kubectl logs -n tezcart -l app=api-gateway

# View Frontend logs
kubectl logs -n tezcart -l app=frontend

# Scale user service
kubectl scale deployment user-service -n tezcart --replicas=3

# Update JWT secret
kubectl create secret generic tezcart-secrets --from-literal=JWT_SECRET=new-secret --dry-run=client -o yaml | kubectl apply -n tezcart -f -

# Test API endpoint
kubectl run -n tezcart test --rm -it --image=curlimages/curl -- curl http://api-gateway:3000/health
```

## 💡 Tips

- Use `-w` flag to watch resources in real-time
- Use `--all-namespaces` or `-A` to view all namespaces
- Use `-o wide` for more detailed output
- Use `-o yaml` or `-o json` for full resource definition
- Use `--dry-run=client -o yaml` to preview changes
- Use `| grep` or `| Select-String` to filter output
- Use `kubectl explain <resource>` to get documentation

## 📖 Resources

- Kubernetes Docs: https://kubernetes.io/docs/
- kubectl Cheat Sheet: https://kubernetes.io/docs/reference/kubectl/cheatsheet/
- Minikube Docs: https://minikube.sigs.k8s.io/docs/
