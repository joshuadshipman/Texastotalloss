'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = Array.from({ length: 13 }, (_, i) => `/images/slides/slide-${(i + 1).toString().padStart(2, '0')}.png`);

export default function Slideshow() {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    return (
        <div className="relative w-full max-w-4xl mx-auto rounded-xl shadow-xl overflow-hidden bg-gray-900 aspect-video md:aspect-[16/9]">
            <div className="absolute inset-0 flex items-center justify-center">
                <Image
                    src={slides[currentIndex]}
                    alt={`Slide ${currentIndex + 1}`}
                    fill
                    className="object-contain"
                />
            </div>

            {/* Controls */}
            <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                aria-label="Previous Slide"
            >
                <ChevronLeft size={32} />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                aria-label="Next Slide"
            >
                <ChevronRight size={32} />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/80'
                            }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>

            <div className="absolute bottom-4 right-4 text-white/50 text-xs font-mono bg-black/30 px-2 py-1 rounded">
                {currentIndex + 1} / {slides.length}
            </div>
        </div>
    );
}
