const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verifyImport() {
    try {
        const { count: purchaseCount, error: pError } = await supabase
            .from('purchases')
            .select('*', { count: 'exact', head: true });

        if (pError) console.error('Error counting purchases:', pError.message);
        else console.log(`Purchases count: ${purchaseCount}`);

        const { count: itemsCount, error: iError } = await supabase
            .from('purchase_items')
            .select('*', { count: 'exact', head: true });

        if (iError) console.error('Error counting items:', iError.message);
        else console.log(`Purchase Items count: ${itemsCount}`);

        const { count: productsCount, error: prError } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true });

        if (prError) console.error('Error counting products:', prError.message);
        else console.log(`Products count: ${productsCount}`);

    } catch (err) {
        console.error('Unexpected error:', err);
    }
}

verifyImport();
