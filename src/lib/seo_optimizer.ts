import { GoogleGenerativeAI } from '@google/generative-ai';
import { BlogPost } from './gemini';
import { getPagePerformance, getStrikingDistancePages } from './gsc';

/**
 * SEO Optimizer - The "Self-Healing" Loop
 * 
 * This module monitors page rankings via GSC and automatically
 * identifies content gaps to reclaim Top 3 positions.
 */

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
    if (performance.currentPosition < 3.5) {
        console.log(`Skipping ${post.slug}: Already dominating at position ${performance.currentPosition}`);
        return null;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    Act as an SEO Repair Surgeon.
    My article "${post.title}" is currently ranking #${performance.currentPosition} for keyword "${performance.targetKeyword}".
    I want to break into the Top 3.
    
    Current Content Summary: ${post.excerpt}
    
    Competitor #1 Content:
    "${topCompetitorContent.substring(0, 500)}..."

    DIAGNOSIS TASK:
    1. Why is the competitor ranking higher?
    2. Generate a SPECIFIC additive improvement.

    Return JSON:
    {
        "originalSlug": "${post.slug}",
        "suggestedTitle": "New Title",
        "addedSection": "HTML Section content",
        "seoImprovementNote": "Strategy explanation"
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

/**
 * The "Self-Healing" Loop
 * Triggered by cron job to fetch rankings and re-optimize.
 */
export async function runDailyRankCheck() {
    console.log("Starting Daily GSC Rank Check...");
    
    // 1. Fetch Real GSC Data
    const performanceRows = await getPagePerformance();
    const targets = getStrikingDistancePages(performanceRows);
    
    console.log(`Found ${targets.length} pages in Striking Distance.`);

    // 2. Process targets
    for (const row of targets.slice(0, 5)) {
        const pageUrl = row.keys[0];
        console.log(`Analyzing ${pageUrl} (Pos: ${row.position}) targeting queries like: ${row.keys[1]}`);
        
        // This would fetch the post from DB and run re-optimization logic
    }
}
