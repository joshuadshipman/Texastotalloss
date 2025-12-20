import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/admin/*', // Protect admin routes from crawling
        },
        sitemap: 'https://texastotalloss.com/sitemap.xml',
    };
}
