const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY; // Use SERVICE_ROLE_KEY if possible to bypass RLS, or ensure user has access

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Error: SUPABASE_URL and SUPABASE_KEY must be set in .env or environment variables.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Adjust path to point to the CSV file
const CSV_PATH = path.join(__dirname, '../../Shopping App/Pre 14 Nov/reference/ShoppingAgentBase - WalMartPurchased.csv');

async function importData() {
  try {
    console.log(`Reading CSV from: ${CSV_PATH}`);
    if (!fs.existsSync(CSV_PATH)) {
        console.error(`File not found: ${CSV_PATH}`);
        process.exit(1);
    }

    const fileContent = fs.readFileSync(CSV_PATH, 'utf8');
    
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    console.log(`Found ${records.length} records. Processing...`);

    // Group by Order Number to handle multiple items per order
    const orders = {};
    
    for (const record of records) {
      const orderNum = record['Order Number'];
      if (!orderNum) continue;

      if (!orders[orderNum]) {
        orders[orderNum] = {
          date: record['Order Date'],
          items: []
        };
      }
      orders[orderNum].items.push(record);
    }

    console.log(`Found ${Object.keys(orders).length} unique orders.`);

    for (const [orderNum, orderData] of Object.entries(orders)) {
      // Parse date - handles various formats if needed, but CSV seems consistent
      const purchaseDate = new Date(orderData.date);
      if (isNaN(purchaseDate.getTime())) {
          console.warn(`Invalid date for order ${orderNum}: ${orderData.date}`);
          continue;
      }
      
      // 1. Check if purchase exists (idempotency)
      let { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .select('purchase_id')
        .eq('invoice_number', orderNum)
        .single();

      if (!purchase) {
        const { data: newPurchase, error: insertError } = await supabase
          .from('purchases')
          .insert({
            store: 'Walmart',
            purchase_date: purchaseDate.toISOString(),
            invoice_number: orderNum,
            total_amount: 0, // Will calculate from items
            payment_method: 'Unknown' // Not in CSV
          })
          .select()
          .single();
          
        if (insertError) {
            console.error(`Error inserting purchase ${orderNum}:`, insertError);
            continue;
        }
        purchase = newPurchase;
      }

      let orderTotal = 0;

      for (const item of orderData.items) {
        const productName = item['Item Name'];
        if (!productName) continue;

        // Clean price string (remove $)
        const priceStr = item['Price'] ? item['Price'].replace('$', '').replace(',', '') : '0';
        const price = parseFloat(priceStr) || 0;
        const quantity = parseInt(item['Quantity']) || 1;
        const category = item['Category'] || 'Uncategorized';
        
        orderTotal += price * quantity;

        // 2. Manage Product Catalog (Upsert-like logic)
        let { data: product } = await supabase
            .from('products')
            .select('product_id, purchase_count')
            .eq('product_name', productName)
            .single();

        if (!product) {
            const { data: newProduct, error: prodError } = await supabase
                .from('products')
                .insert({
                    product_name: productName,
                    normalized_name: productName.toLowerCase(),
                    category: category,
                    typical_stores: ['Walmart'],
                    purchase_count: 1,
                    last_purchased_date: purchaseDate.toISOString()
                })
                .select()
                .single();
            
            if (prodError) {
                console.error(`Error creating product ${productName}:`, prodError);
                continue;
            }
            product = newProduct;
        } else {
             // Update product stats
             await supabase.from('products').update({
                 purchase_count: product.purchase_count + 1,
                 last_purchased_date: purchaseDate.toISOString()
             }).eq('product_id', product.product_id);
        }

        // 3. Add Purchase Item
        const { error: itemError } = await supabase
            .from('purchase_items')
            .insert({
                purchase_id: purchase.purchase_id,
                product_name: productName,
                quantity: quantity,
                unit_price: price,
                total_price: price * quantity,
                category: category,
                brand: null // Not clearly in CSV, could infer from name later
            });

        if (itemError) console.error(`Error adding item ${productName}:`, itemError);

        // 4. Update Current Prices (Historical Record)
        if (price > 0) {
            await supabase.from('current_prices').insert({
                product_id: product.product_id,
                store: 'Walmart',
                price: price,
                in_stock: true,
                checked_at: purchaseDate.toISOString(),
                source: 'purchase_history'
            });
        }
      }

      // Update purchase total with calculated sum
      await supabase.from('purchases').update({ total_amount: orderTotal }).eq('purchase_id', purchase.purchase_id);
      console.log(`Processed Order ${orderNum}: $${orderTotal.toFixed(2)}`);
    }

    console.log('Import complete!');

  } catch (error) {
    console.error('Import failed:', error);
  }
}

importData();
