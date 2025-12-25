'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SlideshowProps {
    images: string[];
}

export default function Slideshow({ images }: SlideshowProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const scrollToSlide = (index: number) => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const slideWidth = container.clientWidth;
        container.scrollTo({
            left: index * slideWidth,
            behavior: 'smooth'
        });
        setActiveIndex(index);
    };

    const handleScroll = () => {
        if (!scrollContainerRef.current) return;
        const container = scrollContainerRef.current;
        const slideWidth = container.clientWidth;
        const newIndex = Math.round(container.scrollLeft / slideWidth);
        if (newIndex !== activeIndex) {
            setActiveIndex(newIndex);
        }
    };

    const nextSlide = () => {
        const next = (activeIndex + 1) % images.length;
        scrollToSlide(next);
    };

    const prevSlide = () => {
        const prev = (activeIndex - 1 + images.length) % images.length;
        scrollToSlide(prev);
    };

    return (
        <div className="relative group w-full max-w-5xl mx-auto rounded-xl overflow-hidden shadow-xl border border-gray-200 bg-white">
            {/* Scroll Container */}
            <div
                ref={scrollContainerRef}
                onScroll={handleScroll}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide aspect-video items-center"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {images.map((src, idx) => (
                    <div key={idx} className="flex-shrink-0 w-full h-full snap-center relative bg-gray-50 flex items-center justify-center">
                        <Image
                            src={src}
                            alt={`Slide ${idx + 1}`}
                            width={1200}
                            height={675}
                            className="w-full h-full object-contain"
                            priority={idx === 0}
                        />
                    </div>
                ))}
            </div>

            {/* Navigation Buttons (Desktop) */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg backdrop-blur-sm transition opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center text-blue-900"
            >
                <ChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-lg backdrop-blur-sm transition opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center text-blue-900"
            >
                <ChevronRight className="w-6 h-6" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-full bg-black/20 backdrop-blur-sm">
                {images.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => scrollToSlide(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${idx === activeIndex ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'}`}
                    />
                ))}
            </div>

            {/* Mobile Hint */}
            <div className="absolute bottom-4 right-4 md:hidden text-white/50 text-xs bg-black/20 px-2 py-1 rounded backdrop-blur-sm">
                Swipe ↔
            </div>
        </div>
    );
}
