'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
    // Basic implementation: if path is /en/..., switch to /es/... and vice versa
    // In a server component, we'd use headers or params. Client components use usePathname.
    // However, this component can be tricky. A simpler way is just two hard links if we know the route.

    // For now, let's just make it a client component that swaps the first segment
    return (
        <div className="flex items-center space-x-3 text-sm font-bold bg-black/60 backdrop-blur-md text-white px-5 py-3 rounded-full border border-white/20 shadow-2xl transition-all hover:bg-black/80 hover:scale-105 active:scale-95">
            <a href="/en" className={`transition-colors ${usePathname()?.startsWith('/en') ? 'text-white' : 'text-white/50 hover:text-white'}`}>EN</a>
            <span className="text-white/20">|</span>
            <a href="/es" className={`transition-colors ${usePathname()?.startsWith('/es') ? 'text-amber-400' : 'text-white/50 hover:text-amber-300'}`}>ES</a>
        </div>
    );
}
