'use client';

import React from 'react';
import DemandLetterGenerator from '@/components/DemandLetterGenerator';
import Link from 'next/link';
import Image from 'next/image';
import Slideshow from '@/components/Slideshow';

export default function DemandLetterPage() {
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
                <div className="mb-12 bg-white p-4 rounded-xl shadow-sm border border-gray-200 inline-block overflow-hidden">
                    <div className="relative w-full h-auto mb-4">
                        <Image
                            src="/images/total-loss-guide.jpg"
                            alt="Total Loss Payout Guide"
                            width={1200}
                            height={600}
                            className="rounded-lg w-full h-auto object-contain max-h-[500px]"
                        />
                    </div>
                    <p className="text-lg font-bold text-blue-900">
                        Follow the guide above, obtain the necessary quotes, and then print the demand letter below as a cover for your proof.
                    </p>
                </div>
            </div>

            <DemandLetterGenerator />

            <div className="mt-16 mb-12">
                <h2 className="text-3xl font-black text-center text-blue-900 mb-8 max-w-2xl mx-auto">
                    Master Class: How to Win Your Total Loss Claim
                </h2>
                <Slideshow />
            </div>

            <div className="max-w-2xl mx-auto mt-12 text-center text-gray-500 text-sm">
                <p>Disclaimer: This tool generates a template based on standard Texas insurance codes. It does not constitute legal advice. For complex cases, consult an attorney.</p>
            </div>
        </div>
    );
}
