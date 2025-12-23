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
                className={`bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex items-center justify-between cursor-pointer hover:shadow-md transition active:scale-[0.98] w-full mb-4`}
            >
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full ${colorClass} text-white`}>
                        {icon}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
                        <p className="text-base text-gray-600">{subtitle}</p>
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
                        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-200"
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
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
                            {children}
                        </div>

                        <div className="p-4 border-t border-gray-100 bg-white shrink-0 text-center">
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                                className="text-gray-500 hover:text-gray-900 font-medium text-sm"
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
