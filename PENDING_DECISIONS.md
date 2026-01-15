# 🛑 Pending Decisions & Action Items

I have built the "Zero-Cost" Marketing Infrastructure as requested. The code is ready.
However, **Automation cannot run** until you provide the following Access Keys.

## 1. Google Business Profile (Maps)
*   **Status**: Code ready (`src/lib/google_business.ts`).
*   **Missing**: OAuth2 Credentials.
*   **Action Needed**: Create a Google Cloud Project, enable "Google Business Profile API", and provide:
    *   `GBP_CLIENT_ID`
    *   `GBP_CLIENT_SECRET`
    *   `GBP_REFRESH_TOKEN`

## 2. Gmail Outreach (Backlinks)
*   **Status**: Code ready (`src/lib/gmail_outreach.ts`).
*   **Missing**: OAuth2 Credentials for `admin@texastotalloss.com`.
*   **Action Needed**: Enable "Gmail API" in the same Cloud Project and provide credentials.

## 3. Review & Launch "The Scout"
*   **Status**: The Cron Job is configured in `vercel.json` to run daily at 8:00 AM.
*   **Action Needed**:
    1.  Deploy this code to Vercel (`git push`).
    2.  Run the Supabase SQL (`supabase/migrations/20260112_create_blog_posts.sql`).
    3.  Define `CRON_SECRET` in Vercel Environment Variables.

## 4. Schema Update Check
*   **Status**: I updated the City Pages to say **"Texas Total Loss & Auto Accident Attorneys"**.
*   **Action Needed**: Verify this wording is legally compliant with your bar rules (regarding "Attorneys" vs "Law Firm").

Once you provide the keys (Actions 1 & 2), the system will wake up and start working for you 24/7.
