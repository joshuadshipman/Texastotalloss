const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { ApifyClient } = require('apify-client');

// Initialize Apify client (requires APIFY_TOKEN in environment)
// For local testing or if env is not set, we'll gracefully throw an error
const apifyToken = process.env.APIFY_TOKEN || functions.config().apify?.token;

exports.scrapeProduct = functions.https.onCall(async (data, context) => {
    // 1. Validate Authentication
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to scrape products.');
    }

    const { url } = data;
    if (!url || typeof url !== 'string') {
        throw new functions.https.HttpsError('invalid-argument', 'A valid product URL is required.');
    }

    if (!apifyToken) {
        throw new functions.https.HttpsError('failed-precondition', 'Apify token is not configured on the server.');
    }

    const client = new ApifyClient({ token: apifyToken });

    try {
        // 2. We use a generic web scraper actor or a specific e-commerce actor on Apify.
        // For this implementation, we'll use a fast, universal Product Scraper actor.
        // (Replacing specific Amazon/BestBuy actors with a more generic one that finds OpenGraph/Schema.org tags)

        // Note: 'cheerio-scraper' or a dedicated e-commerce scraper is usually best.
        // We'll use a placeholder actor ID here that represents a generic schema extractor,
        // or we can fall back to a simple fetch if Apify isn't needed for basic OG tags.
        // Assuming we are using a known Apify store actor like 'lukaskrivka/article-extractor' but tailored for products.
        // For demonstration of the API connection, we'll trigger a lightweight scrape:

        const run = await client.actor('apify/puppeteer-scraper').call({
            startUrls: [{ url }],
            pageFunction: `
                async function pageFunction(context) {
                    const { $, request, log } = context;
                    
                    // Simple extraction logic for common product attributes
                    const title = $('meta[property="og:title"]').attr('content') || $('title').text() || 'Unknown Product';
                    const image = $('meta[property="og:image"]').attr('content') || '';
                    
                    // Price extraction is notoriously hard generically, try common schema:
                    let price = 0;
                    const priceText = $('meta[property="product:price:amount"]').attr('content') || 
                                     $('.price, #price, [data-price]').first().text();
                    
                    if (priceText) {
                        const match = priceText.match(/[0-9]+([,.][0-9]+)?/);
                        if (match) price = parseFloat(match[0].replace(',', '.'));
                    }

                    return {
                        title: title.trim(),
                        image,
                        price,
                        url: request.url
                    };
                }
            `
        });

        const { items } = await client.dataset(run.defaultDatasetId).listItems();

        const productData = items[0] || {};
        const productName = productData.title || 'Scraped Product';
        const recommendedPrice = productData.price || 0;
        const photoUrl = productData.image || null;

        // 3. Save to Firestore
        const docRef = await admin.firestore().collection('shopping_list').add({
            product_name: productName,
            quantity: 1,
            status: 'pending',
            recommended_price: recommendedPrice,
            product_url: url,
            photo_url: photoUrl,
            source: 'apify_scraper',
            added_at: new Date().toISOString(),
            user_id: context.auth.uid
        });

        return {
            success: true,
            id: docRef.id,
            product_name: productName,
            price: recommendedPrice
        };

    } catch (error) {
        console.error("Apify Scrape Error:", error);
        throw new functions.https.HttpsError('internal', `Scraping failed: ${error.message}`);
    }
});
