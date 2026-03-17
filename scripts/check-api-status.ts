
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

async function checkStatus() {
    console.log("--- API Quota & Status Report ---\n");

    const keys = {
        ANTHROPIC: process.env.CLAUDE_API_KEY,
        XAI: process.env.XAI_API_KEY,
        PERPLEXITY: process.env.PERPLEXITY_API_KEY,
        DEEPSEEK: process.env.DEEPSEEK_API_KEY,
        GEMINI: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
        GOOGLE_MAPS: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    };

    // 0. Google Maps Validation
    if (keys.GOOGLE_MAPS) {
        try {
            // Simple key validation via Distance Matrix (minimal request)
            await axios.get(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=Dallas,TX&destinations=Austin,TX&key=${keys.GOOGLE_MAPS}`);
            console.log(`[GOOGLE MAPS] Status: ACTIVE (Key verified)`);
        } catch (e: any) {
            console.log(`[GOOGLE MAPS] Status: ERROR - ${e.response?.data?.error_message || e.message}`);
        }
    } else {
        console.log("[GOOGLE MAPS] Key missing.");
    }

    // 1. DeepSeek Balance & Model Check
    if (keys.DEEPSEEK) {
        try {
            const res = await axios.get('https://api.deepseek.com/user/balance', {
                headers: { 'Authorization': `Bearer ${keys.DEEPSEEK}` }
            });
            const info = res.data.balance_infos[0];
            const balanceStr = info ? `${info.total_balance} ${info.currency}` : "Balance details unavailable";
            console.log(`[DEEPSEEK] Status: ACTIVE | Balance: ${balanceStr}`);
            
            // Minimal chat check for V3.2
            await axios.post('https://api.deepseek.com/chat/completions', {
                model: 'deepseek-chat',
                max_tokens: 1,
                messages: [{ role: 'user', content: 'hi' }]
            }, { headers: { 'Authorization': `Bearer ${keys.DEEPSEEK}` } });
            console.log(`[DEEPSEEK] Model Check (V3.2): VERIFIED`);
        } catch (e: any) {
            console.log(`[DEEPSEEK] Error: ${e.response?.data?.error?.message || e.message}`);
        }
    } else {
        console.log("[DEEPSEEK] Key missing.");
    }

    // 2. Others (Simple Validity Check as they lack quota APIs)
    const simpleCheck = async (name: string, url: string, data: any, headers: any) => {
        try {
            await axios.post(url, data, { headers });
            console.log(`[${name}] Status: ACTIVE (Verified via minimal request)`);
        } catch (e: any) {
            const msg = e.response?.data?.error?.message || e.response?.data?.message || e.message;
            console.log(`[${name}] Status: ERROR - ${msg}`);
        }
    };

    if (keys.ANTHROPIC) {
        await simpleCheck('ANTHROPIC', 'https://api.anthropic.com/v1/messages', {
            model: 'claude-3-haiku-20240307',
            max_tokens: 1,
            messages: [{ role: 'user', content: 'hi' }]
        }, { 
            'x-api-key': keys.ANTHROPIC, 
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
        });
    }

    if (keys.XAI) {
        await simpleCheck('XAI', 'https://api.x.ai/v1/chat/completions', {
            model: 'grok-2-1212',
            max_tokens: 1,
            messages: [{ role: 'user', content: 'hi' }]
        }, { 'Authorization': `Bearer ${keys.XAI}` });
    }

    if (keys.PERPLEXITY) {
        await simpleCheck('PERPLEXITY', 'https://api.perplexity.ai/chat/completions', {
            model: 'llama-3.1-sonar-small-128k-online',
            max_tokens: 1,
            messages: [{ role: 'user', content: 'hi' }]
        }, { 'Authorization': `Bearer ${keys.PERPLEXITY}` });
    }

    console.log("\n--- Report Complete ---");
}

checkStatus();
