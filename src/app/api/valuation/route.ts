import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { year, make, model, trim, features, vin } = body;

        // Basic validation
        if (!year || !make || !model) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const serpApiKey = process.env.SERPAPI_KEY;

        // --- FALLBACK LOGIC (If no Key) ---
        if (!serpApiKey) {
            console.warn("No SERPAPI_KEY found. Using mock fallback.");
            return NextResponse.json(calculateMockValuation(year, make, model, trim));
        }

        // --- REAL SERPAPI LOGIC ---
        // Construct a specific query for "Used [Year] [Make] [Model] [Trim] price"
        const query = `Used ${year} ${make} ${model} ${trim !== 'base' ? trim : ''} price`;

        const params = new URLSearchParams({
            engine: "google_shopping",
            q: query,
            api_key: serpApiKey,
            num: "20", // Get top 20 results
            google_domain: "google.com",
            hl: "en",
            gl: "us",
        });

        const response = await fetch(`https://serpapi.com/search.json?${params}`);
        const data = await response.json();

        if (!data.shopping_results && !data.organic_results) {
            console.log("No SerpApi results found, using fallback.");
            return NextResponse.json(calculateMockValuation(year, make, model, trim));
        }

        // Extract prices
        let prices: number[] = [];

        // 1. Try Shopping Results first (Most accurate)
        if (data.shopping_results) {
            data.shopping_results.forEach((item: any) => {
                if (item.price) {
                    // Price format might be "$25,000" or "$25000.00"
                    const cleanPrice = parseFloat(item.price.toString().replace(/[^0-9.]/g, ''));
                    if (!isNaN(cleanPrice) && cleanPrice > 2000) { // Filter out accessories/parts < $2000
                        prices.push(cleanPrice);
                    }
                }
            });
        }

        // 2. Fallback to Organic Results text snippets if Shopping is empty
        if (prices.length < 3 && data.organic_results) {
            // Logic to regex extract prices from titles/snippets would go here
            // Simplified for now: just stick to shopping results or default
        }

        // 3. Calculate Stats
        if (prices.length > 0) {
            // Remove outliers (simple method: sort and remove top/bottom 10%)
            prices.sort((a, b) => a - b);
            if (prices.length > 5) {
                const removeCount = Math.floor(prices.length * 0.1);
                prices = prices.slice(removeCount, prices.length - removeCount);
            }

            const sum = prices.reduce((a, b) => a + b, 0);
            const avg = sum / prices.length;

            return NextResponse.json({
                min: Math.floor(avg * 0.95), // +/- 5% range
                max: Math.ceil(avg * 1.05),
                source: 'market_data',
                count: prices.length,
                query: query
            });
        } else {
            // Fallback if no prices parsed
            return NextResponse.json(calculateMockValuation(year, make, model, trim));
        }

    } catch (error) {
        console.error("Valuation API Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// Helper: The Mock Logic (Moved from frontend to backend for consistency)
function calculateMockValuation(year: string, make: string, model: string, trim: string) {
    const baseValue = 24000;
    let multiplier = 1.0;

    const t = trim.toLowerCase();
    if (t.includes('limited') || t.includes('platinum')) multiplier = 1.25;
    else if (t.includes('sport') || t.includes('gt')) multiplier = 1.15;
    else if (t.includes('xle') || t.includes('ex')) multiplier = 1.12;

    // Age depreciation mock
    const age = new Date().getFullYear() - parseInt(year);
    const ageFactor = Math.max(0.5, 1 - (age * 0.05)); // -5% per year approx

    const estimated = baseValue * multiplier * ageFactor;

    return {
        min: Math.floor(estimated * 0.9),
        max: Math.floor(estimated * 1.1),
        source: 'estimated_logic'
    };
}
