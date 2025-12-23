
import { getDictionary } from '@/dictionaries/dictionaries';
import CaseReviewModal from '@/components/CaseReviewModal';
import { ChatProvider } from '@/components/ChatContext';
import RedirectToReview from '@/components/RedirectToReview';

type Props = {
    params: Promise<{ lang: 'en' | 'es' }>;
};

export default async function ReviewPage({ params }: Props) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <ChatProvider>
            <RedirectToReview />
            <CaseReviewModal dict={dict} lang={lang} />
        </ChatProvider>
    );
}
