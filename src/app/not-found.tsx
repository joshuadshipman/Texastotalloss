import Link from 'next/link';
import { HomeIcon, SearchIcon, AlertTriangleIcon } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-center font-sans">
            <div className="bg-slate-900 border border-white/10 p-8 rounded-2xl shadow-2xl max-w-lg w-full">
                <div className="bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5 shadow-inner">
                    <AlertTriangleIcon size={40} className="text-gold-500" />
                </div>

                <h1 className="text-6xl font-black text-white mb-2">404</h1>
                <h2 className="text-2xl font-bold text-slate-300 mb-6 uppercase tracking-wider">Page Not Found</h2>

                <p className="text-slate-400 mb-8 border-t border-b border-white/5 py-4">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>

                <div className="space-y-3">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 w-full bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold py-3 px-6 rounded-xl transition shadow-lg shadow-gold-900/20"
                    >
                        <HomeIcon size={18} /> Return Home
                    </Link>

                    <Link
                        href="/en/locations"
                        className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 px-6 rounded-xl transition border border-white/10"
                    >
                        <SearchIcon size={18} /> Browse City Guides
                    </Link>
                </div>
            </div>

            <p className="mt-8 text-slate-600 text-sm">
                Texas Total Loss - AI Accident Assistance
            </p>
        </div>
    );
}
