'use client';

import React, { useState } from 'react';
import { Shield, FileText, Download, Check, AlertCircle } from 'lucide-react';

interface LopProps {
    leadName: string;
    providerName?: string;
    date: string;
    caseId: string;
}

export default function LopGenerator({ leadName, providerName = "[Provider Name]", date, caseId }: LopProps) {
    const [status, setStatus] = useState<'idle' | 'generating' | 'ready'>('idle');

    const handleGenerate = () => {
        setStatus('generating');
        setTimeout(() => setStatus('ready'), 1200);
    };

    return (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
                <Shield className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 uppercase text-xs tracking-wider">LOP (Letter of Protection) Generator</h3>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-6 font-serif text-[10px] leading-relaxed text-slate-600">
                <p className="font-bold mb-2">RE: Letter of Protection for {leadName}</p>
                <p className="mb-2">To: {providerName}</p>
                <p>Please be advised that this office represents {leadName} in connection with a motor vehicle incident occurring on {date}. We hereby issue this Letter of Protection (LOP) ensuring payment for services rendered from any settlement or judgment...</p>
            </div>

            {status === 'idle' && (
                <button 
                    onClick={handleGenerate}
                    className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-sm"
                >
                    <FileText className="w-4 h-4" />
                    Generate Legal LOP
                </button>
            )}

            {status === 'generating' && (
                <div className="w-full py-3 bg-slate-200 text-slate-500 font-bold rounded-xl flex items-center justify-center gap-2 text-sm animate-pulse">
                    Drafting Statutory Language...
                </div>
            )}

            {status === 'ready' && (
                <div className="space-y-2">
                    <button className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 text-sm">
                        <Download className="w-4 h-4" />
                        Download Signed PDF
                    </button>
                    <div className="flex items-center justify-center gap-1 text-[10px] text-green-600 font-bold">
                        <Check className="w-3 h-3" />
                        Verification Hash: {caseId.substring(0,8)}-LOP
                    </div>
                </div>
            )}

            <div className="mt-4 flex items-start gap-2 italic">
                <AlertCircle className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-slate-400">
                    This LOP is a binding agreement to pay the provider from the gross recovery of the "Total Loss" settlement.
                </p>
            </div>
        </div>
    );
}

