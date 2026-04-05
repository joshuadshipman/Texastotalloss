const { onCall } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const modelRouter = require("./modelRouter");

// ── Core Service Imports ─────────────────────────────────────────────────────
const clawbotChat           = require("./clawbotChat");
const projectResearch       = require("./projectResearch");
const whatsappBot           = require("./whatsappBot");
const liveChat              = require("./liveChat");
const taskRunner            = require("./taskRunner");
const financeVault          = require("./financeVault");

// ── Phase 2: P&C Lead Transfer (Original) ────────────────────────────────────
const insuranceVoiceWebhook = require("./insuranceVoiceWebhook");

// ── Phase 3: PI Lead Platform (Series B Core) ────────────────────────────────
const piVoiceWebhook        = require("./piVoiceWebhook");         // Firestore-triggered PI voice transfer
const firmDiscovery         = require("./firmDiscovery");            // Replaces apifyIntegration for law firm discovery
const youtubeLogicIngestion = require("./youtubeLogicIngestion");   // YouTube → LVI knowledge base
const inboundEmailWebhook   = require("./inboundEmailWebhook");     // Corporate AI Butler Inbound Routing

// ── PLIR Generator (callable wrapper) ────────────────────────────────────────
const { generatePLIR } = require("./logic/plirGenerator");

// ── Core Exports ──────────────────────────────────────────────────────────────
exports.chatWithClawbot        = clawbotChat.chatWithClawbot;
exports.runProjectResearch     = projectResearch.runProjectResearch;
exports.liveChat               = liveChat.liveChat;
exports.whatsappBot            = whatsappBot.whatsappBot;
exports.scheduledTaskRunner    = taskRunner.scheduledTaskRunner;
exports.analyzeFinanceDocument = financeVault.analyzeFinanceDocument;

// ── Lead Generation Exports ───────────────────────────────────────────────────
exports.insuranceVoiceWebhook  = insuranceVoiceWebhook.insuranceVoiceWebhook; // P&C: existing
exports.piVoiceTransfer        = piVoiceWebhook.piVoiceTransfer;              // PI: Firestore trigger
exports.ingestYoutubeLogic     = youtubeLogicIngestion.ingestYoutubeLogic;    // YouTube → LVI
exports.triggerFirmDiscovery   = firmDiscovery.triggerFirmDiscovery;          // Law firm scraper
exports.inboundEmailParser     = inboundEmailWebhook.inboundEmailParser;      // Catch inbound emails via webhook

// ── Admin / Callable Functions ────────────────────────────────────────────────
exports.bootstrapGravityClaw = onCall({ region: "us-central1" }, async (request) => {
    return { success: true, platform: "TTL Series B", version: "2.0.0" };
});

exports.manualRunSkill = onCall({ region: "us-central1" }, async (request) => {
    return await taskRunner.manualRunSkill(request);
});

// ── Generate PLIR (callable for admin use) ────────────────────────────────────
exports.generateCasePLIR = onCall({ region: "us-central1" }, async (request) => {
    if (!request.auth) {
        const { HttpsError } = require("firebase-functions/v2/https");
        throw new HttpsError("unauthenticated", "Must be authenticated.");
    }
    const { leadId } = request.data;
    if (!leadId) {
        const { HttpsError } = require("firebase-functions/v2/https");
        throw new HttpsError("invalid-argument", "leadId is required.");
    }
    return await generatePLIR(leadId);
});
