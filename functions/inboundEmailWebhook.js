const { onRequest } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore");

/**
 * Handle Inbound Emails from SendGrid Inbound Parse or Make.com
 * Maps the email to the AI Butler queue for autonomous processing.
 */
exports.inboundEmailParser = onRequest(async (req, res) => {
  // 1. Verify Method
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  try {
    const db = getFirestore();
    const payload = req.body;

    // SendGrid structure mapping (fallback to standard webhook struct)
    const from = payload.from || payload.sender || "Unknown";
    const to = payload.to || payload.recipient || "Unknown";
    const subject = payload.subject || "No Subject";
    const textBody = payload.text || payload.body || "";

    console.log(`[INBOUND EMAIL] Catching email to: ${to} from: ${from}`);

    // Create tracking ID
    const emailRef = db.collection("inbound_emails").doc();

    await emailRef.set({
      from,
      to,
      subject,
      textBody,
      receivedAt: new Date().toISOString(),
      status: "pending_ai_review", // Trigger point for the Butler model
      processed: false
    });

    // Accept webhook quickly to prevent timeouts
    res.status(200).send("Email received and staged for AI review.");
  } catch (error) {
    console.error("Error processing inbound email webhook:", error);
    res.status(500).send("Internal Server Error");
  }
});
