'use client';

import React, { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import ChatSlot from '@/components/admin/ChatSlot';
import {
    LayoutGridIcon, BellIcon, SearchIcon,
    LogOutIcon, LockIcon
} from 'lucide-react';

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

export default function AdminChatPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [pin, setPin] = useState('');
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [openSlots, setOpenSlots] = useState<(ChatSession | null)[]>([null, null, null, null]); // 4 Slots
    const [searchQuery, setSearchQuery] = useState('');

    // --- Authentication ---
    useEffect(() => {
        const storedAuth = localStorage.getItem('admin_chat_auth');
        if (storedAuth === 'true') setIsAuthenticated(true);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (pin === '2026') {
            setIsAuthenticated(true);
            localStorage.setItem('admin_chat_auth', 'true');
        } else {
            alert('Invalid PIN');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('admin_chat_auth');
    };

    // --- Data Loading ---
    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchSessions = async () => {
            const { data, error } = await supabaseClient
                .from('chat_sessions')
                .select('*')
                .order('created_at', { ascending: false }); // Newest first
            if (data) setSessions(data);
        };
        fetchSessions();

        // Realtime: Listen for new sessions or status changes
        const channel = supabaseClient
            .channel('admin-sessions')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_sessions' }, (payload) => {
                fetchSessions(); // Brute force refresh for simplicity
            })
            .subscribe();

        return () => {
            supabaseClient.removeChannel(channel);
        };
    }, [isAuthenticated]);

    // --- Slot Management ---
    const openSession = (session: ChatSession) => {
        // 1. If already open, do nothing (or highlight?)
        if (openSlots.some(s => s?.session_id === session.session_id)) return;

        // 2. Find first empty slot
        const emptyIndex = openSlots.findIndex(s => s === null);
        if (emptyIndex !== -1) {
            const newSlots = [...openSlots];
            newSlots[emptyIndex] = session;
            setOpenSlots(newSlots);
        } else {
            // 3. If full, replace the FIRST slot (Slot 0) - Rolling buffer style
            const newSlots = [...openSlots];
            newSlots[0] = session;
            setOpenSlots(newSlots);
        }
    };

    const closeSlot = (index: number) => {
        const newSlots = [...openSlots];
        newSlots[index] = null;
        setOpenSlots(newSlots);
    };

    // --- Filtered List ---
    const filteredSessions = sessions.filter(s =>
        s.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.user_phone?.includes(searchQuery) ||
        s.incident_summary?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full">
                    <div className="bg-blue-100 p-4 rounded-full inline-block mb-4 text-blue-900"><LockIcon size={32} /></div>
                    <h1 className="text-2xl font-black text-gray-900 mb-2">Admin Command</h1>
                    <p className="text-gray-500 mb-6">Enter secure PIN to access live chats.</p>
                    <input
                        type="password"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="PIN Code"
                        className="w-full text-center text-2xl tracking-widest p-3 border rounded-lg mb-4 font-mono"
                        autoFocus
                    />
                    <button type="submit" className="w-full bg-blue-900 text-white font-bold py-3 rounded-lg hover:bg-blue-800 transition">
                        ACCESS SYSTEM
                    </button>
                    <p className="mt-4 text-xs text-center text-gray-400">Restricted Personnel Only</p>
                </form>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gray-100 overflow-hidden font-sans">
            {/* Top Navigation Bar */}
            <header className="bg-blue-900 text-white h-14 flex items-center justify-between px-4 shadow-md shrink-0 z-50">
                <div className="flex items-center gap-3">
                    <LayoutGridIcon className="text-blue-300" />
                    <h1 className="font-bold text-lg tracking-wide uppercase">Live Command Center</h1>
                    <span className="bg-blue-800 text-xs px-2 py-1 rounded-full text-blue-200">{sessions.length} Sessions</span>
                </div>
                <div className="flex items-center gap-4">
                    <button className="p-2 hover:bg-blue-800 rounded-full relative">
                        <BellIcon size={20} />
                        {sessions.some(s => s.status === 'live') && (
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        )}
                    </button>
                    <div className="h-6 w-px bg-blue-700"></div>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-bold hover:text-red-300 transition">
                        <LogOutIcon size={16} /> LOGOUT
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden">

                {/* Sidebar: Session List */}
                <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
                    <div className="p-3 border-b border-gray-100">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-2.5 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search leads..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {filteredSessions.map(session => (
                            <button
                                key={session.session_id}
                                onClick={() => openSession(session)}
                                className={`w-full text-left p-3 border-b border-gray-50 hover:bg-blue-50 transition group ${openSlots.some(s => s?.session_id === session.session_id) ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'
                                    }`}
                            >
                                <div className="flex justify-between mb-1">
                                    <span className="font-bold text-gray-900 text-sm truncate">{session.user_name || 'Anonymous'}</span>
                                    <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${session.status === 'live' ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                        {session.status}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 truncate mb-1">
                                    {session.incident_summary || 'No Summary'}
                                </p>
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] text-gray-400">{new Date(session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    {/* <ChevronRightIcon size={14} className="text-gray-300 group-hover:text-blue-400" /> */}
                                </div>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Grid View: 4 Slots */}
                <main className="flex-1 bg-gray-200 p-2 overflow-hidden">
                    <div className="h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2">
                        {openSlots.map((slot, index) => (
                            <div key={index} className="flex flex-col h-full bg-white rounded-xl shadow-sm overflow-hidden relative">
                                {slot ? (
                                    <ChatSlot
                                        session={slot}
                                        onClose={() => closeSlot(index)}
                                    />
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center text-gray-300 p-4 text-center border-2 border-dashed border-gray-200 m-2 rounded-xl">
                                        <div className="mb-4 bg-gray-50 p-4 rounded-full">
                                            <LayoutGridIcon size={32} />
                                        </div>
                                        <h3 className="font-bold text-gray-400 mb-1">Slot {index + 1} Empty</h3>
                                        <p className="text-xs max-w-[150px]">Select a session from the sidebar to monitor or chat.</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
}
