import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-02-24.acacia',
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!getApps().length && process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    initializeApp({ credential: cert(serviceAccount) });
  } catch (error) {
    console.error("Firebase Admin init error:", error);
  }
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;

  try {
    if (webhookSecret && signature) {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
        // Fallback for local testing without webhooks mapping
        event = JSON.parse(body);
    }
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const { caseId, attorneyId } = session.metadata || {};

    if (caseId && attorneyId) {
      try {
        const db = getFirestore();
        const caseRef = db.collection('portal_listings').doc(caseId);
        
        // 1. Mark the listing as SOLD so no one else can buy it
        // 2. Identify the purchaser
        await caseRef.update({
          status: 'sold',
          purchasedBy: attorneyId,
          purchasedAt: new Date().toISOString()
        });
        
        console.log(`[STRIPE WEBHOOK] Case ${caseId} sold to Attorney ${attorneyId}`);
      } catch (err) {
        console.error("Firebase Update Error:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
