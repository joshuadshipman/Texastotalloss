'use client';

import React, { useState } from 'react';
import { XIcon, ZoomInIcon } from 'lucide-react';

interface LightboxImageProps {
    src: string;
    alt: string;
    caption?: string;
    className?: string; // For the thumbnail container
}

export default function LightboxImage({ src, alt, caption, className = "" }: LightboxImageProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Prevent body scroll when open
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    return (
        <>
            {/* Thumbnail / Trigger */}
            <div
                className={`relative cursor-zoom-in group overflow-hidden rounded-lg bg-gray-100 ${className}`}
                onClick={() => setIsOpen(true)}
            >
                {/* Check if src is a placeholder text or actual URL. If it starts with [ it is a placeholder text from the current code */}
                {src.startsWith('[') ? (
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-gray-400 font-medium">
                        <ZoomInIcon className="w-8 h-8 mb-2 opacity-50" />
                        <span>{src}</span>
                    </div>
                ) : (
                    <>
                        <img
                            src={src}
                            alt={alt}
                            className="w-full h-full object-cover transition transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition flex items-center justify-center">
                            <ZoomInIcon className="text-white opacity-0 group-hover:opacity-100 w-8 h-8 drop-shadow-md" />
                        </div>
                    </>
                )}
            </div>

            {/* Modal Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setIsOpen(false)}
                >
                    <button
                        onClick={() => setIsOpen(false)}
                        className="absolute top-4 right-4 text-white hover:text-gray-300 p-2 z-60"
                    >
                        <XIcon className="w-8 h-8" />
                    </button>

                    <div className="relative max-w-full max-h-[80vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        {src.startsWith('[') ? (
                            <div className="text-white text-2xl font-bold bg-gray-800 p-10 rounded-xl border border-gray-600">
                                {src}
                                <p className="text-sm font-normal text-gray-400 mt-4 text-center">(Placeholder Graphic)</p>
                            </div>
                        ) : (
                            <img
                                src={src}
                                alt={alt}
                                className="max-w-full max-h-[80vh] object-contain rounded-md shadow-2xl"
                            />
                        )}
                    </div>

                    {caption && (
                        <p className="mt-4 text-white text-center text-sm md:text-base max-w-md">
                            {caption}
                        </p>
                    )}
                </div>
            )}
        </>
    );
}
