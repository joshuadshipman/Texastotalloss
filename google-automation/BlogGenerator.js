/**
 * Blog Generator Pipeline
 * 
 * Automates the creation of SEO-optimized blog posts using Gemini AI.
 * Runs every 6 hours via Time-Driven Trigger.
 */

// Configuration
const CONFIG = {
    SHEET_NAME: 'Blog Content Calendar',
    FOLDER_ID: 'YOUR_FOLDER_ID_HERE', // User must populate
    GEMINI_MODEL: 'gemini-1.5-pro-latest',
    EMAIL_RECIPIENT: 'jds@pmaction.com'
};

/**
 * Main Entry Point
 */
function generateBlogContent() {
    const sheet = SpreadsheetApp.getActiveSheet();
    // Ensure we are on the right sheet, or get by name if deployed
    // const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(CONFIG.SHEET_NAME);

    if (!sheet) {
        Logger.log("Sheet not found: " + CONFIG.SHEET_NAME);
        return;
    }

    const range = sheet.getDataRange();
    const values = range.getValues();
    // Headers: Date | Keyword | Vol | Diff | Draft Link | Status | Approval | Notes | Publish Date

    // 1. Identification: Find next pending topic
    // Looking for row where 'Keyword' exists but 'Status' is empty or 'Pending'
    let targetRow = -1;
    let keyword = "";

    for (let i = 1; i < values.length; i++) {
        const rowStatus = values[i][5]; // Column F
        const rowKeyword = values[i][1]; // Column B

        if (rowKeyword && (!rowStatus || rowStatus === "")) {
            targetRow = i + 1; // 1-based index
            keyword = rowKeyword;
            break;
        }
    }

    if (targetRow === -1) {
        Logger.log("No pending keywords found.");
        return;
    }

    Logger.log(`Generating content for: ${keyword}`);

    // 2. Generation: Call Gemini
    let blogContent;
    try {
        blogContent = callGeminiAPI(keyword);
    } catch (e) {
        Logger.log("Error calling Gemini: " + e.message);
        sheet.getRange(targetRow, 6).setValue("Error: API Fail");
        return;
    }

    // 3. Staging: Create Google Doc
    let docUrl = "";
    try {
        // Check if folder exists, else use root
        let folder;
        try {
            folder = DriveApp.getFolderById(CONFIG.FOLDER_ID);
        } catch (e) {
            folder = DriveApp.getRootFolder();
        }

        const doc = DocumentApp.create(`Draft: ${keyword}`);
        const body = doc.getBody();

        // Insert Header
        body.insertParagraph(0, `Target Keyword: ${keyword}`).setHeading(DocumentApp.ParagraphHeading.HEADING4);
        body.appendParagraph("---");

        // Parse Markdown-ish content to cleaner Google Docs format (Basic)
        // For now, just dumping text. A real parser would handle bold/headers.
        body.appendParagraph(blogContent);

        // Move file
        const file = DriveApp.getFileById(doc.getId());
        file.moveTo(folder);
        docUrl = doc.getUrl();

    } catch (e) {
        Logger.log("Error creating Doc: " + e.message);
        sheet.getRange(targetRow, 6).setValue("Error: Doc Fail");
        return;
    }

    // 4. Update Database (Sheet)
    sheet.getRange(targetRow, 5).setValue(docUrl);
    sheet.getRange(targetRow, 6).setValue("Review Ready");
    sheet.getRange(targetRow, 1).setValue(new Date());

    // 5. Notification: Send Email
    MailApp.sendEmail({
        to: CONFIG.EMAIL_RECIPIENT,
        subject: `📝 Review Needed: "${keyword}"`,
        htmlBody: `
      <h2>New Blog Draft Generated</h2>
      <p><strong>Topic:</strong> ${keyword}</p>
      <p><strong>Status:</strong> Awaiting Approval</p>
      <br />
      <a href="${docUrl}" style="background-color:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">Open Google Doc</a>
      <br /><br />
      <p><em>This is an automated message from your Texas Total Loss Growth Engine.</em></p>
    `
    });
}

function callGeminiAPI(keyword) {
    const scriptProperties = PropertiesService.getScriptProperties();
    const apiKey = scriptProperties.getProperty('GEMINI_API_KEY');

    if (!apiKey) throw new Error("GEMINI_API_KEY not set in Script Properties");

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${CONFIG.GEMINI_MODEL}:generateContent?key=${apiKey}`;

    const prompt = `
    Context: You are an expert Texas personal injury attorney and SEO specialist.
    Task: Write a comprehensive, empathetic, and authoritative blog post about "${keyword}".
    Structure:
    - Headline (H1): Catchy, includes keyword.
    - Introduction: Hook the reader, acknowledge their pain/stress.
    - Body Paragraphs (H2/H3): Answer specific questions related to "${keyword}". Include references to Texas laws if applicable.
    - Local Angle: Mention Texas cities (Dallas, Houston, Austin).
    - Call to Action: Encourage a free case review at TexasTotalLoss.com.
    Style: Professional but accessible (Reading level: Grade 8).
    Format: Use clean text with markdown headers (#, ##).
  `;

    const payload = {
        contents: [{ parts: [{ text: prompt }] }]
    };

    const options = {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
    };

    const response = UrlFetchApp.fetch(url, options);
    const json = JSON.parse(response.getContentText());

    if (json.error) {
        throw new Error(json.error.message);
    }

    return json.candidates[0].content.parts[0].text;
}
