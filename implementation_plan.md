# Implementation Plan - Secure PayPal Integration

The goal is to secure the payment flow by verifying PayPal transactions and updating user credits on the server, rather than the client.

## User Review Required
> [!IMPORTANT]
> You will need to obtain your **PayPal Client Secret** and **Firebase Service Account** credentials.
> - **PayPal Client Secret**: From the same dashboard where you got the Client ID.
> - **Firebase Service Account**: From Firebase Console -> Project Settings -> Service accounts -> Generate new private key.

## Proposed Changes

### Dependencies
- [NEW] `firebase-admin`: For server-side Firestore access.
- [NEW] `@paypal/checkout-server-sdk`: For server-side PayPal order verification.

### Backend (API Routes & Libs)
#### [NEW] [firebase-admin.ts](file:///c:/statement-converter/src/lib/firebase-admin.ts)
- Initialize Firebase Admin SDK.
- Should handle using environment variables for credentials.

#### [NEW] [paypal-client.ts](file:///c:/statement-converter/src/lib/paypal-client.ts)
- Helper to set up PayPal environment (Sandbox/Live) and client.

#### [NEW] [route.ts](file:///c:/statement-converter/src/app/api/capture-order/route.ts)
- **POST** endpoint:
    - Receives `orderID` and `userId` (or verify auth token from headers).
    - Verifies order with PayPal.
    - If valid, calculates credits based on plan.
    - Updates user document in Firestore using `firebase-admin`.
    - Returns success/failure.

### Frontend
#### [MODIFY] [paypal-button.tsx](file:///c:/statement-converter/src/components/app/paypal-button.tsx)
- Remove client-side Firestore update logic.
- Instead, `fetch('/api/capture-order', ...)` with the `orderID`.
- Handle the response from the API.

## Verification Plan
### Manual Verification
- Perform a payment in Sandbox mode.
- Verify that the API route is called.
- Verify that the user's credits are updated in Firestore (check via Firebase Console or App UI).
- Verify that no client-side logic can manipulate the credit amount.
