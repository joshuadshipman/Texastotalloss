import { GoogleGenerativeAI } from '@google/generative-ai';
import { BlogPost } from './gemini';

// This module handles the "Defense" - keeping content in the Top 3
// It requires a future connection to Google Search Console (GSC) API

interface PagePerformance {
    slug: string;
    targetKeyword: string;
    currentPosition: number; // e.g., 5.4
    ctr: number; // e.g., 1.2%
    impressions: number;
}

interface OptimizationResult {
    originalSlug: string;
    suggestedTitle: string;
    addedSection: string; // New content to add
    seoImprovementNote: string;
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export async function reOptimizePost(
    post: BlogPost,
    performance: PagePerformance,
    topCompetitorContent: string
): Promise<OptimizationResult | null> {

    // Config: Only touch pages that are "Striking Distance" (Rank 4-20)
    // If we are #1-3, don't mess with it!
    if (performance.currentPosition < 3.5) {
        console.log(`Skipping ${post.slug}: Already dominating at position ${performance.currentPosition}`);
        return null;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    Act as an SEO Repair Surgeon.
    My article "${post.title}" is currently ranking #${performance.currentPosition} for keyword "${performance.targetKeyword}".
    I want to break into the Top 3.
    
    Here is my current content Summary: ${post.excerpt}
    
    Here is the content ranking #1 (The Competitor):
    "${topCompetitorContent.substring(0, 500)}..."

    DIAGNOSIS TASK:
    1. Why is the competitor ranking higher? (Missing depth? Better Title? More Entities?)
    2. Generate a SPECIFIC improvement.

    Return JSON:
    {
        "originalSlug": "${post.slug}",
        "suggestedTitle": "A click-worthier title if CTE is low",
        "addedSection": "A purely additive HTML section (<h2...>...</h2>) that covers a 'Content Gap' the competitor has but I don't.",
        "seoImprovementNote": "Explanation of why this fix will boost rank."
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned) as OptimizationResult;
    } catch (e) {
        console.error("Optimization failed", e);
        return null;
    }
}

// Stub for the Cron Job to call later
export async function runDailyRankCheck() {
    // 1. Fetch GSC Data (Mocked for now)
    const mockPerformance: PagePerformance[] = [
        { slug: 'texas-ice-accidents', targetKeyword: 'ice accident lawyer texas', currentPosition: 8.2, ctr: 0.5, impressions: 500 }
    ];

    // 2. Loop through underperformers
    // 3. Call reOptimizePost()
    // 4. Update Supabase with new content
    console.log("Would run GSC check here...");
}
