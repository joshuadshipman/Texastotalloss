export interface ScrapedHeadline {
    source: string;
    title: string;
    url: string | undefined;
}

export interface NewsItem {
    source: string;
    title: string;
    link: string;
    pubDate: string;
    snippet: string;
}

export interface ContentConcept {
    theme: string;
    title: string;
    hook: string;
    blog_outline: string[];
    video_prompt: string;
    geo_targets: string[];
}

export interface BlogPost {
    title: string;
    slug: string;
    excerpt: string;
    content: string; // HTML
    author: string;
    date: string;
    tags: string[];
    readTime: string;
}
