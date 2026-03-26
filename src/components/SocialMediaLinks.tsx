'use client';

import { useState } from 'react';
import { FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon, Send } from 'lucide-react';
import TelegramCaptureModal from './TelegramCaptureModal';

// A simple wrapper to use the capture modal for social links
export default function SocialMediaLinks() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [platform, setPlatform] = useState('');

    const handleSocialClick = (name: string) => {
        setPlatform(name);
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="pt-4 flex gap-4">
                <button onClick={() => handleSocialClick('Telegram')} aria-label="Telegram">
                    <Send size={20} className="hover:text-[#0088cc] cursor-pointer transition text-gray-300" />
                </button>
                <button onClick={() => handleSocialClick('Facebook')} aria-label="Facebook">
                    <FacebookIcon size={20} className="hover:text-gold-500 cursor-pointer transition text-gray-300" />
                </button>
                <button onClick={() => handleSocialClick('Twitter')} aria-label="Twitter">
                    <TwitterIcon size={20} className="hover:text-gold-500 cursor-pointer transition text-gray-300" />
                </button>
                <button onClick={() => handleSocialClick('Instagram')} aria-label="Instagram">
                    <InstagramIcon size={20} className="hover:text-gold-500 cursor-pointer transition text-gray-300" />
                </button>
                <button onClick={() => handleSocialClick('TikTok')} aria-label="TikTok">
                    <span className="font-bold text-xs hover:text-gold-500 transition text-gray-300 border border-gray-500 rounded px-1 tracking-tighter">TikTok</span>
                </button>
                <button onClick={() => handleSocialClick('YouTube')} aria-label="YouTube">
                    <YoutubeIcon size={20} className="hover:text-gold-500 cursor-pointer transition text-gray-300" />
                </button>
            </div>

            <TelegramCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}
