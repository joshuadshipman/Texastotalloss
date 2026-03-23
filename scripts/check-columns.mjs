import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://apfdwkttzidzusvrjxur.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFwZmR3a3R0emlkenVzdnJqeHVyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Mzc4OTgyOSwiZXhwIjoyMDg5MzY1ODI5fQ.q71p6jBkfbqn4_p71zktE90vfWhSg4NHuU-Pisjay2Q';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
    const { data, error } = await supabase
        .from('total_loss_leads')
        .select('*')
        .limit(1);

    if (error) {
        console.error('❌ Error fetching data:', error.message);
    } else if (data && data.length > 0) {
        console.log('✅ Columns found:', Object.keys(data[0]).join(', '));
    } else {
        console.warn('⚠️ Table is empty, cannot infer columns from select *');
        // Try another way to get columns
        const { data: cols, error: colError } = await supabase.rpc('get_table_columns', { table_name: 'total_loss_leads' });
        if (colError) console.error('❌ RPC get_table_columns failed.');
    }
}

checkColumns();
