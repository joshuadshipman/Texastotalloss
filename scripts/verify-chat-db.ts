
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

console.log('Current directory:', process.cwd());

function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (!fs.existsSync(envPath)) {
            console.error('.env.local not found at:', envPath);
            return {};
        }
        const content = fs.readFileSync(envPath, 'utf-8');
        const env: Record<string, string> = {};
        content.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
                env[key] = value;
            }
        });
        return env;
    } catch (e) {
        console.error('Error reading .env.local', e);
        return {};
    }
}

const env = loadEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local (manual parse)');
    // console.log('Found keys:', Object.keys(env));
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
});

async function verifyChat() {
    console.log('Starting Chat DB Verification...');
    const sessionId = `verify-${Date.now()}`;

    // 1. Create Session
    console.log('1. Creating Session:', sessionId);
    const { error: sessionError } = await supabase.from('chat_sessions').insert({
        session_id: sessionId,
        status: 'test',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    });

    if (sessionError) {
        console.error('Assertion Failed: Could not create session.', sessionError);
        return;
    }
    console.log('   ✅ Session created.');

    // 2. Insert Message
    console.log('2. Inserting Message...');
    const { error: msgError } = await supabase.from('chat_messages').insert({
        session_id: sessionId,
        sender: 'user',
        content: 'Verification Test Message',
        created_at: new Date().toISOString()
    });

    if (msgError) {
        console.error('Assertion Failed: Could not insert message.', msgError);
        return;
    }
    console.log('   ✅ Message inserted.');

    // 3. Fetch Message
    console.log('3. Fetching Message...');
    const { data: messages, error: fetchError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId);

    if (fetchError || !messages || messages.length === 0) {
        console.error('Assertion Failed: Could not fetch message.', fetchError);
        return;
    }
    console.log(`   ✅ Message fetched: "${messages[0].content}"`);

    // 4. Clean up
    console.log('4. Cleaning up...');
    await supabase.from('chat_messages').delete().eq('session_id', sessionId);
    await supabase.from('chat_sessions').delete().eq('session_id', sessionId);
    console.log('   ✅ Cleanup complete.');

    console.log('User Verification Successful: Database is ready for Chat.');
}

verifyChat();
