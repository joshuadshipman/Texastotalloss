'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
    // Basic implementation: if path is /en/..., switch to /es/... and vice versa
    // In a server component, we'd use headers or params. Client components use usePathname.
    // However, this component can be tricky. A simpler way is just two hard links if we know the route.

    // For now, let's just make it a client component that swaps the first segment
    return (
        <div className="flex items-center space-x-3 text-sm font-bold bg-black/30 backdrop-blur-md text-white px-4 py-2 rounded-full border border-white/20 shadow-lg transition-all hover:bg-black/40">
            <a href="/en" className="hover:text-amber-300 transition-colors">EN</a>
            <span className="text-white/40">|</span>
            <a href="/es" className="hover:text-amber-300 transition-colors">ES</a>
        </div>
    );
}
