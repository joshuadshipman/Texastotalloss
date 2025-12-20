import { Inter } from "next/font/google";
import "../globals.css";
import { ChatProvider } from "@/components/ChatContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Texas Auto Total Loss & Diminished Value Help",
    description: "Total Loss claim help in Texas. Calculator, Gap Insurance, and Injury assistance.",
};

export async function generateStaticParams() {
    return [{ lang: 'en' }, { lang: 'es' }]
}

export default function RootLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: { lang: string }
}) {
    return (
        <html lang={params.lang}>
            <body className={inter.className}>
                <ChatProvider>
                    <div className="absolute top-4 right-4 z-50">
                        <LanguageSwitcher />
                    </div>
                    {children}
                </ChatProvider>
            </body>
        </html>
    );
}
