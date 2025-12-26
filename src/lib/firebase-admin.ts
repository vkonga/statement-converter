import 'server-only';
import * as admin from 'firebase-admin';

const getAdminApp = () => {
    if (!admin.apps.length) {
        if (!process.env.FIREBASE_PROJECT_ID) {
            console.warn('Missing FIREBASE_PROJECT_ID environment variable. Firebase Admin functionality (server-side) will fail.');
            // Throwing here might crash the build if nextjs tries to eval this file during build time without env vars.
            // But for runtime it should be fine. For safety, let's just return a broken app or throw on usage.
            // Actually, the previous fix threw error, so let's keep consistency but maybe safer.
            // Reverting to previous robust check but returning the app explicitly.
            throw new Error('Missing FIREBASE_PROJECT_ID environment variable');
        }

        return admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
        });
    }
    return admin.app();
};

const firestoreProxy = new Proxy({} as admin.firestore.Firestore, {
    get: (_target, prop) => {
        const app = getAdminApp();
        const firestore = app.firestore();
        const value = firestore[prop as keyof admin.firestore.Firestore];
        if (typeof value === 'function') {
            return value.bind(firestore);
        }
        return value;
    }
});

const authProxy = new Proxy({} as admin.auth.Auth, {
    get: (_target, prop) => {
        const app = getAdminApp();
        const auth = app.auth();
        const value = auth[prop as keyof admin.auth.Auth];
        if (typeof value === 'function') {
            return value.bind(auth);
        }
        return value;
    }
});

export { firestoreProxy as firestore, authProxy as auth };
