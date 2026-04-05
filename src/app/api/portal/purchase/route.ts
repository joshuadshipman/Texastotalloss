/**
 * POST /api/portal/purchase — Stripe Checkout Session for Lead Purchase
 * 
 * Flow:
 * 1. Firm clicks "Purchase" on a portal listing
 * 2. This route creates a Stripe Checkout Session with lead metadata
 * 3. On success, Stripe webhook releases PII to the firm
 * 4. Portal listing status updated to "sold"
 */

import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

// Pricing map by LVI tier
const TIER_PRICING: Record<string, { amount: number; label: string }> = {
  platinum: { amount: 50000, label: "Platinum Case — Commercial/Catastrophic" },
  gold:     { amount: 30000, label: "Gold Case — Strong Fundamentals" },
  silver:   { amount: 15000, label: "Silver Case — Developing" },
  partial:  { amount: 5000,  label: "Partial Case — Incomplete Intake" },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { leadId, tier, firmId, firmEmail, caseType, city } = body;

    if (!leadId || !tier || !firmId) {
      return NextResponse.json({ error: "Missing required fields: leadId, tier, firmId" }, { status: 400 });
    }

    const pricing = TIER_PRICING[tier.toLowerCase()];
    if (!pricing) {
      return NextResponse.json({ error: `Invalid tier: ${tier}` }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: firmEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `TTL Case Briefing — ${pricing.label}`,
              description: `Lead #${leadId.substring(0, 8)} | ${caseType || "PI"} | ${city || "Texas"}`,
              metadata: { leadId, tier, firmId },
            },
            unit_amount: pricing.amount,
          },
          quantity: 1,
        },
      ],
      metadata: {
        leadId,
        tier,
        firmId,
        source: "ttl_portal",
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.texastotalloss.com"}/portal?purchased=${leadId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.texastotalloss.com"}/portal?cancelled=${leadId}`,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    console.error("[Stripe Purchase]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
