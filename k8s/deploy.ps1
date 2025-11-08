# TezCart Kubernetes Deployment Script
# This script automates the deployment of TezCart to Kubernetes

Write-Host "🚀 TezCart Kubernetes Deployment Script" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check if kubectl is installed
try {
    kubectl version --client --short | Out-Null
    Write-Host "✓ kubectl is installed" -ForegroundColor Green
} catch {
    Write-Host "✗ kubectl is not installed. Please install kubectl first." -ForegroundColor Red
    exit 1
}

# Check if cluster is accessible
Write-Host "Checking Kubernetes cluster connection..." -ForegroundColor Yellow
try {
    kubectl cluster-info | Out-Null
    Write-Host "✓ Cluster is accessible" -ForegroundColor Green
} catch {
    Write-Host "✗ Cannot connect to cluster. Please ensure your cluster is running." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Building Docker images..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Gray

# Build all images
$images = @(
    "user-service",
    "product-service",
    "cart-service",
    "order-service",
    "admin-service",
    "api-gateway",
    "frontend"
)

foreach ($image in $images) {
    $path = if ($image -eq "frontend") { ".\frontend" } else { ".\services\$image" }
    Write-Host "Building tezcart/${image}:latest..." -ForegroundColor Cyan
    docker build -t "tezcart/${image}:latest" $path
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Failed to build $image" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✓ All images built successfully" -ForegroundColor Green
Write-Host ""

# Check if using minikube
$usingMinikube = $false
try {
    minikube status | Out-Null
    $usingMinikube = $true
    Write-Host "✓ Detected minikube cluster" -ForegroundColor Green
    Write-Host "Loading images into minikube..." -ForegroundColor Yellow
    
    foreach ($image in $images) {
        Write-Host "Loading tezcart/${image}:latest..." -ForegroundColor Cyan
        minikube image load "tezcart/${image}:latest"
    }
    Write-Host "✓ Images loaded into minikube" -ForegroundColor Green
} catch {
    Write-Host "ℹ Not using minikube" -ForegroundColor Gray
}

Write-Host ""
Write-Host "☸ Deploying to Kubernetes..." -ForegroundColor Yellow

# Deploy in order
Write-Host "1. Creating namespace..." -ForegroundColor Cyan
kubectl apply -f k8s/namespace.yaml

Write-Host "2. Creating ConfigMap and Secrets..." -ForegroundColor Cyan
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml

Write-Host "3. Creating Deployments..." -ForegroundColor Cyan
kubectl apply -f k8s/deployments/

Write-Host "4. Creating Services..." -ForegroundColor Cyan
kubectl apply -f k8s/services/

Write-Host "5. Creating Ingress..." -ForegroundColor Cyan
kubectl apply -f k8s/ingress.yaml

Write-Host "6. Creating HPAs..." -ForegroundColor Cyan
kubectl apply -f k8s/hpa/

Write-Host ""
Write-Host "✓ Deployment complete!" -ForegroundColor Green
Write-Host ""

# Wait for pods to be ready
Write-Host "⏳ Waiting for pods to be ready..." -ForegroundColor Yellow
Write-Host "This may take 1-2 minutes..." -ForegroundColor Gray
kubectl wait --for=condition=ready pod -l app -n tezcart --timeout=300s

Write-Host ""
Write-Host "📊 Deployment Status:" -ForegroundColor Cyan
kubectl get pods -n tezcart

Write-Host ""
Write-Host "🌐 Services:" -ForegroundColor Cyan
kubectl get services -n tezcart

Write-Host ""
Write-Host "📈 HPAs:" -ForegroundColor Cyan
kubectl get hpa -n tezcart

Write-Host ""
Write-Host "🎉 TezCart deployed successfully!" -ForegroundColor Green
Write-Host ""

# Show access instructions
if ($usingMinikube) {
    Write-Host "🔗 Access the application:" -ForegroundColor Cyan
    Write-Host "Run the following commands to get the URLs:" -ForegroundColor Yellow
    Write-Host "  Frontend: " -NoNewline; Write-Host "minikube service frontend -n tezcart --url" -ForegroundColor White
    Write-Host "  API Gateway: " -NoNewline; Write-Host "minikube service api-gateway -n tezcart --url" -ForegroundColor White
    Write-Host ""
    Write-Host "Or use port-forwarding:" -ForegroundColor Yellow
    Write-Host "  kubectl port-forward -n tezcart service/frontend 8080:80" -ForegroundColor White
    Write-Host "  kubectl port-forward -n tezcart service/api-gateway 3000:3000" -ForegroundColor White
} else {
    Write-Host "🔗 Access the application:" -ForegroundColor Cyan
    Write-Host "Use port-forwarding to access the services:" -ForegroundColor Yellow
    Write-Host "  kubectl port-forward -n tezcart service/frontend 8080:80" -ForegroundColor White
    Write-Host "  kubectl port-forward -n tezcart service/api-gateway 3000:3000" -ForegroundColor White
    Write-Host ""
    Write-Host "Then open http://localhost:8080 in your browser" -ForegroundColor White
}

Write-Host ""
Write-Host "📚 For more information, check k8s/README.md" -ForegroundColor Gray
