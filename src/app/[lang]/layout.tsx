import { ChatProvider } from "../../components/ChatContext";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import TelegramButton from "../../components/TelegramButton";
import CookieConsent from '../../components/CookieConsent';
import { Analytics } from "@vercel/analytics/next";
import '../../globals.css';


export const metadata = {
    title: {
        default: "Texas Total Loss - AI Claim Assistance",
        template: "%s | Texas Total Loss"
    },
    description: "Total Loss claim help in Texas. Free independent vehicle valuation, Gap Insurance calculator, and Injury case review. Se habla Español.",
    metadataBase: new URL('https://texastotalloss.com'),
    alternates: {
        languages: {
            'en': '/en',
            'es': '/es',
        },
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        alternateLocale: 'es_US',
        url: 'https://texastotalloss.com',
        siteName: 'Texas Total Loss',
        title: 'Texas Total Loss - Maximize Your Claim',
        description: 'Don\'t let insurance underpay you. Get a free AI-powered valuation and expert legal review.',
        images: [
            {
                url: '/images/og-share.jpg', // You need to ensure this exists or create it
                width: 1200,
                height: 630,
                alt: 'Texas Total Loss Assistance',
            }
        ]
    },
    /*
    twitter: {
        card: 'summary_large_image',
        site: '@TexasTotalLoss',
        creator: '@TexasTotalLoss',
    },
    */
    verification: {
        google: 'your-google-verification-code', // Placeholder
    }
};

export async function generateStaticParams() {
    return [{ lang: 'en' }, { lang: 'es' }]
}

export default async function LangLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>
}) {
    const { lang } = await params;
    return (
        <html lang={lang} className="scroll-smooth">
            <body className="antialiased min-h-screen bg-slate-950 text-slate-50 selection:bg-gold-500/30">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Organization',
                            name: 'Texas Total Loss',
                            url: 'https://texastotalloss.com',
                            logo: 'https://texastotalloss.com/images/logo.png',
                            description: 'Independent vehicle valuation and total loss claim assistance for Texas residents.',
                            contactPoint: {
                                '@type': 'ContactPoint',
                                telephone: '+1-469-729-4423',
                                contactType: 'customer service',
                                areaServed: 'TX',
                                availableLanguage: ['en', 'es']
                            },
                        })
                    }}
                />
                <ChatProvider>
                    <div className="fixed top-4 right-4 z-[100]">
                        <LanguageSwitcher />
                    </div>
                    {children}
                    <TelegramButton />
                    <CookieConsent />
                    <Analytics />
                </ChatProvider>
            </body>
        </html>
    );
}
