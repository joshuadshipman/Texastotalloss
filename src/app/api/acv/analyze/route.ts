/**
 * POST /api/acv/analyze — ACV Photo Analyzer (Gemini Vision)
 * 
 * Accepts photo uploads of damaged vehicles for preliminary ACV estimation.
 * Uses Gemini Vision to:
 * - Identify vehicle make/model/year from photos
 * - Estimate damage severity
 * - Cross-reference with NADA/KBB value ranges
 * - Generate a preliminary ACV range for the customer
 */

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const photos = formData.getAll("photos") as File[];
    const vin = formData.get("vin") as string | null;
    const year = formData.get("year") as string | null;
    const make = formData.get("make") as string | null;
    const model = formData.get("model") as string | null;
    const mileage = formData.get("mileage") as string | null;
    const injured = formData.get("injured") === "true";
    const policeReport = formData.get("policeReport") as File | null;

    if (photos.length === 0 && !vin && !year) {
      return NextResponse.json(
        { error: "Please provide at least one photo or vehicle details (VIN, year/make/model)." },
        { status: 400 }
      );
    }

    // Convert photos and police report to base64 for Gemini Vision
    const fileContents = await Promise.all(
      photos.slice(0, 5).map(async (file) => {
        const buffer = Buffer.from(await file.arrayBuffer());
        return {
          inlineData: {
            mimeType: file.type || "image/jpeg",
            data: buffer.toString("base64"),
          },
        };
      })
    );

    if (policeReport) {
      const buffer = Buffer.from(await policeReport.arrayBuffer());
      fileContents.push({
        inlineData: {
          mimeType: policeReport.type || "application/pdf",
          data: buffer.toString("base64"),
        },
      });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Vision API not configured" }, { status: 500 });
    }

    // Build analysis prompt
    const vehicleInfo = [year, make, model].filter(Boolean).join(" ");
    const prompt = `You are an expert automotive damage appraiser and vehicle valuation specialist for the Texas market.

Analyze the provided vehicle photo(s) and determine:

1. **Vehicle Identification**: Year, Make, Model, Trim (if identifiable from photos)
${vin ? `   VIN: ${vin}` : ""}
${vehicleInfo ? `   Owner-reported: ${vehicleInfo}` : ""}
${mileage ? `   Reported mileage: ${mileage}` : ""}
${injured ? `   NOTE: Owner reported an INJURY in this accident. Strongly recommend personal injury counsel.` : ""}
${policeReport ? `   A police report document was provided. Please parse it for fault, citations, and accident circumstances if legible.` : ""}

2. **Damage Assessment**: 
   - Severity: Minor / Moderate / Severe / Total Loss
   - Areas affected (front, rear, driver side, passenger side, roof, undercarriage)
   - Estimated repair cost range (if repairable)

3. **ACV Estimate**:
   - Pre-accident fair market value range (low / mid / high) for Texas market
   - Factors considered (mileage adjustment, condition, local market)
   - Whether this is likely a total loss (repair cost > value)

4. **Recommendation**:
   - Should the owner dispute the insurance offer?
   - Key negotiation points
   - Whether this case involves potential personal injury (visible airbag deployment, intrusion, etc.)

Respond in this exact JSON format:
{
  "vehicle": { "year": "", "make": "", "model": "", "trim": "", "confidence": "" },
  "damage": { "severity": "", "areas": [], "estimatedRepairCost": { "low": 0, "high": 0 }, "isTotalLoss": false },
  "acv": { "low": 0, "mid": 0, "high": 0, "factors": [] },
  "recommendation": { "shouldDispute": false, "negotiationPoints": [], "possibleInjuryCase": false, "injuryIndicators": [] }
}`;

    // Call Gemini Vision API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                ...fileContents,
              ],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      const err = await geminiResponse.text();
      console.error("[ACV Analyzer] Gemini API error:", err);
      return NextResponse.json({ error: "Vision analysis failed. Please try again." }, { status: 502 });
    }

    const geminiData = await geminiResponse.json();
    const analysisText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!analysisText) {
      return NextResponse.json({ error: "Could not analyze the provided images." }, { status: 422 });
    }

    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch {
      // If Gemini returns non-JSON, wrap it
      analysis = { raw: analysisText, parseError: true };
    }

    return NextResponse.json({
      success: true,
      analysis,
      photosProcessed: photos.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    console.error("[ACV Analyzer]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
