import { Inter } from "next/font/google";
import "../globals.css";
import { ChatProvider } from "@/components/ChatContext";
import ChatWidget from "@/components/ChatWidget";
import { getDictionary } from "@/app/[lang]/dictionaries";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Texas Total Loss Blog",
    description: "Latest news and legal updates for Texas car accident victims.",
};

export default async function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Default to English for the blog (simplify for now, or use params if available)
    const dict = await getDictionary('en');

    return (
        <html lang="en">
            <body className={inter.className}>
                <ChatProvider>
                    {children}
                    <ChatWidget dict={dict} />
                </ChatProvider>
            </body>
        </html>
    );
}
