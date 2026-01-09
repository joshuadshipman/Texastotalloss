import axios from 'axios';
import * as cheerio from 'cheerio';

// Competitor Blog Configuration
const COMPETITORS = [
    {
        name: 'Dolman Law',
        url: 'https://www.dolmanlaw.com/blog/',
        selector: 'h2.entry-title a'
    },
    {
        name: 'Enjuris',
        url: 'https://www.enjuris.com/blog/',
        selector: '.post-title a'
    },
    {
        name: 'Malman Law',
        url: 'https://www.malmanlaw.com/blog/',
        selector: '.blog-title a'
    },
    {
        name: 'Thomas J Henry',
        url: 'https://thomasjhenrylaw.com/blog/',
        selector: '.post-title a'
    }
];

export interface ScrapedHeadline {
    source: string;
    title: string;
    url: string | undefined;
}

export async function scrapeCompetitorHeadlines(): Promise<ScrapedHeadline[]> {
    const allHeadlines: ScrapedHeadline[] = [];

    // Process all competitors in parallel
    const promises = COMPETITORS.map(async (comp) => {
        try {
            const { data } = await axios.get(comp.url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                },
                timeout: 5000 // 5s timeout to prevent hanging
            });

            const $ = cheerio.load(data);
            const headlines: ScrapedHeadline[] = [];

            // Select only the first 3 headlines to keep it fresh
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
