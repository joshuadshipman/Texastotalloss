'use client';

import React, { useState, useEffect } from 'react';
import { MessageSquareIcon, MinimizeIcon, XIcon, UserIcon } from 'lucide-react';
import { supabaseClient } from '@/lib/supabaseClient';

interface AdminChatGridProps {
    activeSessions: string[]; // List of session IDs
    onMinimize: (sessionId: string) => void;
    onClose: (sessionId: string) => void;
}

export default function AdminChatGrid({ activeSessions, onMinimize, onClose }: AdminChatGridProps) {
    // We only show up to 4 slots. If more activeSessions exist, they will be in the 'queue' visually handled by parent or sidebar.
    const slots = [0, 1, 2, 3];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {slots.map((index) => {
                const sessionId = activeSessions[index];
                return (
                    <div key={index} className="h-[500px] rounded-xl flex flex-col bg-slate-50 overflow-hidden shadow-sm border border-slate-200 relative transition-all group hover:border-blue-300 hover:shadow-md">
                        {sessionId ? (
                            <AdminChatWindow
                                sessionId={sessionId}
                                onMinimize={() => onMinimize(sessionId)}
                                onClose={() => onClose(sessionId)}
                            />
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-300 relative overflow-hidden">
                                {/* Subtle Grid Pattern Background */}
                                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                                <div className="z-10 bg-white p-6 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform duration-500">
                                    <MessageSquareIcon size={32} className="text-slate-200 group-hover:text-blue-400 transition-colors" />
                                </div>
                                <p className="font-bold text-xs uppercase tracking-widest text-slate-400 z-10">Available Slot {index + 1}</p>
                                <p className="text-[10px] mt-2 text-slate-400 z-10 max-w-[150px] text-center">Waiting for incoming connection...</p>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

function AdminChatWindow({ sessionId, onMinimize, onClose }: { sessionId: string, onMinimize: () => void, onClose: () => void }) {
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [details, setDetails] = useState<any>({});

    useEffect(() => {
        // Fetch Initial
        const fetchMsgs = async () => {
            const { data } = await supabaseClient.from('chat_messages').select('*').eq('session_id', sessionId).order('created_at', { ascending: true });
            if (data) setMessages(data);

            const { data: sessionData } = await supabaseClient.from('chat_sessions').select('*').eq('session_id', sessionId).single();
            if (sessionData) setDetails(sessionData.user_data || {});
        };
        fetchMsgs();

        // Sub
        const channel = supabaseClient.channel(`admin-${sessionId}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${sessionId}` }, (payload) => {
                setMessages(prev => [...prev, payload.new]);
            })
            .subscribe();

        return () => { supabaseClient.removeChannel(channel); };
    }, [sessionId]);

    const sendAgentMessage = async () => {
        if (!input.trim()) return;
        await supabaseClient.from('chat_messages').insert({
            session_id: sessionId,
            sender: 'agent',
            content: input.trim()
        });

        // Also update session to 'live' if not already
        await supabaseClient.from('chat_sessions').update({ status: 'live' }).eq('session_id', sessionId);

        setInput('');
    };

    return (
        <div className="flex flex-col h-full bg-white shadow-xl rounded-xl overflow-hidden border border-slate-200">
            {/* Header - Command Center Style */}
            <div className="bg-slate-900 text-white p-3 flex justify-between items-center cursor-move shadow-sm shrink-0">
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className="relative">
                        <UserIcon size={16} className="text-slate-400" />
                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-green-500 rounded-full animate-pulse border border-slate-900"></span>
                    </div>
                    <div className="truncate">
                        <p className="font-bold text-sm truncate tracking-tight">{details.full_name || 'Visitor'}</p>
                        <p className="text-[10px] text-slate-400 truncate font-mono tracking-wide">{sessionId}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={onMinimize} className="p-1.5 hover:bg-slate-700/50 rounded text-slate-400 hover:text-white transition"><MinimizeIcon size={14} /></button>
                    <button onClick={onClose} className="p-1.5 hover:bg-red-500/20 rounded text-slate-400 hover:text-red-400 transition"><XIcon size={14} /></button>
                </div>
            </div>

            {/* Messages - Premium Chat Bubbles */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                {messages.length === 0 && (
                    <div className="flex justify-center mt-10 opacity-30">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Start of Session</p>
                    </div>
                )}
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-3 text-sm shadow-sm ${m.sender === 'agent'
                            ? 'bg-blue-600 text-white rounded-2xl rounded-tr-none'
                            : 'bg-white text-slate-800 border border-slate-200 rounded-2xl rounded-tl-none'
                            }`}>
                            {m.content}
                        </div>
                    </div>
                ))}
            </div>

            {/* Input - Modern Floating Style */}
            <div className="p-3 bg-white border-t border-slate-100 flex gap-2 shrink-0">
                <input
                    className="flex-1 bg-slate-100 border-0 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none hover:bg-slate-200 transition-colors"
                    placeholder="Reply to user..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendAgentMessage()}
                />
                <button
                    onClick={sendAgentMessage}
                    disabled={!input.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-full font-bold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition transform active:scale-95 shadow-md"
                >
                    Send
                </button>
            </div>
        </div>
    );
}
