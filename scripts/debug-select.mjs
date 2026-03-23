import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://apfdwkttzidzusvrjxur.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwZmR3a3R0emlkenVzdnJqeHVyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mzc4OTgyOSwiZXhwIjoyMDg5MzY1ODI5fQ.q71p6jBkfbqn4_p71zktE90vfWhSg4NHuU-Pisjay2Q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugSelect() {
    const { data, error } = await supabase
        .from('total_loss_leads')
        .select('id, source, created_at');

    if (error) {
        console.log('--- ERROR OBJECT ---');
        console.log(JSON.stringify(error, null, 2));
    } else {
        console.log('✅ Select successful. Count:', data.length);
    }
}

debugSelect();
