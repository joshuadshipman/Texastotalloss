'use strict';
'use client';

import React, { useState } from 'react';
import { MessageCircleIcon } from 'lucide-react';
import WhatsAppCaptureModal from './WhatsAppCaptureModal';

export default function WhatsAppButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = () => {
        setIsModalOpen(true);
        // Log event if analytics exists
        // (window as any).gtag?.('event', 'whatsapp_click');
    };

    return (
        <>
            <button
                onClick={handleClick}
                className="fixed bottom-24 right-4 z-[90] bg-[#25D366] text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 md:bottom-8 md:right-8 flex items-center justify-center gap-2 group"
                aria-label="Chat on WhatsApp"
            >
                <MessageCircleIcon size={28} fill="white" className="text-white" />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-bold text-sm">
                    Chat en WhatsApp
                </span>
            </button>
            <WhatsAppCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}
