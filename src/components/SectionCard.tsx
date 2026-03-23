'use client';

import React, { useState } from 'react';
import { XIcon, ChevronRightIcon } from 'lucide-react';

export interface SectionCardProps {
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    colorClass: string;
    children: React.ReactNode; // The detailed content
}

export default function SectionCard({ title, subtitle, icon, colorClass, children }: SectionCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Prevent scrolling when modal is open
    React.useEffect(() => {
        if (isOpen) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isOpen]);

    return (
        <>
            {/* Card Trigger */}
            <div
                onClick={() => setIsOpen(true)}
                className={`bg-slate-900/50 backdrop-blur-md rounded-[2rem] shadow-sm border border-white/5 p-6 md:p-8 flex items-center justify-between cursor-pointer hover:bg-slate-800 hover:border-gold-500/40 transition-all duration-300 active:scale-[0.98] w-full mb-6 group relative overflow-hidden`}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-gold-500/0 via-gold-500/5 to-gold-500/0 -translate-x-full group-hover:animate-shimmer"></div>
                
                <div className="flex items-center gap-6 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl ${colorClass} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                        {icon}
                    </div>
                    <div className="text-left">
                        <h3 className="text-xl md:text-2xl font-black text-white group-hover:text-gold-400 transition-colors tracking-tight">{title}</h3>
                        <p className="text-sm md:text-base text-slate-400 font-medium uppercase tracking-widest mt-1 opacity-70">{subtitle}</p>
                    </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-navy-900 transition-all duration-300 relative z-10">
                    <ChevronRightIcon size={20} className="text-slate-500 group-hover:text-inherit" />
                </div>
            </div>

            {/* Modal Content */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-[2.5rem] shadow-3xl overflow-hidden flex flex-col relative animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 border border-white/10"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className={`p-8 ${colorClass} text-white flex justify-between items-center shrink-0 relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[60px] rounded-full translate-x-10 -translate-y-10"></div>
                            <div className="flex items-center gap-5 relative z-10">
                                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10 shadow-inner">
                                    {icon}
                                </div>
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-black tracking-tight">{title}</h2>
                                    <p className="text-xs font-bold uppercase tracking-widest text-white/60 mt-1">{subtitle}</p>
                                </div>
                            </div>
                            <button 
                                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} 
                                className="p-4 bg-white/10 hover:bg-white/20 rounded-2xl text-white transition-all active:scale-90 relative z-10 border border-white/10"
                            >
                                <XIcon size={24} />
                            </button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="flex-1 overflow-y-auto p-8 md:p-12 bg-white custom-scrollbar scroll-smooth">
                            <div className="max-w-3xl mx-auto">
                                {children}
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50/50 shrink-0 text-center">
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                                className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-primary hover:border-primary transition-all font-black uppercase tracking-widest text-[10px] active:scale-95 shadow-sm"
                            >
                                {subtitle.includes('Review') ? 'Back to Portal' : 'Close Details'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
