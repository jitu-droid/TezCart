# TezCart Quick Start Script
# Run this to install all dependencies

Write-Host "TezCart - Installing Dependencies" -ForegroundColor Cyan
Write-Host ""

# Function to install dependencies
function Install-Service {
    param($serviceName, $servicePath)
    Write-Host "Installing $serviceName..." -ForegroundColor Yellow
    Push-Location $servicePath
    npm install
    Pop-Location
    Write-Host "$serviceName installed successfully" -ForegroundColor Green
    Write-Host ""
}

# Install all services
Install-Service "User Service" "services\user-service"
Install-Service "Product Service" "services\product-service"
Install-Service "Cart Service" "services\cart-service"
Install-Service "Order Service" "services\order-service"
Install-Service "Admin Service" "services\admin-service"
Install-Service "API Gateway" "services\api-gateway"
Install-Service "Frontend" "frontend"

Write-Host "All dependencies installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Cyan
Write-Host "1. Open 7 separate terminal windows" -ForegroundColor White
Write-Host "2. Run each service:" -ForegroundColor White
Write-Host "   - cd services\user-service; npm start" -ForegroundColor Gray
Write-Host "   - cd services\product-service; npm start" -ForegroundColor Gray
Write-Host "   - cd services\cart-service; npm start" -ForegroundColor Gray
Write-Host "   - cd services\order-service; npm start" -ForegroundColor Gray
Write-Host "   - cd services\admin-service; npm start" -ForegroundColor Gray
Write-Host "   - cd services\api-gateway; npm start" -ForegroundColor Gray
Write-Host "   - cd frontend; npm start" -ForegroundColor Gray
Write-Host ""
