'use client';

import { useState } from 'react';
import { FacebookIcon, TwitterIcon, InstagramIcon, YoutubeIcon, VideoIcon } from 'lucide-react';
import WhatsAppCaptureModal from './WhatsAppCaptureModal';

// Note: Lucide React doesn't have a specific TikTok icon by default in older versions, 
// using VideoIcon as a fallback if not available, or we could import a custom SVG.
// Assuming "VideoIcon" represents TikTok / Shorts for now, or just generic "Social".

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
                    {/* TikTok fallback icon since Lucide might not have it depending on version */}
                    <span className="font-bold text-xs hover:text-gold-500 transition text-gray-300 border border-gray-500 rounded px-1">TikTok</span>
                </button>
                <button onClick={() => handleSocialClick('YouTube')} aria-label="YouTube">
                    <YoutubeIcon size={20} className="hover:text-gold-500 cursor-pointer transition text-gray-300" />
                </button>
            </div>

            {/* Reusing the WhatsApp Capture Modal but ideally we would customize the text. 
                For now, it opens the "Connect" flow. 
                Future improvement: Modify WhatsAppCaptureModal to accept a 'title' prop. 
            */}
            <WhatsAppCaptureModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}
