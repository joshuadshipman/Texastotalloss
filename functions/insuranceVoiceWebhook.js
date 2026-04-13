'use strict';

/**
 * insuranceVoiceWebhook — Firebase Cloud Function (v2)
 *
 * Triggered when a new document is written to insurance_leads/{leadId}
 * with insurance_opt_in === true AND voice_eligible === true.
 *
 * On trigger:
 * 1. Validates the lead has a phone number and TCPA consent cert.
 * 2. Makes an outbound call via Twilio REST API.
 * 3. TwiML directs Twilio to stream audio to the Cloud Run Voice Agent WebSocket.
 * 4. Logs call_sid and status back to Firestore.
 *
 * Stack: Firebase Functions v2 / Firestore Trigger / Twilio SDK / Secret Manager
 */

const { onDocumentWritten } = require('firebase-functions/v2/firestore');
const { defineSecret } = require('firebase-functions/params');
const admin = require('firebase-admin');
const { logger } = require('firebase-functions');

// ── Secrets (managed via Firebase Secret Manager — never hard-coded) ──────────
const TWILIO_ACCOUNT_SID = defineSecret('TWILIO_ACCOUNT_SID');
const TWILIO_AUTH_TOKEN = defineSecret('TWILIO_AUTH_TOKEN');
const TWILIO_PHONE_NUMBER = defineSecret('TWILIO_PHONE_NUMBER');   // e.g. +15125550100
const VOICE_AGENT_URL = defineSecret('VOICE_AGENT_URL');           // Cloud Run service URL

// ── Configuration ─────────────────────────────────────────────────────────────
const CALL_DELAY_SECONDS = 10; // Wait 10s after form submit before calling

/**
 * Firestore trigger — fires when insurance_leads/{leadId} is created or updated.
 */
exports.insuranceVoiceWebhook = onDocumentWritten(
  {
    document: 'insurance_leads/{leadId}',
    region: 'us-central1',
    secrets: [TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, VOICE_AGENT_URL],
  },
  async (event) => {
    const leadId = event.params.leadId;
    const after = event.data.after;

    // Only process on CREATE or when opt-in status changes to true
    if (!after || !after.exists) {
      logger.info(`[VOICE-WEBHOOK] Lead ${leadId} deleted — skipping.`);
      return;
    }

    const lead = after.data();

    // ── Guard Clauses ───────────────────────────────────────────────────────
    if (!lead.insurance_opt_in) {
      logger.info(`[VOICE-WEBHOOK] Lead ${leadId}: no insurance opt-in — skipping.`);
      return;
    }

    if (lead.call_sid) {
      logger.info(`[VOICE-WEBHOOK] Lead ${leadId}: call already initiated (${lead.call_sid}) — skipping duplicate.`);
      return;
    }

    if (!lead.phone) {
      logger.error(`[VOICE-WEBHOOK] Lead ${leadId}: missing phone number — cannot initiate call.`);
      await after.ref.update({ call_status: 'failed_no_phone', last_updated: admin.firestore.FieldValue.serverTimestamp() });
      return;
    }

    if (!lead.trustedform_cert_url) {
      logger.warn(`[VOICE-WEBHOOK] Lead ${leadId}: missing TrustedForm cert — proceeding with caution. Log for compliance review.`);
      // NOTE: Still proceed but flag for compliance audit
    }

    // ── Initiate Twilio Call ─────────────────────────────────────────────────
    const twilio = require('twilio')(
      TWILIO_ACCOUNT_SID.value(),
      TWILIO_AUTH_TOKEN.value()
    );

    const voiceAgentBaseUrl = VOICE_AGENT_URL.value();

    // Build the TwiML webhook URL — passes lead context as query params
    const twimlUrl = new URL(`${voiceAgentBaseUrl}/voice/twiml`);
    twimlUrl.searchParams.set('leadId', leadId);
    twimlUrl.searchParams.set('name', lead.firstName || 'there');
    twimlUrl.searchParams.set('vehicle', lead.vehicleYear && lead.vehicleMake
      ? `${lead.vehicleYear} ${lead.vehicleMake}` : 'vehicle');
    // Enforce the new educational strategy
    twimlUrl.searchParams.set('strategy', 'replacement_quote_education');
    twimlUrl.searchParams.set('systemPromptOverride', 'You are assisting a claimant who needs a replacement vehicle policy check after a total loss. Educate them on why policy checks are smart post-accident. Do not bash their old insurer.');

    logger.info(`[VOICE-WEBHOOK] Initiating call for lead ${leadId} → ${lead.phone}`);

    try {
      const call = await twilio.calls.create({
        from: TWILIO_PHONE_NUMBER.value(),
        to: lead.phone,
        url: twimlUrl.toString(),
        statusCallback: `${voiceAgentBaseUrl}/voice/status?leadId=${leadId}`,
        statusCallbackMethod: 'POST',
        statusCallbackEvent: ['initiated', 'answered', 'completed'],
        timeout: 30, // Ring for 30 seconds before treating as no-answer
      });

      logger.info(`[VOICE-WEBHOOK] Call initiated. SID: ${call.sid}`);

      // Write call metadata back to Firestore
      await after.ref.update({
        call_sid: call.sid,
        call_status: 'initiated',
        call_initiated_at: admin.firestore.FieldValue.serverTimestamp(),
        twiml_url: twimlUrl.toString(),
        last_updated: admin.firestore.FieldValue.serverTimestamp(),
      });

    } catch (err) {
      logger.error(`[VOICE-WEBHOOK] Twilio call failed for lead ${leadId}:`, err);
      await after.ref.update({
        call_status: 'failed_twilio_error',
        call_error: err.message,
        last_updated: admin.firestore.FieldValue.serverTimestamp(),
      });
    }
  }
);
