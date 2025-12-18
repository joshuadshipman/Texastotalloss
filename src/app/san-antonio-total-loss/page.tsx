'use client';

import React from 'react';
import ChatWidget from '@/components/ChatWidget';
import { useChat } from '@/components/ChatContext';

export default function SanAntonioTotalLossPage() {
    const { openChat } = useChat();

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="bg-blue-900 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                        Is My Vehicle a Total Loss After a <span className="text-yellow-400">San Antonio</span> Accident?
                    </h1>
                    <p className="text-xl max-w-3xl mx-auto mb-8 text-blue-100">
                        Guidance for Bexar County drivers on total loss claims, towing, and valuations.
                    </p>
                    <button
                        onClick={openChat}
                        className="bg-yellow-400 hover:bg-yellow-300 text-blue-900 font-bold py-4 px-8 rounded-full text-lg shadow-lg transition transform hover:scale-105"
                    >
                        🤖 Get a Free Instant Valuation
                    </button>
                </div>
            </section>

            {/* Local Context Section */}
            <section className="py-16 px-4">
                <div className="container mx-auto max-w-4xl">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">San Antonio Roadways & Risks</h2>
                        <p className="text-slate-700 mb-4">
                            With growing congestion on <strong>I-10, I-35, Loop 410, and Loop 1604</strong>, San Antonio sees frequent severe accidents.
                            The mix of construction zones and high-speed traffic often leads to damage that exceeds the "Total Loss Threshold."
                        </p>
                        <p className="text-slate-700">
                            If your airbags deployed or your frame is bent, the insurer will likely total it. Ensure you get fair market value for the San Antonio area.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Towing Info */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
                            <h3 className="text-xl font-bold text-slate-900 mb-3">🚗 Finding Your Towed Car (SA)</h3>
                            <p className="text-slate-600 text-sm mb-3">
                                San Antonio Police (SAPD) and Bexar County Sheriff's Office handle non-consensual tows.
                            </p>
                            <div className="bg-slate-100 p-3 rounded text-sm">
                                <strong>Action Plan:</strong>
                                <ul className="list-disc ml-5 mt-1 space-y-1">
                                    <li>Check the <strong>City of San Antonio Auto Pound</strong> search page.</li>
                                    <li>If handled by the county, check with the Bexar County Sheriff.</li>
                                    <li>fees accrue daily. Do not delay.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Appraiser Info */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                            <h3 className="text-xl font-bold text-slate-900 mb-3">🔍 Detailed Appraisers (Bexar)</h3>
                            <p className="text-slate-600 text-sm mb-3">
                                Local appraisers know the specific value of trucks and SUVs popular in this region.
                            </p>
                            <div className="bg-slate-100 p-3 rounded text-sm">
                                <strong>Search Tips:</strong>
                                <ul className="list-disc ml-5 mt-1 space-y-1">
                                    <li>Search "San Antonio independent auto appraiser" or "Bexar County auto value expert".</li>
                                    <li>Ensure they are licensed in Texas.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TDI & FAQ */}
            <section className="py-16 bg-slate-100 border-t border-slate-200">
                <div className="container mx-auto max-w-4xl px-4">
                    <h2 className="text-3xl font-bold text-center mb-10">San Antonio FAQ</h2>

                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="font-bold text-lg mb-2 text-blue-900">How do I dispute a total loss in San Antonio?</h3>
                            <p className="text-slate-600">
                                Gather "comps" from San Antonio dealerships (not just statewide averages). If the insurer refuses to budge, you can invoke the Appraisal Clause or file a complaint with TDI.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 text-center">
                        <button
                            onClick={openChat}
                            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-8 rounded-full transition"
                        >
                            <span>💬 Start a Free Claim Review</span>
                        </button>
                    </div>
                </div>
            </section>

            <ChatWidget />
        </main>
    );
}
