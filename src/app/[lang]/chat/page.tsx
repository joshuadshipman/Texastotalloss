import { getDictionary } from '@/dictionaries/dictionaries';
import ChatWidget from '@/components/ChatWidget';
import { ChatProvider } from '@/components/ChatContext';

type Props = {
    params: Promise<{ lang: 'en' | 'es' }>;
};

export default async function StandardChatPage({ params }: Props) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <ChatProvider>
            <ChatWidget dict={dict} variant="fullscreen" />
        </ChatProvider>
    );
}
