# TezCart Testing Guide

## ✅ Current Status - ALL SERVICES RUNNING!

### Running Services:
- ✅ User Service: http://localhost:3001
- ✅ Product Service: http://localhost:3002
- ✅ Cart Service: http://localhost:3003
- ✅ Order Service: http://localhost:3004
- ✅ Admin Service: http://localhost:3005
- ✅ API Gateway: http://localhost:3000
- ✅ Frontend: http://localhost:3007

---

## 🎯 Manual Testing Checklist

### 1. Test Frontend - User Registration
1. Open http://localhost:3007 in your browser
2. Click "Register" in the navigation
3. Fill in:
   - Name: Test User
   - Email: test@example.com
   - Password: password123
4. Click "Register"
5. ✅ Should redirect to products page
6. ✅ Should see "Hello, Test User" in nav

### 2. Test Product Browsing
1. You should see 5 sample products:
   - Wireless Headphones ($79.99)
   - Smart Watch ($199.99)
   - Running Shoes ($89.99)
   - Backpack ($49.99)
   - Coffee Maker ($129.99)
2. ✅ All products display with images
3. ✅ Prices are visible
4. ✅ "Add to Cart" buttons present

### 3. Test Shopping Cart
1. Click "Add to Cart" on 2-3 products
2. ✅ Should see "Added to cart!" message
3. Click "Cart" in navigation
4. ✅ Should see all added items
5. ✅ Total price calculated correctly
6. Test "Remove" button
7. ✅ Item removed from cart
8. ✅ Total updates

### 4. Test Order Placement
1. Add items to cart
2. Go to Cart page
3. Click "Checkout"
4. ✅ Should see "Order placed successfully!"
5. Wait 2 seconds (auto-redirect)
6. ✅ Redirected to Orders page

### 5. Test Order History
1. Click "Orders" in navigation
2. ✅ Should see your placed order
3. ✅ Order shows:
   - Order number
   - Status (pending)
   - Total amount
   - Items list
   - Date

### 6. Test User Logout/Login
1. Click "Logout"
2. ✅ Redirected to home page
3. Click "Login"
4. Enter credentials:
   - Email: test@example.com
   - Password: password123
5. Click "Login"
6. ✅ Should login successfully
7. ✅ Cart and orders preserved

### 7. Test Admin Login
1. Logout from user account
2. Open: http://localhost:3007/admin (create this page or use API)
3. For now, test via API (see API Testing below)

---

## 🔧 API Testing with PowerShell

### Test User Registration
```powershell
$body = @{
    name = "John Doe"
    email = "john@example.com"
    password = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:3000/api/users/register `
    -Method POST `
    -Body $body `
    -ContentType "application/json" `
    -UseBasicParsing | Select-Object -ExpandProperty Content
```

### Test User Login
```powershell
$body = @{
    email = "john@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri http://localhost:3000/api/users/login `
    -Method POST `
    -Body $body `
    -ContentType "application/json" `
    -UseBasicParsing

$response.Content
# Save the token for later tests
```

### Test Get Products
```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/products `
    -UseBasicParsing | Select-Object -ExpandProperty Content
```

### Test Get Categories
```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/categories `
    -UseBasicParsing | Select-Object -ExpandProperty Content
```

### Test Add to Cart
```powershell
$body = @{
    productId = 1
    name = "Wireless Headphones"
    price = 79.99
    quantity = 1
    image = "https://via.placeholder.com/100x100"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:3000/api/cart/1/add `
    -Method POST `
    -Body $body `
    -ContentType "application/json" `
    -UseBasicParsing | Select-Object -ExpandProperty Content
```

### Test Get Cart
```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/cart/1 `
    -UseBasicParsing | Select-Object -ExpandProperty Content
```

### Test Create Order
```powershell
$body = @{
    userId = 1
    items = @(
        @{
            productId = 1
            name = "Wireless Headphones"
            price = 79.99
            quantity = 1
        }
    )
    total = 79.99
    shippingAddress = "123 Main St"
} | ConvertTo-Json -Depth 3

Invoke-WebRequest -Uri http://localhost:3000/api/orders `
    -Method POST `
    -Body $body `
    -ContentType "application/json" `
    -UseBasicParsing | Select-Object -ExpandProperty Content
```

### Test Get Orders
```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/orders/user/1 `
    -UseBasicParsing | Select-Object -ExpandProperty Content
```

### Test Admin Login
```powershell
$body = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:3000/api/admin/login `
    -Method POST `
    -Body $body `
    -ContentType "application/json" `
    -UseBasicParsing | Select-Object -ExpandProperty Content
```

### Test Admin Get Stats
```powershell
Invoke-WebRequest -Uri http://localhost:3000/api/admin/stats `
    -UseBasicParsing | Select-Object -ExpandProperty Content
```

---

## 🎬 Complete User Flow Test

Run this script to test the complete flow:

```powershell
Write-Host "Testing TezCart Complete Flow" -ForegroundColor Cyan
Write-Host ""

# 1. Register User
Write-Host "1. Registering user..." -ForegroundColor Yellow
$registerBody = @{
    name = "Test User"
    email = "testuser@example.com"
    password = "test123"
} | ConvertTo-Json

$registerResponse = Invoke-WebRequest -Uri http://localhost:3000/api/users/register `
    -Method POST -Body $registerBody -ContentType "application/json" -UseBasicParsing
Write-Host "✅ User registered" -ForegroundColor Green
Write-Host ""

# 2. Get Products
Write-Host "2. Getting products..." -ForegroundColor Yellow
$products = Invoke-WebRequest -Uri http://localhost:3000/api/products -UseBasicParsing
Write-Host "✅ Products retrieved" -ForegroundColor Green
Write-Host ""

# 3. Add to Cart
Write-Host "3. Adding product to cart..." -ForegroundColor Yellow
$cartBody = @{
    productId = 1
    name = "Wireless Headphones"
    price = 79.99
    quantity = 2
    image = "https://via.placeholder.com/100x100"
} | ConvertTo-Json

Invoke-WebRequest -Uri http://localhost:3000/api/cart/1/add `
    -Method POST -Body $cartBody -ContentType "application/json" -UseBasicParsing | Out-Null
Write-Host "✅ Product added to cart" -ForegroundColor Green
Write-Host ""

# 4. Get Cart
Write-Host "4. Viewing cart..." -ForegroundColor Yellow
$cart = Invoke-WebRequest -Uri http://localhost:3000/api/cart/1 -UseBasicParsing
$cartData = $cart.Content | ConvertFrom-Json
Write-Host "✅ Cart total: $($cartData.total)" -ForegroundColor Green
Write-Host ""

# 5. Create Order
Write-Host "5. Creating order..." -ForegroundColor Yellow
$orderBody = @{
    userId = 1
    items = $cartData.items
    total = $cartData.total
} | ConvertTo-Json -Depth 3

$order = Invoke-WebRequest -Uri http://localhost:3000/api/orders `
    -Method POST -Body $orderBody -ContentType "application/json" -UseBasicParsing
Write-Host "✅ Order created" -ForegroundColor Green
Write-Host ""

# 6. View Orders
Write-Host "6. Viewing order history..." -ForegroundColor Yellow
$orders = Invoke-WebRequest -Uri http://localhost:3000/api/orders/user/1 -UseBasicParsing
Write-Host "✅ Order history retrieved" -ForegroundColor Green
Write-Host ""

Write-Host "🎉 Complete flow test successful!" -ForegroundColor Green
```

---

## 🐛 Troubleshooting

### If Frontend Shows Errors:
- Check browser console (F12)
- Verify API Gateway is running on port 3000
- Check CORS is enabled

### If API Calls Fail:
- Verify all services are running
- Check service logs in terminals
- Test individual service health:
  ```powershell
  Invoke-WebRequest -Uri http://localhost:3001/health -UseBasicParsing
  Invoke-WebRequest -Uri http://localhost:3002/health -UseBasicParsing
  Invoke-WebRequest -Uri http://localhost:3003/health -UseBasicParsing
  Invoke-WebRequest -Uri http://localhost:3004/health -UseBasicParsing
  Invoke-WebRequest -Uri http://localhost:3005/health -UseBasicParsing
  ```

### To Stop Services:
- Press Ctrl+C in each terminal
- Or close all terminal windows

---

## ✅ Test Results Template

Use this to document your testing:

```
[ ] User Registration - Works / Issues: ___________
[ ] User Login - Works / Issues: ___________
[ ] Product Display - Works / Issues: ___________
[ ] Add to Cart - Works / Issues: ___________
[ ] View Cart - Works / Issues: ___________
[ ] Remove from Cart - Works / Issues: ___________
[ ] Place Order - Works / Issues: ___________
[ ] View Orders - Works / Issues: ___________
[ ] Admin Login - Works / Issues: ___________
[ ] API Gateway - Works / Issues: ___________
```

---

## 📸 Screenshots for Documentation

Take screenshots of:
1. Home page
2. Product listing
3. Shopping cart with items
4. Order confirmation
5. Order history
6. Running services (terminal windows)
7. Browser DevTools showing API calls

---

**Happy Testing! 🚀**
