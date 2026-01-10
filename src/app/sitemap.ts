import { MetadataRoute } from 'next';

import { cities } from '@/data/cities';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://texastotalloss.com';

    const languages = ['en', 'es'];
    const routes = [
        '',
        '/claims-questions',
        // Add other static routes here
    ];

    const sitemapEntries: MetadataRoute.Sitemap = [];

    languages.forEach(lang => {
        // Static Routes
        routes.forEach(route => {
            sitemapEntries.push({
                url: `${baseUrl}/${lang}${route}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: route === '' ? 1 : 0.8,
            });
        });

        // City Pages
        cities.forEach(city => {
            sitemapEntries.push({
                url: `${baseUrl}/${lang}/locations/${city.slug}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: 0.8,
            });
        });
    });

    return sitemapEntries;
}
