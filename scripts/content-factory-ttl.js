/**
 * TTL Content Factory Script
 * Generates SEO/GEO/AEO optimized articles for TexasTotalLoss.com
 * using Gemini 1.5 Pro. Focuses on the "Legal Authority Cluster".
 */
const fs = require('fs');
const path = require('path');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "YOUR_KEY";
const MODEL_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;

const outputDir = path.join(__dirname, 'output');
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// First 5 articles from the TTL_Topical_Authority_Cluster.md
const topics = [
    {
        title: "Texas Insurance Code § 542 Unfair Settlement Practices",
        focus: "What every total loss claimant must know about unfair delays and denial tactics."
    },
    {
        title: "TAC Rule 21.203 — Standard for Settlement",
        focus: "The 'Actual Cash Value' (ACV) mandate explained and how insurers try to bypass it."
    },
    {
        title: "The '80% Rule' Myth",
        focus: "How Texas law actually defines total loss thresholds and why the 80% rule is misunderstood."
    },
    {
        title: "Texas Department of Insurance (TDI) Complaint Guide",
        focus: "When and how to escalate your total loss claim to the state level."
    },
    {
        title: "Right to Appraisal vs. Litigation",
        focus: "Choosing the best path for your total loss dispute in Texas without hiring a lawyer prematurely."
    }
];

const personaPrompt = `
You are the Lead Legal Content Strategist for TexasTotalLoss.com.
Your goal is to write highly authoritative, SEO-optimized blog posts that rank #1 on Google for auto total loss queries in Texas.
You strictly adhere to Google's E-E-A-T guidelines (Experience, Expertise, Authoritativeness, Trustworthiness).

CRITICAL DIRECTIVES:
1. DO NOT predict legal outcomes (e.g., do not say "this will win your case" or "they will deny you"). Use "may", "can", or "could".
2. You MUST include at least one Semantic FAQ block at the bottom of the article. This should be formatted in pure HTML using <details> and <summary> tags for AEO/GEO snippets. Example:
   <details class="faq-item" id="faq-topic">
     <summary class="faq-question">Question here?</summary>
     <div class="faq-answer">Answer here. <figure class="citation-snippet"><blockquote cite="URL">"Exact statute quote"</blockquote><figcaption>— Source: TAC/TIC</figcaption></figure></div>
   </details>

Return the output as a valid JSON object with the following exact keys:
{
  "title": "SEO optimized H1 title",
  "slug": "url-friendly-slug-with-dashes",
  "excerpt": "A compelling 1-2 sentence meta description.",
  "content": "The full article body in HTML/Markdown mix, including the semantic FAQ structures.",
  "tags": ["Total Loss", "Texas Law", "Insurance Tactics"]
}
Ensure the JSON is perfectly valid and not wrapped in markdown code blocks if possible.
`;

async function generateArticle(topic) {
    console.log(`Generating article: ${topic.title}...`);
    try {
        const response = await fetch(MODEL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    role: "user",
                    parts: [{
                        text: `${personaPrompt}\n\nWrite the comprehensive Deep-Dive article for the following topic:\nTitle Focus: ${topic.title}\nStrategic Goal: ${topic.focus}`
                    }]
                }],
                generationConfig: {
                    response_mime_type: "application/json"
                }
            })
        });

        if (!response.ok) {
            console.error(`API Error for ${topic.title}: ${response.status} ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        const textOutput = data.candidates[0].content.parts[0].text;
        
        let articleJson;
        try {
            articleJson = JSON.parse(textOutput);
            articleJson.published_at = new Date().toISOString();
            articleJson.status = 'published';
        } catch (e) {
            console.error(`Failed to parse JSON for ${topic.title}. Raw output snippet: ${textOutput.substring(0,100)}...`);
            return null;
        }

        const filename = `${articleJson.slug}.json`;
        fs.writeFileSync(path.join(outputDir, filename), JSON.stringify(articleJson, null, 2));
        console.log(`✅ Saved ${filename}`);
        
    } catch (err) {
        console.error(`Error processing ${topic.title}:`, err);
    }
}

async function run() {
    console.log("Starting TTL Content Factory Pipeline...");
    for (const topic of topics) {
        await generateArticle(topic);
        // Sleep to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 5000));
    }
    console.log("🎉 Pipeline Complete! 5 legal articles generated in /output.");
}

run();
