'use client';

import React, { useState } from 'react';
import { accidentTypes } from '@/data/accidentTypes';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

import dynamic from 'next/dynamic';
const SectionCard = dynamic(() => import('@/components/SectionCard'));

interface AccidentGridProps {
    dict: any;
}

export default function AccidentGrid({ dict }: AccidentGridProps) {
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

                <div className="flex flex-col gap-4">
                    {accidentTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                            <SectionCard
                                key={type.id}
                                title={type.title}
                                subtitle="Click to learn about our strategy for this accident type."
                                icon={<Icon size={24} />}
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
                                        <button className="bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow hover:bg-blue-700 transition">
                                            Start Review
                                        </button>
                                    </div>
                                </div>
                            </SectionCard>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
