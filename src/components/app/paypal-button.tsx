'use client';

import {
  PayPalScriptProvider,
  PayPalButtons,
  OnApproveData,
  CreateOrderData,
} from '@paypal/react-paypal-js';
import { useToast } from '@/hooks/use-toast';

interface PayPalButtonProps {
  planName: string;
  amount: string;
  billingCycle: 'monthly' | 'yearly';
}

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test';

export function PayPalButton({ planName, amount, billingCycle }: PayPalButtonProps) {
  const { toast } = useToast();

  const createSubscription = (data: CreateOrderData, actions: any) => {
    // This is where you would integrate with your backend to create a subscription plan ID.
    // For this client-side example, we'll use a placeholder.
    // In production, you would fetch a plan_id from your server.
    // e.g., return fetch('/api/paypal/create-subscription', { method: 'POST', ... })
    console.log(`Creating subscription for ${planName} (${billingCycle})`);
    
    // NOTE: This is a placeholder for a plan_id you would create in your PayPal Business account.
    // You need to replace 'P-YOUR_PLAN_ID' with a real Plan ID from your PayPal dashboard.
    const planId = 'P-YOUR_PLAN_ID'; 

    if (planId === 'P-YOUR_PLAN_ID') {
        console.error("PayPal Error: You must replace 'P-YOUR_PLAN_ID' with an actual Plan ID from your PayPal Business account.");
        toast({
            title: 'PayPal Configuration Error',
            description: 'The PayPal plan is not configured correctly. Please contact support.',
            variant: 'destructive',
        });
        // We prevent the subscription window from opening.
        return new Promise((resolve, reject) => reject(new Error("PayPal Plan ID not configured.")));
    }
    
    return actions.subscription.create({
      plan_id: planId,
    });
  };

  const onApprove = (data: OnApproveData, actions: any) => {
    console.log('Subscription approved:', data);
    // You would typically send the subscriptionID to your backend to verify
    // and activate the user's subscription in your database.
    // e.g., return fetch('/api/paypal/approve-subscription', { method: 'POST', body: JSON.stringify({ subscriptionID: data.subscriptionID })})
    
    toast({
      title: 'Subscription Successful!',
      description: `You are now subscribed to the ${planName} plan.`,
    });
    
    // The capture is not needed for subscriptions; the approval is the key step.
    return Promise.resolve();
  };

  const onError = (err: any) => {
    console.error('PayPal Checkout Error:', err);
    toast({
      title: 'Payment Error',
      description:
        'An error occurred during the payment process. Please try again or contact support.',
      variant: 'destructive',
    });
  };
  
  if (PAYPAL_CLIENT_ID === 'test' || PAYPAL_CLIENT_ID === 'YOUR_CLIENT_ID_HERE') {
    return (
        <div className="w-full text-center p-4 bg-yellow-100 border border-yellow-300 rounded-md">
            <p className="text-sm text-yellow-800">
                PayPal is not configured. Please add your PayPal Client ID to your environment file to enable subscriptions.
            </p>
        </div>
    )
  }


  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, intent: 'subscription', vault: true }}>
      <div className="w-full">
        <PayPalButtons
          style={{ layout: 'vertical', label: 'subscribe' }}
          createSubscription={createSubscription}
          onApprove={onApprove}
          onError={onError}
        />
      </div>
    </PayPalScriptProvider>
  );
}
