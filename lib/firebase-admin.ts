import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            }),
            storageBucket: process.env.GCS_BUCKET_NAME,
        });
    } catch (error) {
        console.error('Firebase admin initialization error', error);
    }
}

export const firestore = admin.apps.length ? admin.firestore() : undefined;
export const storage = admin.apps.length ? admin.storage() : undefined;
export const auth = admin.apps.length ? admin.auth() : undefined;
