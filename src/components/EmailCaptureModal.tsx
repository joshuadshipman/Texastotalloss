'use client';

import { useState } from 'react';
import { XIcon, LockIcon, FileTextIcon, Loader2Icon } from 'lucide-react';

interface EmailCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (email: string) => Promise<void>;
    title?: string;
    description?: string;
}

export default function EmailCaptureModal({ isOpen, onClose, onSubmit, title, description }: EmailCaptureModalProps) {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address.');
            return;
        }

        setIsLoading(true);
        try {
            await onSubmit(email);
        } catch (err) {
            console.error(err);
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <XIcon size={24} />
                </button>

                {/* Header with Icon */}
                <div className="bg-slate-50 p-8 text-center border-b border-slate-100 flex flex-col items-center">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 shadow-inner">
                        <FileTextIcon size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">{title || "Your Report is Ready"}</h3>
                    <p className="text-slate-500 font-medium">{description || "Enter your email to receive the official PDF report instanty."}</p>
                </div>

                {/* Form */}
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none font-medium text-lg"
                                autoFocus
                            />
                            {error && <p className="text-red-500 text-sm mt-2 font-bold flex items-center gap-1">⚠️ {error}</p>}
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-400 justify-center mb-4">
                            <LockIcon size={12} />
                            <span>We respect your privacy. No spam.</span>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-blue-600/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2Icon className="animate-spin" /> Processing...
                                </>
                            ) : (
                                "Download Report Now »"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
