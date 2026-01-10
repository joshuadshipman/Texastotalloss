import { Inter, Playfair_Display } from "next/font/google";
import "../globals.css";
import { ChatProvider } from "@/components/ChatContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import WhatsAppButton from "@/components/WhatsAppButton";
import CookieConsent from '@/components/CookieConsent';
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-serif' });

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

export default async function RootLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>
}) {
    const { lang } = await params;
    return (
        <html lang={lang} suppressHydrationWarning>
            <body className={`${inter.variable} ${playfair.variable} font-sans antialiased notranslate`} translate="no">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Organization',
                            name: 'Texas Total Loss',
                            url: 'https://texastotalloss.com',
                            logo: 'https://texastotalloss.com/images/logo.png', // Ensure this path exists or update later
                            description: 'Independent vehicle valuation and total loss claim assistance for Texas residents.',
                            contactPoint: {
                                '@type': 'ContactPoint',
                                telephone: '+1-800-555-0199',
                                contactType: 'customer service',
                                areaServed: 'TX',
                                availableLanguage: ['en', 'es']
                            },
                            /*
                            sameAs: [
                                'https://twitter.com/TexasTotalLoss',
                                'https://facebook.com/TexasTotalLoss'
                            ]
                            */
                        })
                    }}
                />
                <ChatProvider>
                    <div className="fixed top-4 right-4 z-[100]">
                        <LanguageSwitcher />
                    </div>
                    {children}
                    <WhatsAppButton />
                    <CookieConsent />
                    <Analytics />
                </ChatProvider>
            </body>
        </html>
    );
}
