'use client';

import { useState, useEffect } from 'react';
import { XIcon } from 'lucide-react';
import { useChat } from './ChatContext';

export default function ExitIntentPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [hasTriggered, setHasTriggered] = useState(false);
    const { openChat } = useChat();

    // Configuration
    const COOL_OFF_DAYS = 1; // Don't show again for 1 day
    const MOBILE_DELAY_MS = 30000; // Show after 30s on mobile

    useEffect(() => {
        // Check localStorage
        const lastShown = localStorage.getItem('exit_intent_flashed');
        if (lastShown) {
            const daysSince = (Date.now() - parseInt(lastShown)) / (1000 * 60 * 60 * 24);
            if (daysSince < COOL_OFF_DAYS) {
                setHasTriggered(true); // Treat as already triggered so it doesn't show
                return;
            }
        }

        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !hasTriggered) {
                triggerPopup();
            }
        };

        const triggerPopup = () => {
            setIsVisible(true);
            setHasTriggered(true);
            localStorage.setItem('exit_intent_flashed', Date.now().toString());
        };

        // Desktop Exit Intent
        document.addEventListener('mouseleave', handleMouseLeave);

        // Mobile Timer (or fallback)
        const timer = setTimeout(() => {
            if (!hasTriggered && window.innerWidth < 768) { // Only force on mobile
                triggerPopup();
            }
        }, MOBILE_DELAY_MS);

        return () => {
            document.removeEventListener('mouseleave', handleMouseLeave);
            clearTimeout(timer);
        };
    }, [hasTriggered]);

    const closePopup = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300 relative border-4 border-gold-500">
                {/* Close Button */}
                <button
                    onClick={closePopup}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
                >
                    <XIcon size={24} />
                </button>

                <div className="flex flex-col md:flex-row">
                    {/* Visual Side (Hidden on tiny screens) */}
                    <div className="hidden md:flex w-1/3 bg-slate-900 items-center justify-center p-6 text-center">
                        <div className="text-6xl">🛑</div>
                    </div>

                    {/* Content Side */}
                    <div className="flex-1 p-8 text-center md:text-left">
                        <h3 className="text-3xl font-black text-red-600 mb-2 uppercase tracking-tighter">Wait!</h3>
                        <p className="text-slate-800 font-bold text-lg mb-4 leading-tight">
                            Don&apos;t settle with the insurance company yet.
                        </p>
                        <p className="text-slate-600 text-sm mb-6">
                            They often underpay by thousands. Get a <strong>free attorney review</strong> of your offer before you sign anything.
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => {
                                    openChat('live');
                                    closePopup();
                                }}
                                className="w-full bg-gold-500 hover:bg-gold-400 text-navy-900 font-black py-3 rounded-xl shadow-lg transition-all transform hover:scale-105"
                            >
                                Chat with an Expert Now »
                            </button>
                            <button
                                onClick={closePopup}
                                className="text-slate-400 text-xs hover:text-slate-600 font-medium"
                            >
                                No thanks, I&apos;ll risk the potentially lower offer.
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
