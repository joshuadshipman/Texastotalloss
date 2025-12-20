import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function LanguageSwitcher() {
    // Basic implementation: if path is /en/..., switch to /es/... and vice versa
    // In a server component, we'd use headers or params. Client components use usePathname.
    // However, this component can be tricky. A simpler way is just two hard links if we know the route.

    // For now, let's just make it a client component that swaps the first segment
    return (
        <div className="flex items-center space-x-2 text-sm font-bold">
            <a href="/en" className="hover:text-amber-400">EN</a>
            <span className="text-gray-400">|</span>
            <a href="/es" className="hover:text-amber-400">ES</a>
        </div>
    );
}
