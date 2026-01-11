'use server';

import { supabaseClient } from '@/lib/supabaseClient';
import { scrapeCompetitorHeadlines } from '@/lib/scraper';
import { analyzeHeadlines, generateFullBlogPost, ContentConcept } from '@/lib/gemini';

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
        const { error } = await supabaseClient
            .from('content_drafts')
            .insert({
                status: 'draft',
                concept: concept,
                generated_content: content,
                source_url: 'Competitor Scan'
            });

        if (error) {
            console.error("DB Error:", error);
            return { success: false, message: "Database insertion failed." };
        }

        return { success: true, message: "New Content Concept Generated & Saved!" };

    } catch (e) {
        console.error("Scout Error:", e);
        return { success: false, message: "Server error during execution." };
    }
}

export async function getDrafts() {
    const { data, error } = await supabaseClient
        .from('content_drafts')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}

export async function publishDraft(id: string) {
    // 1. Get draft
    const { data: draft } = await supabaseClient.from('content_drafts').select('*').eq('id', id).single();
    if (!draft) return { success: false, message: "Draft not found" };

    const content = draft.generated_content;

    // 2. Publish to content_library
    const { error: pubError } = await supabaseClient
        .from('content_library')
        .insert({
            title: content.title,
            category: 'auto_accident', // Default, could be dynamic
            video_url: '', // Video prompt is in concept, but no actual video yet
            description: content.excerpt,
            transcript: JSON.stringify(content.content), // Storing full HTML in transcript field for now, or need check schema
            is_trending: false,
            published_at: new Date().toISOString()
        });

    if (pubError) {
        console.error(pubError);
        return { success: false, message: "Failed to pubish to library" };
    }

    // 3. Update status
    await supabaseClient.from('content_drafts').update({ status: 'published' }).eq('id', id);

    return { success: true, message: "Published successfully" };
}
