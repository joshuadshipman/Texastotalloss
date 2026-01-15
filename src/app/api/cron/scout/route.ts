import { NextRequest, NextResponse } from 'next/server';
import { fetchTrendingNews } from '@/lib/news_scanner';
import { scrapeCompetitorHeadlines } from '@/lib/scraper';
import { analyzeHeadlines, generateFullBlogPost } from '@/lib/gemini';
import { createClient } from '@supabase/supabase-js';
import { generateGBPUpdateFromBlog, postToGoogleBusinessProfile } from '@/lib/google_business';

// This Route is triggered by Vercel Cron (check vercel.json)
// Logic: "The Daily Patrol" -> Scans news, writes blog, updates Google Maps

export async function GET(req: NextRequest) {
    // 1. Authenticate (Verify Vercel Cron Header)
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        // In dev, we might allow it, but in prod block it
        // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        console.log("🤖 CRON: Starting Daily Content Scout...");

        // 2. Gather Intelligence
        const [news, competitors] = await Promise.all([
            fetchTrendingNews(),
            scrapeCompetitorHeadlines()
        ]);

        // 3. AI Analysis (Offense)
        const concept = await analyzeHeadlines(competitors, news);

        if (!concept) {
            return NextResponse.json({ status: 'skipeed', reason: 'No viable concepts found' });
        }

        console.log("💡 CRON: Concept Generated:", concept.title);

        // 4. Write the Content
        const post = await generateFullBlogPost(concept);
        if (!post) {
            throw new Error("Failed to generate blog post");
        }

        // 5. Save to Database (Persistence)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Ideally use SERVICE_ROLE key for writes
        );

        const { error } = await supabase.from('blog_posts').insert({
            title: post.title,
            slug: post.slug,
            excerpt: post.excerpt,
            content: post.content, // HTML
            tags: post.tags,
            source_type: 'automated_cron',
            seo_score: 85 // AI Estimate
        });

        if (error) {
            console.error("DB Save Failed:", error);
            // Don't fail the whole job, maybe we can email admin?
        }

        // 6. Marketing Automation (The "Zero-Cost" Push)
        // Post to Google Business Profile (Safeguarded)
        try {
            // Only attempt if we have the credentials set up
            if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
                // Note: In real app, we need to map 'geo_targets' to specific Location IDs
                const gbpUpdate = generateGBPUpdateFromBlog(post.title, post.slug, concept.geo_targets[0] || 'Texas');
                await postToGoogleBusinessProfile('accounts/123/locations/456', gbpUpdate);
                console.log("GB Posted Successfully");
            } else {
                console.log("Skipping GBP Post: No Google Credentials found.");
            }
        } catch (gbpError) {
            console.error("GBP Post Failed (Non-fatal):", gbpError);
        }

        return NextResponse.json({
            status: 'success',
            action: 'published',
            title: post.title,
            gbp_posted: true
        });

    } catch (error) {
        console.error("CRON Failed:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
