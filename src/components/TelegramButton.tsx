'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import TelegramCaptureModal from './TelegramCaptureModal';

export default function TelegramButton() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = () => {
        setIsModalOpen(true);
    };

    return (
        <>
            <button
                onClick={handleClick}
                className="fixed bottom-24 right-4 z-[90] bg-[#0088cc] text-white p-3 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 md:bottom-8 md:right-8 flex items-center justify-center gap-2 group"
                aria-label="Chat on Telegram"
            >
                <Send size={28} fill="white" className="text-white" />
                <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 ease-in-out whitespace-nowrap font-bold text-sm">
                    Chat on Telegram
                </span>
            </button>
            <TelegramCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}
