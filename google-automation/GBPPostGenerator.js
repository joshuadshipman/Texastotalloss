/**
 * GBP Post Generator Pipeline
 * 
 * Generates daily Google Business Profile updates based on local trends.
 * Runs Daily at 7:00 AM.
 */

const GBP_CONFIG = {
    EMAIL_RECIPIENT: 'jds@pmaction.com',
    CITIES: ['Dallas', 'Houston', 'Austin', 'San Antonio'],
    GEMINI_MODEL: 'gemini-1.5-pro-latest'
};

function generateGBPPost() {
    const sheet = SpreadsheetApp.getActiveSheet(); // Assumes bound script or active

    // 1. Identify Trend (Mocking external trend fetch for now, or use pre-filled list)
    // In a real scenario, this could fetch from Google Trends email RSS or similar
    const city = GBP_CONFIG.CITIES[new Date().getDay() % GBP_CONFIG.CITIES.length]; // Rotate cities
    const topic = getNextTopicFromSheet(sheet) || "Total Loss Help";

    const prompt = `
    Write a short, engaging Google Business Profile update (max 150 words) for "Texas Total Loss".
    Focus City: ${city}
    Topic: ${topic}
    Tone: Helpful, Urgent, Local.
    Include: 1 Emoji, HashTags (#TexasTotalLoss, #${city}), and a Call to Action to call 1-800-555-0199.
  `;

    // 2. Generate Copy
    const postCopy = callGeminiAPI_GBP(prompt);

    // 3. Log to Sheet
    const nextRow = sheet.getLastRow() + 1;
    sheet.getRange(nextRow, 1).setValue(new Date());
    sheet.getRange(nextRow, 2).setValue(topic);
    sheet.getRange(nextRow, 3).setValue(postCopy);
    sheet.getRange(nextRow, 4).setValue("Pending");

    // 4. Email for Approval
    MailApp.sendEmail({
        to: GBP_CONFIG.EMAIL_RECIPIENT,
        subject: `📍 GBP Post Approval: ${city} - ${topic}`,
        htmlBody: `
      <h2>Daily Local Post Draft</h2>
      <p><strong>City:</strong> ${city}</p>
      <p><strong>Topic:</strong> ${topic}</p>
      <hr/>
      <p style="font-family:sans-serif; background:#f5f5f5; padding:15px; border-left:4px solid #2196F3;">
        ${postCopy.replace(/\n/g, '<br>')}
      </p>
      <hr/>
      <p>Reply "APPROVED" to post (Automation to be added) or copy-paste to GBP.</p>
    `
    });
}

function getNextTopicFromSheet(sheet) {
    // Simple logic: Find first row in a "Topics" column (e.g. Col Z) that isn't used
    // For MVP, returning random generic topic
    const topics = ["Diminished Value", "Gap Insurance", "Not at Fault Rental", "Total Loss Valuation"];
    return topics[Math.floor(Math.random() * topics.length)];
}

function callGeminiAPI_GBP(prompt) {
    const scriptProperties = PropertiesService.getScriptProperties();
    const apiKey = scriptProperties.getProperty('GEMINI_API_KEY');

    if (!apiKey) return "Error: API Key Missing";

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GBP_CONFIG.GEMINI_MODEL}:generateContent?key=${apiKey}`;
    const payload = { contents: [{ parts: [{ text: prompt }] }] };

    try {
        const response = UrlFetchApp.fetch(url, {
            method: 'post',
            contentType: 'application/json',
            payload: JSON.stringify(payload),
            muteHttpExceptions: true
        });
        const json = JSON.parse(response.getContentText());
        return json.candidates[0].content.parts[0].text;
    } catch (e) {
        return "Error generating content: " + e.message;
    }
}
