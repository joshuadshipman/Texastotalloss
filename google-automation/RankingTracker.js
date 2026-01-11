/**
 * Ranking Tracker System
 * 
 * Fetches daily rankings and compares with historical data.
 * Runs Daily at 6:00 AM.
 */

const RANK_CONFIG = {
    DOMAIN: 'texastotalloss.com',
    API_PROVIDER: 'SEMRUSH', // or 'MOCK' for testing
    EMAIL_RECIPIENT: 'jds@pmaction.com'
};

function trackRankings() {
    const sheet = SpreadsheetApp.getActiveSheet();
    const lastRow = sheet.getLastRow();

    // Assumed Columns: A=Keyword, B=TargetRank, C=CurrentRank, D=PrevRank, E=Trend

    if (lastRow < 2) return; // No keywords

    const keywords = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
    let movements = { up: [], down: [], new: [] };

    keywords.forEach((kw, index) => {
        const row = index + 2;
        const currentRankCell = sheet.getRange(row, 3);
        const prevRankCell = sheet.getRange(row, 4);
        const trendCell = sheet.getRange(row, 5);

        // 1. Shift History
        const prevRank = currentRankCell.getValue() || 0;
        prevRankCell.setValue(prevRank);

        // 2. Fetch New Rank
        const newRank = fetchRank(kw); // 0 means > 100 or not found
        currentRankCell.setValue(newRank);

        // 3. Calculate Trend
        let trend = "xx";
        if (prevRank === 0 && newRank > 0) {
            trend = "NEW";
            movements.new.push(`${kw} (#${newRank})`);
            trendCell.setBackground('#E3F2FD'); // Blue
        } else if (newRank < prevRank && newRank !== 0) {
            trend = "UP"; // Lower number is better
            movements.up.push(`${kw} (#${prevRank} -> #${newRank})`);
            trendCell.setBackground('#C8E6C9'); // Green
        } else if (newRank > prevRank) {
            trend = "DOWN";
            movements.down.push(`${kw} (#${prevRank} -> #${newRank})`);
            trendCell.setBackground('#FFCDD2'); // Red
        } else {
            trend = "-";
            trendCell.setBackground('#FFFFFF');
        }

        trendCell.setValue(trend);
    });

    // 4. Send Digest
    if (movements.up.length > 0 || movements.down.length > 0 || movements.new.length > 0) {
        sendRankAlert(movements);
    }
}

function fetchRank(keyword) {
    // Real implementation requires Semrush/Ahrefs API
    // Returning MOCK data for setup verification
    if (RANK_CONFIG.API_PROVIDER === 'MOCK') {
        // Simulate volatility
        return Math.floor(Math.random() * 20) + 1;
    }

    // Example Semrush Call (Commented out)
    /*
    const key = PropertiesService.getScriptProperties().getProperty('SEMRUSH_KEY');
    const url = `https://api.semrush.com/?type=phrase_this&key=${key}&phrase=${encodeURIComponent(keyword)}&database=us`;
    // fetch and parse...
    */
    return 0;
}

function sendRankAlert(movements) {
    let html = "<h2>📉 Daily SEO Movement</h2>";

    if (movements.new.length) {
        html += `<h3 style="color:#2196F3">✨ New Rankings</h3><ul><li>${movements.new.join('</li><li>')}</li></ul>`;
    }
    if (movements.up.length) {
        html += `<h3 style="color:#4CAF50">🚀 Movers (UP)</h3><ul><li>${movements.up.join('</li><li>')}</li></ul>`;
    }
    if (movements.down.length) {
        html += `<h3 style="color:#F44336">⚠️ Dropped</h3><ul><li>${movements.down.join('</li><li>')}</li></ul>`;
    }

    MailApp.sendEmail({
        to: RANK_CONFIG.EMAIL_RECIPIENT,
        subject: `SEO Alert: ${movements.up.length} Keywords Improved`,
        htmlBody: html
    });
}
