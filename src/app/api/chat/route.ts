/**
 * POST /api/chat — TTL AI Chat Assistant
 * 
 * Gemini-powered conversational assistant that:
 * - Answers total loss questions (ACV, GAP, salvage, timeline)
 * - Detects injury mentions → routes to PI intake
 * - Detects ACV/valuation mentions → routes to quiz
 * - Provides helpful, empathetic guidance to consumers in crisis
 */

import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are the Texas Total Loss AI Assistant — a friendly, knowledgeable guide helping Texans navigate vehicle total loss claims and car accident injuries.

YOUR PERSONALITY:
- Empathetic and calm (users are often in crisis after an accident)
- Direct and actionable (no fluff — give real advice)
- Professional but warm (like a trusted advisor, not a lawyer)

YOUR KNOWLEDGE AREAS:
1. Total Loss Process: ACV disputes, GAP insurance, salvage/Copart, settlement timelines, diminished value, rental car rights
2. Personal Injury: When to pursue a PI claim, statute of limitations, ER visits
3. Insurance: Adjuster tactics, Texas Insurance Code deadlines

ROUTING RULES (Include these EXACT markdown links when appropriate):
- If the user mentions INJURIES, pain, ER, hospital, or medical treatment → respond with advice AND suggest: "You may have a personal injury case. [Start a free case evaluation](/intake) to see if you qualify — it takes under 5 minutes and there's no obligation."
- If the user mentions vehicle VALUE, ACV, insurance offer, or lowball → respond with advice AND suggest: "Upload photos of your vehicle for an [instant AI valuation](/quiz) to see what it's really worth."

MISSING INFO PROTOCOL (Crucial):
If the user has not completed our intake or ACV quiz, you must gently collect the following information from them naturally in conversation:
1. "Do you have any photos of the vehicle damage?"
2. "Was a police report filed for the accident?"
3. "Has anyone received medical treatment since the crash?"
4. What are the Year/Make/Model of the vehicle?
If they have this info, direct them to upload it at [the ACV Quiz](/quiz) or [the PI Intake](/intake).

RULES:
- Never provide specific legal advice (say "consult with an attorney" for legal questions)
- Always be honest about limitations
- Keep responses under 200 words unless the user asks for details
- Format responses in markdown for readability`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "Messages array required" }, { status: 400 });
    }

    const apiKey =
      process.env.GOOGLE_AI_API_KEY ||
      process.env.GEMINI_API_KEY ||
      process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      // Graceful fallback — never show a raw error to users
      return NextResponse.json({
        reply:
          "I'm having trouble connecting right now. For immediate help with your claim, please [complete our free evaluation](/quiz) or call us directly. We're here to help.",
      });
    }

    // Convert chat messages to Gemini format
    const geminiMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    }));

    geminiMessages.unshift({
      role: "user",
      parts: [{ text: "SYSTEM INSTRUCTIONS (FOLLOW THESE STRICTLY): " + SYSTEM_PROMPT }]
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: geminiMessages,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          },
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("[Chat API] Gemini error:", err);
      return NextResponse.json({ error: "Chat service unavailable", details: err }, { status: 502 });
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return NextResponse.json({ error: "No response generated" }, { status: 422 });
    }

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Chat failed";
    console.error("[Chat API]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
