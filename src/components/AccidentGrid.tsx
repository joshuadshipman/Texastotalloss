'use client';

import React, { useState } from 'react';
import { accidentTypes } from '@/data/accidentTypes';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { useChat } from './ChatContext';

import dynamic from 'next/dynamic';
const SectionCard = dynamic(() => import('@/components/SectionCard'));

interface AccidentGridProps {
    dict: any;
}

export default function AccidentGrid({ dict }: AccidentGridProps) {
    const { openChat } = useChat();
    // Fallbacks
    const title = dict?.accident_grid?.title || "Common Auto Accident Types";
    const sub = dict?.accident_grid?.subtitle || "We have specialized strategies for every scenario to maximize your recovery.";

    return (
        <section className="py-16 bg-white border-t border-gray-100">
            <div className="max-w-4xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-black text-blue-900 mb-4 uppercase tracking-wide">
                        {title}
                    </h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        {sub}
                    </p>
                </div>

                {/* Condensed Card Container */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Header inside card (Optional, or keep clean) */}
                    <div className="bg-blue-50 p-4 border-b border-blue-100 flex justify-between items-center">
                        <span className="text-sm font-bold text-blue-800 uppercase tracking-wider">Select Your Accident Type</span>
                        <span className="text-xs text-blue-500">Scroll for more ↓</span>
                    </div>

                    {/* Scrollable Area */}
                    <div className="h-[320px] overflow-y-auto p-4 space-y-3 custom-scrollbar bg-gray-50/50">
                        {accidentTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                                <SectionCard
                                    key={type.id}
                                    title={type.title}
                                    subtitle="Click for strategy" // Shortened subtitle
                                    icon={<Icon size={20} />}
                                    colorClass={type.color}
                                >
                                    <div className="space-y-6">
                                        {/* Stats Row */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {type.stats.map((stat, idx) => (
                                                <div key={idx} className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                                                    <div className={`text-2xl font-black ${type.color.replace('bg-', 'text-')}`}>
                                                        {stat.value}
                                                    </div>
                                                    <div className="text-xs font-bold text-gray-500 uppercase">
                                                        {stat.label}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Description */}
                                        <div>
                                            <h3 className="font-bold text-lg mb-2 text-gray-900">Case Strategy</h3>
                                            <p className="text-gray-700 leading-relaxed text-lg">
                                                {type.description}
                                            </p>
                                        </div>

                                        {/* CTA */}
                                        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex justify-between items-center">
                                            <div>
                                                <p className="font-bold text-blue-900">Involved in this type of crash?</p>
                                                <p className="text-sm text-blue-600">Get a free specialized case review now.</p>
                                            </div>
                                            <button
                                                onClick={() => openChat('standalone')}
                                                className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-blue-700 transition"
                                            >
                                                Start Review
                                            </button>
                                        </div>
                                    </div>
                                </SectionCard>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
