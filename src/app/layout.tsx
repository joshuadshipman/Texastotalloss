import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ChatProvider } from '@/components/ChatContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: {
        template: '%s | Texas Total Loss & Injury Help',
        default: 'Texas Total Loss Help | Free Valuations & Injury Claim Review',
    },
    description: 'Free assistance for Texas auto accidents. Calculate total loss value, understand the 51% Rule, and get a free case review for injuries and diminished value. Not legal advice.',
    keywords: ['Texas Total Loss', 'Car Accident Help', '51% Bar Rule', 'Diminished Value Texas', 'Total Loss Calculator', 'Personal Injury Lawyer Referral', 'Gap Insurance Claims', 'Medical Treatment Gaps'],
    openGraph: {
        title: 'Texas Total Loss Help | Don\'t Get Lowballed',
        description: 'Get a fair value for your car and protect your injury rights. Free 24/7 analysis.',
        type: 'website',
        locale: 'en_US',
        url: 'https://texastotalloss.com',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // JSON-LD for "ProfessionalService" (Lead Gen/Consulting) and "FAQPage"
    const jsonLd = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "ProfessionalService",
                "name": "Texas Total Loss Claim Help",
                "description": "Free guidance and lead generation for Texas auto accident victims, focusing on total loss valuations and injury claim assistance.",
                "url": "https://texastotalloss.com",
                "areaServed": {
                    "@type": "State",
                    "name": "Texas"
                },
                "priceRange": "Free",
                "knowsAbout": ["Auto Accidents", "Total Loss Valuations", "Personal Injury", "Diminished Value", "Insurance Claims"]
            },
            {
                "@type": "FAQPage",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "What is the 51% Rule in Texas?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Texas follows the 'Modified Comparative Negligence' rule. If you are found to be more than 50% at fault for an accident, you cannot recover any damages."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "What is Actual Cash Value (ACV)?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "ACV is the fair market value of your vehicle the moment before the accident, not what you owe on the loan or what you paid for it."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Does seeking medical care affect my claim?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Yes. Delays in medical treatment ('gaps in care') can be used by insurance companies to argue that your injuries were not caused by the accident, potentially denying your claim."
                        }
                    }
                ]
            }
        ]
    };

    return (
        <html lang="en">
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            </head>
            <body className={inter.className}>
                <ChatProvider>{children}</ChatProvider>
            </body>
        </html>
    );
}
