'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from './ChatContext';
import { supabaseClient } from '@/lib/supabaseClient';
import { Dictionary } from '@/dictionaries/en';

type Message = {
    sender: 'user' | 'bot';
    text: string;
};

interface ChatWidgetProps {
    dict?: Dictionary | null;
}

export default function ChatWidget({ dict }: ChatWidgetProps) {
    const { isOpen, toggleChat, chatMode } = useChat();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [step, setStep] = useState(0);
    const [userData, setUserData] = useState<any>({});
    const [sessionId] = useState(() => Math.random().toString(36).substring(7));
    const bottomRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const agentTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Initial greeting
    useEffect(() => {
        if (isOpen && messages.length === 0 && dict) {
            if (chatMode === 'sms') {
                setMessages([{
                    sender: 'bot',
                    text: dict.chat.responses.greeting_sms
                }]);
                setStep(20);
            } else if (chatMode === 'live') {
                setMessages([{
                    sender: 'bot',
                    text: dict.chat.responses.greeting_live
                }]);

                agentTimeoutRef.current = setTimeout(() => {
                    setMessages(prev => [...prev, {
                        sender: 'bot',
                        text: dict.chat.responses.busy_agents
                    }]);
                    setStep(30);
                }, 20000);

                supabaseClient.from('chat_messages').insert({
                    session_id: sessionId,
                    sender: 'bot',
                    content: '[SYSTEM]: User clicked Live Agent button.'
                }).then(({ error }) => {
                    if (error) console.error(error);
                });

            } else {
                setMessages([{
                    sender: 'bot',
                    text: dict.chat.responses.greeting_standard
                }]);
                setStep(1);
            }
        }
    }, [isOpen, chatMode, dict]);

    // Auto-scroll
    useEffect(() => {
        if (isOpen) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    // Realtime Subscription
    useEffect(() => {
        if (!isOpen) return;

        const channel = supabaseClient
            .channel(`session-${sessionId}`)
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'chat_messages', filter: `session_id=eq.${sessionId}` }, (payload) => {
                const newMsg = payload.new as any;
                if (newMsg.sender === 'agent') {
                    if (agentTimeoutRef.current) {
                        clearTimeout(agentTimeoutRef.current);
                        agentTimeoutRef.current = null;
                    }
                    setMessages(prev => [...prev, { sender: 'bot', text: newMsg.content }]);
                }
            })
            .subscribe();

        return () => {
            if (agentTimeoutRef.current) clearTimeout(agentTimeoutRef.current);
            supabaseClient.removeChannel(channel);
        };
    }, [isOpen, sessionId]);

    const handleSend = async (text: string = input) => {
        if (!text.trim() || !dict) return;

        const newMessages = [...messages, { sender: 'user', text } as Message];
        setMessages(newMessages);
        setInput('');

        try {
            await supabaseClient.from('chat_messages').insert({
                session_id: sessionId,
                sender: 'user',
                content: text
            });
        } catch (e) {
            console.error('Failed to save message', e);
        }

        setTimeout(() => processBotResponse(text, newMessages, dict), 600);
    };

    const processBotResponse = async (userText: string, currentMessages: Message[], d: Dictionary) => {
        let botText = '';
        let nextStep = step;
        let newData = { ...userData };

        const lowerText = userText.toLowerCase();

        const isLiveAgentRequest = d.chat.keywords.live_agent.some(k => lowerText.includes(k));

        if (step < 20 && isLiveAgentRequest) {
            setMessages(prev => [...prev, {
                sender: 'bot',
                text: d.chat.responses.greeting_live
            }]);

            await supabaseClient.from('chat_messages').insert({
                session_id: sessionId,
                sender: 'bot',
                content: '[SYSTEM]: User requested Live Agent.'
            });

            if (agentTimeoutRef.current) clearTimeout(agentTimeoutRef.current);
            agentTimeoutRef.current = setTimeout(() => {
                setMessages(prev => [...prev, {
                    sender: 'bot',
                    text: d.chat.responses.busy_agents
                }]);
                setStep(30);
            }, 20000);

            return;
        }

        const isYes = d.chat.keywords.yes.some(k => lowerText.includes(k));

        switch (step) {
            case 1:
                newData.full_name = userText;
                botText = d.chat.responses.ask_phone.replace('{name}', userText);
                nextStep = 2;
                break;
            case 2:
                newData.phone = userText;
                botText = d.chat.responses.ask_contact_method;
                nextStep = 3;
                break;
            case 3:
                newData.contact_pref = userText.toLowerCase().includes('text') || userText.toLowerCase().includes('texto') ? 'text' : 'call';
                if (newData.contact_pref === 'call') {
                    botText = d.chat.responses.ask_call_time;
                    nextStep = 4;
                } else {
                    botText = d.chat.responses.ask_incident;
                    nextStep = 5;
                }
                break;
            case 4:
                newData.best_time = userText;
                botText = d.chat.responses.ask_incident;
                nextStep = 5;
                break;
            case 5:
                newData.incident_details = userText;
                const painKeywords = d.chat.keywords.pain;
                newData.has_injury = painKeywords.some(k => lowerText.includes(k));
                botText = d.chat.responses.ask_fault;
                nextStep = 6;
                break;
            case 6:
                newData.fault_info = userText;
                botText = d.chat.responses.ask_photos;
                nextStep = 7;
                break;
            case 7:
                botText = d.chat.responses.ask_recent;
                nextStep = 8;
                break;
            case 8:
                const isRecent = isYes || lowerText.includes('today') || lowerText.includes('hoy') || lowerText.includes('yesterday') || lowerText.includes('ayer');

                if (isRecent) {
                    botText = d.chat.responses.advice_er;
                    nextStep = 10;
                } else {
                    botText = d.chat.responses.advice_chiro;
                    nextStep = 11;
                }
                break;

            case 10:
                botText = d.chat.responses.confirmation;
                setTimeout(() => submitLead(newData), 2000);
                nextStep = 15;
                break;

            case 11:
                botText = d.chat.responses.confirmation;
                setTimeout(() => submitLead(newData), 2000);
                nextStep = 15;
                break;

            case 15:
                botText = d.chat.responses.confirmation;
                break;

            case 20:
                newData.phone = userText;
                botText = d.chat.responses.ask_incident;
                nextStep = 21;
                break;
            case 21:
                newData.incident_details = userText;
                botText = d.chat.responses.busy_agents;
                nextStep = 22;
                break;
            case 22:
                newData.best_time = userText;
                botText = d.chat.responses.confirmation;
                setTimeout(() => submitLead(newData), 1000);
                nextStep = 24;
                break;

            case 30:
                botText = d.chat.responses.confirmation;
                setTimeout(() => submitLead(newData), 1000);
                nextStep = 9;
                break;

            default:
                botText = d.chat.responses.confirmation;
        }

        setUserData(newData);
        setStep(nextStep);
        if (botText) {
            setMessages(prev => [...prev, { sender: 'bot', text: botText }]);
        }
    };

    const submitLead = async (data: any) => {
        try {
            await fetch('/api/submit-lead', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, session: sessionId })
            });
            console.log('Lead submitted');
        } catch (e) {
            console.error('Submission error', e);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!dict) return;
        const file = e.target.files?.[0];
        if (!file) return;

        setMessages(prev => [...prev, { sender: 'user', text: `Uploading ${file.name}...` }]);

        try {
            const fileName = `${sessionId}/${Date.now()}-${file.name}`;
            const { error: uploadError } = await supabaseClient.storage
                .from('vehicle-photos')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            setMessages(prev => [...prev, { sender: 'user', text: dict.chat.responses.upload_success }]);

            if (step === 7) {
                setMessages(prev => [...prev, { sender: 'bot', text: dict.chat.responses.ask_recent }]);
                setStep(8);
            }

        } catch (error) {
            console.error('Upload error:', error);
            setMessages(prev => [...prev, { sender: 'bot', text: dict.chat.responses.upload_fail }]);
        }
    };

    if (!dict) return null;

    return (
        <>
            <button
                onClick={toggleChat}
                className="hidden fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition z-50 font-bold"
            >
                {dict.chat.trigger}
            </button>

            {isOpen && (
                <div className="fixed inset-0 md:inset-auto md:bottom-4 md:right-4 md:w-96 md:h-[600px] bg-white md:rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden font-sans">
                    <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-4 rounded-t-none md:rounded-t-lg font-bold flex justify-between items-center shadow-md">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span>{dict.chat.header_title}</span>
                        </div>
                        <button onClick={toggleChat} className="text-white hover:text-gray-200 text-xl font-bold">×</button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] p-3 rounded-2xl text-sm shadow-sm leading-relaxed ${m.sender === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none text-left'
                                        }`}
                                >
                                    {m.text}
                                </div>
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    <div className="p-3 border-t border-gray-100 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex gap-2 items-center">
                        <label className="cursor-pointer text-gray-400 hover:text-blue-600 p-2 transition-colors" title={dict.chat.upload_tooltip}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path><circle cx="12" cy="13" r="3"></circle></svg>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileUpload}
                                ref={fileInputRef}
                            />
                        </label>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={dict.chat.input_placeholder}
                            className="flex-1 p-3 bg-gray-100 border-0 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-100 text-gray-800 placeholder-gray-400"
                        />
                        <button
                            onClick={() => handleSend()}
                            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-md disabled:opacity-50"
                            disabled={!input.trim()}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
