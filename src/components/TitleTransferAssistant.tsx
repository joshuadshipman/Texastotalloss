'use client';

import React, { useState } from 'react';
import { FileText, Send, CheckCircle, Download, AlertCircle } from 'lucide-react';

export default function TitleTransferAssistant() {
    const [status, setStatus] = useState<'idle' | 'generating' | 'ready'>('idle');

    const handleGenerate = () => {
        setStatus('generating');
        setTimeout(() => setStatus('ready'), 1500);
    };

    return (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-50 rounded-2xl">
                    <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Texas Title Transfer Assistant</h2>
                    <p className="text-sm text-slate-500">Automate your VTR-40 and settlement paperwork.</p>
                </div>
            </div>

            <div className="space-y-4 mb-8">
                <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-slate-400 border border-slate-200 text-xs">VTR</div>
                        <span className="font-semibold text-slate-700">Vehicle Transfer Notification (VTR-40)</span>
                    </div>
                    {status === 'ready' ? <CheckCircle className="w-5 h-5 text-green-500" /> : <div className="w-2 h-2 bg-slate-200 rounded-full" />}
                </div>
                
                <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between border border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-slate-400 border border-slate-200 text-xs">POA</div>
                        <span className="font-semibold text-slate-700">Limited Power of Attorney</span>
                    </div>
                    {status === 'ready' ? <CheckCircle className="w-5 h-5 text-green-500" /> : <div className="w-2 h-2 bg-slate-200 rounded-full" />}
                </div>
            </div>

            {status === 'idle' && (
                <button 
                    onClick={handleGenerate}
                    className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                    <Download className="w-5 h-5" />
                    Generate Settlement Package
                </button>
            )}

            {status === 'generating' && (
                <div className="w-full py-4 bg-slate-100 text-slate-400 font-bold rounded-2xl flex items-center justify-center gap-2 animate-pulse">
                    Populating TxDMV Database...
                </div>
            )}

            {status === 'ready' && (
                <div className="space-y-3">
                    <button className="w-full py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition-all flex items-center justify-center gap-2">
                        <Download className="w-5 h-5" />
                        Download PDF Package
                    </button>
                    <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                        <Send className="w-5 h-5" />
                        E-file with TxDMV via TTL
                    </button>
                    <p className="text-[10px] text-center text-slate-400 italic">
                        By click E-file, you notify the State of Texas that you have transferred ownership of this vehicle.
                    </p>
                </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-slate-500 leading-relaxed">
                    <strong>Why is this important?</strong> Once the title is transferred, you are no longer liable for 
                    parking tickets, tolls, or storage fees incurred by the new owner or the insurance company.
                </p>
            </div>
        </div>
    );
}

