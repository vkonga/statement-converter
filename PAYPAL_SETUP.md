# PayPal Integration Setup Guide

## 1. Prerequisites
- A verified **PayPal Business Account**. (Personal accounts may have limitations for accepting international payments).
- Since you are in **India**, PayPal regulations allow you to receive payments from **international** customers (in USD, EUR, etc.) but **not** domestic payments (INR from other Indian PayPal accounts).

## 2. Get Your Credentials
1. Go to the [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/).
2. Log in with your Business account.
3. Keep the toggle on **Sandbox** for testing.
4. Click **Create App**.
5. Give it a name (e.g., "StatementConverter Dev").
6. Click **Create App**.
7. Copy the **Client ID** shown on the screen.

## 3. Configure Your Application
1. Create a file named `.env.local` in the root of your project (if it doesn't exist).
2. Add the following line:

```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_client_id_here
```

Replace `your_client_id_here` with the Client ID you copied.

## 4. Testing the Integration
1. Go to your local application (usually `http://localhost:3000/pricing`).
2. You should see the PayPal buttons.
3. To test a payment, you need a **Sandbox Personal Account**.
   - Go back to PayPal Developer Dashboard -> **Testing Tools** -> **Sandbox Accounts**.
   - Create a new "Personal" sandbox account.
   - Use the generated email and password to log in when you click the PayPal button on your site.
4. Complete the payment.
5. You should see a "Payment Successful" notification and be redirected to the Home page.

## 5. Go Live (Production)
1. In the PayPal Developer Dashboard, switch the toggle to **Live**.
2. Create a **Live** App.
3. Copy the **Live Client ID**.
4. Update your `.env.local` file (or your production environment variables) with the live Client ID.
   ```env
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_live_client_id_here
   ```
5. **Important for Indian Merchants**:
   - Ensure you have linked your Bank Account to PayPal.
   - You may need to provide a "Purpose Code" for export of services (e.g., usually "P0802 - Software consultancy" or similar, check with your CA/PayPal).
   - Payments received in USD will be auto-converted to INR and transferred to your bank account daily.

## 6. Currency Handling
Your application is currently configured to request payments in **USD**:
```javascript
amount: {
  value: amount,
  currency_code: 'USD',
},
```
This means even if a user pays with a different currency card, PayPal will handle the conversion to USD.
