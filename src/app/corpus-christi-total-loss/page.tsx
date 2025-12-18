'use client';

import React from 'react';
import ChatWidget from '@/components/ChatWidget';
import { useChat } from '@/components/ChatContext';

export default function CorpusChristiTotalLossPage() {
    const { openChat } = useChat();

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <section className="bg-blue-900 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
                        Is My Vehicle a Total Loss After a <span className="text-yellow-400">Corpus Christi</span> Crash?
                    </h1>
                    <p className="text-xl max-w-3xl mx-auto mb-8 text-blue-100">
                        Help for coastal bend drivers dealing with insurers and towing fees.
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
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Corpus Christi Traffic Risks</h2>
                        <p className="text-slate-700 mb-4">
                            Routes like <strong>I-37, SH 286 (Crosstown), and SPID (SH 358)</strong> see heavy tourist and port traffic.
                            Salt air exposure and coastal conditions can also impact vehicle valuation arguments in this region.
                        </p>
                        <p className="text-slate-700">
                            If your car is totaled, make sure the offer isn't unfairly reduced by claims of "rust" or "condition" that aren't accurate.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Towing Info */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-red-500">
                            <h3 className="text-xl font-bold text-slate-900 mb-3">🚗 Corpus Christi Towing</h3>
                            <p className="text-slate-600 text-sm mb-3">
                                CCPD uses the <strong>City Impound Lot</strong>.
                            </p>
                            <div className="bg-slate-100 p-3 rounded text-sm">
                                <strong>Action Plan:</strong>
                                <ul className="list-disc ml-5 mt-1 space-y-1">
                                    <li>Locate your car via the <strong>City of Corpus Christi</strong> impound search.</li>
                                    <li>Pay fees and move it ASAP. Storage fees add up quickly.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Appraiser Info */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                            <h3 className="text-xl font-bold text-slate-900 mb-3">🔍 Corpus Christi Appraisers</h3>
                            <p className="text-slate-600 text-sm mb-3">
                                Find a Coastal Bend expert.
                            </p>
                            <div className="bg-slate-100 p-3 rounded text-sm">
                                <strong>Search Tips:</strong>
                                <ul className="list-disc ml-5 mt-1 space-y-1">
                                    <li>Search "Corpus Christi auto appraiser" or "Nueces County total loss expert".</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* TDI & FAQ */}
            <section className="py-16 bg-slate-100 border-t border-slate-200">
                <div className="container mx-auto max-w-4xl px-4">
                    <h2 className="text-3xl font-bold text-center mb-10">Corpus Christi FAQ</h2>

                    <div className="space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h3 className="font-bold text-lg mb-2 text-blue-900">Where do I file an insurance complaint?</h3>
                            <p className="text-slate-600">
                                Use the <a href="https://www.tdi.texas.gov/" target="_blank" className="text-blue-600 underline hover:text-blue-800">TDI online portal</a>.
                                It is the same for all Texas residents.
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
