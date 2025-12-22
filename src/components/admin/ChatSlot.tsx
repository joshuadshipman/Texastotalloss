'use client';

import React, { useState, useEffect, useRef } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import { SendIcon, UserIcon, PhoneIcon, MapPinIcon, XCircleIcon, AlertTriangleIcon, CheckCircleIcon } from 'lucide-react';

interface ChatSession {
    session_id: string;
    user_name?: string;
    user_phone?: string;
    user_email?: string;
    created_at: string;
    status: 'bot' | 'live' | 'closed';
    incident_summary?: string;
    unread_count?: number;
    pin_verified?: boolean;
}

interface ChatMessage {
    id: number;
    session_id: string;
    sender: 'user' | 'bot' | 'admin';
    text: string;
    created_at: string;
    media_url?: string;
}

interface ChatSlotProps {
    session: ChatSession;
    onClose: () => void;
}

export default function ChatSlot({ session, onClose }: ChatSlotProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLive, setIsLive] = useState(session.status === 'live');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Load initial messages
    useEffect(() => {
        const fetchMessages = async () => {
            const { data } = await supabaseClient
                .from('chat_messages')
                .select('*')
                .eq('session_id', session.session_id)
                .order('created_at', { ascending: true });
            if (data) setMessages(data);
        };
        fetchMessages();

        // Subscribe to new messages
        const channel = supabaseClient
            .channel(`slot-${session.session_id}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${session.session_id}` }, (payload) => {
                setMessages((prev) => [...prev, payload.new as ChatMessage]);
            })
            .subscribe();

        return () => {
            supabaseClient.removeChannel(channel);
        };
    }, [session.session_id]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const text = input.trim();
        setInput('');

        // 1. Send Message
        await supabaseClient.from('chat_messages').insert({
            session_id: session.session_id,
            sender: 'admin',
            text: text
        });

        // 2. Ensure session is live (if not already)
        if (!isLive) {
            await toggleLiveStatus();
        }
    };

    const toggleLiveStatus = async () => {
        const newStatus = isLive ? 'bot' : 'live';
        const { error } = await supabaseClient
            .from('chat_sessions')
            .update({ status: newStatus })
            .eq('session_id', session.session_id);

        if (!error) setIsLive(!isLive);
    };

    return (
        <div className="flex flex-col h-full bg-white border-l border-r border-gray-200 shadow-xl overflow-hidden relative">
            {/* Header: User Data (The "Text above the chat") */}
            <div className={`p-3 ${isLive ? 'bg-amber-50' : 'bg-white'} border-b border-gray-200 shadow-sm shrink-0`}>
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                            INTAKE FORMULA
                        </span>
                        <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${isLive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                            {isLive ? 'LIVE AGENT' : 'BOT ACTIVE'}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={toggleLiveStatus} className="text-[10px] font-bold text-blue-600 hover:underline">
                            {isLive ? 'Embed Bot' : 'Take Over'}
                        </button>
                        <button onClick={onClose} className="text-gray-300 hover:text-red-500">
                            <XCircleIcon size={18} />
                        </button>
                    </div>
                </div>

                {/* Formula Grid */}
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs bg-blue-50/50 p-2 rounded border border-blue-100">
                    <div className="flex flex-col">
                        <span className="text-[9px] text-blue-400 uppercase font-bold">Client Name</span>
                        <span className="font-bold text-gray-800">{session.user_name || 'Anonymous'}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[9px] text-blue-400 uppercase font-bold">Phone</span>
                        <span className="font-mono text-blue-700">{session.user_phone || 'N/A'}</span>
                    </div>
                    <div className="col-span-2 flex flex-col mt-1 pt-1 border-t border-blue-100">
                        <span className="text-[9px] text-blue-400 uppercase font-bold">Incident Context</span>
                        <span className="text-gray-700 leading-tight">
                            {session.incident_summary || 'No summary available yet.'}
                        </span>
                    </div>
                    <div className="col-span-2 flex justify-between items-center mt-1 pt-1 border-t border-blue-100 text-[9px] text-gray-400">
                        <span>Session ID: {session.session_id.substring(0, 8)}</span>
                        <span>{new Date(session.created_at).toLocaleTimeString()}</span>
                    </div>
                </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.map((msg) => {
                    const isMe = msg.sender === 'admin';
                    const isBot = msg.sender === 'bot';
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] rounded-lg p-3 text-sm shadow-sm ${isMe ? 'bg-blue-600 text-white' :
                                isBot ? 'bg-gray-200 text-gray-800 border border-gray-300' :
                                    'bg-white text-gray-900 border border-gray-200'
                                }`}>
                                {isBot && <span className="text-[10px] font-bold text-gray-500 block mb-1">BOT</span>}
                                {msg.text}
                                {msg.media_url && (
                                    <img src={msg.media_url} alt="Attachment" className="mt-2 rounded max-h-32 object-cover" />
                                )}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-200">
                <form
                    onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                    className="flex gap-2"
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={isLive ? "Type a reply..." : "Taking over pauses the bot..."}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={!input.trim()}
                        className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        <SendIcon size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
}
