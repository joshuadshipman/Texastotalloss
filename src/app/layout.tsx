
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-serif' });

export const metadata = {
    title: {
        default: "Texas Total Loss - AI Claim Assistance",
        template: "%s | Texas Total Loss"
    },
    description: "Total Loss claim help in Texas. Free independent vehicle valuation, Gap Insurance calculator, and Injury case review. Se habla Español.",
    metadataBase: new URL('https://texastotalloss.com'),
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
                {children}
            </body>
        </html>
    );
}
