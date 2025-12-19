'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from './ChatContext';

type Message = {
    sender: 'user' | 'bot';
    text: string;
};

import { supabaseClient } from '@/lib/supabaseClient';

export default function ChatWidget() {
    const { isOpen, toggleChat, chatMode } = useChat(); // Added chatMode
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [step, setStep] = useState(0);
    const [userData, setUserData] = useState<any>({});
    const [sessionId] = useState(() => Math.random().toString(36).substring(7));
    const bottomRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const agentTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Track timeout

    // Initial greeting
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            if (chatMode === 'sms') {
                setMessages([{
                    sender: 'bot',
                    text: "No problem. Let's get this set up so we can text you. To start, please provide your cell phone number."
                }]);
                setStep(20); // SMS: Waiting for Cell
            } else {
                setMessages([{
                    sender: 'bot',
                    text: "Hi, I'm Angel. I understand this is a stressful time, and I'm here to help you get through this. To start, may I have your name? I want to make this as quick as possible so I will ask you a few questions but you can always just say \"live agent\" and I will go ahead and connect you."
                }]);
                setStep(1); // Standard: Waiting for Name
            }
        }
    }, [isOpen, chatMode]);

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
                    // Agent replied, clear timeout
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
        if (!text.trim()) return;

        // User Message (Optimistic)
        const newMessages = [...messages, { sender: 'user', text } as Message];
        setMessages(newMessages);
        setInput('');

        // 1. Save to DB for Admin to see
        try {
            await fetch('/api/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session_id: sessionId,
                    sender: 'user',
                    content: text
                })
            });
        } catch (e) {
            console.error('Failed to save message', e);
        }

        // 2. Bot Logic
        setTimeout(() => processBotResponse(text, newMessages), 600);
    };

    const processBotResponse = async (userText: string, currentMessages: Message[]) => {
        let botText = '';
        let nextStep = step;
        let newData = { ...userData };

        // Global Interrupt: Live Agent (only if not already in SMS flow or waiting)
        if (step < 20 && (userText.toLowerCase().includes('live agent') || userText.toLowerCase().includes('agent'))) {
            setMessages(prev => [...prev, {
                sender: 'bot',
                text: "I am connecting you to a live specialist now. Please hold on, someone will be with you shortly."
            }]);

            // Notify admin via system message (simulated by generic send)
            await fetch('/api/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ session_id: sessionId, sender: 'bot', content: '[SYSTEM]: User requested Live Agent.' })
            });

            // Set 20s timeout
            if (agentTimeoutRef.current) clearTimeout(agentTimeoutRef.current);
            agentTimeoutRef.current = setTimeout(() => {
                setMessages(prev => [...prev, {
                    sender: 'bot',
                    text: "All our agents are currently busy assisting others. An agent will text you as soon as they are available. What is the best time to text you?"
                }]);
                setStep(30); // Special step: Waiting for Text Time
            }, 20000); // 20 seconds

            return; // Stop standard bot flow
        }

        switch (step) {
            // ... (Standard flows 1-9 remain) ...
            case 1:
                newData.full_name = userText;
                botText = `Thank you, ${userText}. In case we get disconnected, what is your cell phone number?`;
                nextStep = 2;
                break;
            case 2:
                newData.phone = userText;
                botText = "Thanks. Do you prefer we contact you via Text or Call?";
                nextStep = 3;
                break;
            case 3:
                newData.contact_pref = userText.toLowerCase().includes('text') ? 'text' : 'call';
                if (newData.contact_pref === 'call') {
                    botText = "What is the best time for us to call you? I'll send a text to confirm the appointment time.";
                    nextStep = 4;
                } else {
                    botText = "Understood. Now, could you please share what happened? Was it a total loss, were there injuries, or both?";
                    nextStep = 5;
                }
                break;
            case 4:
                newData.best_time = userText;
                botText = "Perfect. Now, could you please share me briefly what happened? Was it a total loss, were there injuries, or both?";
                nextStep = 5;
                break;
            case 5: // Incident -> Ask Fault
                newData.incident_details = userText;
                newData.has_injury = userText.toLowerCase().includes('pain') || userText.toLowerCase().includes('hurt') || userText.toLowerCase().includes('injur');
                botText = "I see. I'm so sorry you're going through this. Did the police confirm fault?";
                nextStep = 6;
                break;
            case 6:
                newData.fault_info = userText;
                botText = "Do you have any photos of the damage or a police report you can share? (You can upload them using the camera icon below, or just say 'No')";
                nextStep = 7;
                break;
            case 7:
                // Logic for photos handled by upload button, but text response moves us forward
                botText = "One last important question: Was the accident within the last 48 hours?";
                nextStep = 8;
                break;
            case 8:
                const isRecent = userText.toLowerCase().includes('yes') || userText.toLowerCase().includes('within') || userText.toLowerCase().includes('today') || userText.toLowerCase().includes('yesterday');

                if (isRecent) {
                    botText = "Please listen carefully: because it's been less than 48 hours, I strongly recommend you visit an ER or Urgent Care immediately. Adrenaline can mask injuries. The car can wait—your health can't.";
                } else {
                    botText = "Since it's been a few days, I recommend seeing a Chiropractor or Rehab Specialist to check for hidden soft-tissue injuries. The longer you wait, the harder it is to prove your injuries are related to the crash.";
                }

                // Add closing advice
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        sender: 'bot',
                        text: "Always seek medical attention if you are injured. The insurance company often claims 'gaps in treatment' mean you weren't really hurt. Don't let them do that."
                    }]);

                    // Final submission
                    submitLead(newData);

                }, 2000);

                nextStep = 9; // End
                break;

            case 9:
                botText = "We have received your details and a specialist will be in touch shortly. Is there anything else you'd like to share?";
                break;

            // --- SMS FLOW ---
            case 20: // SMS: Cell -> Ask Loss
                newData.phone = userText;
                newData.contact_pref = 'text'; // Implicit
                botText = "Got it. Could you briefly describe the loss or accident?";
                nextStep = 21;
                break;
            case 21: // SMS: Loss -> Ask Time
                newData.incident_details = userText;
                botText = "Thank you. What is the best time for us to text you inside the next 24 hours?";
                nextStep = 22;
                break;
            case 22: // SMS: Time -> Ask Review Info
                newData.best_time = userText;
                botText = "Understood. Finally, what information would you like the firm to review prior to texting?";
                nextStep = 23;
                break;
            case 23: // SMS: Info -> Confirm
                newData.notes = userText; // Store in notes or extra field
                botText = "Thank you. I have confirmed your number and details. Someone will be reaching out via text in the next 24 hours.";

                setTimeout(() => {
                    submitLead(newData);
                }, 1000);

                nextStep = 24;
                break;
            case 24:
                botText = "Your request is confirmed. We will reach out soon.";
                break;

            case 24:
                botText = "Your request is confirmed. We will reach out soon.";
                break;

            // --- FALLBACK from Live Agent ---
            case 30: // Waiting for Text Time
                newData.best_time = userText;
                botText = "Thank you. An agent will text you at that time. We have your details.";
                setTimeout(() => { submitLead(newData); }, 1000);
                nextStep = 9; // End
                break;

            default:
                botText = "Thanks. We'll be in touch.";
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
        const file = e.target.files?.[0];
        if (!file) return;

        setMessages(prev => [...prev, { sender: 'user', text: `Uploading ${file.name}...` }]);

        try {
            const fileName = `${sessionId}/${Date.now()}-${file.name}`;
            const { error: uploadError } = await supabaseClient.storage
                .from('vehicle-photos')
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabaseClient.storage
                .from('vehicle-photos')
                .getPublicUrl(fileName);

            setMessages(prev => [...prev, { sender: 'user', text: `✅ Photo uploaded!` }]);

            // Advance step if waiting for photos
            if (step === 7) {
                // Determine if we trigger the text flow manually or wait for user input? 
                // Let's prompt user to continue or just auto-advance after short delay
                setMessages(prev => [...prev, { sender: 'bot', text: "Photo received. Was the accident within the last 48 hours?" }]);
                setStep(8);
            }

        } catch (error) {
            console.error('Upload error:', error);
            setMessages(prev => [...prev, { sender: 'bot', text: 'Failed to upload photo. Please try again.' }]);
        }
    };

    return (
        <>
            {/* Trigger Button - HIDDEN per request, but kept in code for potential future use or manual testing via devtools */}
            <button
                onClick={toggleChat}
                className="hidden fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition z-50 font-bold"
                id="chat-trigger-btn"
            >
                {isOpen ? 'Close' : 'Chat Support'}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed inset-0 md:inset-auto md:bottom-4 md:right-4 md:w-96 md:h-[600px] bg-white md:rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden font-sans">
                    <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-4 rounded-t-none md:rounded-t-lg font-bold flex justify-between items-center shadow-md">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span>Angel - Claims Specialist</span>
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
                        <label className="cursor-pointer text-gray-400 hover:text-blue-600 p-2 transition-colors" title="Upload Photo">
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
                            placeholder="Type a message..."
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
