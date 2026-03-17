/**
 * Blog Generator Pipeline (Bilingual + Video Enhanced)
 * 
 * Automates the creation of SEO-optimized blog posts in English and Spanish,
 * plus a YouTube Shorts script using Gemini AI.
 */

// Configuration
const CONFIG = {
    SHEET_NAME: 'Blog Content Calendar',
    FOLDER_ID: 'YOUR_FOLDER_ID_HERE',
    GEMINI_MODEL: 'gemini-1.5-flash',
    EMAIL_RECIPIENT: 'jds@pmaction.com'
};

/**
 * Main Entry Point
 */
function generateBlogContent() {
    const ss = SpreadsheetApp.openById('1UyLfJOlixYCMX3_G6VbGw1lc5Q2EdQwbqEtoZhAmceo');
    const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

    if (!sheet) {
        Logger.log("Sheet not found: " + CONFIG.SHEET_NAME);
        return;
    }

    const range = sheet.getDataRange();
    const values = range.getValues();

    let targetRow = -1;
    let keyword = "";

    for (let i = 1; i < values.length; i++) {
        const rowStatus = values[i][5]; // Column F
        const rowKeyword = values[i][1]; // Column B

        if (rowKeyword && (!rowStatus || rowStatus === "")) {
            targetRow = i + 1;
            keyword = rowKeyword;
            break;
        }
    }

    if (targetRow === -1) {
        Logger.log("No pending keywords found.");
        return;
    }

    Logger.log(`Generating bilingual content for: ${keyword}`);

    let generatedData;
    try {
        generatedData = callGeminiAPI(keyword);
    } catch (e) {
        Logger.log("Error calling Gemini: " + e.message);
        sheet.getRange(targetRow, 6).setValue("Error: API Fail");
        return;
    }

    // 3. Staging: Create Google Docs (English and Spanish)
    let engDocUrl = "";
    let espDocUrl = "";
    try {
        let folder;
        try {
            folder = DriveApp.getFolderById(CONFIG.FOLDER_ID);
        } catch (e) {
            folder = DriveApp.getRootFolder();
        }

        // English Doc
        const engDoc = DocumentApp.create(`[EN] Draft: ${keyword}`);
        engDoc.getBody().appendParagraph(generatedData.english_content);
        const engFile = DriveApp.getFileById(engDoc.getId());
        engFile.moveTo(folder);
        engDocUrl = engDoc.getUrl();

        // Spanish Doc
        const espDoc = DocumentApp.create(`[ES] Draft: ${keyword}`);
        espDoc.getBody().appendParagraph(generatedData.spanish_content);
        const espFile = DriveApp.getFileById(espDoc.getId());
        espFile.moveTo(folder);
        espDocUrl = espDoc.getUrl();

        // YouTube Script (Save as text file or in notes column)
        const scriptFile = folder.createFile(`[VIDEO] Script: ${keyword}.txt`, generatedData.youtube_script);

    } catch (e) {
        Logger.log("Error creating Docs: " + e.message);
        sheet.getRange(targetRow, 6).setValue("Error: Doc Fail");
        return;
    }

    // 4. Update Database (Sheet)
    // Format: Store both links in Draft Link column
    sheet.getRange(targetRow, 5).setValue(`EN: ${engDocUrl}\nES: ${espDocUrl}`);
    sheet.getRange(targetRow, 6).setValue("Bilingual Review Ready");
    sheet.getRange(targetRow, 1).setValue(new Date());

    // 5. Notification: Send Email
    MailApp.sendEmail({
        to: CONFIG.EMAIL_RECIPIENT,
        subject: `📝 Bilingual Review Needed: "${keyword}"`,
        htmlBody: `
      <h2>New Bilingual Blog & Video Script Generated</h2>
      <p><strong>Topic:</strong> ${keyword}</p>
      <p><strong>Status:</strong> Awaiting Approval</p>
      <br />
      <a href="${engDocUrl}" style="background-color:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">English Doc</a>
      <a href="${espDocUrl}" style="background-color:#008CBA;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;margin-left:10px;">Spanish Doc</a>
      <br /><br />
      <p><em>YouTube script also generated in the staging folder.</em></p>
    `
    });
}

function callGeminiAPI(keyword) {
    const scriptProperties = PropertiesService.getScriptProperties();
    const apiKey = scriptProperties.getProperty('GEMINI_API_KEY');

    if (!apiKey) throw new Error("GEMINI_API_KEY not set in Script Properties");

    const url = `https://generativelanguage.googleapis.com/v1/models/${CONFIG.GEMINI_MODEL}:generateContent?key=${apiKey}`;

    const prompt = `
    Context: Expert Texas personal injury attorney and SEO specialist.
    Task: Generate three distinct outputs for the keyword "${keyword}".
    
    1. A comprehensive blog post in English.
    2. A full translation of that blog post into Spanish (Se habla español style).
    3. A 60-second YouTube Shorts/TikTok script focusing on a "Insurance Secret" or "Quick Tip" related to the topic.
    
    Format: Return ONLY a JSON object with keys: "english_content", "spanish_content", and "youtube_script".
    Do not include markdown code blocks in the response, just the raw JSON.
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
    const textResponse = response.getContentText();

    // Clean JSON response (remove potential AI bloat)
    const cleanedText = textResponse.replace(/```json|```/g, "").trim();

    let json;
    try {
        json = JSON.parse(cleanedText);
    } catch (e) {
        // Fallback for nested JSON parsing errors
        const content = JSON.parse(textResponse);
        const rawText = content.candidates[0].content.parts[0].text;
        json = JSON.parse(rawText.replace(/```json|```/g, "").trim());
    }

    return json;
}
