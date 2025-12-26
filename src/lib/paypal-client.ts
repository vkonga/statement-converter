import checkoutNodeJssdk from '@paypal/checkout-server-sdk';

const getClient = () => {
    const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        throw new Error('Missing PayPal Credentials: NEXT_PUBLIC_PAYPAL_CLIENT_ID or PAYPAL_CLIENT_SECRET');
    }

    const environment = process.env.NODE_ENV === 'production'
        ? new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret)
        : new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);

    return new checkoutNodeJssdk.core.PayPalHttpClient(environment);
}

const client = {
    execute: async (request: any) => {
        return getClient().execute(request);
    }
};

export default client;
