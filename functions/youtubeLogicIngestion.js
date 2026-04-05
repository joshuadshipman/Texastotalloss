'use strict';

const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const { runYoutubeIngestion } = require("./logic/youtubeIngestor");

/**
 * YouTube Logic Ingestion Agent (Cloud Function Wrapper)
 */
exports.ingestYoutubeLogic = onCall(async (request) => {
    const { youtubeUrl, query } = request.data;

    if (!youtubeUrl && !query) {
        throw new HttpsError('invalid-argument', 'Must provide either a youtubeUrl or a research query.');
    }

    try {
        return await runYoutubeIngestion({ youtubeUrl, query });
    } catch (error) {
        logger.error("Failed to ingest YouTube logic", error);
        throw new HttpsError('internal', 'YouTube Logic Ingestion failed: ' + error.message);
    }
});
