# Google Workspace Automation Scripts

This folder contains the automation logic for the Texas Total Loss growth engine.

## Installation Instructions

1.  **Open Google Sheets**
    *   Create a new Sheet (or open your "Blog Content Calendar").
    *   Go to **Extensions > Apps Script**.

2.  **Copy Script Files**
    *   Create a new file in the Apps Script editor for each file in this folder:
        *   `BlogGenerator.gs` (paste content from `BlogGenerator.js`)
        *   `GBPPostGenerator.gs` (paste content from `GBPPostGenerator.js`)
        *   `RankingTracker.gs` (paste content from `RankingTracker.js`)
        *   `CompetitorGap.gs` (paste content from `CompetitorGap.js`)

3.  **Set Script Properties**
    *   In Apps Script editor, click **Project Settings** (Gear icon).
    *   Scroll to **Script Properties**.
    *   Add Property: `GEMINI_API_KEY` -> Value: `Your_Gemini_Key`
    *   Add Property: `SEMRUSH_KEY` -> Value: `Your_Semrush_Key` (if using)

4.  **Set Triggers**
    *   Click **Triggers** (Clock icon) in the left sidebar.
    *   **BlogGenerator**: Add Trigger -> `generateBlogContent` -> Time-driven -> Every 6 hours.
    *   **GBPPostGenerator**: Add Trigger -> `generateGBPPost` -> Time-driven -> Day timer -> 7am to 8am.
    *   **RankingTracker**: Add Trigger -> `trackRankings` -> Time-driven -> Day timer -> 6am to 7am.
    *   **CompetitorGap**: Add Trigger -> `analyzeGaps` -> Time-driven -> Week timer -> Every Monday.

## Testing
You can manually run any function by selecting it in the toolbar and clicking **Run**. Check the **Execution Log** for output.
