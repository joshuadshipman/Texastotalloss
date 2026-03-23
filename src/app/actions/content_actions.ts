'use server';

import { adminDb } from '@/lib/firebaseAdmin';
import { analyzeHeadlines, generateFullBlogPost } from '../../lib/gemini';
import { ContentConcept, BlogPost, NewsItem, ScrapedHeadline } from '../../lib/models/types';
import { fetchTrendingNews } from '../../lib/news_scanner';
import { scrapeCompetitorHeadlines } from '../../lib/scraper';

export async function triggerContentScout() {
    try {
        console.log("Scout: Starting scrape...");
        const headlines = await scrapeCompetitorHeadlines();
        console.log(`Scout: Found ${headlines.length} headlines.`);

        if (headlines.length === 0) {
            return { success: false, message: "No headlines found." };
        }

        console.log("Analyst: Analyzing with Gemini...");
        const concept = await analyzeHeadlines(headlines);

        if (!concept) {
            return { success: false, message: "Gemini analysis failed to produce a concept." };
        }

        console.log("Creator: Generating Content Draft...");
        const content = await generateFullBlogPost(concept);

        if (!content) {
            return { success: false, message: "Failed to generate blog content." };
        }

        console.log("Database: Saving Draft...");
        await adminDb.collection('content_drafts').add({
            status: 'draft',
            concept: concept,
            generated_content: content,
            source_url: 'Competitor Scan',
            created_at: new Date().toISOString()
        });

        if (!adminDb) {
            return { success: false, message: "Database connection failed." };
        }

        return { success: true, message: "New Content Concept Generated & Saved!" };

    } catch (e) {
        console.error("Scout Error:", e);
        return { success: false, message: "Server error during execution." };
    }
}

export async function getDrafts() {
    const snapshot = await adminDb.collection('content_drafts')
        .orderBy('created_at', 'desc')
        .get();

    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function publishDraft(id: string) {
    // 1. Get draft
    const draftDoc = await adminDb.collection('content_drafts').doc(id).get();
    if (!draftDoc.exists) return { success: false, message: "Draft not found" };
    const draft = draftDoc.data();
    if (!draft) return { success: false, message: "Draft content missing" };

    const content = draft.generated_content;

    // 2. Publish to content_library
    try {
        await adminDb.collection('content_library').add({
            title: content.title,
            category: 'auto_accident', // Default, could be dynamic
            video_url: '', // Video prompt is in concept, but no actual video yet
            description: content.excerpt,
            transcript: JSON.stringify(content.content), // Storing full HTML in transcript field for now, or need check schema
            is_trending: false,
            published_at: new Date().toISOString()
        });
    } catch (pubError) {
        console.error(pubError);
        return { success: false, message: "Failed to publish to library" };
    }

    // 3. Update status
    await adminDb.collection('content_drafts').doc(id).update({ status: 'published' });

    return { success: true, message: "Published successfully" };
}

// --- New Server Action Wrappers for UI ---

export async function scrapeCompetitorHeadlinesAction(): Promise<ScrapedHeadline[]> {
    return await scrapeCompetitorHeadlines();
}

export async function fetchTrendingNewsAction(): Promise<NewsItem[]> {
    return await fetchTrendingNews();
}

export async function analyzeHeadlinesAction(headlines: ScrapedHeadline[], news: NewsItem[] = []): Promise<ContentConcept | null> {
    return await analyzeHeadlines(headlines, news);
}

export async function generateFullBlogPostAction(concept: ContentConcept): Promise<BlogPost | null> {
    return await generateFullBlogPost(concept);
}
