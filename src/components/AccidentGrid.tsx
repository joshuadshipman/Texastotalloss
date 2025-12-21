'use client';

import React, { useState } from 'react';
import { accidentTypes } from '@/data/accidentTypes';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

export default function AccidentGrid() {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-black text-blue-900 mb-4 uppercase tracking-wide">
                        Common Auto Accident Types
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Every crash is unique. We have specialized strategies for every scenario to maximize your recovery.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {accidentTypes.map((type) => {
                        const Icon = type.icon;
                        const isExpanded = expandedId === type.id;

                        return (
                            <div
                                key={type.id}
                                className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 group flex flex-col`}
                            >
                                {/* Header / Hero */}
                                <div className={`${type.color} p-4 text-white flex items-center justify-between`}>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                                            <Icon size={24} className="text-white" />
                                        </div>
                                        <h3 className="font-bold text-lg leading-tight">{type.title}</h3>
                                    </div>
                                </div>

                                {/* Infographic Body */}
                                <div className="p-5 flex-grow flex flex-col justify-between">
                                    <div className="grid grid-cols-3 gap-2 mb-4">
                                        {type.stats.map((stat, idx) => (
                                            <div key={idx} className="text-center p-2 bg-gray-50 rounded-lg border border-gray-100">
                                                <div className={`text-lg font-black ${type.color.replace('bg-', 'text-')}`}>
                                                    {stat.value}
                                                </div>
                                                <div className="text-[10px] font-bold text-gray-400 uppercase leading-tight">
                                                    {stat.label}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                        {type.description}
                                    </p>

                                    <button
                                        className={`w-full py-2 rounded-lg font-bold text-sm transition-colors ${type.color.replace('bg-', 'text-')
                                            } bg-opacity-10 hover:bg-opacity-20 bg-gray-100 group-hover:bg-gray-200`}
                                    >
                                        Get Help for This case &rarr;
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
