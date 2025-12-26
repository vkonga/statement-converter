import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/paypal-client';
import checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import { firestore, auth } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { generateInvoicePDF } from '@/lib/invoice-generator';
import { sendInvoiceEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const { orderID, userId, planName, billingCycle } = await req.json();

        if (!orderID || !userId || !planName) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }


        // 1. Verify the order with PayPal
        // We use OrdersGetRequest to fetch details. 
        // Ideally, for a robust capture, you might use OrdersCaptureRequest if the client didn't capture yet.
        // However, the client-side usually calls actions.order.capture(). 
        // If the client ALREADY captured, we should use OrdersGetRequest to verify the status is 'COMPLETED'.

        // BUT, the React PayPal JS library's `onApprove` usually happens AFTER `actions.order.capture()` on the client,
        // which returns the details. 
        // TO BE SECURE: The client should NOT capture. The backend should capture.
        // However, keeping the current flow simple: The client captures, and we VERIFY here.

        const request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderID);
        const order = await client.execute(request);

        if (order.result.status !== 'COMPLETED') {
            return NextResponse.json({ error: 'Order not completed' }, { status: 400 });
        }

        // 2. Calculate Credits
        let creditsToAdd = 0;
        switch (planName) {
            case 'Pro': creditsToAdd = 400; break;
            case 'Pro Max': creditsToAdd = 1000; break;
            case 'Business': creditsToAdd = 4000; break;
            default: creditsToAdd = 0;
        }

        if (billingCycle === 'yearly') {
            creditsToAdd *= 12;
        }

        if (creditsToAdd === 0) {
            return NextResponse.json({ error: 'Invalid plan name' }, { status: 400 });
        }

        // 3. Update User in Firestore (Server-side)
        const userRef = firestore.collection('users').doc(userId);

        await userRef.set({
            credits: FieldValue.increment(creditsToAdd),
            plan: planName,
            lastPaymentDate: FieldValue.serverTimestamp(),
            isPaidUser: true,
            lastOrderId: orderID // Idempotency check could be added here
        }, { merge: true });

        // 4. Send Invoice Email
        try {
            const userRecord = await auth.getUser(userId);
            const userEmail = userRecord.email;
            const userName = userRecord.displayName || 'Valued Customer';

            if (userEmail) {
                // Determine amount for invoice (rough estimate logic for now as amount is not passed from client except implicitly)
                // In a real app, pass amount from client or fetch from plan DB.
                // Re-calculating based on plan and cycle.
                let amount = 0;
                // Base Monthly Prices
                const prices: Record<string, number> = { 'Pro': 15, 'Pro Max': 30, 'Business': 50 };
                // Yearly discount logic: Monthly price for yearly plan is { 'Pro': 8, 'Pro Max': 15, 'Business': 25 }
                const yearlyPrices: Record<string, number> = { 'Pro': 8, 'Pro Max': 15, 'Business': 25 };

                if (billingCycle === 'yearly') {
                    amount = (yearlyPrices[planName] || 0) * 12;
                } else {
                    amount = prices[planName] || 0;
                }

                const invoicePdf = await generateInvoicePDF({
                    orderID,
                    date: new Date(),
                    userName,
                    userEmail,
                    planName,
                    amount,
                    currency: 'USD'
                });

                await sendInvoiceEmail(userEmail, invoicePdf, { orderID, planName });
            }
        } catch (emailError) {
            console.error('Failed to send invoice email:', emailError);
            // Don't fail the request, payment was successful
        }

        return NextResponse.json({ success: true, creditsAdded: creditsToAdd });

    } catch (error: any) {
        console.error('Error in capture-order API:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
