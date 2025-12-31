import { getDictionary } from '@/app/[lang]/dictionaries';
import ChatWidget from '@/components/ChatWidget';
import { ChatProvider } from '@/components/ChatContext';

type Props = {
    params: Promise<{ lang: 'en' | 'es' }>;
};

export async function generateStaticParams() {
    return [{ lang: 'en' }, { lang: 'es' }];
}

import CaseReviewModal from '@/components/CaseReviewModal';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'TL and Injury Case Review',
    description: 'Immediate AI Legal & Medical Case Analysis',
};

export default async function StandardChatPage({ params }: Props) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <ChatProvider>
            <CaseReviewModal dict={dict} lang={lang} />
            <ChatWidget dict={dict} variant="fullscreen" />
        </ChatProvider>
    );
}
