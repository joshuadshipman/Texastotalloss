import axios from 'axios';
import * as cheerio from 'cheerio';
import Parser from 'rss-parser';

const parser = new Parser();

// Competitor Blog Configuration
const COMPETITORS = [
    {
        name: 'Dolman Law',
        url: 'https://www.dolmanlaw.com/blog/',
        feed: 'https://www.dolmanlaw.com/feed/',
        selector: 'h2.entry-title a'
    },
    {
        name: 'Enjuris',
        url: 'https://www.enjuris.com/blog/',
        feed: 'https://www.enjuris.com/feed/',
        selector: '.post-title a'
    },
    {
        name: 'Malman Law',
        url: 'https://www.malmanlaw.com/blog/',
        feed: 'https://www.malmanlaw.com/feed/',
        selector: '.blog-title a'
    },
    {
        name: 'Thomas J Henry',
        url: 'https://thomasjhenrylaw.com/blog/',
        feed: 'https://thomasjhenrylaw.com/feed/',
        selector: '.post-title a'
    }
];

import { ScrapedHeadline } from './models/types';

export async function scrapeCompetitorHeadlines(): Promise<ScrapedHeadline[]> {
    const allHeadlines: ScrapedHeadline[] = [];

    // Process all competitors in parallel
    const promises = COMPETITORS.map(async (comp) => {
        try {
            const { data } = await axios.get(comp.url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
                timeout: 5000 
            });

            const $ = cheerio.load(data);
            const headlines: ScrapedHeadline[] = [];

            $(comp.selector).slice(0, 3).each((_, element) => {
                const title = $(element).text().trim();
                const link = $(element).attr('href');

                if (title && link) {
                    headlines.push({
                        source: comp.name,
                        title: title,
                        url: link.startsWith('http') ? link : new URL(link, comp.url).toString()
                    });
                }
            });

            // Fallback to RSS if standard scraping found nothing
            if (headlines.length === 0 && comp.feed) {
                try {
                    const feed = await parser.parseURL(comp.feed);
                    feed.items.slice(0, 3).forEach(item => {
                        if (item.title && item.link) {
                            headlines.push({
                                source: comp.name,
                                title: item.title,
                                url: item.link
                            });
                        }
                    });
                } catch (feedError) {
                    console.error(`RSS fallback failed for ${comp.name}:`, feedError instanceof Error ? feedError.message : feedError);
                }
            }

            return headlines;
        } catch (error) {
            console.error(`Failed to scrape ${comp.name}:`, error instanceof Error ? error.message : error);
            return [];
        }
    });

    const results = await Promise.all(promises);

    // Flatten results
    results.forEach(headlines => allHeadlines.push(...headlines));

    return allHeadlines;
}
