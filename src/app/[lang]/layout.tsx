import { Inter, Playfair_Display } from "next/font/google";
import "../globals.css";
import { ChatProvider } from "@/components/ChatContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import CookieConsent from '@/components/CookieConsent';
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-serif' });

export const metadata = {
    title: "Texas Auto Total Loss & Diminished Value Help",
    description: "Total Loss claim help in Texas. Calculator, Gap Insurance, and Injury assistance.",
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
        <html lang={lang}>
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
                            sameAs: [
                                'https://twitter.com/TexasTotalLoss',
                                'https://facebook.com/TexasTotalLoss'
                            ]
                        })
                    }}
                />
                <ChatProvider>
                    <div className="fixed top-4 right-4 z-[100]">
                        <LanguageSwitcher />
                    </div>
                    {children}
                    <CookieConsent />
                    <Analytics />
                </ChatProvider>
            </body>
        </html>
    );
}
