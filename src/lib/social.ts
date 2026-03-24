import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Social Media Content Pipeline - V2 (Broad Texas Rights)
 * 
 * Generates platform-specific content covering the full lifecycle
 * of a Texas insurance claim (Diminished Value, Appraisal Clause, LOPs, VSF).
 */

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export interface SocialDraft {
  platform: 'twitter' | 'youtube' | 'tiktok';
  content: string; 
  headline?: string;
  hashtags: string[];
}

/**
 * Generates a Twitter thread covering specific Texas legal hooks
 */
export async function generateTwitterRightsAlert(topic: string, statute?: string): Promise<SocialDraft> {
  const prompt = `
    Create a Twitter (X) thread (3-4 tweets) for "Texas Total Loss".
    Topic: ${topic} (Focus on broad Texas Insurance Rights - e.g. Diminished Value, Appraisal Clause, or Liability).
    ${statute ? `Must cite: ${statute}` : ''}
    
    Tone: Aggressive Advocate but Empathetic. 
    Constraint: First tweet must be a hook. Use emojis.
    Max 280 chars per tweet.
  `;

  const result = await model.generateContent(prompt);
  return {
    platform: 'twitter',
    content: result.response.text(),
    hashtags: ['#TexasTotalLoss', '#InsuranceRights', '#TexasLaw', '#PersonalInjury']
  };
}

/**
 * Generates a 60-second script for high-energy education
 */
export async function generateShortsScript(topic: string): Promise<SocialDraft> {
  const prompt = `
    Create a 60-second YouTube Shorts script for "Texas Total Loss".
    Topic: ${topic} (Broader than just VSF - cover Appraisal Clause, 542.003, or 'The Total Loss Math').
    Structure:
    0-5s: THE HOOK (Why they are losing thousands)
    5-45s: THE REVEAL/RIGHTS (Cite specific Texas Code or Insurance Industry Secrets)
    45-60s: CALL TO ACTION (Check out our free valuation tools)
    
    Tone: High Energy, Fast-paced.
  `;

  const result = await model.generateContent(prompt);
  return {
    platform: 'youtube',
    content: result.response.text(),
    headline: `Texas Rights: ${topic}`,
    hashtags: ['#Shorts', '#TexasTotalLoss', '#InsuranceHacks', '#LegalRights']
  };
}
