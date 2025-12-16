import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Total Loss Intake Platform',
    description: 'Free Total Loss & Injury Validation',
};

import { ChatProvider } from '@/components/ChatContext';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <ChatProvider>{children}</ChatProvider>
            </body>
        </html>
    );
}
