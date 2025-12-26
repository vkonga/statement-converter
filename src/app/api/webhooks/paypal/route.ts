import { NextRequest, NextResponse } from 'next/server';
import client from '@/lib/paypal-client';
import * as paypal from '@paypal/checkout-server-sdk';
import { firestore } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
    try {
        // 1. Get headers and body
        const headers = req.headers;
        const bodyText = await req.text(); // Raw body needed for verification
        const body = JSON.parse(bodyText);

        // 2. Verify Webhook Signature
        // We need to verify that this request actually came from PayPal.
        const webhookId = process.env.PAYPAL_WEBHOOK_ID;

        if (!webhookId) {
            console.error("Missing PAYPAL_WEBHOOK_ID");
            return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
        }

        // Prepare the verification request
        const verifyRequest = new (paypal as any).notifications.VerifyWebhookSignatureRequest();
        verifyRequest.requestBody({
            transmission_id: headers.get('paypal-transmission-id'),
            transmission_time: headers.get('paypal-transmission-time'),
            cert_url: headers.get('paypal-cert-url'),
            auth_algo: headers.get('paypal-auth-algo'),
            transmission_sig: headers.get('paypal-transmission-sig'),
            webhook_id: webhookId,
            webhook_event: body
        });

        try {
            const verification = await client.execute(verifyRequest);
            if (verification.result.verification_status !== 'SUCCESS') {
                console.error("Webhook signature verification failed");
                return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
            }
        } catch (err) {
            console.error("Error verifying webhook:", err);
            // During local testing without a real webhook ID, verification might fail or throw.
            // For strict security, we should return 400 here.
            // For now, logging and returning 400.
            return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
        }

        // 3. Process the Event
        const eventType = body.event_type;

        if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
            const resource = body.resource;
            const orderID = resource.id; // Or resource.supplementary_data.related_ids.order_id depending on exact event structure

            // In PAYMENT.CAPTURE.COMPLETED, resource is the capture object.
            // It usually links back to the Order.
            // However, we passed `userId` and `planName` in the CUSTOM_ID or pass it via metadata?
            // PayPal Webhooks are tricky because they don't always pass back the arbitrary metadata we sent during createOrder
            // unless we put it in `custom_id`.

            // STRATEGY: 
            // We relying on the client/capture API to have done the work mostly. 
            // This webhook is a backup.
            // BUT, if the client failed, we might not know WHO the user is just from the webhook 
            // unless we stored the `orderID -> userId` mapping in a temporary collection 
            // OR we put `userId` in the `custom_id` field of the purchase_unit when creating the order.

            // Checking `paypal-button.tsx`... we verify `createOrder` doesn't currently add `custom_id`.
            // To make this robust, we SHOULD expect `custom_id` to contain `userId|planName`.

            // For now, let's assume valid data or just log success if we can't find the user context directly 
            // without searching the DB for the orderID (which we might have saved if the capture API ran).

            // If we saved `lastOrderId` in the user doc (as we do in `capture-order/route.ts`),
            // we can query `users` where `lastOrderId == orderID`.

            // Check if we already processed this order
            const snapshot = await firestore.collection('users').where('lastOrderId', '==', orderID).get();
            if (!snapshot.empty) {
                console.log(`Order ${orderID} already processed for user ${snapshot.docs[0].id}`);
                return NextResponse.json({ status: 'already_processed' });
            }

            // Fallback: Use custom_id to find user and fulfill
            const customId = resource.custom_id;
            if (customId) {
                try {
                    const { userId, planName } = JSON.parse(customId);

                    if (userId && planName) {
                        console.log(`Fulfilling order ${orderID} for user ${userId} via Webhook`);

                        let creditsToAdd = 0;
                        switch (planName) {
                            case 'Pro': creditsToAdd = 400; break;
                            case 'Pro Max': creditsToAdd = 1000; break;
                            case 'Business': creditsToAdd = 4000; break;
                            default: creditsToAdd = 0;
                        }

                        if (creditsToAdd > 0) {
                            await firestore.collection('users').doc(userId).set({
                                credits: FieldValue.increment(creditsToAdd),
                                plan: planName,
                                lastPaymentDate: FieldValue.serverTimestamp(),
                                isPaidUser: true,
                                lastOrderId: orderID
                            }, { merge: true });

                            return NextResponse.json({ status: 'fulfilled_via_webhook' });
                        }
                    }
                } catch (e) {
                    console.error("Failed to parse custom_id", e);
                }
            }

            console.warn(`Received webhook for order ${orderID}, user unknown.`);
        }

        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
    }
}
