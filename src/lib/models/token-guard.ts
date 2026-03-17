
export interface TokenEstimate {
    promptTokens: number;
    completionTokens: number;
    estimatedCost: number;
}

const COST_PER_1M_TOKENS = {
    FLASH: 0.075, // $0.075 per 1M tokens (estimate)
    PRO: 3.50     // $3.50 per 1M tokens (estimate)
};

export class TokenGuard {
    private static threshold = 5000; // Warning threshold for prompts

    static estimateTokens(text: string): number {
        // Rough estimate: 4 characters per token
        return Math.ceil(text.length / 4);
    }

    static checkUsage(prompt: string, model: string = 'flash'): boolean {
        const tokens = this.estimateTokens(prompt);
        const costPerMillion = model === 'pro' ? COST_PER_1M_TOKENS.PRO : COST_PER_1M_TOKENS.FLASH;
        const cost = (tokens / 1000000) * costPerMillion;

        console.log(`[TokenGuard] Estimate: ${tokens} tokens (~$${cost.toFixed(4)}) on ${model}`);

        if (tokens > this.threshold) {
            console.warn(`[TokenGuard] ADVANCE WARNING: High token usage detected (${tokens} tokens).`);
            if (model === 'pro') {
                const errorMsg = `[TokenGuard] 🛑 BLOCK: Burning Pro tokens on a large prompt (${tokens} tokens). Please simplify your request.`;
                console.error(errorMsg);
                throw new Error(errorMsg);
            }
            return false;
        }

        return true;
    }
}
