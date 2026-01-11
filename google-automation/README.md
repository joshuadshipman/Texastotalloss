# Google Workspace Automation Scripts

This folder contains the automation logic for the Texas Total Loss 24/7 growth engine.

## 📋 Prerequisites

1. **Google Account** with access to Google Sheets and Google Docs
2. **Gemini API Key** (from Google AI Studio)
3. **SEMrush API Key** (optional, for ranking data)

---

## 🚀 Quick Start (5 Minutes)

### Step 1: Create Required Google Sheets

Create ONE Google Sheet with these tabs (or separate sheets):

| Tab Name | Purpose | Required Headers |
|----------|---------|------------------|
| `Blog Content Calendar` | Blog topics queue | A: Date, B: Target Keyword, C: Title, D: Doc URL, E: Status |
| `GBP Daily Post Calendar` | GBP post history | A: Date, B: Topic, C: Generated Copy, D: Status |
| `Ranking Data` | Keyword rank tracking | A: Date, B: Keyword, C: Position, D: URL, E: Change |
| `Competitor Analysis` | Gap insights | A: Date, B: Competitor, C: Keyword, D: Our Position, E: Gap |

### Step 2: Open Apps Script

1. Open your Google Sheet
2. Click **Extensions** → **Apps Script**
3. This opens the script editor (important: must be from the Sheet!)

### Step 3: Add Script Files

Create these files in the Apps Script editor:
- Click **+** next to "Files" 
- Select "Script"
- Name it and paste the code:

| File Name | Copy From |
|-----------|-----------|
| `BlogGenerator.gs` | `BlogGenerator.js` |
| `GBPPostGenerator.gs` | `GBPPostGenerator.js` |
| `RankingTracker.gs` | `RankingTracker.js` |
| `CompetitorGap.gs` | `CompetitorGap.js` |

### Step 4: Configure API Keys

1. Click ⚙️ **Project Settings** (gear icon, left sidebar)
2. Scroll to **Script Properties**
3. Click **Add Script Property**
4. Add:
   - `GEMINI_API_KEY` → Your Gemini API key
   - `SEMRUSH_KEY` → Your SEMrush key (optional)

### Step 5: Authorize Permissions

1. From the dropdown, select `generateBlogContent`
2. Click **Run**
3. Click **Review Permissions** → Select your account
4. Click **Advanced** → **Go to [Project Name] (unsafe)**
5. Click **Allow**

---

## 🧪 Testing Each Script

### BlogGenerator
1. **Add a test row** to `Blog Content Calendar`:
   - Column A: Today's date
   - Column B: `texas total loss claim tips`
   - Column F: Leave empty (or `pending`)
2. Select `generateBlogContent` from dropdown
3. Click **Run**
4. Check **Execution Log** (View → Logs) for output
5. **Expected**: New Google Doc created, email sent to `jds@pmaction.com`

### GBPPostGenerator
1. **Ensure tab exists**: `GBP Daily Post Calendar`
2. Select `generateGBPPost` from dropdown
3. Click **Run**
4. **Expected**: New row added with AI-generated post copy

### RankingTracker
1. Select `trackRankings` from dropdown
2. Click **Run**
3. **Expected**: Ranking data logged (mock data if no SEMrush key)

### CompetitorGap
1. Select `analyzeGaps` from dropdown
2. Click **Run**
3. **Expected**: Gap analysis logged

---

## ⏰ Setting Up Automated Triggers

1. Click ⏱️ **Triggers** (clock icon, left sidebar)
2. Click **+ Add Trigger**

| Function | Type | Schedule |
|----------|------|----------|
| `generateBlogContent` | Time-driven | Every 6 hours |
| `generateGBPPost` | Time-driven | Daily, 7am-8am |
| `trackRankings` | Time-driven | Daily, 6am-7am |
| `analyzeGaps` | Time-driven | Weekly, Monday |

---

## 🐛 Troubleshooting

### "Sheet not found" Error
- Make sure you opened Apps Script from **Extensions menu inside the Sheet**
- The tab name must match exactly (case-sensitive)

### "Execution finished immediately with no output"
- You ran the wrong function! Use the dropdown to select the main function (e.g., `generateBlogContent`, not `getNextKeyword`)

### "Missing Gemini Key"
- Go to Project Settings → Script Properties
- Add `GEMINI_API_KEY` with your actual key

### "TypeError: Cannot read property 'getRange'"
- The script is looking for a sheet tab that doesn't exist
- Check tab names in your Sheet match the code

### Authorization Stuck
- Clear browser cache
- Try in Incognito mode
- Use a different browser

---

## 📊 Monitoring

Check **View → Executions** in the Apps Script editor to see:
- ✅ Successful runs
- ❌ Failed runs (click to see error details)
- ⏱️ Execution times

---

## 📧 Email Recipients

By default, approval emails go to: `jds@pmaction.com`

To change, edit the `CONFIG.email_to` in each script file.
