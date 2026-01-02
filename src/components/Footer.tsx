'use client';

import React from 'react';
import { ShieldCheckIcon, FacebookIcon, TwitterIcon, InstagramIcon } from 'lucide-react';
import Link from 'next/link';

interface FooterProps {
    dict: any;
    lang: string;
}

export default function Footer({ dict, lang }: FooterProps) {
    const year = new Date().getFullYear();

    return (
        <footer className="bg-navy-900 text-gray-300 py-16 px-4 border-t border-gray-800">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">

                {/* Column 1: Brand & Disclaimer */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white font-black text-xl uppercase tracking-tighter">
                        <ShieldCheckIcon className="text-gold-500" />
                        <span className="font-serif">Texas<span className="text-gold-500">TotalLoss</span></span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed text-justify">
                        {dict.footer.disclaimer_text}
                    </p>
                    <div className="pt-4 flex gap-4">
                        <FacebookIcon size={20} className="hover:text-gold-500 cursor-pointer transition" />
                        <TwitterIcon size={20} className="hover:text-gold-500 cursor-pointer transition" />
                        <InstagramIcon size={20} className="hover:text-gold-500 cursor-pointer transition" />
                    </div>
                </div>

                {/* Column 2: Quick Links */}
                <div>
                    <h3 className="text-gold-500 font-bold uppercase tracking-widest mb-6 text-xs font-serif">Quick Links</h3>
                    <ul className="space-y-3 text-sm">
                        <li><Link href={`/${lang}`} className="hover:text-white transition">Home</Link></li>
                        <li><Link href={`/${lang}/review`} className="hover:text-white transition">{dict.buttons.ai_review}</Link></li>
                        <li><button onClick={() => window.location.href = `/${lang}/chat`} className="hover:text-white transition text-left">Chat With Angel</button></li>
                        <li><Link href={`/${lang}#calculator`} className="hover:text-white transition">Value Calculator</Link></li>
                    </ul>
                </div>

                {/* Column 3: Resources */}
                <div>
                    <h3 className="text-gold-500 font-bold uppercase tracking-widest mb-6 text-xs font-serif">Resources</h3>
                    <ul className="space-y-3 text-sm">
                        <li><Link href={`/${lang}#resources`} className="hover:text-white transition">Critical Checklist</Link></li>
                        <li><Link href={`/${lang}#faq`} className="hover:text-white transition">FAQ</Link></li>
                        <li><Link href={`/${lang}#videos`} className="hover:text-white transition">Video Library</Link></li>
                        <li><Link href={`/${lang}/locations`} className="hover:text-white transition">City Guides</Link></li>
                    </ul>
                </div>

                {/* Column 4: Legal */}
                <div>
                    <h3 className="text-gold-500 font-bold uppercase tracking-widest mb-6 text-xs font-serif">Legal</h3>
                    <ul className="space-y-3 text-sm">
                        <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                        <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
                        <li><Link href="/sitemap" className="hover:text-white transition">Sitemap</Link></li>
                        <li><Link href="/disclosure" className="text-gold-500 hover:text-gold-400 font-bold transition">Full Disclosure</Link></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-gray-800 text-center md:text-left flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-medium">
                <p>&copy; {year} Texas Total Loss Claim Help. {dict.footer.rights}</p>
                <div className="mt-4 md:mt-0 flex gap-4">
                    <p className="uppercase tracking-widest text-[10px]">{dict.footer.disclaimer_title}</p>
                </div>
            </div>
        </footer>
    );
}
