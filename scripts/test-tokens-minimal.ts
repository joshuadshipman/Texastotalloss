
import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function check() {
    const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    const deepseekKey = process.env.DEEPSEEK_API_KEY;

    if (geminiKey) {
        try {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
            const res = await axios.post(url, { contents: [{ parts: [{ text: "hi" }] }] });
            console.log("GEMINI: ACTIVE");
        } catch (e: any) {
            console.log("GEMINI: ERROR - " + (e.response?.data?.error?.message || e.message));
        }
    } else {
        console.log("GEMINI: KEY MISSING");
    }

    if (deepseekKey) {
        try {
            const res = await axios.get('https://api.deepseek.com/user/balance', {
                headers: { 'Authorization': `Bearer ${deepseekKey}` }
            });
            console.log("DEEPSEEK BALANCE: " + JSON.stringify(res.data.balance_infos[0]));
        } catch (e: any) {
            console.log("DEEPSEEK: ERROR - " + (e.response?.data?.error?.message || e.message));
        }
    } else {
        console.log("DEEPSEEK: KEY MISSING");
    }
}

check();
