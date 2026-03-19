'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Activity, Shield, Zap, Info, Loader2, Maximize2, Minimize2, Paperclip, ImageIcon } from 'lucide-react';
import { supabaseClient } from '../../lib/supabaseClient';

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
            content: 'GravityClaw v1.0.9 [MOBILE_OPTIMIZED] Link Established.', 
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
                    context: { source: 'Mobile_Clawbot_Shell', version: '2026.1' }
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
            const { error } = await supabaseClient.storage
                .from('scout-attachments')
                .upload(fileName, file);

            if (error) throw error;

            const { data: { publicUrl } } = supabaseClient.storage
                .from('scout-attachments')
                .getPublicUrl(fileName);

            setLogs(prev => [...prev, { 
                type: 'input', 
                content: `Attached Image: ${file.name}`, 
                timestamp: new Date() 
            }]);

            // Automatically send the image URL to the agent
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
        <div className={`flex flex-col h-full bg-slate-950 font-mono text-[13px] text-slate-300 transition-all duration-500 overflow-hidden ${isExpanded ? 'fixed inset-0 z-[100]' : 'relative'}`}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800 shadow-lg">
                <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span className="font-black text-slate-100 italic tracking-[0.2em] text-[10px] uppercase">G-CLAW.v1</span>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 ml-2">
                        <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-[8px] text-emerald-400 uppercase font-black">Linked</span>
                    </div>
                </div>
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1.5 text-slate-500 hover:text-white transition-colors"
                >
                    {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
            </div>

            {/* Terminal Logs */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 pb-32 md:pb-24"
            >
                {logs.map((log, i) => (
                    <div key={i} className="animate-in fade-in slide-in-from-bottom-2 duration-400">
                        <div className="flex items-start gap-3">
                            <span className="text-[10px] text-slate-600 mt-0.5 opacity-50">{log.timestamp.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}</span>
                            
                            <div className="flex-1 space-y-2">
                                <div className="flex items-start gap-2">
                                    {log.type === 'input' && <span className="text-emerald-500 font-black mt-0.5 select-none opacity-50">&gt;</span>}
                                    {log.type === 'system' && <div className="w-1.5 h-3 bg-blue-500 mt-1 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
                                    {log.type === 'error' && <div className="w-1.5 h-3 bg-rose-500 mt-1 animate-pulse" />}
                                    {log.type === 'output' && <Zap size={14} className="text-amber-400 mt-0.5 fill-amber-400/20" />}
                                    
                                    <span className={`block leading-relaxed tracking-tight ${
                                        log.type === 'input' ? 'text-white font-bold opacity-90' :
                                        log.type === 'error' ? 'text-rose-400' :
                                        log.type === 'system' ? 'text-blue-300 italic' :
                                        'text-amber-100 font-medium'
                                    }`}>
                                        {log.content}
                                    </span>
                                </div>

                                {log.interpretation && (
                                    <div className="ml-2 p-3 bg-slate-800/40 rounded-xl border border-white/5 backdrop-blur-md space-y-2 group hover:border-emerald-500/30 transition-all">
                                        <div className="flex items-center justify-between">
                                            <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 font-black uppercase text-[9px] tracking-widest border border-emerald-500/20">
                                                {log.interpretation.type}
                                            </span>
                                            <span className="text-[9px] text-slate-500 font-mono tracking-tighter uppercase opacity-30">Status: En Route</span>
                                        </div>
                                        <div className="text-slate-300 text-[11px] font-bold leading-snug">
                                            {log.interpretation.action_summary}
                                        </div>
                                        <div className="flex items-center gap-2 text-[9px]">
                                            <span className="text-slate-500">Target:</span>
                                            <span className="text-emerald-300 font-mono">{log.interpretation.target}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex items-center gap-3 text-slate-500 ml-12 py-2">
                        <div className="flex gap-1">
                            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce" />
                        </div>
                        <span className="text-[10px] uppercase font-black tracking-widest opacity-50">Syncing with Core...</span>
                    </div>
                )}
            </div>

            <div className="absolute bottom-4 left-0 right-0 px-4 md:bottom-2">
                <form 
                    onSubmit={handleCommand}
                    className="glass-card rounded-2xl p-1.5 flex items-center gap-2 shadow-2xl border-white/10 backdrop-blur-3xl bg-slate-900/40"
                >
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Direct dispatch to agent..."
                            disabled={isTyping || uploading}
                            className="w-full bg-transparent rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none text-[16px] font-medium"
                        />
                    </div>
                    
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        className="hidden" 
                        accept="image/*"
                    />

                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isTyping || uploading}
                        className="p-3 text-slate-400 hover:text-emerald-400 transition-colors disabled:opacity-20"
                    >
                        {uploading ? <Loader2 size={18} className="animate-spin" /> : <Paperclip size={18} />}
                    </button>

                    <button
                        type="submit"
                        disabled={!input.trim() || isTyping || uploading}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-xl transition-all active:scale-90 shadow-lg shadow-emerald-500/20 disabled:opacity-20 flex items-center justify-center"
                    >
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default GravityClawShell;
