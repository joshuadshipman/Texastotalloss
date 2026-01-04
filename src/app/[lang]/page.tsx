import { getDictionary } from './dictionaries';
import HomeClient from './HomeClient';
import { getTrendingContent } from '@/lib/content';

export async function generateStaticParams() {
    return [{ lang: 'en' }, { lang: 'es' }];
}

export default async function Home({ params }: { params: Promise<{ lang: 'en' | 'es' }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);
    const trendingContent = await getTrendingContent();

    return <HomeClient dict={dict} lang={lang} trendingContent={trendingContent} />;
}
