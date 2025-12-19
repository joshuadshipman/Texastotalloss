
'use client';

import { useState, useEffect, useRef } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';

type ChatMessage = {
    id: string;
    session_id: string;
    sender: 'user' | 'bot' | 'agent';
    content: string;
    created_at: string;
};

type SessionSummary = {
    session_id: string;
    last_message: string;
    updated_at: string;
    is_read: boolean;
};

export default function AdminChatPage() {
    const [sessions, setSessions] = useState<SessionSummary[]>([]);
    const [selectedSession, setSelectedSession] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pin, setPin] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 1. PIN Auth (Simple)
    const handleLogin = () => {
        if (pin === '1234') setIsAuthenticated(true); // Should be env var in real app
        else alert('Wrong PIN');
    };

    // 2. Load Sessions
    useEffect(() => {
        if (!isAuthenticated) return;
        fetchSessions();

        // Subscribe to NEW messages to update session list order?
        const channel = supabaseClient
            .channel('admin-chat-list')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages' }, (payload) => {
                const newMsg = payload.new as ChatMessage;
                // Update session list locally
                setSessions(prev => {
                    const exists = prev.find(s => s.session_id === newMsg.session_id);
                    if (exists) {
                        return [
                            { ...exists, last_message: newMsg.content, updated_at: newMsg.created_at, is_read: false },
                            ...prev.filter(s => s.session_id !== newMsg.session_id)
                        ];
                    } else {
                        return [
                            { session_id: newMsg.session_id, last_message: newMsg.content, updated_at: newMsg.created_at, is_read: false },
                            ...prev
                        ];
                    }
                });
            })
            .subscribe();

        return () => { supabaseClient.removeChannel(channel); };
    }, [isAuthenticated]);

    const fetchSessions = async () => {
        // Since we don't have a specific `chat_sessions` table, we have to group by session_id on messages or rely on `total_loss_leads`.
        // Let's rely on `total_loss_leads` for list of people, or just query unique session_ids from messages.
        // For efficiency, let's just fetch recent messages and unique them client side for now.
        const { data } = await supabaseClient
            .from('chat_messages')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

        if (data) {
            const uniqueSessions = new Map<string, SessionSummary>();
            data.forEach((msg: ChatMessage) => {
                if (!uniqueSessions.has(msg.session_id)) {
                    uniqueSessions.set(msg.session_id, {
                        session_id: msg.session_id,
                        last_message: msg.content,
                        updated_at: msg.created_at,
                        is_read: true // default
                    });
                }
            });
            setSessions(Array.from(uniqueSessions.values()));
        }
    };

    // 3. Load & Subscribe Messages for Selected Session
    useEffect(() => {
        if (!selectedSession) return;

        const loadMessages = async () => {
            const { data } = await supabaseClient
                .from('chat_messages')
                .select('*')
                .eq('session_id', selectedSession)
                .order('created_at', { ascending: true });
            if (data) setMessages(data);
        };
        loadMessages();

        const channel = supabaseClient
            .channel(`session-${selectedSession}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${selectedSession}` }, (payload) => {
                setMessages(prev => [...prev, payload.new as ChatMessage]);
            })
            .subscribe();

        return () => { supabaseClient.removeChannel(channel); };
    }, [selectedSession]);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !selectedSession) return;

        // Optimistic update
        // setMessages(prev => [...prev, { id: 'temp', session_id: selectedSession, sender: 'agent', content: input, created_at: new Date().toISOString() }]);

        await fetch('/api/chat/send', {
            method: 'POST',
            body: JSON.stringify({
                session_id: selectedSession,
                sender: 'agent',
                content: input
            })
        });
        setInput('');
    };

    if (!isAuthenticated) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded shadow-md">
                    <h1 className="text-xl mb-4">Admin Login</h1>
                    <input type="password" value={pin} onChange={e => setPin(e.target.value)} className="border p-2 rounded w-full mb-4" placeholder="Enter PIN" />
                    <button onClick={handleLogin} className="bg-blue-600 text-white p-2 rounded w-full">Access</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100 font-sans text-black">
            {/* Sidebar */}
            <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b font-bold text-lg bg-gray-50">Active Chats</div>
                <div className="flex-1 overflow-y-auto">
                    {sessions.map(s => (
                        <div
                            key={s.session_id}
                            onClick={() => setSelectedSession(s.session_id)}
                            className={`p-4 border-b cursor-pointer hover:bg-blue-50 ${selectedSession === s.session_id ? 'bg-blue-100' : ''}`}
                        >
                            <div className="font-bold text-sm text-gray-700 truncate">{s.session_id}</div>
                            <div className="text-xs text-gray-500 truncate">{s.last_message}</div>
                            <div className="text-xs text-gray-400 mt-1">{new Date(s.updated_at).toLocaleTimeString()}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
                {selectedSession ? (
                    <>
                        <div className="p-4 bg-white border-b shadow-sm flex justify-between items-center">
                            <h2 className="font-bold">Session: {selectedSession}</h2>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] p-3 rounded-lg text-sm ${m.sender === 'agent' ? 'bg-blue-600 text-white' :
                                            m.sender === 'bot' ? 'bg-gray-200 text-gray-600 italic' :
                                                'bg-white border border-gray-300'
                                        }`}>
                                        <div className="text-xs opacity-75 mb-1 capitalize">{m.sender}</div>
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="p-4 bg-white border-t">
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 border p-2 rounded"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                                    placeholder="Type a reply..."
                                />
                                <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded">Send</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-400">Select a session to start chatting</div>
                )}
            </div>
        </div>
    );
}
