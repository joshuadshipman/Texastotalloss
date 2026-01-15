# 🤖 24/7 Content Automation Guide (The "Always-On" Strategy)

You asked how to keep the blog generation running "24/7" and "rotate the AI". Here is the strategy we have implemented and the next steps for full automation.

## ✅ Phase 1: Better & Faster Sourcing (Done)
We have upgraded your Content Engine:
1.  **Breaking News Feed**: Instead of just copying competitors, the AI now scans **Google News RSS** for real-time Texas accident reports.
    *   *Benefit*: You get content *before* your competitors.
2.  **AI Rotation (Personas)**: The AI now randomly selects a "Persona" for each run:
    *   *The Aggressive Advocate*
    *   *The Empathetic Guide*
    *   *The Insider Analyst*
    *   *Benefit*: Your blog won't sound robotic or repetitive.

## 🚀 Phase 2: True 24/7 Automation (The Cron Job)
Currently, you have to click "Run Daily Scout". To make this run automatically at 8:00 AM every day, follow these steps:

### 1. The Database Switch (Required)
The automated system cannot "save to file" (`blog-posts.ts`) because the server resets every time. It **must** save to Supabase.
*   **Step**: Run the SQL query I savedase/migrat in `supabions/20260112_create_blog_posts.sql` in your Supabase SQL Editor.
*   **Status**: Migration file is ready.

### 2. Create the API Endpoint
We need a secret URL that Vercel can "ping" to trigger the scout.
*   Create a file `src/app/api/cron/scout/route.ts` (I can do this for you next).
*   This generic "worker" will:
    1.  Run `fetchTrendingNews()`
    2.  Generate a Concept
    3.  Write the Post
    4.  Save to **Supabase**

### 3. Set Up Vercel Cron (Free)
1.  Go to your project in **Vercel Dashboard**.
2.  Settings -> **Cron Jobs**.
3.  Add a job:
    *   **Schedule**: `0 14 * * *` (This runs at 8 AM CST daily).
    *   **Path**: `/api/cron/scout`

## 📊 How "We" Are Obtaining Data
We are now "triangulating" content:
1.  **Competitors**: "What are they talking about?" (Scraper)
2.  **Google News**: "What just happened?" (RSS Scanner)
3.  **Evergreen**: "What do people search?" (Gemini Knowledge)


## 🔄 Phase 3: The SEO Feedback Loop (Staying in Top 3)
You asked: *"Will this update itself to ensure we are in the Top 3?"*
**Not out of the box.** The current system is "Feed Forward" (It creates content). To make it "Self-Healing" (Update existing content), we need **Google Search Console (GSC)** data.

I have created the logic for this in `src/lib/seo_optimizer.ts`. Here is how to activate it:

1.  **Connect GSC**: We need to connect your `admin@texastotalloss.com` account to the Google Search Console API.
2.  **The Loop Logic**:
    *   **Daily Check**: The system scans your rankings.
    *   **The "Striking Distance" Rule**: If a page is ranked **#4 through #20** (close but not winning), the AI wakes up.
    *   **Auto-Optimize**: The AI reads the #1 result, compares it to your page, and *rewrites* your content to fill the gaps.
    *   **Win**: This pushes you into the Top 3 automatically.

**Next Step**: When you are ready, ask me to "Connect Google Search Console API" to close this loop.

