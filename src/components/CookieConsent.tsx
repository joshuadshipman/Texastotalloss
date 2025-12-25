
'use client';

import { useState, useEffect } from 'react';
import { XIcon, CookieIcon, ShieldCheckIcon } from 'lucide-react';

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check local storage for consent
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            // Delay slightly for smooth entrance
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'accepted');
        setIsVisible(false);
        // Here we would initialize analytics
        // if (typeof window !== 'undefined' && window.gtag) { window.gtag('consent', 'update', { ... }) }
    };

    const handleDecline = () => {
        localStorage.setItem('cookie_consent', 'declined');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in fade-in slide-in-from-bottom duration-500">
            <div className="max-w-4xl mx-auto bg-white/95 backdrop-blur shadow-2xl rounded-2xl border border-gray-200 p-6 md:flex items-center justify-between gap-6">

                <div className="flex items-start gap-4 mb-4 md:mb-0">
                    <div className="bg-blue-100 p-3 rounded-full text-blue-600 shrink-0">
                        <CookieIcon size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg mb-1">We value your privacy</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                            We use cookies to improve your experience and analyze site traffic.
                            We prioritize your data privacy compliant with Texas Law.
                        </p>
                        <a href="/privacy" className="text-xs font-bold text-blue-600 hover:underline mt-2 inline-flex items-center gap-1">
                            <ShieldCheckIcon size={12} /> Read our Privacy Policy
                        </a>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 min-w-[240px]">
                    <button
                        onClick={handleDecline}
                        className="px-6 py-2.5 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition"
                    >
                        Necessary Only
                    </button>
                    <button
                        onClick={handleAccept}
                        className="px-6 py-2.5 rounded-xl text-sm font-bold bg-blue-900 text-white hover:bg-blue-800 shadow-lg shadow-blue-900/20 transition transform hover:scale-105"
                    >
                        Accept All
                    </button>
                </div>

            </div>
        </div>
    );
}
