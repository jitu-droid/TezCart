# TezCart Kubernetes Cleanup Script
# This script removes all TezCart resources from Kubernetes

Write-Host "🧹 TezCart Kubernetes Cleanup Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "⚠ WARNING: This will delete all TezCart resources from Kubernetes!" -ForegroundColor Yellow
Write-Host ""

$confirmation = Read-Host "Are you sure you want to continue? (yes/no)"

if ($confirmation -ne "yes") {
    Write-Host "Cleanup cancelled." -ForegroundColor Gray
    exit 0
}

Write-Host ""
Write-Host "🗑 Deleting TezCart resources..." -ForegroundColor Yellow

# Delete in reverse order
Write-Host "1. Deleting HPAs..." -ForegroundColor Cyan
kubectl delete -f k8s/hpa/ --ignore-not-found=true

Write-Host "2. Deleting Ingress..." -ForegroundColor Cyan
kubectl delete -f k8s/ingress.yaml --ignore-not-found=true

Write-Host "3. Deleting Services..." -ForegroundColor Cyan
kubectl delete -f k8s/services/ --ignore-not-found=true

Write-Host "4. Deleting Deployments..." -ForegroundColor Cyan
kubectl delete -f k8s/deployments/ --ignore-not-found=true

Write-Host "5. Deleting ConfigMap and Secrets..." -ForegroundColor Cyan
kubectl delete -f k8s/configmap.yaml --ignore-not-found=true
kubectl delete -f k8s/secrets.yaml --ignore-not-found=true

Write-Host "6. Deleting Namespace..." -ForegroundColor Cyan
kubectl delete -f k8s/namespace.yaml --ignore-not-found=true

Write-Host ""
Write-Host "✓ Cleanup complete!" -ForegroundColor Green
Write-Host ""

# Verify cleanup
Write-Host "Verifying cleanup..." -ForegroundColor Yellow
$remainingPods = kubectl get pods -n tezcart 2>$null
if ($null -eq $remainingPods -or $remainingPods -like "*No resources found*") {
    Write-Host "✓ All resources deleted successfully" -ForegroundColor Green
} else {
    Write-Host "⚠ Some resources may still exist:" -ForegroundColor Yellow
    kubectl get all -n tezcart
}
