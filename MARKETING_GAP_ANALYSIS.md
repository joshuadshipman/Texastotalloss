# Gap Analysis: Current Tech Stack vs. Marketing Strategy

You provided a detailed **Organic Ranking Dominance** strategy. Here is exactly where our current codebase stands and what is missing (Pending) to achieve the 2026 goals.

## 1. Local SEO Dominance (Highest ROI)
**Strategy Goal**: Top 3 Local Pack positions.
*   ✅ **Built**: 
    *   **City-Specific Landing Pages**: `src/data/cities.ts` has the structure for Dallas, Houston, Austin, etc. The `medicalResources` update we just did supports this.
*   ❌ **Pending / Missing**:
    *   **Google Business Profile (GBP) Automation**: We have *zero* integration with the GBP API. We cannot auto-post to Google Maps yet.
    *   **Review Generation System**: We have a "Contact" form, but no automated "Review Request" email/SMS flow after a case is closed.
    *   **Local Directories**: Codebase cannot help here; this is manual operational work (registering with Justia, BBB).

## 2. AI Overview Optimization (Next-Gen Advantage)
**Strategy Goal**: Featured in ChatGPT/Perplexity/Google AI answers.
*   ✅ **Built**:
    *   **Structured Q&A**: We added the "Top 50 Claims Questions" page (`claims-questions/page.tsx`). This is perfect for AI ingestion.
*   ❌ **Pending / Missing**:
    *   **Legal Schema Markup**: We have basic `FAQPage` schema, but we lack specific `LegalService` and `Attorney` schema on the city pages to explicitly tell AI "We are a Law Firm in Dallas".
    *   **Citation-Ready Snippets**: Our blog posts effectively do this, but we need to ensure the *HTML structure* uses specific semantic tags (`<summary>`, `<details>`) that AI parsers love.

## 3. Topical Authority Building
**Strategy Goal**: Cover all "Total Loss" niche topics.
*   ✅ **Built**:
    *   **Automated Content Pipeline**: The new `gemini.ts` + `news_scanner.ts` covers the "Content Generation" part perfectly. It targets "high-intent keywords" via the "Insider Analyst" persona.
*   ❌ **Pending / Missing**:
    *   **Content Gap Analysis Engine**: We scan headlines, but we don't mathematically compare "Our Keywords" vs "Competitor Keywords" (Ahrefs/SEMrush API). We are currently guessing gaps based on headlines.

## 4. Backlink Strategy
**Strategy Goal**: Links from hospitals, mechanics, etc.
*   ⚠️ **Partially Built**:
    *   We added the *data* for hospitals/mechanics in `cities.ts`.
*   ❌ **Pending / Missing**:
    *   **Outreach Automation**: There is no system to email these hospitals saying "Hey, we listed you as a resource, can you link back?". This is a huge missing piece for "Organic Authority".

---

## 🛠️ Technical Roadmap to Close Gaps

### Immediate Actions (Next 2-3 Days)
1.  **Add Legal Schema**: Update `CityPage` component to generate rich JSON-LD `LegalService` schema dynamically for every city. **(High Impact for AI Overviews)**
2.  **GBP API Connector**: Build `src/lib/google_business.ts` to allow the Content Engine to push a "Post" to Google Maps every time a blog is published.
3.  **Review Request Drip**: Create a "Post-Case" email template that asks for a Google Review.

### Strategic Infrastructure (Weeks 2-4)
1.  **Resource Outreach Script**: A script that takes the `medicalResources` from `cities.ts` and generates outreach emails to those businesses.
