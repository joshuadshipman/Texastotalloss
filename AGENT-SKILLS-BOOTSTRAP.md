# Texas Total Loss Skills Blueprint

This file contains the combined skill definitions for the Texas Total Loss project. The `skills-bootstrapper` will use this file to generate individual skill folders.

---
name: texas-total-loss-content-agent
description: Generate informative and engaging blog posts, FAQs, and articles about Texas Total Loss topics.
trigger: >
  Use this when asked to create content, blog posts, FAQs, or articles
  related to Texas property damage, insurance claims, or total loss disputes.
---

# Goal
Produce high-quality, Texas-specific content that establishes authority
and guides users through the total loss process.

# Instructions
1. Research the specific Texas legal or process-related topic.
2. Draft content using one of the established personas (Advocate, Guide, Analyst).
3. Ensure all claims are framed as information, not legal advice.
4. Include relevant CTAs for calculators or case reviews.

---
name: ttl-competitor-research-agent
description: Perform scheduled research on competitor websites, ads, and features to inform Texas Total Loss content and design.
trigger: >
  Use this skill for daily or weekly competitive research,
  or when specifically asked to analyze competitor marketing and site features.
---

# Goal
Continuously monitor and summarize competitor marketing: pages, funnels, tools, and messaging.
Extract reusable patterns (not content) to guide Texas Total Loss campaigns, content, and UX improvements.

# Inputs
- Optional:
  - A list of competitor domains or URLs.
  - Specific focus (e.g., "total loss calculators", "demand letter funnels", "storage-fee content").
  - Time window (e.g., daily, weekly review).

# Instructions
1. **Apply global skills**
   - Use `cost-aware-planner` to limit external calls and choose a small, representative set of sites.
   - Use `example-miner` principles: extract structure and patterns, not raw content.
2. **Select targets**
   - If a competitor list exists in a doc (e.g., `docs/competitors.md`), use it.
   - Otherwise, search for: "Texas total loss calculator", "dispute total loss value Texas", "auto accident property damage Texas".
   - Pick 3–7 relevant sites or landing pages for this run.
3. **Capture observations**
   - For each site/page:
     - Note the primary offer and positioning.
     - Summarize the layout structure (hero, forms, calculators, FAQ, proof).
     - Identify main CTAs and how they are phrased.
     - Note any interactive tools (calculators, chatbots, forms) and their flows.
4. **Summarize patterns**
   - Group findings into patterns:
     - Messaging/positioning themes.
     - Layout and funnel structure.
     - Features/tools that appear frequently.
   - For each pattern, describe why it might work and if it fits constraints.
5. **Write to workspace docs**
   - Append a dated entry to `docs/competitor-trends.md`.
   - Update or append to `docs/example-patterns.md`.
6. **Propose next actions**
   - Output 3–5 specific, testable recommendations.

---
name: ttl-campaign-generator-agent
description: Generate multichannel marketing campaigns and test plans for Texas Total Loss based on goals, trends, and competitor insights.
trigger: >
  Use this skill when you need a structured campaign plan with channel mixes,
  messaging, creative variants, and simple test designs for Texas Total Loss.
---

# Goal
Given a campaign objective and constraints, produce a clear brief, messaging variants, and a test plan.

# Instructions
1. **Apply global skills**
   - Use `cost-aware-planner` for cheap testing.
   - Use `skill-router` for content or research needs.
2. **Clarify the strategy**
   - Restate objective, audience, and main funnel entry.
3. **Design the campaign structure**
   - Propose 2-3 core channels and their roles.
4. **Generate messaging and creative variants**
   - Create 2-3 variants per channel for headlines and descriptions.
5. **Define a simple test plan**
   - Specify duration, metrics, and decision rules.
6. **Produce a structured campaign file**
   - Write to `docs/campaigns/`.
7. **Summarize next steps**.

---
name: ttl-daily-marketing-review-agent
description: Perform a daily review of Texas Total Loss marketing activity, competitor updates, and performance to suggest next actions.
trigger: >
  Use this skill once per day (or on demand) to summarize what happened,
  what worked, and what to do next for Texas Total Loss marketing.
---

# Goal
Create a concise daily intelligence report summarizing activity, performance, and recommending next actions.

# Instructions
1. **Gather context**
   - Read recent `docs/marketing-insights.md`, `docs/competitor-trends.md`, and campaign files.
2. **Review performance data**
   - Look in `data/analytics/` and summarize high-level metrics.
3. **Synthesize a Daily Summary**
   - What changed, what performed best, issues/anomalies.
4. **Recommend next actions**
   - Propose 3–5 actions, clearly ranked by impact/effort.
   - **Apply Decision Tier Framework (from `context.md`)**:
     - **Auto-Determine**: If a choice has high confidence/precedent, state the decision made.
     - **Propose Narrowed List**: If multiple viable paths exist, present a "Top 3" list with trade-offs.
   - For each action, note:
     - Which skill(s) should handle it.
     - Whether it needs human review or can be mostly automated.
5. **Write back to workspace**
   - Update `docs/marketing-insights.md` and `.antigravity/brain/plan.md`.
6. **Output a concise report**.

---
name: ttl-design-updater-agent
description: Continuously improve the appearance and flow of key pages based on example patterns and performance.
trigger: >
  Use this when you need to propose design or layout improvements
  to the Texas Total Loss web application.
---

# Goal
Propose and implement design updates that feel premium and follow modern aesthetic standards.

# Instructions
1. Read `docs/example-patterns.md` and past experiment notes.
2. Propose small, testable changes to layout, components, and microcopy.
3. Write updated specs to `docs/specs/`.
4. Implement diffs against the current codebase.
---
name: ttl-marketing-profile-agent
description: Act as an employee to create and set up new web logins and marketing profiles for Texas Total Loss.
trigger: >
  Use this when asked to set up new accounts, profiles, or logins
  for marketing platforms (e.g., social media, directories, lead gems).
---

# Goal
Safely and effectively create marketing profiles that appear human and avoid bot detection, following best-in-class patterns for lead generation success.

# Instructions
1. **Apply Stealth Patterns**
   - Use `browser_subagent` with explicit instructions to emulate human behavior:
     - Non-linear mouse movements.
     - Varied scrolling and typing speeds.
     - Realistic pauses to "read" content.
2. **Identity Management**
   - If available, use high-quality residential proxies or rotate IPs.
   - Rotate User-Agent strings to match common, modern browsers.
   - Disable automation flags (e.g., `navigator.webdriver`).
3. **Account Warm-up**
   - Do not perform high-frequency actions immediately after creation.
   - Plan a multi-day "warm-up" phase (likes, minor engagement) to build trust.
4. **Data Integrity**
   - Use unique, business-appropriate emails (e.g., from the `texastotalloss.com` domain).
   - Document all credentials securely (do not hardcode).
5. **Research First**
   - For any new platform, first research its specific anti-bot measures and success patterns from other lead gen implementations.

# Constraints
- Never create fake identities or personas that violate platform Terms of Service.
- Always use legitimate company information.
- Stop and report if met with complex CAPTCHAs that require manual intervention or paid solvers (unless integrated).

---
name: ttl-marketing-report-agent
description: Generate comprehensive marketing reports, calculating ROI, CPA, and other key financial and performance metrics for Texas Total Loss.
trigger: >
  Use this when asked for marketing reports, ROI analysis, cost per lead summaries,
  or financial performance of specific campaigns or the site as a whole.
---

# Goal
Provide accurate, data-driven financial and performance reports to guide marketing investment decisions.

# Instructions
1. **Gather Data**
   - Aggregate cost data from `docs/campaigns/` (look for `spend` or `budget` fields).
   - Aggregate conversion/lead data from `docs/marketing-insights.md` or `data/analytics/`.
   - If available, pull revenue/case-value data from Supabase or manual logs.
2. **Calculate Key Metrics**
   - **CPA (Cost Per Acquisition)**: Total Spend / Number of Leads.
   - **ROI (Return on Investment)**: (Total Revenue - Total Spend) / Total Spend.
   - **Conversion Rate**: Total Leads / Total Traffic.
3. **Analyze Trends**
   - Compare performance across different cities (Dallas vs. Houston vs. San Antonio).
   - Identify high-performing vs. low-performing channels (Organic, Paid, Email).
4. **Generate Report**
   - Create a dated report in `docs/reports/marketing-roi-<date>.md`.
   - Use tables and concise summaries for easy reading.
5. **Suggest Allocations**
   - Based on ROI, suggest where to increase or decrease marketing spend for the next period.

# Constraints
- Clearly label "estimates" vs. "verified data".
- Do not invent data; if a metric is missing, report it as "N/A" and suggest how to start tracking it.

---
name: ttl-crm-management-agent
description: Ensure data captured via the questionnaire is structured and saved in formats compatible with Litify (Salesforce).
trigger: >
  Use this when asked to verify CRM compatibility, perform field mapping,
  or modify the lead submission data structure to support Litify.
---

# Goal
Safeguard data integrity and ensure seamless lead flow from the web application into Litify.

# Instructions
1. **Enforce Field Mapping**
   - Maintain a master mapping between Supabase schema and Litify fields.
   - For any new field added to the questionnaire, define its Litify equivalent (standard or custom `__c`).
2. **Standardize Data Formats**
   - Ensure dates use ISO 8601 for Supabase but are convertible to Salesforce `Date` format.
   - Ensure picklist values (e.g., source, role) match the predefined options in Litify.
   - Automatically split "Full Name" into `FirstName` and `LastName` during the CRM sync process logic.
3. **Validate Data Integrity**
   - Before submission, verify that required fields for Litify (e.g., Phone, Last Name) are present and correctly formatted.
4. **Audit and Reconcile**
   - Periodically audit saved leads to ensure no data loss occurs due to format mismatches.

# Constraints
- Do not modify the Supabase schema without first checking impact on any existing external syncs.
- Always prioritize data types: if Litify expects a Number, do not send a String.

---
name: web-search
description: Searches the web for a given query using the Gemini 1.5 Flash Google Search grounding tool. Returns a structured summary with source links.
trigger: >
  Use this for research, competitor analysis, or finding the latest market
  trends without using paid search APIs (Tavily/Brave).
---

# Goal
Provide high-accuracy, grounded web research for lead generation and content topics.

# Instructions
1. **Gemini Grounding**: Always use the `google_search_grounding` tool.
2. **Summary**: Provide a bulleted summary of findings with source links.
3. **Accuracy**: Cross-reference facts if they seem inconsistent.

---
name: browser-automation
description: Automates browser interactions (click, form fill, scrape) using Puppeteer. Pairs with Gemini Vision to interpret page state.
trigger: >
  Use this for scraping competitor websites, logging into marketing platforms,
  or automating form submissions.
---

# Goal
Perform manual-like interactions on dynamic websites autonomously.

# Instructions
1. **Identity Protection**: Rotate User-Agents and use non-linear mouse movements.
2. **Vision-First**: Use Gemini Vision to interpret the screenshot before making decisions on where to click.
3. **Data Extraction**: Save structured data (JSON) from scraped pages.

---
name: mcp-connector
description: Generic MCP (Model Context Protocol) bridge. Connects to external MCP servers like GitHub or CRM APIs.
trigger: >
  Use this to call tools from external MCP servers that are not natively
  integrated into this workspace.
---

# Goal
Expand the Hub's capabilities by bridging to the global MCP ecosystem.

# Instructions
1. **Secure Headers**: Retrieve auth tokens from Secret Manager or .env.
2. **Standard Routing**: Route tool calls via HTTPS POST.

---
name: crisis-detection
description: Screens incoming lead messages and journal entries for crisis keywords or legal risk.
trigger: >
  Use this to scan incoming lead descriptions or chat logs for urgent
  safety issues or high-priority legal red flags.
---

# Goal
Ensure user safety and provide immediate resources for urgent cases.

# Instructions
1. **Keyword Screening**: Check for safety-critical phrases (e.g., "hurt", "suicide", "hospital").
2. **Urgent Escalation**: Immediately flag leads that require a <4 hour response time.
3. **Resource Provision**: Suggest immediate hotlines or emergency contacts in the lead response.
