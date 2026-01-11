'use client';

import React, { useState } from 'react';
import { ChevronDown, MapPin } from 'lucide-react';

interface Neighborhood {
    name: string;
    desc: string;
}

interface Props {
    title: string;
    neighborhoods: Neighborhood[];
}

export default function NeighborhoodAccordion({ title, neighborhoods }: Props) {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggle = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 p-4 border-b border-slate-200">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <MapPin className="text-blue-600" size={20} />
                    {title}
                </h3>
            </div>

            <div className="divide-y divide-slate-100">
                {neighborhoods.map((hood, idx) => (
                    <div key={idx} className="group">
                        <button
                            onClick={() => toggle(idx)}
                            className="w-full text-left p-4 flex justify-between items-center hover:bg-slate-50 transition-colors"
                        >
                            <span className="font-serif font-bold text-slate-700">{hood.name} Total Loss Claims</span>
                            <ChevronDown
                                className={`text-slate-400 transition-transform duration-300 ${openIndex === idx ? 'rotate-180' : ''}`}
                                size={18}
                            />
                        </button>
                        <div
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                        >
                            <div className="p-4 pt-0 text-slate-600 text-sm leading-relaxed">
                                {hood.desc}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="bg-slate-50 p-3 text-xs text-center text-slate-400">
                Helping accident victims in all {neighborhoods.length} neighborhoods
            </div>
        </div>
    );
}
