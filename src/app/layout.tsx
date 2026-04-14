import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Texas Total Loss | Auto Accident & Personal Injury Help",
    template: "%s | Texas Total Loss",
  },
  description:
    "Texas Total Loss helps accident victims understand their rights, document their case, and get connected with qualified personal injury attorneys. Free case evaluation — no pressure.",
  keywords: [
    "texas total loss",
    "car accident attorney texas",
    "personal injury texas",
    "auto accident help",
    "totaled car settlement",
    "texas pi attorney",
  ],
  authors: [{ name: "Texas Total Loss" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.texastotalloss.com",
    siteName: "Texas Total Loss",
    title: "Texas Total Loss | Auto Accident & Personal Injury Help",
    description:
      "Understand your rights after an accident. Connect with top Texas PI attorneys. Document your case in minutes.",
    images: [{ url: "/images/og-share.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Texas Total Loss | Auto Accident & Personal Injury Help",
    description: "Understand your rights after an accident. Connect with top Texas PI attorneys.",
  },
  robots: { index: true, follow: true },
  metadataBase: new URL("https://www.texastotalloss.com"),
};

import CounselChatWidget from "../components/CounselChatWidget";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0A1628" />
      </head>
      <body>
        {children}
        <CounselChatWidget />
      </body>
    </html>
  );
}
