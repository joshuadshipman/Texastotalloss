'use client';

import React, { useState } from 'react';

interface FlipCardProps {
    frontContent: React.ReactNode;
    backContent: React.ReactNode;
    colorClass?: string;
}

export default function FlipCard({ frontContent, backContent, colorClass = "bg-blue-600" }: FlipCardProps) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <div
            className="group h-64 w-full perspective-1000 cursor-pointer"
            onClick={() => setIsFlipped(!isFlipped)}
            onMouseEnter={() => setIsFlipped(true)}
            onMouseLeave={() => setIsFlipped(false)}
        >
            <div className={`relative h-full w-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                {/* Front */}
                <div className={`absolute h-full w-full backface-hidden rounded-xl shadow-lg p-6 flex flex-col items-center justify-center text-center ${colorClass} text-white`}>
                    {frontContent}
                    <p className="mt-4 text-sm opacity-80 font-medium border border-white/30 px-3 py-1 rounded-full">
                        Hover / Tap to Reveal
                    </p>
                </div>

                {/* Back */}
                <div className="absolute h-full w-full backface-hidden rotate-y-180 rounded-xl shadow-lg bg-gray-900 border-2 border-gray-700 p-6 flex flex-col items-center justify-center text-center text-white">
                    {backContent}
                </div>
            </div>
        </div>
    );
}
