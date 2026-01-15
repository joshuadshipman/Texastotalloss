import { GoogleGenerativeAI } from '@google/generative-ai';
import { ScrapedHeadline } from './scraper';
import { NewsItem } from './news_scanner';

// Use the existing client-side key for now, or prefer a server-side key if available
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export interface ContentConcept {
    theme: string;
    title: string;
    hook: string;
    blog_outline: string[];
    video_prompt: string;
    geo_targets: string[]; // e.g., ["Plano", "Frisco"] for placeholder insertion
}

const PERSONAS = [
    "The Aggressive Advocate: Focus on fighting insurance companies and getting maximum payouts. Use strong, assertive language.",
    "The Empathetic Guide: Focus on the emotional toll of accidents. Use warm, reassuring, and clear language.",
    "The Insider Analyst: Focus on the technical details of total loss valuations and legal loopholes. Use data-driven and precise language.",
    "The Local Expert: Focus heavily on Texas-specific laws (Title 7), local roads (I-35, DNT), and community safety."
];

export async function analyzeHeadlines(headlines: ScrapedHeadline[], news: NewsItem[] = []): Promise<ContentConcept | null> {
    if ((!headlines || headlines.length === 0) && (!news || news.length === 0)) return null;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const headlineText = headlines.map(h => `- [Competitor] ${h.title} (Source: ${h.source})`).join('\n');
    const newsText = news.map(n => `- [Breaking News] ${n.title} - ${n.snippet.substring(0, 100)}...`).join('\n');

    // Rotate Persona
    const persona = PERSONAS[Math.floor(Math.random() * PERSONAS.length)];

    const prompt = `
    Act as an expert content strategist for a Personal Injury Law Firm in Texas.
    Adopt the following Persona strictly: **${persona}**

    Analyze the following recent inputs (Competitor Blogs + Breaking News):
    
    ${headlineText}
    ${newsText}
    
    Your Goal: Identify a common, trending, or high-value topic related STRICTLY to **Auto Accidents**, **Trucking Accidents**, or **Vehicle-Related Personal Injury**.
    
    Create a content concept for a new blog post and video that:
    1. Matches the assigned Persona's tone.
    2. Explicitly positions **Legal Support** as the solution.
    3. If 'Breaking News' is present, prioritize "Trend Jacking" that topic (e.g. if there's a pileup on I-35, write about multi-car liability).

    Return the response in strictly valid JSON format with the following keys:
    {
      "theme": "The core topic (e.g., Winter Ice Accidents, 18-Wheeler Negligence)",
      "title": "A catchy, SEO-optimized title matching the persona",
      "hook": "A 1-sentence hook addressing the victim's pain",
      "blog_outline": ["The Accident Context", "Why Handling it Alone Delays Payment", "How Legal Support Speeds Up Resolution"],
      "video_prompt": "A detailed prompt I can paste into Google Vids to generate a 60s vertical video. Script should push legal support as the key to efficiency.",
      "geo_targets": ["Dallas", "Fort Worth", "Plano"] 
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Clean markdown framing if present (Gemini sometimes adds \`\`\`json ...)
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        return JSON.parse(cleanedText) as ContentConcept;
    } catch (error) {
        console.error("Gemini Analysis Failed:", error);
        return null;
    }
}

export interface BlogPost {
    title: string;
    slug: string;
    excerpt: string;
    content: string; // HTML
    author: string;
    date: string;
    tags: string[];
    readTime: string;
}

export async function generateFullBlogPost(concept: ContentConcept): Promise<BlogPost | null> {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
    You are an expert legal copywriter for "Texas Total Loss". 
    Write a comprehensive, SEO-optimized blog post based on this concept:
    
    Title: ${concept.title}
    Theme: ${concept.theme}
    Outline: ${concept.blog_outline.join(', ')}
    Geo Targets: ${concept.geo_targets.join(', ')}

    Requirements:
    1. Output strictly valid JSON.
    2. "content" key must contain semantic HTML (<h3>, <p>, <ul>, <strong>) ready for rendering. NO <h1> or <html> tags.
    3. Tone: Empathetic, authoritative, helpful.
    4. Include specific references to Texas laws or general insurance practices where relevant.
    5. "slug" should be a url-friendly kebab-case string of the title.

    Response Format:
    {
        "title": "${concept.title}",
        "slug": "url-friendly-slug",
        "excerpt": "Compelling meta description/excerpt (160 chars)",
        "content": "<p>Opening paragraph...</p>...",
        "tags": ["Tag1", "Tag2"],
        "readTime": "5 min read"
    }
    `;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const data = JSON.parse(cleanedText);

        return {
            ...data,
            author: "Texas Total Loss Team",
            date: new Date().toISOString().split('T')[0]
        };
    } catch (e) {
        console.error("Failed to generate blog post", e);
        return null;
    }
}
