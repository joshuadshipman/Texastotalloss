const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Error: SUPABASE_URL and SUPABASE_KEY must be set.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkSchema() {
    try {
        const { data, error } = await supabase
            .from('purchases')
            .select('count', { count: 'exact', head: true });

        if (error) {
            console.error('Error checking purchases table:', error.message);
            if (error.code === '42P01') {
                console.log('Table "purchases" does not exist.');
            }
        } else {
            console.log('Table "purchases" exists.');
        }

        const { data: prodData, error: prodError } = await supabase
            .from('products')
            .select('count', { count: 'exact', head: true });

        if (prodError) {
            console.error('Error checking products table:', prodError.message);
        } else {
            console.log('Table "products" exists.');
        }

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

checkSchema();
