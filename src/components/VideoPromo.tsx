'use client';

import React, { useState } from 'react';
import { PlayIcon, AlertTriangleIcon } from 'lucide-react';
import { useChat } from './ChatContext';

interface VideoPromoProps {
    title?: string;
    subtitle?: string;
    thumbnailUrl?: string;
    videoUrl?: string; // YouTube embed or MP4
}

export default function VideoPromo({
    title = "Hit by a Drunk Driver?",
    subtitle = "Don't let them get away with it. See how we maximize your settlement.",
    thumbnailUrl = "/images/accident-scene-placeholder.jpg",
    videoUrl
}: VideoPromoProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const { openReview } = useChat();

    // Placeholder gradient if no image
    const bgStyle = thumbnailUrl && !thumbnailUrl.includes('placeholder')
        ? { backgroundImage: `url(${thumbnailUrl})` }
        : {};

    return (
        <div className="my-8 rounded-2xl overflow-hidden shadow-2xl border-4 border-red-600 relative bg-black aspect-video group">

            {!isPlaying ? (
                <div
                    className="absolute inset-0 bg-cover bg-center flex items-center justify-center cursor-pointer"
                    style={{ ...bgStyle, background: 'linear-gradient(45deg, #1a1a1a, #4a0404)' }}
                    onClick={() => setIsPlaying(true)}
                >
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition"></div>

                    <div className="texy-center relative z-10 p-6 flex flex-col items-center">
                        <div className="bg-red-600 text-white font-black uppercase text-xs px-3 py-1 mb-4 rounded tracking-widest animate-pulse">
                            Video Evidence
                        </div>
                        <h3 className="text-3xl md:text-5xl font-black text-white text-center mb-2 drop-shadow-lg uppercase italic">
                            {title}
                        </h3>
                        <p className="text-gray-200 text-lg mb-8 max-w-lg text-center font-medium">
                            {subtitle}
                        </p>

                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition duration-300 border-2 border-white/50">
                            <PlayIcon size={40} className="text-white fill-white ml-2" />
                        </div>

                        <div className="mt-8 text-white/80 text-xs font-mono">
                            Tap to Watch • 0:45
                        </div>
                    </div>
                </div>
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 text-white p-8 text-center">
                    {/* Placeholder for actual Video Player */}
                    <AlertTriangleIcon size={64} className="text-red-500 mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Video Placeholder</h3>
                    <p className="text-gray-400 mb-6">The video specifically addressing this case type would play here.</p>
                    <button
                        onClick={openReview}
                        className="bg-red-600 hover:bg-red-500 text-white font-black py-4 px-8 rounded-xl shadow-lg transition text-lg"
                    >
                        Start My Free Case Review Now
                    </button>
                    <button onClick={() => setIsPlaying(false)} className="mt-4 text-sm text-gray-500 underline">Close Video</button>
                </div>
            )}
        </div>
    );
}
