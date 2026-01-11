/**
 * Local Mock Runner for Google Apps Script
 * 
 * This file mocks the Google Apps Script global objects (SpreadsheetApp, DriveApp, etc.)
 * so we can run the logic in a local Node.js environment to verify flow.
 */

// --- MOCKS ---

const Logger = {
    log: (msg) => console.log(`[Logger] ${msg}`)
};

const PropertiesService = {
    getScriptProperties: () => ({
        getProperty: (key) => "MOCK_API_KEY_12345"
    })
};

const MailApp = {
    sendEmail: (params) => {
        console.log(`[MailApp] Sending email to ${params.to}`);
        console.log(`[MailApp] Subject: ${params.subject}`);
        // console.log(`[MailApp] Body Preview: ${params.htmlBody.substring(0, 50)}...`);
    }
};

const UrlFetchApp = {
    fetch: (url, options) => {
        console.log(`[UrlFetchApp] Request to ${url}`);
        // Mock Gemini Response
        return {
            getContentText: () => JSON.stringify({
                candidates: [{
                    content: { parts: [{ text: "MOCK GENERATED CONTENT: Here is a blog post about the keyword..." }] }
                }]
            })
        };
    }
};

const DriveApp = {
    getFolderById: (id) => ({ addFile: () => { } }),
    getRootFolder: () => ({ addFile: () => { } }),
    getFileById: (id) => ({
        moveTo: () => { },
        getUrl: () => `https://docs.google.com/document/d/${id}`
    })
};

const DocumentApp = {
    create: (name) => {
        console.log(`[DocumentApp] Created Doc: ${name}`);
        return {
            getId: () => "MOCK_DOC_ID_" + Date.now(),
            getUrl: () => `https://docs.google.com/document/d/MOCK_ID`,
            getBody: () => ({
                insertParagraph: () => ({ setHeading: () => { } }),
                appendParagraph: () => ({ setHeading: () => { }, setHeading2: () => { } })
            })
        };
    },
    ParagraphHeading: { HEADING1: 'H1', HEADING2: 'H2', HEADING4: 'H4' }
};

class MockRange {
    constructor(row, col, rows, cols) {
        this.row = row;
        this.value = "";
    }
    setValue(val) { console.log(`[Sheet] Set Cell [${this.row}, ?]: ${val}`); this.value = val; }
    getValue() { return 10; } // Default rank
    setBackground(color) { console.log(`[Sheet] Set Bg Color: ${color}`); }
    setFontColor(color) { }
}

const SpreadsheetApp = {
    getActiveSheet: () => ({
        getDataRange: () => ({
            getValues: () => [
                ["Date", "Keyword", "Vol", "Diff", "Link", "Status"],
                ["1/1/26", "Total Loss Dallas", 500, 10, "", ""] // Pending item
            ]
        }),
        getRange: (row, col) => new MockRange(row, col),
        getLastRow: () => 5
    })
};

// --- IMPORT & RUN SCRIPTS (Simulated) ---

// In a real Node env we'd require(), but here we will just paste the logic to test
// or assume the user runs this where those files are concatenated.
// For this verification step, we will manually invoke the logic if we were running purely locally.

console.log(">>> STARTING MOCK TESTS <<<");

// 1. Test Blog Generator Logic (Copy-pasted core logic for test)
// ... (Logic would go here in true integration test, but for now we confirm Mocks exist)

console.log("Mocks initialized successfully. Ready for manual script injection testing.");
