import { getDictionary } from './dictionaries';
import HomeClient from './HomeClient';

export async function generateStaticParams() {
    return [{ lang: 'en' }, { lang: 'es' }];
}

export default async function Home({ params }: { params: Promise<{ lang: 'en' | 'es' }> }) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return <HomeClient dict={dict} lang={lang} />;
}
