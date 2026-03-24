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
                className={`bg-slate-900/40 backdrop-blur-xl rounded-[2.5rem] shadow-[0_16px_50px_rgba(0,0,0,0.2)] border border-white/10 p-10 flex items-center justify-between cursor-pointer hover:bg-slate-800 hover:border-gold-500/50 hover:shadow-gold-500/5 transition-all duration-500 active:scale-[0.98] w-full mb-8 group relative overflow-hidden`}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-gold-500/0 via-gold-500/10 to-gold-500/0 -translate-x-full group-hover:animate-shimmer duration-1000"></div>
                
                <div className="flex items-center gap-8 relative z-10">
                    <div className={`w-20 h-20 rounded-[2rem] ${colorClass} text-white flex items-center justify-center shadow-[0_8px_30px_rgba(0,0,0,0.3)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 border border-white/20`}>
                        {React.cloneElement(icon as React.ReactElement<any>, { size: 32 })}
                    </div>
                    <div className="text-left">
                        <h3 className="text-2xl md:text-3xl font-black text-white group-hover:text-gold-400 transition-colors tracking-tight leading-none mb-2">{title}</h3>
                        <p className="text-xs md:text-sm text-slate-400 font-black uppercase tracking-[0.3em] opacity-50 group-hover:opacity-100 group-hover:text-gold-500/80 transition-all">{subtitle}</p>
                    </div>
                </div>
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gold-500 group-hover:text-navy-900 group-hover:shadow-[0_0_30px_rgba(234,179,8,0.4)] transition-all duration-500 relative z-10 border border-white/5">
                    <ChevronRightIcon size={24} className="text-slate-500 group-hover:text-inherit" />
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
