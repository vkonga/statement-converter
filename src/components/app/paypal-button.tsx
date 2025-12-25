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

  const createOrder = (data: CreateOrderData, actions: any) => {
    console.log(`Creating order for ${planName} (${billingCycle}) for amount ${amount}`);
    return actions.order.create({
      purchase_units: [
        {
          description: `Subscription to ${planName} - ${billingCycle}`,
          amount: {
            value: amount,
            currency_code: 'USD',
          },
        },
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING',
      }
    });
  };

  const onApprove = (data: OnApproveData, actions: any) => {
    console.log('Order approved:', data);
    return actions.order.capture().then((details: any) => {
      toast({
        title: 'Payment Successful!',
        description: `Your payment for the ${planName} plan has been processed.`,
      });
      console.log('Capture result', details);
      // In a real application, you would send the orderID (data.orderID) 
      // or capture details to your backend for verification and to provision the user's plan.
    });
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
  
  if (PAYPAL_CLIENT_ID === 'test' || !PAYPAL_CLIENT_ID) {
    return (
        <div className="w-full text-center p-4 bg-yellow-100 border border-yellow-300 rounded-md">
            <p className="text-sm text-yellow-800">
                PayPal is not configured. Please add your PayPal Client ID to your environment file to enable payments.
            </p>
        </div>
    )
  }

  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID, intent: 'capture' }}>
      <div className="w-full">
        <PayPalButtons
          style={{ layout: 'vertical', label: 'pay' }}
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
        />
      </div>
    </PayPalScriptProvider>
  );
}
