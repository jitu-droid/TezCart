# TezCart Docker Control Script

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("start", "stop", "restart", "logs", "build", "clean", "status")]
    [string]$Action = "start"
)

Write-Host "TezCart Docker Manager" -ForegroundColor Cyan
Write-Host ""

switch ($Action) {
    "start" {
        Write-Host "Starting all services..." -ForegroundColor Green
        docker-compose up -d --build
        Write-Host ""
        Write-Host "All services started!" -ForegroundColor Green
        Write-Host "Frontend: http://localhost:8080" -ForegroundColor Yellow
        Write-Host "API Gateway: http://localhost:3000" -ForegroundColor Yellow
    }
    
    "stop" {
        Write-Host "Stopping all services..." -ForegroundColor Yellow
        docker-compose down
        Write-Host "All services stopped!" -ForegroundColor Green
    }
    
    "restart" {
        Write-Host "Restarting all services..." -ForegroundColor Yellow
        docker-compose restart
        Write-Host "All services restarted!" -ForegroundColor Green
    }
    
    "logs" {
        Write-Host "Showing logs (Ctrl+C to exit)..." -ForegroundColor Yellow
        docker-compose logs -f
    }
    
    "build" {
        Write-Host "Building all images..." -ForegroundColor Green
        docker-compose build
        Write-Host "Build complete!" -ForegroundColor Green
    }
    
    "clean" {
        Write-Host "Cleaning up Docker resources..." -ForegroundColor Yellow
        docker-compose down -v
        Write-Host "Cleanup complete!" -ForegroundColor Green
    }
    
    "status" {
        Write-Host "Container Status:" -ForegroundColor Green
        docker-compose ps
    }
}
