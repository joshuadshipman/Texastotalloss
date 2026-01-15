import Parser from 'rss-parser';

export interface NewsItem {
    source: string;
    title: string;
    link: string;
    pubDate: string;
    snippet: string;
}

const parser = new Parser();

// RSS Feeds for real-time trend monitoring
const FEEDS = [
    {
        name: 'Google News - Texas Accidents',
        url: 'https://news.google.com/rss/search?q=Texas+car+accident+lawsuit+OR+highway+crash&hl=en-US&gl=US&ceid=US:en'
    },
    {
        name: 'Insurance Journal - Texas',
        url: 'https://www.insurancejournal.com/rss/news/southcentral/'
    }
];

export async function fetchTrendingNews(): Promise<NewsItem[]> {
    const allNews: NewsItem[] = [];

    // Process feeds in parallel
    const feedPromises = FEEDS.map(async (feed) => {
        try {
            const feedData = await parser.parseURL(feed.url);

            // Take top 3 from each feed
            feedData.items.slice(0, 3).forEach(item => {
                allNews.push({
                    source: feed.name,
                    title: item.title || 'Unknown Title',
                    link: item.link || '',
                    pubDate: item.pubDate || '',
                    snippet: item.contentSnippet || item.content || ''
                });
            });
        } catch (error) {
            console.error(`Failed to fetch RSS ${feed.name}:`, error);
        }
    });

    await Promise.all(feedPromises);
    return allNews;
}
