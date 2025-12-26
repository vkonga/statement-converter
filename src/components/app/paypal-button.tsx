'use client';

import {
  PayPalScriptProvider,
  PayPalButtons,
} from '@paypal/react-paypal-js';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useUser, useFirestore } from '@/firebase';
import { doc, updateDoc, increment, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

interface PayPalButtonProps {
  planName: string;
  amount: string;
  billingCycle: 'monthly' | 'yearly';
}

const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'test';

export function PayPalButton({ planName, amount, billingCycle }: PayPalButtonProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();
  const firestore = useFirestore();

  const getCreditsForPlan = (name: string) => {
    switch (name) {
      case 'Pro': return 400;
      case 'Pro Max': return 1000;
      case 'Business': return 4000;
      default: return 0;
    }
  };

  const createOrder = (data: any, actions: any) => {
    console.log(`Creating order for ${planName} (${billingCycle}) for amount ${amount}`);
    return actions.order.create({
      purchase_units: [
        {
          description: `Subscription to ${planName} - ${billingCycle}`,
          amount: {
            value: amount,
            currency_code: 'USD',
          },
          custom_id: JSON.stringify({ userId: user?.uid, planName, billingCycle }),
        },
      ],
      application_context: {
        shipping_preference: 'NO_SHIPPING',
      }
    });
  };

  const onApprove = async (data: any, actions: any) => {
    console.log('Order approved:', data);
    try {
      // NOTE: We do NOT capture on the client if we want full server control.
      // But react-paypal-js + smart buttons usually capture on the client or give us the details.
      // IF we used `intent='capture'` in provider (which we do), we CAN calls actions.order.capture().
      // For this secure flow, we capture first (to get the money) then verify on backend.
      // OR we can pass just the orderID to the backend and let the backend capture.
      //
      // Let's stick to the pattern: Client captures -> Backend verifies & fulfills.

      const details = await actions.order.capture();
      console.log('Capture result', details);

      if (user) {
        // Call our secure API to verify and update credits
        const response = await fetch('/api/capture-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderID: data.orderID,
            userId: user.uid,
            planName: planName,
            billingCycle: billingCycle,
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || 'Failed to verify order');
        }

        toast({
          title: 'Payment Successful!',
          description: `You have received ${result.creditsAdded} credits for the ${planName} plan.`,
        });

        // Delay redirection so user can see the success toast
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        toast({
          title: 'Payment Successful!',
          description: `Payment received, but we couldn't find your user account to update credits. Please contact support with Order ID: ${data.orderID}`,
          variant: 'destructive',
        });
      }

    } catch (error: any) {
      console.error("Error capturing order or updating user:", error);
      toast({
        title: 'Error Processing Payment',
        description: error.message || 'There was an error updating your account. Please contact support.',
        variant: 'destructive',
      });
    }
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
