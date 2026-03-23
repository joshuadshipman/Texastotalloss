'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Activity, Shield, Zap, Info, Loader2, Maximize2, Minimize2, Paperclip, RefreshCwIcon } from 'lucide-react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface LogEntry {
    type: 'input' | 'output' | 'system' | 'error';
    content: string;
    timestamp: Date;
    interpretation?: any;
}

const GravityClawShell = () => {
    const [input, setInput] = useState('');
    const [logs, setLogs] = useState<LogEntry[]>([
        { 
            type: 'system', 
            content: 'GravityClaw PRIME v1.1.0 [CORE_SYNC_READY] Link Established.', 
            timestamp: new Date() 
        }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [uploading, setUploading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs, isTyping]);

    const handleCommand = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isTyping) return;

        const cmd = input.trim();
        setInput('');
        setLogs(prev => [...prev, { type: 'input', content: cmd, timestamp: new Date() }]);
        setIsTyping(true);

        try {
            const response = await fetch('/api/admin/command', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    command: cmd,
                    context: { source: 'Mobile_Clawbot_Shell', version: '1.1.0' }
                })
            });

            const data = await response.json();

            if (data.success) {
                setLogs(prev => [...prev, { 
                    type: 'output', 
                    content: data.message || 'Transmission received by core.', 
                    timestamp: new Date(),
                    interpretation: data.interpretation
                }]);
            } else {
                setLogs(prev => [...prev, { 
                    type: 'error', 
                    content: `Link Error: ${data.message || 'Core refused connection.'}`, 
                    timestamp: new Date() 
                }]);
            }
        } catch (err) {
            setLogs(prev => [...prev, { 
                type: 'error', 
                content: 'Critical Link Failure: core-not-reachable', 
                timestamp: new Date() 
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const fileName = `${Date.now()}-${file.name}`;
        
        try {
            const storageRef = ref(storage, `scout-attachments/${fileName}`);
            await uploadBytes(storageRef, file);
            const publicUrl = await getDownloadURL(storageRef);

            setLogs(prev => [...prev, { 
                type: 'input', 
                content: `Attached Image: ${file.name}`, 
                timestamp: new Date() 
            }]);

            const response = await fetch('/api/admin/command', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    command: `I am attaching a screenshot: ${publicUrl}. Please analyze it.`,
                    context: { source: 'Mobile_Clawbot_Shell', has_image: true, image_url: publicUrl }
                })
            });

            const result = await response.json();
            if (result.success) {
                setLogs(prev => [...prev, { 
                    type: 'output', 
                    content: result.interpretation?.response || 'Image analyzed.', 
                    timestamp: new Date()
                }]);
            }
        } catch (err: any) {
            setLogs(prev => [...prev, { 
                type: 'error', 
                content: `Upload Failed: ${err.message}`, 
                timestamp: new Date() 
            }]);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={`relative flex flex-col h-full bg-slate-950 font-mono text-xs text-blue-100 overflow-hidden transition-all duration-500 ${isExpanded ? 'fixed inset-0 z-50 p-4' : 'rounded-2xl border border-blue-500/30 shadow-2xl shadow-blue-900/10'}`}>
            
            {/* Ultra-Visible Prime Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 border-b border-blue-500/30">
                <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-blue-500 rounded-lg animate-pulse">
                        <Zap size={16} className="text-white" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-black text-blue-400 tracking-tighter text-sm">ANTIGRAVITY // PRIME</span>
                            <span className="bg-blue-500/20 text-blue-400 text-[9px] px-1.5 py-0.5 rounded border border-blue-500/30">v1.1.0</span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                            <span className="text-[10px] text-emerald-400/80 font-bold uppercase tracking-widest">Link Secured</span>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => setLogs(p => [...p, { type: 'system', content: 'Manual Environment Refresh...', timestamp: new Date() }])}
                        className="p-2 hover:bg-white/5 rounded-lg text-blue-400 transition-colors"
                        title="Sync"
                    >
                        <RefreshCwIcon size={16} />
                    </button>
                    <button 
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2 hover:bg-white/5 rounded-lg text-blue-400 transition-colors"
                    >
                        {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
                    </button>
                </div>
            </div>

            {/* Terminal Feed */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-blue-900/50"
                style={{ 
                    backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(29, 78, 216, 0.05) 0%, transparent 100%)',
                    scrollBehavior: 'smooth'
                }}
            >
                {logs.map((log, i) => (
                    <div key={i} className={`flex flex-col gap-1.5 ${log.type === 'input' ? 'items-end' : 'items-start animate-in fade-in slide-in-from-left-2 duration-300'}`}>
                        <div className="flex items-center gap-2 px-2">
                            <span className="text-[9px] text-slate-600">
                                {log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                            <span className={`text-[9px] font-black uppercase tracking-widest ${
                                log.type === 'input' ? 'text-blue-500' : 
                                log.type === 'error' ? 'text-red-500' : 
                                log.type === 'system' ? 'text-emerald-500' : 'text-indigo-400'
                            }`}>
                                {log.type === 'input' ? 'User' : 'Core'}
                            </span>
                        </div>
                        
                        <div className={`max-w-[90%] p-3 rounded-2xl border ${
                            log.type === 'input' 
                            ? 'bg-blue-600/10 border-blue-500/30 text-blue-50 text-[13px] rounded-tr-none' 
                            : log.type === 'error'
                            ? 'bg-red-500/10 border-red-500/30 text-red-200 text-[13px]'
                            : log.type === 'system'
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100 font-bold text-[11px]'
                            : 'bg-slate-900/80 border-slate-800 text-slate-100 text-[13px] leading-relaxed backdrop-blur-md shadow-xl rounded-tl-none'
                        }`}>
                            <div className="flex items-start gap-2">
                                {log.type === 'system' && <Shield size={14} className="mt-0.5 text-emerald-500" />}
                                {log.type === 'error' && <Info size={14} className="mt-0.5 text-red-500" />}
                                <div className="whitespace-pre-wrap">{log.content}</div>
                            </div>

                            {log.interpretation && (
                                <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-2 gap-2">
                                    <div className="bg-white/5 p-2 rounded border border-white/10">
                                        <div className="text-[8px] uppercase text-slate-500 font-black">Intent Detected</div>
                                        <div className="text-[10px] text-blue-400 truncate font-bold">{log.interpretation.intent}</div>
                                    </div>
                                    <div className="bg-white/5 p-2 rounded border border-white/10">
                                        <div className="text-[8px] uppercase text-slate-500 font-black">Protocol</div>
                                        <div className="text-[10px] text-emerald-400 uppercase font-bold">{log.interpretation.type}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex flex-col gap-1.5 items-start">
                        <div className="flex items-center gap-2 px-2">
                            <span className="text-[9px] text-blue-400 animate-pulse font-black uppercase tracking-widest">Core Thinking...</span>
                        </div>
                        <div className="bg-slate-900/50 p-2.5 rounded-xl border border-slate-800 flex gap-1.5">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Controls - Deep Mobile Spacing */}
            <div className="p-4 bg-slate-950/90 backdrop-blur-2xl border-t border-blue-500/20 pb-12 md:pb-6 relative z-20">
                <form onSubmit={handleCommand} className="flex flex-col gap-3">
                    <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleCommand(e);
                                }
                            }}
                            placeholder="Type command locally..."
                            className="relative w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 pr-16 text-[16px] text-blue-50 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all resize-none min-h-[56px] max-h-32"
                            rows={1}
                        />
                        <button 
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className={`absolute right-2.5 bottom-2.5 p-2 rounded-xl transition-all ${
                                input.trim() && !isTyping 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 hover:scale-110 active:scale-95' 
                                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                            }`}
                        >
                            {isTyping ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                        </button>
                    </div>

                    <div className="flex items-center justify-between px-1">
                        <button 
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-bold text-slate-400 hover:text-blue-400 transition-all active:scale-95"
                        >
                            <Paperclip size={14} />
                            Log File
                            {uploading && <Loader2 size={12} className="animate-spin" />}
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileUpload}
                            className="hidden" 
                            accept="image/*,.log,.txt"
                        />
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                            <Shield size={10} />
                            <span>Link: Encrypted</span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GravityClawShell;
