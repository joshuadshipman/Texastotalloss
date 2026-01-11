# Texas Total Loss - Future Roadmap & Improvements

This document outlines potential high-impact improvements for the Texas Total Loss Intake platform, focusing on automation, SEO dominance, and lead conversion.

## 🚀 Phase 1: content Engine Maturity
*   **Persistent Database for Blog Posts**:
    *   *Current State*: Blog posts are saved in a local file (`src/data/blog-posts.ts`).
    *   *Upgrade*: Connect `src/app/admin/content/page.tsx` to Supabase `blog_posts` table. This allows dynamic creating/editing/deleting without code deploys.
*   **AI Image Generation**:
    *   *Idea*: Auto-generate a featured image for every blog post using Gemini or DALL-E APIs based on the "Content Concept" description.
*   **Bilingual Content Auto-Pilot**:
    *   *Idea*: Update `gemini.ts` to generate the blog post in *both* English and Spanish automatically, populating `/es/blog` simultaneously.

## 📈 Phase 2: SEO & Local Domination
*   **Neighborhood Landing Pages**:
    *   *Idea*: Programmatically generate 100+ "micro-location" pages (e.g., `/dallas/deep-ellum-car-accident`) using the `cities.ts` sub-city data combined with the Content Engine templates.
*   **Schema Markup Expansion**:
    *   *Idea*: Add `Review` schema and `LegalService` schema dynamically to every city page to boost "stars" in Google results.

## 🤝 Phase 3: Lead Nurturing (CRM)
*   **Automated Email Drip Sequences**:
    *   *Idea*: When a lead is captured via the WhatsApp/Case Review modal, automatically trigger a SendGrid/Resend email sequence (Day 1: "What to expect", Day 3: "Don't sign yet", Day 7: "Check in").
*   **Admin Dashboard Upgrade**:
    *   *Idea*: Create a "Leads" tab in the Admin section to view/filter/export submissions from Supabase, rather than just receiving emails.

## 📱 Phase 4: Social Media Automation
*   **One-Click Social Posting**:
    *   *Idea*: Add a "Post to X/Facebook" button in the Admin Dashboard that takes the generated "Social Post" text from Gemini and pushes it to the official accounts (once created).

## 🛠️ Infrastructure
*   **Unit Testing**: Add Jest/React Testing Library tests for the Lead Capture forms to ensure reliability.
*   **Error Monitoring**: Integrate Sentry to track client-side errors (especially for the Content Engine).
