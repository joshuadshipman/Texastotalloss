/**
 * piVoiceWebhook.js — PI Lead Voice Transfer Webhook
 * Series B: Texas Total Loss | PI Lead Generation Platform
 *
 * PURPOSE: Mirror of insuranceVoiceWebhook.js, but tuned for PI leads.
 * Triggers on new pi_leads where lvi_score >= 90 (Gold/Platinum tier).
 * Initiates a warm transfer call via Twilio to connect the lead with
 * the on-call partner attorney or TTL intake coordinator.
 *
 * TRIGGER: Firestore onCreate — pi_leads/{leadId}
 * CONDITION: lvi_score >= 90 AND voice_eligible == true AND tcpaConsent == true
 */

const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { logger } = require("firebase-functions");
const admin = require("firebase-admin");
const twilio = require("twilio");

if (!admin.apps.length) admin.initializeApp();

// ── Tier Configuration ────────────────────────────────────────────────────────
const VOICE_TRANSFER_CONFIG = {
  platinum: {
    minScore: 120,
    priority: "HIGH",
    transferNumber: process.env.PLATINUM_TRANSFER_NUMBER || process.env.TTL_INTAKE_NUMBER,
    message: "connecting you with our senior intake specialist for immediate assistance",
  },
  gold: {
    minScore: 90,
    priority: "STANDARD",
    transferNumber: process.env.GOLD_TRANSFER_NUMBER || process.env.TTL_INTAKE_NUMBER,
    message: "connecting you with a qualified intake specialist",
  },
};

// ── Helper: Determine Transfer Config by Score ───────────────────────────────
function getTransferConfig(score) {
  if (score >= VOICE_TRANSFER_CONFIG.platinum.minScore) return { tier: "platinum", ...VOICE_TRANSFER_CONFIG.platinum };
  if (score >= VOICE_TRANSFER_CONFIG.gold.minScore)     return { tier: "gold",     ...VOICE_TRANSFER_CONFIG.gold };
  return null;
}

// ── Helper: Build TwiML for the Outbound Call ────────────────────────────────
function buildTwiML(lead, config) {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const response = new VoiceResponse();

  // Greet the customer
  response.say(
    { voice: "Polly.Joanna", language: "en-US" },
    `Hello, ${lead.firstName || "there"}! This is Texas Total Loss calling. 
     We received your case evaluation and your claim appears to have strong merit. 
     We are ${config.message} right now. Please hold for just a moment.`
  );

  // Brief pause
  response.pause({ length: 1 });

  // Dial to transfer number
  const dial = response.dial({
    action: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.texastotalloss.com"}/api/voice/status`,
    timeout: 30,
    record: "record-from-answer",
    recordingStatusCallback: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.texastotalloss.com"}/api/voice/recording`,
  });

  dial.number(config.transferNumber);

  return response.toString();
}

// ── Helper: Log Call Attempt to Firestore ────────────────────────────────────
async function logCallAttempt(leadId, callData) {
  await admin.firestore().collection("pi_leads").doc(leadId).update({
    voice_call_attempted: true,
    voice_call_sid: callData.sid || null,
    voice_call_status: callData.status || "initiated",
    voice_call_at: admin.firestore.FieldValue.serverTimestamp(),
  });

  await admin.firestore().collection("call_logs").add({
    leadId,
    type: "pi_voice_transfer",
    callSid: callData.sid,
    status: callData.status,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
  });
}

// ── Main Cloud Function ───────────────────────────────────────────────────────
exports.piVoiceTransfer = onDocumentCreated(
  { document: "pi_leads/{leadId}", timeoutSeconds: 60 },
  async (event) => {
    const leadId = event.params.leadId;
    const lead = event.data?.data();

    if (!lead) {
      logger.warn(`[PI Voice] No data for lead ${leadId}`);
      return;
    }

    // ── Gate 1: Voice eligibility checks ─────────────────────────────────────
    if (!lead.tcpaConsent) {
      logger.info(`[PI Voice] Lead ${leadId} skipped — no TCPA consent.`);
      return;
    }

    if (!lead.voice_eligible || lead.lvi_score < 90) {
      logger.info(`[PI Voice] Lead ${leadId} skipped — LVI score ${lead.lvi_score} below Gold threshold.`);
      return;
    }

    if (!lead.phone) {
      logger.warn(`[PI Voice] Lead ${leadId} skipped — no phone number.`);
      return;
    }

    // ── Gate 2: Business Hours Check (7am–9pm CT) ────────────────────────────
    const now = new Date();
    const ctHour = parseInt(now.toLocaleString("en-US", { timeZone: "America/Chicago", hour: "numeric", hour12: false }));
    if (ctHour < 7 || ctHour >= 21) {
      logger.info(`[PI Voice] Lead ${leadId} logged for callback — outside business hours (${ctHour}:00 CT).`);
      await admin.firestore().collection("pi_leads").doc(leadId).update({
        voice_callback_scheduled: true,
        voice_callback_reason: "outside_business_hours",
      });
      return;
    }

    // ── Gate 3: Twilio credentials ────────────────────────────────────────────
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken  = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_FROM_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      logger.error("[PI Voice] Twilio credentials not configured. Set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER.");
      return;
    }

    // ── Get Transfer Config ───────────────────────────────────────────────────
    const config = getTransferConfig(lead.lvi_score);
    if (!config) {
      logger.info(`[PI Voice] No transfer config for score ${lead.lvi_score}.`);
      return;
    }

    if (!config.transferNumber) {
      logger.error(`[PI Voice] No transfer number configured for ${config.tier} tier.`);
      return;
    }

    // ── Initiate Call ─────────────────────────────────────────────────────────
    try {
      logger.info(`[PI Voice] Initiating ${config.tier.toUpperCase()} transfer for lead ${leadId}. Score: ${lead.lvi_score}`);

      const client = twilio(accountSid, authToken);
      const twiml = buildTwiML(lead, config);

      const call = await client.calls.create({
        to: lead.phone,
        from: fromNumber,
        twiml,
        statusCallback: `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.texastotalloss.com"}/api/voice/status`,
        statusCallbackMethod: "POST",
      });

      await logCallAttempt(leadId, call);

      logger.info(`[PI Voice] ✅ Call initiated. SID: ${call.sid} | Tier: ${config.tier} | Lead: ${leadId}`);

    } catch (err) {
      logger.error(`[PI Voice] ❌ Call failed for lead ${leadId}:`, err.message);
      await admin.firestore().collection("pi_leads").doc(leadId).update({
        voice_call_error: err.message,
        voice_call_failed: true,
      });
    }
  }
);

/**
 * retryVoiceCallbacks
 * Scheduled function to retry leads that were blocked by business hours.
 * Should be triggered at 8am CT daily by taskRunner.js
 */
exports.retryVoiceCallbacks = async () => {
  const db = admin.firestore();
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    logger.error("[PI Voice Retry] Twilio not configured.");
    return;
  }

  const q = db.collection("pi_leads")
    .where("voice_callback_scheduled", "==", true)
    .where("voice_call_attempted", "==", false)
    .limit(20);

  const snap = await q.get();
  if (snap.empty) {
    logger.info("[PI Voice Retry] No pending callbacks.");
    return;
  }

  const client = twilio(accountSid, authToken);
  let processed = 0;

  for (const doc of snap.docs) {
    const lead = doc.data();
    const config = getTransferConfig(lead.lvi_score);
    if (!config || !lead.phone) continue;

    try {
      const twiml = buildTwiML(lead, config);
      const call = await client.calls.create({ to: lead.phone, from: fromNumber, twiml });
      await logCallAttempt(doc.id, call);
      await doc.ref.update({ voice_callback_scheduled: false });
      processed++;
    } catch (err) {
      logger.error(`[PI Voice Retry] Failed for ${doc.id}:`, err.message);
    }
  }

  logger.info(`[PI Voice Retry] ✅ Processed ${processed} retry callbacks.`);
  return { processed };
};
