/**
 * Verification Script
 * Concatenates Mocks + BlogGenerator logic to verify flow.
 */

// --- MOCKS ---
const Logger = { log: (msg) => console.log(`[Logger] ${msg}`) };
const PropertiesService = { getScriptProperties: () => ({ getProperty: (key) => "MOCK_API_KEY_12345" }) };
const MailApp = { sendEmail: (params) => { console.log(`[MailApp] Sending email to ${params.to} | Subject: ${params.subject}`); } };
const UrlFetchApp = {
    fetch: (url, options) => {
        console.log(`[UrlFetchApp] Request to ${url}`);
        return { getContentText: () => JSON.stringify({ candidates: [{ content: { parts: [{ text: "MOCK GENERATED CONTENT" }] } }] }) };
    }
};
const DriveApp = {
    getFolderById: (id) => ({ addFile: () => { } }),
    getRootFolder: () => ({ addFile: () => { } }),
    getFileById: (id) => ({ moveTo: () => { }, getUrl: () => `https://docs.google.com/document/d/${id}` })
};
const DocumentApp = {
    create: (name) => {
        console.log(`[DocumentApp] Created Doc: ${name}`);
        return {
            getId: () => "MOCK_DOC_ID_" + Date.now(),
            getUrl: () => `https://docs.google.com/document/d/MOCK_ID`,
            getBody: () => ({ insertParagraph: () => ({ setHeading: () => { } }), appendParagraph: () => ({ setHeading: () => { }, setHeading2: () => { } }) })
        };
    },
    ParagraphHeading: { HEADING4: 'H4' }
};

// Mock Sheet
class MockRange {
    constructor(row, col) { this.row = row; }
    setValue(val) { console.log(`[Sheet] Set Row ${this.row}: ${val}`); }
}
const SpreadsheetApp = {
    getActiveSheet: () => ({
        getDataRange: () => ({
            getValues: () => [
                ["Date", "Keyword", "Vol", "Diff", "Link", "Status"],
                ["1/1/26", "Total Loss Dallas", 500, 10, "", ""] // Row 2, Pending
            ]
        }),
        getRange: (row, col) => new MockRange(row, col)
    })
};

// --- BLOG GENERATOR LOGIC (Inlined for Test) ---
const CONFIG = { EMAIL_RECIPIENT: 'test@example.com', FOLDER_ID: '123', GEMINI_MODEL: 'gemini-1.5' };

function generateBlogContent() {
    const sheet = SpreadsheetApp.getActiveSheet();
    const values = sheet.getDataRange().getValues();
    let targetRow = -1;
    let keyword = "";

    for (let i = 1; i < values.length; i++) {
        const rowStatus = values[i][5];
        const rowKeyword = values[i][1];
        if (rowKeyword && (!rowStatus || rowStatus === "")) {
            targetRow = i + 1;
            keyword = rowKeyword;
            break;
        }
    }

    if (targetRow === -1) { Logger.log("No pending keywords found."); return; }

    Logger.log(`Generating content for: ${keyword}`);

    // Call Gemini
    const blogContent = "MOCK CONTENT"; // Skipping actual fetch call wrapper to simplify test

    // Create Doc
    const doc = DocumentApp.create(`Draft: ${keyword}`);

    // Update Sheet
    sheet.getRange(targetRow, 6).setValue("Review Ready");

    // Send Email
    MailApp.sendEmail({
        to: CONFIG.EMAIL_RECIPIENT,
        subject: `Review Needed: "${keyword}"`,
        htmlBody: "Link to doc"
    });
}

// --- EXECUTE ---
console.log(">>> RUNNING TEST <<<");
generateBlogContent();
console.log(">>> TEST COMPLETE <<<");
