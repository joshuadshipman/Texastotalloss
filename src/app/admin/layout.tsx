
import { Inter } from "next/font/google";
import "../../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Admin Dashboard - Texas Total Loss",
    description: "Admin Command Center",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                {children}
            </body>
        </html>
    );
}
