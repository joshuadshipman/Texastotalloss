'use client';

import { HomeIcon, CalculatorIcon, FileTextIcon, MessageCircleIcon, SearchIcon } from 'lucide-react';
import { useChat } from './ChatContext';
import Link from 'next/link';

import { Dictionary } from '@/dictionaries/en';

interface MobileNavProps {
    dict?: Dictionary;
}

export default function MobileNav({ dict }: MobileNavProps) {
    const { openChat } = useChat();

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-slate-900 border-t border-white/10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)] z-40 pb-safe">
            <div className="flex justify-around items-center p-3">
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors">
                    <HomeIcon size={20} />
                    <span className="text-[10px] font-medium">{dict?.nav?.home || "Home"}</span>
                </button>

                <button onClick={() => scrollToSection('calculator')} className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors">
                    <CalculatorIcon size={20} />
                    <span className="text-[10px] font-medium">{dict?.nav?.value || "Value"}</span>
                </button>

                <div className="relative -top-5">
                    <button
                        onClick={() => openChat()}
                        className="bg-gold-500 text-navy-900 p-4 rounded-full shadow-lg hover:bg-gold-400 transition transform active:scale-95 border-4 border-slate-900"
                    >
                        <MessageCircleIcon size={24} />
                    </button>
                </div>

                <Link href="/checklist" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors">
                    <FileTextIcon size={20} />
                    <span className="text-[10px] font-medium">{dict?.nav?.checklist || "Checklist"}</span>
                </Link>

                <Link href="#resources" className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors">
                    <SearchIcon size={20} />
                    <span className="text-[10px] font-medium">{dict?.nav?.resources || "Resources"}</span>
                </Link>
            </div>
        </div>
    );
}
