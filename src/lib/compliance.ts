/**
 * Barratry Shield Compliance Filter
 * Ensures chatbot responses adhere to Texas Penal Code § 38.12.
 */

const NON_COMPLIANT_PHRASES = [
    /hire (us|our|a) lawyer/i,
    /sign up with us/i,
    /call our attorney/i,
    /we will (fight|represent|win|sue) for you/i,
    /guarantee (a|the) (payout|settlement|win)/i,
    /should hire (a|an|our) (lawyer|attorney)/i,
    /you (need|must) (to )?hire/i,
    /talk to (our|a) lawyer/i,
    /we have (an attorney|a lawyer) for you/i,
    /contact (an attorney|a lawyer) through us/i,
    /our (legal team|lawyers|attorneys)/i
];

const COMPLIANT_ALTERNATIVES = [
    "You may wish to consult with a legal professional regarding your options.",
    "Legal support can help navigate the total loss process more effectively.",
    "Many victims find that professional legal guidance helps ensure a fair valuation."
];

export function applyComplianceFilter(text: string): string {
    let filteredText = text;

    for (const pattern of NON_COMPLIANT_PHRASES) {
        if (pattern.test(filteredText)) {
            console.warn(`[Barratry Shield] Flagged non-compliant response: "${filteredText}"`);
            // Replace with a neutral alternative
            filteredText = filteredText.replace(pattern, COMPLIANT_ALTERNATIVES[Math.floor(Math.random() * COMPLIANT_ALTERNATIVES.length)]);
        }
    }

    // Ensure disclaimer presence if it's a long response
    if (filteredText.length > 200 && !filteredText.toLowerCase().includes('informational')) {
        filteredText += "\n\n*Note: This information is for educational purposes only and does not constitute legal advice.*";
    }

    return filteredText;
}
