'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from './ChatContext';
import { supabaseClient } from '@/lib/supabaseClient';
import { Dictionary } from '@/dictionaries/en';
import { XIcon, SendIcon, AlertTriangleIcon, MessageCircleIcon } from 'lucide-react';

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
    const [isLiveMode, setIsLiveMode] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const agentTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Initial greeting
    useEffect(() => {
        if (isOpen && messages.length === 0 && dict) {
            let initialMsgs: Message[] = [];
            let initialStep = 0;

            if (chatMode === 'sms') {
                initialMsgs = [{ sender: 'bot', text: dict.chat.responses.greeting_sms }];
                initialStep = 300; // SMS Flow Start
            } else if (chatMode === 'call') {
                initialMsgs = [{ sender: 'bot', text: dict.chat.responses.greeting_call }];
                initialStep = 400; // Call Flow Start
            } else if (chatMode === 'schedule') {
                initialMsgs = [{ sender: 'bot', text: dict.chat.responses.greeting_schedule }];
                initialStep = 500; // Schedule Flow Start
            } else if (chatMode === 'live') {
                initialMsgs = [{ sender: 'bot', text: dict.chat.responses.greeting_live }];
                // ... (Existing live logic kept separate if needed, or merged)
                agentTimeoutRef.current = setTimeout(() => {
                    addMessage('bot', dict.chat.responses.busy_agents);
                    setStep(30);
                }, 15000);
            } else {
                initialMsgs = [{ sender: 'bot', text: dict.chat.responses.greeting_standard }];
                initialStep = 1;
            }

            // Reset logic if mode changed or first open
            setMessages(initialMsgs);
            setStep(initialStep);

            // Only save initial if we don't have messages? 
            // Actually, we should always reset if the user clicks a specific button (changing intent)
        }
    }, [isOpen, chatMode, dict]); // Added chatMode to dependency array to trigger reset

    // Effect to handle "Start Over" when switching modes while already open
    useEffect(() => {
        if (isOpen && dict) {
            let initialMsgs: Message[] = [];
            let initialStep = 0;

            if (chatMode === 'sms') {
                initialMsgs = [{ sender: 'bot', text: dict.chat.responses.greeting_sms }];
                initialStep = 300;
            } else if (chatMode === 'call') {
                initialMsgs = [{ sender: 'bot', text: dict.chat.responses.greeting_call }];
                initialStep = 400;
            } else if (chatMode === 'schedule') {
                initialMsgs = [{ sender: 'bot', text: dict.chat.responses.greeting_schedule }];
                initialStep = 500;
            } else {
                initialMsgs = [{ sender: 'bot', text: dict.chat.responses.greeting_standard }];
                initialStep = 1;
            }

            setMessages(initialMsgs);
            setStep(initialStep);

            // Sync reset to Supabase if valid session
            /* 
               We typically don't spam Supabase on every mode switch reset unless user typed.
               But if we want a clean slate in the DB, we might ignoring the old messages.
               For now, we just reset the UI. 
            */
        }
    }, [chatMode]);

    // Auto-scroll
    useEffect(() => {
        if (isOpen) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    // Realtime Session Status & Messages
    useEffect(() => {
        if (!isOpen) return;

        // 1. Subscribe to Messages
        const msgChannel = supabaseClient
            .channel(`session-msgs-${sessionId}`)
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

        // 2. Subscribe to Session Status (Live Mode Takeover)
        const sessionChannel = supabaseClient
            .channel(`session-status-${sessionId}`)
            .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chat_sessions', filter: `session_id=eq.${sessionId}` }, (payload) => {
                const newState = payload.new as any;
                if (newState.status === 'live') {
                    setIsLiveMode(true);
                }
            })
            .subscribe();

        // 3. Create/Init Session in DB
        const initSession = async () => {
            const { error } = await supabaseClient.from('chat_sessions').upsert({
                session_id: sessionId,
                status: 'bot',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }, { onConflict: 'session_id' });
            if (error) console.error("Session Init Error:", error);
        };
        initSession();

        return () => {
            if (agentTimeoutRef.current) clearTimeout(agentTimeoutRef.current);
            supabaseClient.removeChannel(msgChannel);
            supabaseClient.removeChannel(sessionChannel);
        };
    }, [isOpen, sessionId]);

    // Update Session Data Helper
    const updateSessionData = async (newData: any) => {
        await supabaseClient.from('chat_sessions').update({
            user_data: newData,
            updated_at: new Date().toISOString()
        }).eq('session_id', sessionId);
    };

    const addMessage = (sender: 'user' | 'bot', text: string) => {
        setMessages(prev => [...prev, { sender, text }]);

        // Save to Supabase
        supabaseClient.from('chat_messages').insert({
            session_id: sessionId,
            sender,
            content: text,
            created_at: new Date().toISOString()
        }).then(({ error }) => {
            if (error) console.error('Error saving chat:', error);
        });
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

    const handleScoreAndProceed = (currentData: any) => {
        if (!dict) return;
        let score = 0;
        if (currentData.fault === 'other') score += 30;
        if (currentData.has_injury) score += 30;
        if (currentData.year && parseInt(currentData.year) > 2015) score += 10;

        const finalData = { ...currentData, score };
        submitLead(finalData);

        if (score >= 50) {
            addMessage('bot', dict.chat.responses.qualify_high || "Connecting to Senior Specialist...");
            setStep(999); // Live Agent State
        } else {
            addMessage('bot', dict.chat.responses.qualify_low || "Sending Accident Packet...");
            setStep(998); // End State
        }
    };

    const handleAtTheScene = () => {
        if (!dict) return;
        addMessage('bot', dict.chat.responses.scene_safety || "Are you safe?");
        setStep(200);
    };

    const handleSend = async (textOverride?: string) => {
        const userText = textOverride || input;
        if (!userText.trim() || !dict) return;

        setInput('');
        addMessage('user', userText);

        setTimeout(() => {
            const lowerText = userText.toLowerCase();
            const d = dict!;
            let nextStep = step;
            let botText = '';
            let newData = { ...userData };

            // --- At The Scene Flow ---
            if (step === 200) { // Safety Answer
                botText = d.chat.responses.scene_photo_plates || "Upload plates";
                nextStep = 201;
            }
            else if (step === 201) { // Plates
                botText = d.chat.responses.scene_photo_scene || "Scene photos";
                nextStep = 202;
            }
            else if (step === 202) { // Scene
                botText = d.chat.responses.scene_photo_docs || "Docs photos";
                nextStep = 203;
            }
            else if (step === 203) { // Docs
                botText = d.chat.responses.scene_processing || "Processing...";
                nextStep = 5; // Go to Incident Description
                setTimeout(() => {
                    addMessage('bot', d.chat.responses.ask_incident);
                }, 1500);
            }

            // --- Standard Flow ---
            else if (step === 0 || step === 1) { // Intro -> Name
                newData.full_name = userText;
                botText = d.chat.responses.ask_phone.replace('{name}', userText);
                nextStep = 2;
            }
            else if (step === 2) { // Phone
                newData.phone = userText;
                botText = d.chat.responses.ask_contact_method;
                nextStep = 3;
            }

            // --- SMS Flow (300) ---
            else if (step === 300) {
                newData.phone = userText;
                newData.contact_pref = 'text';
                botText = "Thanks. I've sent a link. Meanwhile, do you have photos of the accident? (Yes/No)";
                nextStep = 301;
            }
            else if (step === 301) {
                if (lowerText.includes('yes')) {
                    botText = d.chat.responses.scene_photo_plates || "Please upload them now.";
                    nextStep = 201; // Jump to existing evidence flow
                } else {
                    botText = d.chat.responses.ask_incident;
                    nextStep = 5;
                }
            }

            // --- Call Flow (400) ---
            else if (step === 400) {
                newData.phone = userText;
                newData.contact_pref = 'call';
                botText = "Got it. We are dialing you now. While you wait, do you have any photos of the damage? (Yes/No)";
                nextStep = 301; // Re-use the photo check logic
            }

            // --- Schedule Flow (500) ---
            else if (step === 500) {
                newData.incident_details = userText; // They described emergency
                botText = d.chat.responses.ask_call_time || "When is the best time for us to call you?";
                nextStep = 501;
            }
            else if (step === 501) {
                newData.best_time = userText;
                botText = d.chat.responses.ask_phone.replace('{name}', 'there');
                nextStep = 502;
            }
            else if (step === 502) {
                newData.phone = userText;
                botText = "Appointment Confirmed. Do you have scene photos to help the attorney prepare? (Yes/No)";
                nextStep = 301; // Re-use photo check
            }

            else if (step === 3) { // Method
                newData.contact_pref = lowerText.includes('text') ? 'text' : 'call';
                botText = d.chat.responses.ask_incident;
                nextStep = 4; // Skip to incident?
                if (newData.contact_pref === 'call') {
                    botText = d.chat.responses.ask_call_time;
                    nextStep = 4;
                } else {
                    botText = d.chat.responses.ask_incident;
                    nextStep = 5;
                }
            }
            else if (step === 4) { // Time
                newData.best_time = userText;
                botText = d.chat.responses.ask_incident;
                nextStep = 5;
            }
            else if (step === 100) { // Legacy Call (Safe fallback)
                newData.phone = userText;
                botText = d.chat.responses.ask_incident;
                nextStep = 5;
            }
            else if (step === 5) { // Incident
                newData.incident_details = userText;
                botText = d.chat.responses.ask_fault;
                nextStep = 6;
            }
            else if (step === 6) { // Fault
                newData.fault = lowerText.includes('me') ? 'me' : 'other';
                botText = "Was anyone injured? (Yes/No)";
                nextStep = 7;
            }
            else if (step === 7) { // Injury
                newData.has_injury = lowerText.includes('yes');
                handleScoreAndProceed(newData);
                return; // End flow handling here
            }

            // --- Call Flow ---
            else if (step === 100) {
                // ... (Simplified for brevity, can expand if needed)
                botText = d.chat.responses.ask_incident;
                nextStep = 5;
            }

            // If Live Mode is active, do NOT run bot logic
            if (isLiveMode) {
                setUserData(newData); // Still keep local state up to date just in case
                updateSessionData(newData); // Sync data
                return;
            }

            setUserData(newData);
            updateSessionData(newData); // Sync to DB
            setStep(nextStep);

            if (botText) {
                addMessage('bot', botText);
            }
        }, 800);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!dict) return;
        const file = e.target.files?.[0];
        if (!file) return;

        addMessage('user', `Uploading ${file.name}...`);

        try {
            const fileName = `${sessionId}/${Date.now()}-${file.name}`;
            const { error: uploadError } = await supabaseClient.storage
                .from('vehicle-photos')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            addMessage('bot', dict.chat.responses.upload_success);

            // Auto-advance if in Scene Flow
            if (step >= 200 && step <= 203) {
                handleSend("Image Uploaded"); // Trigger next step
            }
            else if (step === 7) {
                // Legacy flow
                addMessage('bot', dict.chat.responses.ask_recent);
                setStep(8);
            }

        } catch (error) {
            console.error('Upload error:', error);
            addMessage('bot', dict.chat.responses.upload_fail);
        }
    };

    if (!dict) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
            {/* Trigger Button */}
            {!isOpen && (
                <button
                    onClick={toggleChat}
                    className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition animate-bounce-subtle"
                >
                    <MessageCircleIcon size={28} />
                </button>
            )}

            {isOpen && (
                <div className="bg-white w-[350px] md:w-[400px] h-[500px] md:h-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 animate-in slide-in-from-bottom-5">

                    {/* Header */}
                    <div className="bg-blue-900 text-white p-4 flex justify-between items-center shrink-0">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold">A</div>
                            <div>
                                <h3 className="font-bold">Angel (AI Specialist)</h3>
                                <p className="text-xs text-blue-200 flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online</p>
                            </div>
                        </div>
                        <button onClick={toggleChat} className="p-2 hover:bg-white/20 rounded-full"><XIcon size={20} /></button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">

                        {/* Start Options */}
                        {messages.length < 2 && (
                            <div className="mb-6">
                                <button
                                    onClick={handleAtTheScene}
                                    className="w-full bg-red-600 hover:bg-red-700 text-white p-4 rounded-xl shadow-lg border border-red-500 flex items-center justify-between group transition-all mb-4 text-left"
                                >
                                    <div>
                                        <span className="block text-xs font-bold text-red-100 uppercase tracking-wider animate-pulse">Just Crashed?</span>
                                        <span className="text-lg font-black">At The Scene? Do This!</span>
                                    </div>
                                    <AlertTriangleIcon size={24} />
                                </button>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : 'bg-white text-gray-800 border border-gray-200 shadow-sm rounded-tl-none'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t border-gray-100 flex gap-2 shrink-0">
                        <label className="p-3 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 cursor-pointer">
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} ref={fileInputRef} />
                            <span className="text-xl">📷</span>
                        </label>

                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type your message..."
                            className="flex-1 bg-gray-100 border-0 rounded-full px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button
                            onClick={() => handleSend()}
                            className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-md transition transform active:scale-95"
                        >
                            <SendIcon size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
