const { onCall } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const modelRouter = require("./modelRouter");

// Service Imports
const clawbotChat = require("./clawbotChat"); 
const projectResearch = require("./projectResearch");
const liveChat = require("./liveChat");

// Exports
exports.chatWithClawbot = clawbotChat.chatWithClawbot;
exports.runProjectResearch = projectResearch.runProjectResearch;
exports.liveChat = liveChat.liveChat;

exports.bootstrapGravityClaw = onCall({ region: "us-central1" }, async (request) => {
    return { success: true };
});
