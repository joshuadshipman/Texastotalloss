import { MetadataRoute } from 'next';
import { adminDb } from '@/lib/firebaseAdmin';
import { cities } from '../data/cities';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

    // 3. Dynamic Blog Posts
    try {
        const postsSnapshot = await adminDb.collection('blog_posts').limit(1000).get();

        if (!postsSnapshot.empty) {
            postsSnapshot.forEach(docSnap => {
                const post = docSnap.data();
                languages.forEach(lang => {
                    sitemapEntries.push({
                        url: `${baseUrl}/${lang}/blog/${post.slug}`,
                        lastModified: post.published_at ? new Date(post.published_at) : new Date(),
                        changeFrequency: 'monthly',
                        priority: 0.6,
                    });
                });
            });
        }
    } catch (e) {
        console.error("Sitemap Blog Fetch Failed:", e);
    }

    return sitemapEntries;
}
