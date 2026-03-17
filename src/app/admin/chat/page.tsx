'use client';

import React, { useState, useEffect } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';
import ChatSlot from '@/components/admin/ChatSlot';
import ClawbotShell from '@/components/admin/ClawbotShell';
import {
    LayoutGridIcon, BellIcon, SearchIcon,
    LogOutIcon, LockIcon, TerminalIcon, MessageCircleIcon
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
    const [openSlots, setOpenSlots] = useState<(ChatSession | null)[]>([null, null, null, null]);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'chat' | 'command'>('chat');
    const [showSidebar, setShowSidebar] = useState(false);

    // --- Authentication ---
    useEffect(() => {
        const storedAuth = localStorage.getItem('admin_chat_auth');
        if (storedAuth === 'true') setIsAuthenticated(true);
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (pin === '1234') {
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
            try {
                const res = await fetch('/api/admin/get-chat-sessions');
                if (!res.ok) throw new Error('Failed to fetch sessions');
                const { sessions } = await res.json();
                if (sessions) setSessions(sessions);
            } catch (error) {
                console.error("Failed to load sessions:", error);
            }
        };
        fetchSessions();

        const channel = supabaseClient
            .channel('admin-sessions')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_sessions' }, (payload: any) => {
                fetchSessions();
            })
            .subscribe();

        return () => {
            supabaseClient.removeChannel(channel);
        };
    }, [isAuthenticated]);

    // --- Slot Management ---
    const openSession = (session: ChatSession) => {
        if (openSlots.some(s => s?.session_id === session.session_id)) return;
        
        const emptyIndex = openSlots.findIndex(s => s === null);
        if (emptyIndex !== -1) {
            const newSlots = [...openSlots];
            newSlots[emptyIndex] = session;
            setOpenSlots(newSlots);
        } else {
            const newSlots = [...openSlots];
            newSlots[0] = session;
            setOpenSlots(newSlots);
        }
        if (window.innerWidth < 1024) setShowSidebar(false); // Auto-hide sidebar on mobile
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
            <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
                <form onSubmit={handleLogin} className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl text-center max-w-sm w-full">
                    <div className="bg-blue-100 p-4 rounded-full inline-block mb-4 text-blue-900"><LockIcon size={32} /></div>
                    <h1 className="text-xl md:text-2xl font-black text-gray-900 mb-2">Admin Command</h1>
                    <p className="text-sm text-gray-500 mb-6">Enter secure PIN to access live chats.</p>
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
            <header className="bg-blue-950 text-white h-14 md:h-16 flex items-center justify-between px-4 shadow-xl shrink-0 z-50">
                <div className="flex items-center gap-2 md:gap-4 font-mono">
                    <button 
                        onClick={() => setShowSidebar(!showSidebar)}
                        className="lg:hidden p-2 hover:bg-blue-900 rounded-md"
                    >
                        <LayoutGridIcon size={20} />
                    </button>
                    <div className="hidden sm:flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                        <h1 className="font-black text-sm md:text-lg tracking-tighter uppercase italic">Control_Center</h1>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex bg-blue-900/50 p-1 rounded-full border border-blue-800/50">
                    <button 
                        onClick={() => setActiveTab('chat')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === 'chat' ? 'bg-blue-600 text-white shadow-lg' : 'text-blue-300 hover:text-white'}`}
                    >
                        <MessageCircleIcon size={14} /> <span className="hidden sm:inline">LIVE CHAT</span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('command')}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === 'command' ? 'bg-purple-600 text-white shadow-lg' : 'text-blue-300 hover:text-white'}`}
                    >
                        <TerminalIcon size={14} /> <span className="hidden sm:inline">GRAVITYCLAW HUB</span>
                    </button>
                </div>

                <div className="flex items-center gap-2 md:gap-4 font-mono">
                    <button className="hidden sm:block p-2 hover:bg-blue-900 rounded-full relative">
                        <BellIcon size={20} />
                        {sessions.some(s => s.status === 'live') && (
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        )}
                    </button>
                    <button onClick={handleLogout} className="text-[10px] md:text-xs font-black text-red-400 hover:text-red-300 transition uppercase tracking-widest px-2 py-1 border border-red-900/50 rounded bg-red-900/10">
                        EXIT
                    </button>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden relative">

                {/* Sidebar: Session List - Conditional for Mobile */}
                <aside className={`
                    absolute lg:relative z-40 w-72 bg-white border-r border-gray-200 flex flex-col shrink-0 h-full transition-transform duration-300 ease-in-out
                    ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                `}>
                    <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-2.5 text-gray-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search sessions..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {filteredSessions.map(session => (
                            <button
                                key={session.session_id}
                                onClick={() => openSession(session)}
                                className={`w-full text-left p-4 border-b border-gray-50 hover:bg-blue-50 transition-colors group relative ${openSlots.some(s => s?.session_id === session.session_id) ? 'bg-blue-50/80' : ''}`}
                            >
                                {openSlots.some(s => s?.session_id === session.session_id) && (
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
                                )}
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-black text-gray-900 text-xs tracking-tight truncate pr-2 uppercase italic">{session.user_name || 'Anonymous'}</span>
                                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm ${session.status === 'live' ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-gray-500'}`}>
                                        {session.status}
                                    </span>
                                </div>
                                <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mb-2 font-medium">
                                    {session.incident_summary || 'Waiting for diagnostic input...'}
                                </p>
                                <div className="flex justify-between items-center opacity-60">
                                    <span className="text-[9px] font-bold text-gray-400 font-mono tracking-tighter">{new Date(session.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    {session.unread_count && session.unread_count > 0 && (
                                      <span className="bg-red-500 text-white w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center">{session.unread_count}</span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Dynamic Content: Chat Grid or Command Hub */}
                <main className="flex-1 bg-gray-100 overflow-hidden">
                    {activeTab === 'chat' ? (
                        <div className="h-full p-2 lg:p-4 overflow-y-auto lg:overflow-hidden">
                            <div className="h-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2 lg:gap-4">
                                {openSlots.map((slot, index) => (
                                    <div key={index} className="flex flex-col h-[600px] lg:h-full bg-white rounded-2xl shadow-xl overflow-hidden relative border border-gray-200/50">
                                        {slot ? (
                                            <ChatSlot
                                                session={slot}
                                                onClose={() => closeSlot(index)}
                                            />
                                        ) : (
                                            <div className="flex-1 flex flex-col items-center justify-center text-gray-300 p-8 text-center opacity-40">
                                                <div className="mb-6 bg-gray-100 p-6 rounded-full">
                                                    <LayoutGridIcon size={48} />
                                                </div>
                                                <h3 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-2">Slot {index + 1} Available</h3>
                                                <p className="text-slate-400">Select a session or visit the <span className="text-cyan-400 font-bold">GravityClaw Hub</span> to issue commands.</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full">
                            <ClawbotShell />
                        </div>
                    )}
                </main>
            </div>
            
            {/* Sidebar Overlay for Mobile */}
            {showSidebar && (
              <div 
                className="fixed inset-0 bg-black/40 z-30 lg:hidden backdrop-blur-sm"
                onClick={() => setShowSidebar(false)}
              ></div>
            )}
        </div>
    );
}
