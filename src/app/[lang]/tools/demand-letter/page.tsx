'use client';

import React from 'react';
import DemandLetterGenerator from '@/components/DemandLetterGenerator';
import Link from 'next/link';
import Slideshow from '@/components/Slideshow';

export default function DemandLetterPage() {
    const guideImages = [
        '/images/slides/slide-01.png',
        '/images/slides/slide-02.png',
        '/images/slides/slide-03.png',
        '/images/slides/slide-04.png',
        '/images/slides/slide-05.png',
        '/images/slides/slide-06.png',
        '/images/slides/slide-07.png',
        '/images/slides/slide-08.png',
        '/images/slides/slide-09.png',
        '/images/slides/slide-10.png',
        '/images/slides/slide-11.png',
    ];

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4">
            <div className="max-w-4xl mx-auto mb-8 text-center">
                <Link href="/" className="text-gray-500 hover:text-blue-600 font-bold mb-4 inline-block">&larr; Back to Home</Link>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Total Loss <span className="text-blue-600">Demand Generator</span></h1>
                <p className="text-xl text-gray-600 mb-8">
                    Insurance company offering you less than your car is worth?
                    <br />Generate a professional legal demand letter in 30 seconds.
                </p>

                {/* Infographic Guide */}
                <div className="mb-12">
                    <p className="text-lg font-bold text-blue-900 mb-4">
                        Swipe through the step-by-step guide below to maximize your payout.
                    </p>

                    <Slideshow images={guideImages} />

                    <p className="text-gray-500 text-sm mt-4">
                        Follow the steps above, obtain the necessary quotes, and then use the tool below to generate your demand letter.
                    </p>
                </div>
            </div>

            <DemandLetterGenerator />

            <div className="max-w-2xl mx-auto mt-12 text-center text-gray-500 text-sm">
                <p>Disclaimer: This tool generates a template based on standard Texas insurance codes. It does not constitute legal advice. For complex cases, consult an attorney.</p>
            </div>
        </div>
    );
}
