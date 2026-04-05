import { NextRequest, NextResponse } from "next/server";
import { initializeApp, cert, getApps, getApp, App } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";

// ── Admin SDK Init ────────────────────────────────────────────────────────────
function getAdminApp(): App {
  if (getApps().length) return getApp();
  return initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:  process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

// ── LVI Scoring (Server-side, Cannot Be Gamed by Client) ─────────────────────
interface IntakePayload {
  accidentType: string;
  atFaultParty: string;
  policeReportFiled: boolean;
  hadErVisit: boolean;
  injuryDescription: string;
  estimatedDamages: number;
  insuranceCarrier: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  tcpaConsent: boolean;
  hasPhotos?: string;
  hasUIM?: string;
}

function scoreLead(payload: IntakePayload): { score: number; tier: string } {
  let score = 0;

  // ── Pillar 1: Accident Type / Liability (40 pts max) ─────────────────────
  const accidentMultipliers: Record<string, number> = {
    commercial:  40,  // CDL driver — highest liability exposure
    rideshare:   32,  // Corporate (Uber/Lyft) liability
    pedestrian:  30,  // Defendant had duty of care
    mvc:         20,  // Standard MVC
    slip_fall:   18,
    total_loss:   5,  // Property damage only
  };
  score += accidentMultipliers[payload.accidentType] ?? 15;

  // Liability clarity
  if (payload.atFaultParty === "other_driver" || payload.atFaultParty === "commercial_driver") score += 15;
  else if (payload.atFaultParty === "rideshare_driver") score += 12;
  else if (payload.atFaultParty === "shared") score += 5;

  // Police report
  if (payload.policeReportFiled) score += 10;

  // Photos
  if (payload.hasPhotos === "Yes") score += 5;
  else if (payload.hasPhotos === "Some") score += 2;

  // ── Pillar 2: Medical Treatment (40 pts max) ──────────────────────────────
  if (payload.hadErVisit) score += 30;  // Critical — shows immediate harm

  // Injury description mentions key medical terms
  const injuryText = payload.injuryDescription.toLowerCase();
  if (injuryText.includes("surgery") || injuryText.includes("fracture") || injuryText.includes("broken")) score += 20;
  else if (injuryText.includes("mri") || injuryText.includes("hospitalized")) score += 15;
  else if (injuryText.includes("chiropractor") || injuryText.includes("physical therapy")) score += 10;
  else if (injuryText.includes("pain") || injuryText.includes("whiplash")) score += 5;

  // ── Pillar 3: Damages (20 pts max) ───────────────────────────────────────
  if (payload.estimatedDamages >= 20000) score += 20;
  else if (payload.estimatedDamages >= 10000) score += 15;
  else if (payload.estimatedDamages >= 5000) score += 10;
  else if (payload.estimatedDamages > 0) score += 5;

  // ── Pillar 4: Insurance Coverage (bonus) ─────────────────────────────────
  if (payload.hasUIM === "Yes") score += 5; // UIM coverage = more recovery options

  // Cap at 150
  score = Math.min(score, 150);

  // Tier assignment
  let tier = "bronze";
  if (score >= 120) tier = "platinum";
  else if (score >= 90) tier = "gold";
  else if (score >= 60) tier = "silver";

  return { score, tier };
}

// ── POST Handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body: IntakePayload = await req.json();

    // Validate required fields
    const required = ["firstName", "phone", "email", "accidentType", "tcpaConsent"];
    for (const field of required) {
      if (!body[field as keyof IntakePayload]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    if (!body.tcpaConsent) {
      return NextResponse.json({ error: "TCPA consent is required." }, { status: 400 });
    }

    // Score the lead server-side
    const { score, tier } = scoreLead(body);

    // Write to Firestore via Admin SDK
    const adminApp = getAdminApp();
    const db = getFirestore(adminApp);

    const leadRef = await db.collection("pi_leads").add({
      ...body,
      lvi_score: score,
      lvi_tier: tier,
      status: "pending_review",
      voice_eligible: score >= 90, // Gold+ gets voice transfer eligibility
      submitted_at: FieldValue.serverTimestamp(),
      source: "ttl_intake_form_v2",
    });

    // For Platinum/Gold — also create an anonymized portal listing
    if (score >= 90) {
      await db.collection("portal_listings").doc(leadRef.id).set({
        caseId: leadRef.id,
        accidentType: body.accidentType,
        injurySummary: body.injuryDescription.substring(0, 100) + "...",
        hadErVisit: body.hadErVisit,
        policeReportFiled: body.policeReportFiled,
        estimatedDamages: body.estimatedDamages,
        lvi_score: score,
        lvi_tier: tier,
        status: "available",
        city: "Texas", // Geo tagging placeholder
        created_at: FieldValue.serverTimestamp(),
        // NO PII — firstName, phone, email excluded until purchased
      });
    }

    return NextResponse.json({
      success: true,
      leadId: leadRef.id,
      tier,
      score,
    });
  } catch (err: unknown) {
    console.error("[INTAKE API] Error:", err);
    return NextResponse.json(
      { error: "Submission failed. Please try again." },
      { status: 500 }
    );
  }
}
