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

export function PayPalButton({ planName, amount }: PayPalButtonProps) {
  const { toast } = useToast();

  const createOrder = (data: CreateOrderData, actions: any) => {
    console.log('Creating order for:', planName, 'Amount:', amount);
    // Here you would typically make a call to your backend to create the order
    // The backend would interact with PayPal's API to set up the transaction
    // For this example, we'll create the order directly on the client.
    return actions.order.create({
      purchase_units: [
        {
          description: `Subscription to ${planName}`,
          amount: {
            // Currency and value should be passed from your backend
            currency_code: 'USD',
            value: amount,
          },
        },
      ],
    });
  };

  const onApprove = (data: OnApproveData, actions: any) => {
    console.log('Payment approved:', data);
    // Here you would typically capture the order on your backend
    // and then update the user's subscription status in your database.
    return actions.order.capture().then((details: any) => {
      toast({
        title: 'Payment Successful!',
        description: `Thank you for subscribing to the ${planName} plan.`,
      });
      console.log('Capture details:', details);
      // Redirect or update UI to reflect subscription status
    });
  };

  const onError = (err: any) => {
    console.error('PayPal Checkout Error:', err);
    toast({
      title: 'Payment Error',
      description:
        'An error occurred during the payment process. Please try again.',
      variant: 'destructive',
    });
  };

  if (!PAYPAL_CLIENT_ID || PAYPAL_CLIENT_ID === 'YOUR_CLIENT_ID_HERE') {
    return (
        <div className="w-full text-center p-4 bg-yellow-100 border border-yellow-300 rounded-md">
            <p className="text-sm text-yellow-800">
                PayPal is not configured. Please set your Client ID in the environment variables.
            </p>
        </div>
    )
  }


  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, currency: 'USD', intent: 'subscription' }}>
      <div className="w-full">
        <PayPalButtons
          style={{ layout: 'vertical', label: 'subscribe' }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
        />
      </div>
    </PayPalScriptProvider>
  );
}
