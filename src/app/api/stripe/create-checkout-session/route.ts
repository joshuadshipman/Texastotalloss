import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getFirestore } from 'firebase-admin/firestore';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

// Stripe Backend Initialization
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2025-02-24.acacia',
});

// Firebase Admin Initialization (safely)
if (!getApps().length && process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    initializeApp({ credential: cert(serviceAccount) });
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
  }
}

const TIER_PRICES = {
  platinum: 50000, // $500.00
  gold: 30000,     // $300.00
  silver: 15000,   // $150.00
  bronze: 5000,    // $50.00
};

export async function POST(req: Request) {
  try {
    const { caseId, tier, attorneyId, attorneyEmail } = await req.json();

    if (!caseId || !tier || !attorneyId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const priceAmount = TIER_PRICES[tier as keyof typeof TIER_PRICES] || 15000;

    // Create a Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: attorneyEmail,
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Texas Total Loss Excusive Intake Lead (${tier.toUpperCase()})`,
              description: `Case ID: ${caseId}. Includes full PII, Vehicle Photos, and Severity Analysis.`,
            },
            unit_amount: priceAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // The webhook will handle releasing the PII. The success URL just returns them to the dashboard.
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/portal?success=true&caseId=${caseId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/portal?failed=true`,
      metadata: {
        caseId,
        attorneyId,
        tier
      }
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (err: any) {
    console.error("Stripe Session Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
