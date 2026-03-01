# Razorpay Payment Gateway Integration Guide

## Overview

This document explains the complete Razorpay integration setup for the College ERP System. The system now supports:

- ✅ Card payments (Visa, Mastercard, RuPay)
- ✅ Net Banking (all major banks)
- ✅ UPI payments (PhonePe, Paytm, Google Pay) - Ready for activation
- ✅ Offline payments (Cash, Check, DD)

## Architecture

### Backend Components

1. **RazorpayConfig.java**
   - Spring configuration bean
   - Loads API credentials from `razorpay.properties`
   - Provides `RazorpayClient` bean for SDK integration

2. **RazorpayService.java**
   - Business logic for Razorpay operations
   - Methods:
     - `createOrder()` - Creates Razorpay order
     - `verifyPaymentSignature()` - Validates payment authenticity
     - `generateSignature()` - HMAC SHA256 signature generation
     - `getPaymentDetails()` - Fetches payment info from Razorpay
     - `getOrderDetails()` - Fetches order info from Razorpay

3. **RazorpayController.java**
   - REST endpoints:
     - `POST /api/razorpay/create-order` - Initiates payment
     - `POST /api/razorpay/verify-payment` - Verifies payment signature
     - `GET /api/razorpay/order/{orderId}` - Gets order details
     - `GET /api/razorpay/payment/{paymentId}` - Gets payment details

### Frontend Components

1. **Payment.jsx**
   - Student payment dashboard
   - Integrated Razorpay checkout for CARD & NETBANKING methods
   - Functions:
     - `initiateRazorpayPayment()` - Opens Razorpay checkout
     - `verifyRazorpayPayment()` - Verifies payment after transaction

2. **razorpayConfig.js** (New)
   - Utility functions for Razorpay integration
   - Helper methods for order creation, verification, and payment details

3. **index.html**
   - Added Razorpay SDK script: `https://checkout.razorpay.com/v1/checkout.js`

## Setup Steps

### Phase 1: Get Razorpay Credentials ✅ (WHEN YOU GET YOUR API KEYS)

1. **Go to Razorpay Dashboard**
   - Website: https://dashboard.razorpay.com
   - Sign up (if not already done) - You mentioned KYC is pending
   - Complete KYC verification (video call takes ~24 hours)

2. **Get Test Keys** (Available immediately after signup)
   - Navigate to Settings → API Keys
   - Copy TEST Key ID and TEST Key Secret
   - Use these for development/testing

3. **Get Live Keys** (After KYC approval)
   - After KYC passes, LIVE keys become available
   - Switch toggle to see LIVE keys
   - Use these for production

### Phase 2: Configure Backend ✅ (Ready)

1. **Update razorpay.properties**

   ```properties
   razorpay.key.id=${RAZORPAY_KEY_ID}
   razorpay.key.secret=${RAZORPAY_KEY_SECRET}
   razorpay.webhook.secret=${RAZORPAY_WEBHOOK_SECRET}
   ```

2. **Option A: Environment Variables (Recommended for Production)**

   ```bash
   # Linux/Mac
   export RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxx"
   export RAZORPAY_KEY_SECRET="xxxxxxxxxxxxxxx"
   export RAZORPAY_WEBHOOK_SECRET="whsec_xxxxxxxxxx"

   # Windows PowerShell
   $env:RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxx"
   $env:RAZORPAY_KEY_SECRET="xxxxxxxxxxxxxxx"
   $env:RAZORPAY_WEBHOOK_SECRET="whsec_xxxxxxxxxx"
   ```

3. **Option B: Direct Configuration (For Development)**
   - Edit `Back-End/stud-erp/src/main/resources/razorpay.properties`
   - Replace placeholders directly:
   ```properties
   razorpay.key.id=rzp_test_xxx...
   razorpay.key.secret=xxx...
   razorpay.webhook.secret=xxx...
   ```

### Phase 3: Frontend Configuration ✅ (Ready)

1. **Razorpay Script Loaded** ✅
   - Already added to `index.html`
   - Script: `https://checkout.razorpay.com/v1/checkout.js`

2. **Environment Variables** (Optional)
   - Create `.env.local` in frontend folder:
   ```
   VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxx
   ```

   - Or update Payment.jsx line ~230:
   ```javascript
   key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_key",
   ```

### Phase 4: Backend Compilation ⏳ (Next Step)

1. **Navigate to backend directory**

   ```bash
   cd Back-End/stud-erp
   ```

2. **Build with Maven**

   ```bash
   mvn clean install
   # Or if builds fail:
   mvn clean install -DskipTests
   ```

3. **Run the application**
   ```bash
   mvn spring-boot:run
   ```

### Phase 5: Testing

#### Test Transaction Flow (With Test Keys)

1. Navigate to Payment page in student dashboard
2. Select a pending payment (e.g., Semester 1 fee: ₹54,000)
3. Click "Pay Now"
4. Choose "Credit/Debit Card (Razorpay)" or "Net Banking (Razorpay)"
5. Click "Proceed to Pay"
6. Use Razorpay test credentials:
   ```
   Card Number: 4111 1111 1111 1111
   Expiry: Any future date (e.g., 12/25)
   CVV: Any 3 digits
   ```

#### Test Payment Success

- Razorpay test mode accepts any test card details
- Automatic success after entering OTP screen
- Payment appears in history with transaction ID

#### Test Payment Failure (Optional)

- Card: 4000 0000 0000 0002
- This will trigger payment failure scenario

## File Locations

```
Backend:
- RazorpayConfig.java → Back-End/stud-erp/src/main/java/com/example/stud_erp/config/
- RazorpayService.java → Back-End/stud-erp/src/main/java/com/example/stud_erp/service/
- RazorpayController.java → Back-End/stud-erp/src/main/java/com/example/stud_erp/controller/
- razorpay.properties → Back-End/stud-erp/src/main/resources/

Frontend:
- Payment.jsx → Fron-End/College-ERP/src/pages/dashboard/student/
- razorpayConfig.js → Fron-End/College-ERP/src/utils/
- index.html → Fron-End/College-ERP/ (Razorpay script added)
```

## Payment Flow Diagram

```
Student Clicks "Pay Now"
    ↓
Payment Dialog Opens (Method Selection)
    ↓
┌─────────────────────────────────────────┐
│ Method Selection                        │
├─────────────────────────────────────────┤
│ CARD/NETBANKING     → Go to Razorpay   │
│ UPI                 → Mock QR Code      │
│ OFFLINE             → Direct Process    │
└─────────────────────────────────────────┘
    ↓
[For CARD/NETBANKING]
    ↓
initializeRazorpayPayment()
    ↓
Call: POST /api/razorpay/create-order
    ↓
Backend creates Razorpay order
    ↓
Return orderData with orderId
    ↓
Open Razorpay Checkout
    ↓
User completes payment
    ↓
Razorpay returns response with paymentId & signature
    ↓
verifyRazorpayPayment()
    ↓
Call: POST /api/razorpay/verify-payment
    ↓
Backend validates signature & payment status
    ↓
Call: processPayment() (Mark as COMPLETED in DB)
    ↓
Show Success Dialog
    ↓
Update Payment History
```

## API Endpoints

### Create Order

```bash
POST /api/razorpay/create-order

Request Body:
{
  "paymentId": 123,
  "amount": 5400000,
  "description": "Semester 1 Fee"
}

Response:
{
  "orderId": "order_2CKu...",
  "amount": 5400000,
  "currency": "INR",
  "paymentId": 123,
  "description": "Semester 1 Fee"
}
```

### Verify Payment

```bash
POST /api/razorpay/verify-payment

Request Body:
{
  "orderId": "order_2CKu...",
  "paymentId": "pay_2CKu...",
  "signature": "9ef4dffbfd..."
}

Response:
{
  "success": true,
  "message": "Payment verified successfully",
  "paymentDetails": { ... }
}
```

### Get Order Details

```bash
GET /api/razorpay/order/{orderId}

Response: { ... order details ... }
```

### Get Payment Details

```bash
GET /api/razorpay/payment/{paymentId}

Response: { ... payment details ... }
```

## Future Enhancements ⏳

1. **Webhook Implementation**
   - Handle payment.success, payment.failure events
   - Automatic payment status updates

2. **UPI Razorpay Integration**
   - Replace mock QR code with actual Razorpay UPI
   - Same checkout experience as Cards/NetBanking

3. **Payment Refunds**
   - Add refund capability in payment history
   - Admin dashboard for refund management

4. **Recurring Payments**
   - Enable installment plans
   - Auto-debit for recurring fees

5. **Payment Analytics**
   - Dashboard for payment statistics
   - Daily/monthly revenue reports

## Troubleshooting

### Issue: "Failed to load Razorpay script"

- **Solution**: Check internet connection, ensure HTTPS context for production

### Issue: "Invalid payment signature"

- **Solution**: Verify Key Secret is correct, check webhook secret configuration

### Issue: "Order creation failed"

- **Solution**: Check backend logs, verify Razorpay service is running, test endpoint with Postman

### Issue: Payment dialog doesn't open

- **Solution**: Ensure `window.Razorpay` is loaded, check browser console for errors

### Issue: Payment success but not saved to database

- **Solution**: Check PaymentService, verify Student ID mapping, check database constraints

## Key Files to Remember

When you get Razorpay credentials:

1. Edit: `razorpay.properties` - Add actual keys
2. Rebuild: `mvn clean install`
3. Run: `mvn spring-boot:run`
4. Test: Use test card details on Payment page

## Contact Support

For issues with Razorpay:

- [Razorpay Support](https://razorpay.com/contact-us/)
- [Razorpay Docs](https://razorpay.com/docs/)

For issues with this implementation:

- Check backend logs: `mvn spring-boot:run` console output
- Check frontend console: F12 → Console tab in browser

## NEXT STEPS (After Setup)

1. ✅ Files created and configured
2. ⏳ Get Razorpay test keys from dashboard
3. ⏳ Update razorpay.properties with test keys
4. ⏳ Build backend: `mvn clean install`
5. ⏳ Run backend: `mvn spring-boot:run`
6. ⏳ Test full payment flow
7. ⏳ Switch to LIVE keys after KYC approval
