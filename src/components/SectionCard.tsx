'use client';

import React, { useState } from 'react';
import { XIcon, ChevronRightIcon } from 'lucide-react';

interface SectionCardProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    colorClass: string;
    children: React.ReactNode; // The detailed content
}

export default function SectionCard({ title, subtitle, icon, colorClass, children }: SectionCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Prevent scrolling when modal is open
    // useEffect(() => {
    //     if (isOpen) document.body.style.overflow = 'hidden';
    //     else document.body.style.overflow = 'unset';
    // }, [isOpen]); 
    // Simplified for now

    return (
        <>
            {/* Card Trigger */}
            <div
                onClick={() => setIsOpen(true)}
                className={`bg-slate-900 rounded-2xl shadow-sm border border-white/10 p-6 flex items-center justify-between cursor-pointer hover:bg-slate-800 hover:border-gold-500/30 transition active:scale-[0.98] w-full mb-4 group`}
            >
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${colorClass} text-white`}>
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-gold-400 transition-colors">{title}</h3>
                        <p className="text-base text-slate-400">{subtitle}</p>
                    </div>
                </div>
                <ChevronRightIcon className="text-gray-400" />
            </div>

            {/* Modal Content */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                    onClick={() => setIsOpen(false)} // Click backdrop to close
                >
                    <div
                        className="bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200 border border-white/10"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                    >
                        {/* Header */}
                        <div className={`p-4 ${colorClass} text-white flex justify-between items-center shrink-0`}>
                            <div className="flex items-center gap-3">
                                {icon}
                                <h2 className="text-xl font-bold">{title}</h2>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="p-2 hover:bg-white/20 rounded-full transition">
                                <XIcon size={24} />
                            </button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/50">
                            {children}
                        </div>

                        <div className="p-4 border-t border-white/10 bg-slate-900 shrink-0 text-center">
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                                className="text-slate-500 hover:text-white font-medium text-sm"
                            >
                                Close / Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
