import { GoogleGenerativeAI } from '@google/generative-ai';
import { ScrapedHeadline } from './scraper';

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

export async function analyzeHeadlines(headlines: ScrapedHeadline[]): Promise<ContentConcept | null> {
    if (!headlines || headlines.length === 0) return null;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const headlineText = headlines.map(h => `- ${h.title} (Source: ${h.source})`).join('\n');

    const prompt = `
    Act as an empathetic content strategist for a Personal Injury Law Firm in Texas.
    Analyze the following recent blog headlines from competitors:
    
    ${headlineText}
    
    Your Goal: Identify a common, trending, or high-value topic that focuses on the VICTIM'S struggle (not just legal news).
    Create a content concept for a new blog post and video.
    
    Return the response in strictly valid JSON format with the following keys:
    {
      "theme": "The core topic (e.g., Winter Ice Accidents)",
      "title": "A catchy, empathetic blog title for Texas victims",
      "hook": "A 1-sentence emotional hook addressing the victim's pain",
      "blog_outline": ["Section 1", "Section 2", "Section 3"],
      "video_prompt": "A detailed prompt I can paste into Google Vids to generate a 60s vertical video. Describe the visual style, tone, and script structure.",
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
