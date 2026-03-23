import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://apfdwkttzidzusvrjxur.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwZmR3a3R0emlkenVzdnJqeHVyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mzc4OTgyOSwiZXhwIjoyMDg5MzY1ODI5fQ.q71p6jBkfbqn4_p71zktE90vfWhSg4NHuU-Pisjay2Q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    console.log('--- Checking Supabase Tables ---');
    const { data, error } = await supabase
        .from('total_loss_leads')
        .select('id', { count: 'exact', head: true });

    if (error) {
        console.error('❌ Error fetching total_loss_leads:', error.message);
    } else {
        console.log('✅ total_loss_leads table exists.');
    }

    const { data: tables, error: tableError } = await supabase
        .rpc('get_tables'); // This might not work if RPC is not enabled

    if (tableError) {
        console.warn('⚠️ RPC call failed, trying alternative check.');
        // Try checking a known table or just listing schemas if possible
    }
}

check();
