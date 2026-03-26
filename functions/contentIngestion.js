const { onRequest } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const admin = require('firebase-admin');

if (!admin.apps.length) {
    admin.initializeApp();
}

/**
 * Webhook for ingesting content like "CC (Your Day Ahead)" emails
 * Forwards matching content directly into the `content_sources` collection
 * for the Agent Task Engine to consume.
 */
exports.ingestEmailWebhook = onRequest(async (req, res) => {
    logger.info("Content Ingestion Webhook Received");
    const db = admin.firestore();

    try {
        // Basic parsing - assuming a generic JSON payload from Zapier/Make or a direct email parser
        const payload = req.body;
        
        if (!payload || Object.keys(payload).length === 0) {
            res.status(400).send("Empty payload");
            return;
        }

        const subject = payload.subject || "Unknown Subject";
        const sender = payload.from || "unknown";
        const bodyContent = payload.text || payload.html || payload.body || "";
        
        let sourceType = "generic_email";
        if (subject.toLowerCase().includes("your day ahead") || sender.toLowerCase().includes("cc")) {
            sourceType = "cc_briefing";
        } else if (sender.toLowerCase().includes("notebooklm")) {
            sourceType = "notebook_lm_export";
        }

        const docRef = await db.collection('content_sources').add({
            source_type: sourceType,
            subject: subject,
            sender: sender,
            raw_content: bodyContent,
            ingested_at: new Date(),
            status: "unread", // To be picked up by the Task Runner
        });

        logger.info(`Successfully ingested [${sourceType}] document ID: ${docRef.id}`);
        res.status(200).send({ success: true, id: docRef.id });

    } catch (e) {
        logger.error("Failed to ingest content:", e);
        res.status(500).send("Ingestion Error");
    }
});
