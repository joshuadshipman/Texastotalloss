
import { YoutubeTranscript } from 'youtube-transcript';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

async function generateBlogPost(videoId, targetKeyword) {
    if (!process.env.GEMINI_API_KEY) {
        console.error('❌ Missing GEMINI_API_KEY. Please add it to .env.local');
        return;
    }

    console.log(`🎥 Fetching transcript for video: ${videoId}...`);

    try {
        // 1. Fetch Transcript
        const transcriptItems = await YoutubeTranscript.fetchTranscript(videoId);
        const fullText = transcriptItems.map(item => item.text).join(' ');

        console.log(`✅ Transcript fetched (${fullText.length} chars). Generating blog post...`);

        // 2. Generate Blog Post with Gemini
        const prompt = `
            You are an expert legal content writer for a Texas personal injury law firm.
            
            Task: Write a comprehensive, SEO-optimized blog post based on the following YouTube video transcript.
            
            Target Keyword: "${targetKeyword}"
            
            Requirements:
            - Title: Catchy and SEO-friendly.
            - Tone: Professional, authoritative, yet accessible.
            - Structure: Use H2 and H3 headers to break up text.
            - Call to Action: End with a strong CTA to contact our firm for a free consultation.
            - Format: Return ONLY valid Markdown.

            Transcript:
            "${fullText.substring(0, 20000)}" 
        `;


        const result = await model.generateContent(prompt);
        const response = await result.response;
        const blogPost = response.text();

        console.log('✅ Blog post generated!');

        // 3. Save to Supabase
        const slug = targetKeyword.toLowerCase().replace(/ /g, '-') + '-' + Math.floor(Math.random() * 1000);
        const { data, error } = await supabase
            .from('posts')
            .insert([
                {
                    title: `Blog Post: ${targetKeyword}`,
                    slug: slug,
                    content: blogPost,
                    status: 'draft',
                    source_video_id: videoId
                }
            ])
            .select();

        if (error) {
            console.error('❌ Supabase Upload Error:', error);
        } else {
            console.log('✅ Saved to Supabase Drafts:', data[0].title);
            console.log(`\n--- BLOG POST PREVIEW ---\n`);
            console.log(blogPost.substring(0, 200) + '...\n');
            console.log(`-------------------------\n`);
        }

        return blogPost;

    } catch (error) {
        console.error('❌ Error generating blog post:', error);
    }
}

// Run immediately
const args = process.argv.slice(2);
if (args.length > 0) {
    generateBlogPost(args[0], "Car Accident Claims Texas");
} else {
    console.log("Usage: node scripts/generate-blog.js <YOUTUBE_VIDEO_ID>");
}
