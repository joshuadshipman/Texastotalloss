import * as admin from 'firebase-admin';

if (!admin.apps.length) {
    try {
        let authConfig;
        
        if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
            authConfig = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
            console.log('Using GOOGLE_SERVICE_ACCOUNT_JSON for authentication');
        } else {
            authConfig = {
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            };
            console.log('Using individual FIREBASE_* variables for authentication');
        }

        admin.initializeApp({
            credential: admin.credential.cert(authConfig),
            storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
        });
        console.log('Firebase Admin Initialized Successfully');
    } catch (error) {
        console.error('Firebase Admin Initialization Error:', error);
    }
}

export const adminDb = admin.firestore();
export const adminStorage = admin.storage();
export const adminAuth = admin.auth();
