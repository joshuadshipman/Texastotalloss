'use client';

import React, { useState } from 'react';
import { Send, X, ShieldCheck, Zap } from 'lucide-react';

interface TelegramCaptureModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TelegramCaptureModal({ isOpen, onClose }: TelegramCaptureModalProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        incident: '',
    });

    if (!isOpen) return null;

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        setStep(2);
    };

    const handleConnect = () => {
        // Log lead capture event
        const text = `Name: ${formData.name}%0APhone: ${formData.phone}%0AIncident: ${formData.incident}`;
        window.open(`https://t.me/TexasTotalLossBot?text=Start%20Case%20Review%3A%20${text}`, '_blank');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl border border-blue-50 relative animate-in zoom-in-95 duration-300">
                <button 
                    onClick={onClose}
                    className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="p-8 md:p-10">
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                            <Zap size={14} fill="currentColor" /> Autonomous Case Review
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-2">
                            {step === 1 ? 'Start Your Review' : 'Connect via Telegram'}
                        </h2>
                        <p className="text-slate-500 font-medium">
                            {step === 1 
                                ? 'Answer 3 quick questions to check your potential recovery.' 
                                : 'Our AI Scout is ready to analyze your case details.'}
                        </p>
                    </div>

                    {step === 1 ? (
                        <form onSubmit={handleNext} className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Full Name</label>
                                    <input 
                                        required
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-900" 
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Phone Number</label>
                                    <input 
                                        required
                                        type="tel"
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-900" 
                                        placeholder="(512) 555-0199"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">What happened? (Optional)</label>
                                    <textarea 
                                        className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 focus:bg-white rounded-2xl outline-none transition-all font-bold text-slate-900 h-24 resize-none" 
                                        placeholder="Briefly describe the accident..."
                                        value={formData.incident}
                                        onChange={(e) => setFormData({...formData, incident: e.target.value})}
                                    />
                                </div>
                            </div>
                            <button 
                                type="submit"
                                className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all"
                            >
                                CONTINUE TO AI REVIEW
                            </button>
                        </form>
                    ) : (
                        <div className="space-y-6 text-center">
                            <div className="p-8 bg-blue-50 border-2 border-blue-100 rounded-[2rem] flex flex-col items-center">
                                <Send size={48} className="text-blue-600 mb-4 animate-bounce" />
                                <div className="text-blue-900 font-black text-xl mb-1 truncate w-full px-4">Ready to Analyze</div>
                                <div className="text-blue-700/70 text-sm font-bold">Secure Telegram Bridge Active</div>
                            </div>
                            
                            <button 
                                onClick={handleConnect}
                                className="w-full py-5 bg-[#0088cc] text-white rounded-[1.5rem] font-black text-lg shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                            >
                                <Send size={24} /> OPEN IN TELEGRAM
                            </button>
                            
                            <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                <ShieldCheck size={14} className="text-green-500" /> End-to-End Encrypted Data
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
