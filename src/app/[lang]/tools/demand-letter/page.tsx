'use client';

import React from 'react';
import DemandLetterGenerator from '@/components/DemandLetterGenerator';
import Link from 'next/link';

export default function DemandLetterPage() {
    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4">
            <div className="max-w-4xl mx-auto mb-8">
                <Link href="/" className="text-gray-500 hover:text-blue-600 font-bold mb-4 inline-block">&larr; Back to Home</Link>
                <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">Total Loss <span className="text-blue-600">Demand Generator</span></h1>
                <p className="text-xl text-gray-600">
                    Insurance company offering you less than your car is worth?
                    <br />Generate a professional legal demand letter in 30 seconds.
                </p>
            </div>

            <DemandLetterGenerator />

            <div className="max-w-2xl mx-auto mt-12 text-center text-gray-500 text-sm">
                <p>Disclaimer: This tool generates a template based on standard Texas insurance codes. It does not constitute legal advice. For complex cases, consult an attorney.</p>
            </div>
        </div>
    );
}
