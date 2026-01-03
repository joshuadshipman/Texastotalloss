

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { YoutubeTranscript } from 'youtube-transcript';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';

// Remove top-level initialization to prevent build-time errors
// const supabase = createClient... 
// const genAI = ...

export async function POST(req: NextRequest) {
    try {
        // Initialize Clients at Runtime
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
        if (!supabaseUrl || !supabaseKey) {
            console.error("Missing Supabase Keys");
            return NextResponse.json({ error: 'Server Config Error: Missing Supabase Keys' }, { status: 500 });
        }
        const supabase = createClient(supabaseUrl, supabaseKey);

        const geminiKey = process.env.GEMINI_API_KEY || '';
        if (!geminiKey) {
            return NextResponse.json({ error: 'Server Config Error: Missing Gemini Key' }, { status: 500 });
        }
        const genAI = new GoogleGenerativeAI(geminiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        const body = await req.json();
        const { videoId } = body;

        if (!videoId) {
            return NextResponse.json({ error: 'Missing videoId' }, { status: 400 });
        }

        console.log(`🎥 [API] Fetching transcript for video: ${videoId}...`);

        // 1. Fetch Transcript
        let fullText = '';
        try {
            const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
            fullText = transcriptItems.map((item: any) => item.text).join(' ');
        } catch (err) {
            console.error('Transcript Fetch Error:', err);
            return NextResponse.json({ error: 'Failed to fetch transcript (Captions likely disabled)' }, { status: 400 });
        }

        if (!fullText) {
            return NextResponse.json({ error: 'No transcript text found' }, { status: 400 });
        }

        // 2. Generate Blog Post with Enhanced "NotebookLM-Style" Prompt
        const prompt = `
            You are an expert legal content strategist and AI researcher. 
            
            Input: YouTube Video Transcript (below).
            Goal: Create a "NotebookLM" style Deep Dive Report / Blog Post that is highly optimized for **GEO (Generative Engine Optimization)** and **SEO**.

            **Content Requirements:**
            1.  **Title:** High CTR, asking a specific legal question (e.g., "Texas Total Loss: Is the Insurance Company Lying about..."?)
            2.  **Summary/Key Takeaways:** Bullet points at the top (Google snippet friendly).
            3.  **Deep Dive Articles:** The main body should be authoritative, citing specific codes/laws if mentioned (e.g., Texas Insurance Code).
            4.  **GEO Structure:** Use Q&A format ("People Also Ask") for H2 headers to trigger AI overview answers.
            5.  **Short Video Scripts (Viral):**
                -   Create 3 distinct 15-30 second scripts for TikTok/Shorts based on this content. 
                -   Format: [Hook] -> [Value] -> [CTA].
            6.  **Twitter/X Thread:**
                -   Write a 5-tweet thread summarizing the article.
                -   Tweet 1 must hook the reader. 
                -   Tweet 5 must include a CTA.

            **Output Format:** 
            Return a single Markdown document. 
            -   Separate the Blog Article from the Video Scripts with: <!-- SEPARATOR: VIDEOS -->
            -   Separate the Video Scripts from the Tweets with: <!-- SEPARATOR: TWEETS -->
            -   Use these EXACT delimiter strings.

            Transcript:
            "${fullText.substring(0, 25000)}" 
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const blogPost = response.text();

        // 3. Save to Supabase (Draft)
        const slug = `blog-${videoId}-${Math.floor(Math.random() * 1000)}`;

        const { data, error } = await supabase
            .from('posts')
            .insert([
                {
                    title: `Draft for Video ${videoId}`,
                    slug: slug,
                    content: blogPost,
                    status: 'draft',
                    source_video_id: videoId
                }
            ])
            .select();

        if (error) {
            console.error('Supabase Error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, post: data[0] });

    } catch (error: any) {
        console.error('Generate Blog Error:', error);
        return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
    }
}
