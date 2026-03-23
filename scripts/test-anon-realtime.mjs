import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Manual env parsing for script
const envFile = readFileSync(resolve('.env.local'), 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
    const [key, ...value] = line.split('=');
    if (key && value) env[key.trim()] = value.join('=').trim().replace(/^"|"$/g, '');
});

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('📡 Testing URL:', supabaseUrl);
console.log('🔑 Testing Key Starts With:', anonKey?.substring(0, 20));

const supabase = createClient(supabaseUrl, anonKey);

async function testAnon() {
    console.log('--- Testing ANON Key ---');
    const { data, error } = await supabase
        .from('total_loss_leads')
        .select('id')
        .limit(1);

    if (error) {
        console.error('❌ ANON Key Selection Failed:', error.message);
    } else {
        console.log('✅ ANON Key Selection Worked.');
    }

    console.log('--- Testing Realtime Connection ---');
    const channel = supabase.channel('test-channel')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'total_loss_leads' }, (payload) => {
            console.log('Change received!', payload);
        })
        .subscribe((status) => {
            console.log('Realtime Status:', status);
            if (status === 'SUBSCRIBED') {
                console.log('✅ Realtime Subscribed successfully.');
                process.exit(0);
            } else if (status === 'CHANNEL_ERROR') {
                console.error('❌ Realtime Channel Error.');
                process.exit(1);
            }
        });

    setTimeout(() => {
        console.error('⌛ Realtime timed out.');
        process.exit(1);
    }, 10000);
}

testAnon();
