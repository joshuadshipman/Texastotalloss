
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TerminalIcon, SendIcon, SparklesIcon, FileTextIcon, CodeIcon, SearchIcon } from 'lucide-react';

export default function GravityClawShell() {
    const [input, setInput] = useState('');
    const [logs, setLogs] = useState<{ type: 'user' | 'bot' | 'system', content: string, data?: any }[]>([
        { type: 'bot', content: "SYSTEM: GravityClaw Mobile Command Hub Active. Waiting for instructions..." }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [logs, isTyping]);

    const handleCommand = async () => {
        if (!input.trim()) return;

        const userMsg = input.trim();
        setInput('');
        setLogs(prev => [...prev, { type: 'user', content: userMsg }]);
        setIsTyping(true);

        try {
            const res = await fetch('/api/admin/command', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ command: userMsg })
            });

            const data = await res.json();
            setIsTyping(false);

            if (res.ok) {
                setLogs(prev => [...prev, { 
                    type: 'bot', 
                    content: data.message,
                    data: data.interpretation
                }]);
            } else {
                setLogs(prev => [...prev, { type: 'system', content: `Error: ${data.error}` }]);
            }
        } catch (e) {
            setIsTyping(false);
            setLogs(prev => [...prev, { type: 'system', content: 'Connection failed. Check network or server status.' }]);
        }
    };

    return (
        <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-mono text-sm overflow-hidden">
            {/* Shell Header */}
            <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <TerminalIcon size={16} className="text-green-400" />
                    <span className="font-bold text-xs tracking-tighter uppercase text-slate-400">workspace_cli v1.0.4</span>
                </div>
                <div className="flex gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                    <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                    <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                </div>
            </div>

            {/* Log Display */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 bg-[radial-gradient(circle_at_50%_0%,rgba(16,24,39,1)_0%,rgba(2,6,23,1)_100%)]">
                {logs.map((log, i) => (
                    <div key={i} className={`flex gap-3 ${log.type === 'user' ? 'opacity-80' : ''}`}>
                        <div className="shrink-0 mt-1">
                            {log.type === 'user' ? (
                                <span className="text-blue-400">❯</span>
                            ) : log.type === 'bot' ? (
                                <SparklesIcon size={14} className="text-purple-400" />
                            ) : (
                                <span className="text-red-500">!</span>
                            )}
                        </div>
                        <div className="flex-1 space-y-2">
                            <p className={log.type === 'bot' ? 'text-slate-200' : log.type === 'system' ? 'text-red-400 italic' : 'text-blue-300'}>
                                {log.content}
                            </p>
                            
                            {/* Command Results / Data Badges */}
                            {log.data && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="px-2 py-0.5 bg-slate-800 rounded border border-slate-700 text-[10px] flex items-center gap-1">
                                        {log.data.type === 'FILE_PULL' && <FileTextIcon size={10} />}
                                        {log.data.type === 'EDIT_REQUEST' && <CodeIcon size={10} />}
                                        {log.data.type === 'WORKSPACE_QUERY' && <SearchIcon size={10} />}
                                        {log.data.type}
                                    </span>
                                    {log.data.target && (
                                        <span className="px-2 py-0.5 bg-blue-900/30 text-blue-300 rounded border border-blue-800/50 text-[10px]">
                                            target: {log.data.target}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isTyping && (
                    <div className="flex gap-3 animate-pulse">
                        <span className="text-purple-400">✨</span>
                        <div className="h-4 w-20 bg-slate-800 rounded"></div>
                    </div>
                )}
            </div>

            {/* Floating Input Area */}
            <div className="p-4 bg-slate-900/50 border-t border-slate-800 shrink-0">
                <div className="relative group">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
                        placeholder="Request edit, pull file, or query workspace..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-4 pr-12 py-3 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all text-slate-200 placeholder:text-slate-600"
                    />
                    <button 
                        onClick={handleCommand}
                        disabled={!input.trim() || isTyping}
                        className="absolute right-2 top-2 p-1.5 bg-purple-600 rounded-md text-white hover:bg-purple-500 disabled:opacity-30 disabled:hover:bg-purple-600 transition-colors shadow-lg shadow-purple-900/20"
                    >
                        <SendIcon size={18} />
                    </button>
                    <div className="absolute -bottom-6 left-0 right-0 flex justify-between px-1">
                      <span className="text-[9px] text-slate-600 uppercase tracking-widest">Mobile Command Interface</span>
                      <span className="text-[9px] text-slate-600 font-mono">LATENCY: 42ms</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
