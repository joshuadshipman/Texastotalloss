import React, { useState, useEffect } from 'react';
import { Search, Brain, Zap, ShieldCheck, Clock, CheckCircle2, AlertCircle, History, BarChart3 } from 'lucide-react';
import { STRATEGY_ROLES } from '@/lib/persona';

export default function ManualResearchPortal() {
    const [topic, setTopic] = useState('');
    const [role, setRole] = useState<string>('Auto');
    const [isRunning, setIsRunning] = useState(false);
    const [history, setHistory] = useState<any[]>([]);
    const [progress, setProgress] = useState<{ step: string; status: 'pending' | 'active' | 'done' }[]>([
        { step: 'Autonomous Persona Assignment', status: 'pending' },
        { step: 'Executive Deep-Dive Research', status: 'pending' },
        { step: 'Adversarial Business Audit', status: 'pending' },
        { step: 'Strategy Refinement & Profitability Pass', status: 'pending' },
        { step: 'Final Production Report', status: 'pending' }
    ]);

    const runResearch = async () => {
        setIsRunning(true);
        try {
            const res = await fetch('/api/research/autonomous', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, role: role === 'Auto' ? undefined : role })
            });
            const data = await res.json();
            if (data.success) {
                // Refresh history after save
                fetchHistory();
            }
        } catch (error) {
            console.error(error);
        } finally {
           setIsRunning(false);
        }
    };

    const fetchHistory = async () => {
        // In a real app, this would be an API call
        // const res = await fetch('/api/research/history');
    };

    return (
        <div className="max-w-6xl mx-auto p-8">
            <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-4 rounded-2xl">
                        <Brain className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tight text-slate-100">Strategy Command Hub</h1>
                        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">24/7 Autonomous Market & Business Research</p>
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center min-w-[120px]">
                        <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Total Burn</p>
                        <p className="text-xl font-black text-primary">$12.45</p>
                    </div>
                    <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center min-w-[120px]">
                        <p className="text-[8px] font-black text-slate-500 uppercase mb-1">Avg Confidence</p>
                        <p className="text-xl font-black text-green-500">89%</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Inputs */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900 p-6 rounded-3xl shadow-xl border border-slate-800">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Research Topic or Concept</label>
                        <textarea 
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                            placeholder="e.g. How to gamify medical log tracking to ensure 'Witness-Stand Quality' documentation..."
                            className="w-full h-32 bg-slate-800 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/50 text-white placeholder:text-slate-600"
                        />
                        
                        <div className="mt-4 flex gap-4">
                            <div className="flex-1">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Assign Persona</label>
                                <select 
                                    value={role}
                                    onChange={e => setRole(e.target.value)}
                                    className="w-full bg-slate-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 text-slate-300"
                                >
                                    <option value="Auto">Auto-Select (Recommended)</option>
                                    {Object.keys(STRATEGY_ROLES).map(k => (
                                        <option key={k} value={k}>{STRATEGY_ROLES[k].name}</option>
                                    ))}
                                </select>
                            </div>
                            <button 
                                onClick={runResearch}
                                disabled={!topic || isRunning}
                                className="self-end px-8 py-3 bg-primary text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-primary/80 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-primary/20"
                            >
                                {isRunning ? <Clock className="animate-spin" size={16} /> : <Zap size={16} />}
                                {isRunning ? 'Running Deep Dive...' : 'Start Autonomous Audit'}
                            </button>
                        </div>
                    </div>

                    {/* Results Area */}
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 min-h-[400px]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                                <BarChart3 size={20} className="text-primary" />
                                Strategy Output
                            </h3>
                            <div className="flex gap-2">
                                <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-white transition-all"><History size={16} /></button>
                            </div>
                        </div>

                        {!isRunning ? (
                            <div className="space-y-6">
                                <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-800">
                                    <p className="text-slate-300 text-sm leading-relaxed leading-extra-loose italic">
                                        Submit a topic above to generate an autonomous executive strategy. The system will recursively refine the plan until it reaches 85% business confidence.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20">
                                <div className="relative mb-6">
                                    <Brain className="w-16 h-16 text-primary animate-pulse" />
                                    <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                                </div>
                                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs animate-bounce">Processing Executive Audit...</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar (Metrics & Loop) */}
                <div className="space-y-6">
                    <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 px-1">Loop Diagnostics</h3>
                        <div className="space-y-6">
                            {progress.map((s, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="mt-1">
                                        {s.status === 'done' ? <CheckCircle2 className="text-green-500" size={18} /> : 
                                         s.status === 'active' ? <Clock className="text-primary animate-spin" size={18} /> : 
                                         <div className="w-[18px] h-[18px] border-2 border-slate-800 rounded-full" />}
                                    </div>
                                    <div>
                                        <p className={`text-[11px] font-black uppercase tracking-tight ${s.status === 'active' ? 'text-primary' : s.status === 'done' ? 'text-slate-300' : 'text-slate-600'}`}>
                                            {s.step}
                                        </p>
                                        {s.status === 'active' && <p className="text-[9px] text-slate-500 italic">Gemini 1.5 Pro Active</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800">
                        <div className="flex items-center gap-2 mb-4">
                            <ShieldCheck className="text-primary" size={16} />
                            <h3 className="text-[10px] font-black text-slate-100 uppercase tracking-widest">Confidence Threshold</h3>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] font-black text-slate-500 uppercase">Current Audit</span>
                            <span className="text-xs font-black text-primary">85% REQ</span>
                        </div>
                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-primary shadow-[0_0_10px_rgba(33,150,243,0.5)]" style={{ width: isRunning ? '65%' : '0%' }} title="Current confidence based on Ops Director Audit" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
