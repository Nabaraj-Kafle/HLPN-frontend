# 🔍 Debugging 400 Error - Place Order Issue

## Step 1: Open Browser Developer Tools
Press **F12** to open the browser console, then follow these steps:

### A. Check Network Tab
1. Click **Network** tab
2. Try to place an order by clicking "Confirm & Place Order"
3. Look for a request to `/api/orders/checkout/` (or similar)
4. Click on that request to see:
   - **Request**: Scroll to see the payload JSON being sent
   - **Response**: See the error message from backend

### B. Check Console Tab  
1. Click **Console** tab
2. Try to place an order
3. Look for red error messages starting with:
   - `❌ 400 Bad Request`
   - `API Error - POST /orders/checkout/:`
   - `Validation Error:`

## Step 2: Copy the Error Details

### Common 400 Error Messages & Solutions:

**If you see validation errors like:**
```
"items": ["This field is required"]
"payment_method": ["Invalid choice"]
"shipping_address": ["This field is required"]
```

**Issue**: Field names or structure mismatch

---

## Step 3: Check Backend Expected Format

The backend Django API expects one of these formats:

### Format 1 (Current Implementation):
```json
{
  "items": [
    {"product_id": 1, "quantity": 2},
    {"product_id": 3, "quantity": 1}
  ],
  "shipping_address": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St",
    "city": "New York",
    "zip_code": "10001"
  },
  "payment_method": "cod"
}
```

### Format 2 (Alternative - If Format 1 fails):
```json
{
  "order_items": [
    {"product": 1, "quantity": 2},
    {"product": 3, "quantity": 1}
  ],
  "shipping_address": {...},
  "payment_method": "cod"
}
```

---

## Step 4: What to Look For

### In Console, You Should See:
```
✅ API Request - POST /orders/checkout/ with payload:
{
  "items": [...]
  "shipping_address": {...}
  "payment_method": "cod"
}

❌ 400 Bad Request - Check the payload structure...
Response data: {
  "field_name": ["Error message here"]
}
```

---

## Step 5: Most Common Issues & Fixes

### Issue #1: Field Name Mismatch
**Error**: `"Unknown field: product_id"`
**Fix**: Backend might use `product` instead of `product_id`

### Issue #2: Missing Shipping Address Fields  
**Error**: `"shipping_address": "This field is required"`
**Fix**: All fields must be filled (name, email, phone, address)

### Issue #3: Invalid Payment Method
**Error**: `"payment_method": ["Invalid choice"]`
**Fix**: Must be exactly `"cod"` or `"qr"` (lowercase, no spaces)

### Issue #4: Empty Cart
**Error**: `"items": ["Empty list not allowed"]`
**Fix**: Ensure cartItems is not empty before placing order

### Issue #5: Invalid Product ID
**Error**: `"items": [{"product_id": "Not found"}]`
**Fix**: Product must exist in database

---

## Step 6: How to Report the Issue

When you get the 400 error, copy this info and share:

```
1. Screenshot of Network tab showing the Request payload
2. Screenshot of Response tab showing the error
3. Browser console error message (copy the full JSON)
4. Cart items (how many items, which product IDs)
5. Checkout form data you filled in
```

---

## Quick Actions

### 🔧 To Fix Immediately:
1. **Open F12** → Network tab
2. **Place order** and look for `/checkout/` request
3. **Right-click** the request → Copy as cURL
4. **Share the error response** from backend
5. We'll adjust payload format accordingly

### 📝 Meanwhile, Verify:
- [ ] All form fields are filled correctly
- [ ] Cart has items
- [ ] You're logged in
- [ ] Payment method is selected
- [ ] Browser console shows no JS errors before clicking button

---

## Backend API Status
- Endpoint: `POST /api/orders/checkout/`
- Authentication: Required (Bearer token)
- Response: 201 (Created) or 400 (Bad Request)

**Open F12 now and try placing an order. Copy the console output!** 🚀
