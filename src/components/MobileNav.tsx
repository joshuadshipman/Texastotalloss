'use client';

import { HomeIcon, CalculatorIcon, FileTextIcon, MessageCircleIcon, SearchIcon } from 'lucide-react';
import { useChat } from './ChatContext';
import Link from 'next/link';

export default function MobileNav() {
    const { openChat } = useChat();

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40 pb-safe">
            <div className="flex justify-around items-center p-3">
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex flex-col items-center gap-1 text-gray-500 hover:text-blue-600">
                    <HomeIcon size={20} />
                    <span className="text-[10px] font-medium">Home</span>
                </button>

                <button onClick={() => scrollToSection('calculator')} className="flex flex-col items-center gap-1 text-gray-500 hover:text-blue-600">
                    <CalculatorIcon size={20} />
                    <span className="text-[10px] font-medium">Value</span>
                </button>

                <div className="relative -top-5">
                    <button
                        onClick={() => openChat()}
                        className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition transform active:scale-95 border-4 border-gray-50"
                    >
                        <MessageCircleIcon size={24} />
                    </button>
                </div>

                <Link href="/checklist" className="flex flex-col items-center gap-1 text-gray-500 hover:text-blue-600">
                    <FileTextIcon size={20} />
                    <span className="text-[10px] font-medium">Checklist</span>
                </Link>

                <button onClick={() => scrollToSection('faq')} className="flex flex-col items-center gap-1 text-gray-500 hover:text-blue-600">
                    <SearchIcon size={20} />
                    <span className="text-[10px] font-medium">Search</span>
                </button>
            </div>
        </div>
    );
}
