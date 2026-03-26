const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function createSchema() {
    console.log('Creating database schema...');

    const sql = `
-- Drop existing tables
DROP TABLE IF EXISTS shopping_list, current_prices, purchase_items, products, purchases CASCADE;

-- Table 1: purchases
CREATE TABLE purchases (
  purchase_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store TEXT NOT NULL,
  purchase_date TIMESTAMP NOT NULL,
  total_amount DECIMAL(10,2),
  payment_method TEXT,
  invoice_number TEXT,
  email_id TEXT UNIQUE,
  gmail_message_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON purchases FOR SELECT TO anon USING (true);
CREATE POLICY "Allow authenticated insert" ON purchases FOR INSERT TO authenticated WITH CHECK (true);

-- Table 2: purchase_items
CREATE TABLE purchase_items (
  item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  purchase_id UUID REFERENCES purchases(purchase_id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL(10,2),
  total_price DECIMAL(10,2),
  brand TEXT,
  category TEXT,
  upc_code TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE purchase_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON purchase_items FOR SELECT TO anon USING (true);
CREATE POLICY "Allow authenticated insert" ON purchase_items FOR INSERT TO authenticated WITH CHECK (true);

-- Table 3: products
CREATE TABLE products (
  product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT UNIQUE NOT NULL,
  normalized_name TEXT,
  category TEXT,
  typical_stores TEXT[],
  default_brand_preference TEXT DEFAULT 'generic',
  purchase_count INTEGER DEFAULT 0,
  last_purchased_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON products FOR SELECT TO anon USING (true);
CREATE POLICY "Allow authenticated operations" ON products FOR ALL TO authenticated USING (true);

-- Table 4: current_prices
CREATE TABLE current_prices (
  price_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(product_id) ON DELETE CASCADE,
  store TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  brand TEXT,
  in_stock BOOLEAN DEFAULT true,
  checked_at TIMESTAMP DEFAULT NOW(),
  source TEXT
);

ALTER TABLE current_prices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON current_prices FOR SELECT TO anon USING (true);
CREATE POLICY "Allow authenticated insert" ON current_prices FOR INSERT TO authenticated WITH CHECK (true);

-- Table 5: shopping_list
CREATE TABLE shopping_list (
  list_item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_name TEXT NOT NULL,
  quantity INTEGER DEFAULT 1,
  recommended_store TEXT,
  recommended_price DECIMAL(10,2),
  recommended_brand TEXT,
  status TEXT DEFAULT 'pending',
  added_via TEXT,
  added_at TIMESTAMP DEFAULT NOW(),
  purchased_at TIMESTAMP
);

ALTER TABLE shopping_list ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public access" ON shopping_list FOR ALL TO anon USING (true);
`;

    try {
        const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

        if (error) {
            console.error('Error creating schema:', error);
            console.log('\nTrying alternative method...');

            // Alternative: Use fetch to call Supabase REST API directly
            const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`
                },
                body: JSON.stringify({ sql_query: sql })
            });

            if (!response.ok) {
                console.error('Alternative method also failed');
                console.log('\nPlease run the SQL manually in Supabase SQL Editor.');
                console.log('The SQL file is located at: shopping-app-schema.sql');
                process.exit(1);
            }
        }

        console.log('✅ Schema created successfully!');
        console.log('Tables created: purchases, purchase_items, products, current_prices, shopping_list');

    } catch (error) {
        console.error('Unexpected error:', error);
        console.log('\nPlease run the SQL manually in Supabase SQL Editor.');
        console.log('The SQL file is located at: shopping-app-schema.sql');
        process.exit(1);
    }
}

createSchema();
