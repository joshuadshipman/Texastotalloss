
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

type ChatSession = {
    session_id: string;
    status: 'bot' | 'live' | 'closed';
    user_data: {
        full_name?: string;
        phone?: string;
        incident_details?: string;
        fault?: string;
        has_injury?: boolean;
        best_time?: string;
        score?: number;
    };
    created_at: string;
    updated_at: string;
    last_message?: string; // Derived
};

export default function AdminChatPage() {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pin, setPin] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Derived Selected Session
    const selectedSession = sessions.find(s => s.session_id === selectedSessionId);

    // 1. PIN Auth
    const handleLogin = () => {
        if (pin === '1234') setIsAuthenticated(true);
        else alert('Wrong PIN');
    };

    // 2. Fetch Sessions (and Subscribe)
    useEffect(() => {
        if (!isAuthenticated) return;
        fetchSessions();

        const channel = supabaseClient
            .channel('admin-sessions')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_sessions' }, (payload) => {
                fetchSessions(); // Refresh list on any change
            })
            .subscribe();

        return () => { supabaseClient.removeChannel(channel); };
    }, [isAuthenticated]);

    const fetchSessions = async () => {
        const { data, error } = await supabaseClient
            .from('chat_sessions')
            .select('*')
            .order('updated_at', { ascending: false });

        if (data) {
            setSessions(data as ChatSession[]);
        }
    };

    // 3. Messages Subscription
    useEffect(() => {
        if (!selectedSessionId) return;

        const loadMessages = async () => {
            const { data } = await supabaseClient
                .from('chat_messages')
                .select('*')
                .eq('session_id', selectedSessionId)
                .order('created_at', { ascending: true });
            if (data) setMessages(data);
        };
        loadMessages();

        const channel = supabaseClient
            .channel(`admin-messages-${selectedSessionId}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${selectedSessionId}` }, (payload) => {
                setMessages(prev => [...prev, payload.new as ChatMessage]);
                // Play Sound for User Message
                if (payload.new.sender === 'user') {
                    const audio = new Audio('/notification.mp3'); // Placeholder
                    // beep
                }
            })
            .subscribe();

        return () => { supabaseClient.removeChannel(channel); };
    }, [selectedSessionId]);

    // Scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !selectedSessionId) return;

        await supabaseClient.from('chat_messages').insert({
            session_id: selectedSessionId,
            sender: 'agent',
            content: input
        });
        setInput('');
    };

    const handleTakeOver = async () => {
        if (!selectedSessionId) return;
        await supabaseClient.from('chat_sessions').update({ status: 'live' }).eq('session_id', selectedSessionId);
    };

    // --- Renders ---

    if (!isAuthenticated) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-900">
                <div className="bg-white p-8 rounded-lg shadow-2xl w-96">
                    <h1 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Portal</h1>
                    <input type="password" value={pin} onChange={e => setPin(e.target.value)}
                        className="border border-gray-300 p-3 rounded w-full mb-6 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Enter Access PIN"
                        onKeyDown={e => e.key === 'Enter' && handleLogin()}
                    />
                    <button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700 text-white font-bold p-3 rounded w-full transition">Access Dashboard</button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100 font-sans text-gray-800 overflow-hidden">
            {/* 1. Sidebar: Session List */}
            <div className="w-80 bg-white border-r border-gray-200 flex flex-col shrink-0 z-10">
                <div className="p-4 border-b bg-gray-50 font-bold text-gray-600 flex justify-between items-center">
                    <span>Inbox</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">{sessions.length}</span>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {sessions.length === 0 && <div className="p-8 text-center text-gray-400">No active chats</div>}
                    {sessions.map(s => (
                        <div
                            key={s.session_id}
                            onClick={() => setSelectedSessionId(s.session_id)}
                            className={`p-4 border-b cursor-pointer hover:bg-blue-50 transition ${selectedSessionId === s.session_id ? 'bg-blue-100 border-l-4 border-blue-600' : ''}`}
                        >
                            <div className="flex justify-between mb-1">
                                <span className={`font-bold ${s.status === 'live' ? 'text-green-600' : 'text-gray-800'}`}>
                                    {s.user_data?.full_name || 'Anonymous Guest'}
                                </span>
                                <span className="text-xs text-gray-400">{new Date(s.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="text-sm text-gray-500 truncate">{s.user_data?.incident_details || "No details yet..."}</div>
                            <div className="flex gap-2 mt-2">
                                {s.status === 'live' && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded font-bold uppercase">Live</span>}
                                {s.status === 'bot' && <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded font-bold uppercase">Bot</span>}
                                {s.user_data?.score && s.user_data.score > 50 && <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded font-bold uppercase">High Value</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Chat Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-white shadow-xl z-0">
                {selectedSession ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-4 border-b flex justify-between items-center bg-white">
                            <div>
                                <h2 className="font-bold text-lg">{selectedSession.user_data?.full_name || 'Guest User'}</h2>
                                <p className="text-xs text-gray-500">Session ID: {selectedSession.session_id}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {selectedSession.status === 'bot' ? (
                                    <button onClick={handleTakeOver} className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded text-sm font-bold shadow-sm transition">
                                        ✋ Take Over
                                    </button>
                                ) : (
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                                        ● Live Agent Active
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.sender === 'agent' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[70%] p-3 rounded-2xl text-sm shadow-sm ${m.sender === 'agent' ? 'bg-blue-600 text-white rounded-tr-none' :
                                            m.sender === 'user' ? 'bg-white text-gray-800 border-gray-200 border rounded-tl-none' :
                                                'bg-gray-200 text-gray-600 italic text-xs' // Bot messages
                                        }`}>
                                        <div className="text-[10px] opacity-70 mb-1 uppercase font-bold tracking-wider">{m.sender}</div>
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 bg-white border-t">
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                                    placeholder={selectedSession.status === 'bot' ? "Taking over will pause the bot..." : "Type your reply..."}
                                />
                                <button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold transition">Send</button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-300 flex-col">
                        <span className="text-4xl mb-4">💬</span>
                        <p>Select a conversation to start</p>
                    </div>
                )}
            </div>

            {/* 3. Claimant Info Panel */}
            {selectedSession && (
                <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto hidden xl:block shadow-lg z-20">
                    <h3 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-6">Claimant Details</h3>

                    <div className="space-y-6">
                        <div>
                            <label className="text-xs text-gray-400 block mb-1">Full Name</label>
                            <div className="font-bold text-lg">{selectedSession.user_data?.full_name || '—'}</div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-400 block mb-1">Phone Number</label>
                            <div className="font-mono bg-gray-50 p-2 rounded border border-gray-100 inline-block text-blue-600">
                                {selectedSession.user_data?.phone || '—'}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-gray-400 block mb-1">Incident Summary</label>
                            <div className="text-sm bg-gray-50 p-3 rounded border border-gray-100 italic leading-relaxed">
                                "{selectedSession.user_data?.incident_details || 'No details provided yet.'}"
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-400 block mb-1">Fault</label>
                                <div className={`font-bold ${selectedSession.user_data?.fault === 'other' ? 'text-green-600' : 'text-red-500'}`}>
                                    {selectedSession.user_data?.fault?.toUpperCase() || '—'}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs text-gray-400 block mb-1">Injury</label>
                                <div className={`font-bold ${selectedSession.user_data?.has_injury ? 'text-red-600' : 'text-gray-500'}`}>
                                    {selectedSession.user_data?.has_injury ? 'YES' : 'NO'}
                                </div>
                            </div>
                        </div>

                        <hr />

                        <div>
                            <h4 className="font-bold text-gray-400 text-xs uppercase tracking-widest mb-3">Evidence</h4>
                            <div className="grid grid-cols-2 gap-2">
                                {/* Placeholder for photos - in real app would query storage bucket */}
                                <div className="bg-gray-100 aspect-square rounded flex items-center justify-center text-gray-400 text-xs border border-dashed border-gray-300 cursor-not-allowed">
                                    No Photos
                                </div>
                            </div>
                        </div>

                        {/* Diagnostic / SQL Help */}
                        <div className="mt-10 p-4 bg-yellow-50 rounded text-xs text-gray-600 border border-yellow-100">
                            <strong>Database Setup (One-Time)</strong>
                            <pre className="mt-2 text-[10px] overflow-x-auto p-2 bg-white rounded border border-gray-200">
                                {`CREATE TABLE public.chat_sessions (
  session_id TEXT PRIMARY KEY,
  status TEXT DEFAULT 'bot',
  user_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_sessions;
-- Add Policies as needed
`}
                            </pre>
                            <p className="mt-2">Run this in Supabase SQL Editor if chats don't appear.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
