
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

                // Notification Sound & Title for non-agent messages
                if (newMsg.sender !== 'agent') {
                    // 1. Play Sound
                    try {
                        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.frequency.setValueAtTime(880, ctx.currentTime); // High ping
                        gain.gain.setValueAtTime(0.1, ctx.currentTime);
                        gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.5);
                        osc.start();
                        osc.stop(ctx.currentTime + 0.5);
                    } catch (e) { console.error("Audio play failed", e); }

                    // 2. Update Title
                    document.title = `(${newMsg.sender}) New Message!`;
                }

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

        await supabaseClient.from('chat_messages').insert({
            session_id: selectedSession,
            sender: 'agent',
            content: input
        });
        setInput('');
        document.title = 'Admin Chat'; // Reset title
    };

    // Status Check
    const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');
    const [dbError, setDbError] = useState<string>('');

    useEffect(() => {
        checkDbConnection();
    }, [isAuthenticated]);

    const checkDbConnection = async () => {
        try {
            const { count, error } = await supabaseClient.from('chat_messages').select('*', { count: 'exact', head: true });
            if (error) throw error;
            setDbStatus('connected');
        } catch (e: any) {
            console.error('DB Check Failed:', e);
            setDbStatus('error');
            setDbError(e.message || 'Unknown error');
        }
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

    if (dbStatus === 'error') {
        return (
            <div className="min-h-screen bg-red-50 p-8">
                <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-8 border-l-4 border-red-500">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Database Connection Issue</h1>
                    <p className="text-gray-700 mb-4">Assuming "chat_messages" table does not exist. Please run the following SQL in your Supabase Dashboard SQL Editor:</p>

                    <div className="bg-gray-900 text-gray-100 p-4 rounded overflow-auto mb-4 text-sm font-mono whitespace-pre">
                        {`-- Run this in Supabase SQL Editor
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id TEXT NOT NULL,
    sender TEXT NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB
);

ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON public.chat_messages(session_id);
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON public.chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON public.chat_messages FOR SELECT USING (true);`}
                    </div>
                    <p className="text-sm text-gray-500 mb-6">Error Detail: {dbError}</p>
                    <button onClick={() => window.location.reload()} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">I Have Run The SQL - Retry</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100 font-sans text-black">
            {/* Sidebar */}
            <div className="w-1/4 bg-white border-r border-gray-200 flex flex-col">
                <div className="p-4 border-b font-bold text-lg bg-gray-50 flex justify-between items-center">
                    <span>Active Chats</span>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
                    >
                        ↻
                    </button>
                </div>

                {/* Diagnostic Status Box */}
                <div className={`p-2 text-xs text-center border-b ${dbStatus === 'connected' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    DB Status: <strong>{dbStatus.toUpperCase()}</strong>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {sessions.length === 0 && (
                        <div className="p-4 text-center text-gray-400 text-sm">
                            <p>No active sessions found.</p>
                            <button
                                onClick={checkDbConnection}
                                className="mt-4 text-blue-500 underline text-xs"
                            >
                                Re-Test Connection
                            </button>
                        </div>
                    )}
                    {sessions.map(s => (
                        <div
                            key={s.session_id}
                            onClick={() => {
                                setSelectedSession(s.session_id);
                                setSessions(prev => prev.map(sess => sess.session_id === s.session_id ? { ...sess, is_read: true } : sess));
                            }}
                            className={`p-4 border-b cursor-pointer hover:bg-blue-50 relative ${selectedSession === s.session_id ? 'bg-blue-100' : ''}`}
                        >
                            {!s.is_read && (
                                <div className="absolute top-4 right-4 w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-sm"></div>
                            )}
                            <div className="font-bold text-sm text-gray-700 truncate pr-6">{s.session_id}</div>
                            <div className={`text-xs truncate ${!s.is_read ? 'font-bold text-gray-900' : 'text-gray-500'}`}>{s.last_message}</div>
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
