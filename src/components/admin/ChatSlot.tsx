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
            <div className={`p-4 ${isLive ? 'bg-amber-50' : 'bg-gray-50'} border-b border-gray-200`}>
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <div className="bg-blue-100 p-2 rounded-full text-blue-700">
                            <UserIcon size={16} />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900 text-sm">{session.user_name || 'Anonymous User'}</h3>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <PhoneIcon size={10} /> {session.user_phone || 'No Phone'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500">
                        <XCircleIcon size={20} />
                    </button>
                </div>

                {/* Intent / Summary */}
                <div className="bg-white p-2 rounded border border-gray-100 text-xs text-gray-700 mb-2">
                    <span className="font-bold text-blue-600 uppercase text-[10px]">Intent:</span> {session.incident_summary || 'Unknown Intent'}
                </div>

                {/* Status Toggle */}
                <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${isLive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                        {isLive ? <CheckCircleIcon size={12} /> : <AlertTriangleIcon size={12} />}
                        {isLive ? 'LIVE AGENT ACTIVE' : 'BOT HANDELING'}
                    </div>
                    <button
                        onClick={toggleLiveStatus}
                        className={`text-xs font-bold underline ${isLive ? 'text-gray-500' : 'text-blue-600'}`}
                    >
                        {isLive ? 'Return to Bot' : 'Take Over Now'}
                    </button>
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
