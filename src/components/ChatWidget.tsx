/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from './ChatContext';
import { supabaseClient } from '@/lib/supabaseClient';
import { Dictionary } from '@/dictionaries/en';
import { XIcon, SendIcon, AlertTriangleIcon, MessageCircleIcon, SparklesIcon, CalendarIcon } from 'lucide-react';

type Message = {
    sender: 'user' | 'bot';
    text: string;
};

interface ChatWidgetProps {
    dict?: Dictionary | null;
    variant?: 'popup' | 'fullscreen';
}

export default function ChatWidget({ dict, variant = 'popup' }: ChatWidgetProps) {
    const { isOpen, toggleChat, chatMode, openReview, chatData } = useChat();
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [step, setStep] = useState(0);
    const [userData, setUserData] = useState<any>({});
    const [sessionId] = useState(() => Math.random().toString(36).substring(7));
    const [isLiveMode, setIsLiveMode] = useState(false);
    const [currentOptions, setCurrentOptions] = useState<{ label: string; value: string; }[] | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const agentTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const processingRef = useRef(false);

    // Force open if fullscreen
    const showChat = variant === 'fullscreen' || isOpen;

    // --- HELPER FUNCTIONS (Defined before Effects to avoid TDZ) ---

    // 1. Update Session
    const updateSessionData = async (newData: any) => {
        await supabaseClient.from('chat_sessions').update({
            user_data: newData,
            updated_at: new Date().toISOString()
        }).eq('session_id', sessionId);
    };

    // 2. Add Message
    const addMessage = (sender: 'user' | 'bot', text: string) => {
        setMessages(prev => [...prev, { sender, text }]);

        supabaseClient.from('chat_messages').insert({
            session_id: sessionId,
            sender,
            content: text,
            created_at: new Date().toISOString()
        }).then(({ error }) => {
            if (error) console.error('Error saving chat:', error);
        });
    };

    // 3. Submit Lead
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

    // 4. Score & Proceed
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

            // NO DEAD END: Offer live chat anyway
            setTimeout(() => {
                addMessage('bot', (dict.chat.responses as any).qualify_low_followup || "However, our Senior Agents are still available...");
                setStep(10); // Go to Standalone Options (Chat / Schedule)
            }, 1500);
        }
    };


    const handleAtTheScene = () => {
        if (!dict) return;
        addMessage('bot', dict.chat.responses.scene_safety || "🚨 First priority: Is everyone safe?");
        setTimeout(() => {
            addMessage('bot', dict.chat.responses.scene_safety_followup || "Are you in a safe place to chat now?");
        }, 1000);
        setStep(200);
        sendChatAlert('At The Scene Started');
    };

    // 5. Send Chat Alert
    const sendChatAlert = async (initialMessage: string) => {
        try {
            const key = `alert_sent_${sessionId}`;
            if (sessionStorage.getItem(key)) return;
            sessionStorage.setItem(key, 'true');

            await fetch('/api/notify/chat-start', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId,
                    userName: userData.full_name || 'Guest',
                    language: window.location.pathname.startsWith('/es') ? 'es' : 'en',
                    initialMessage
                })
            });
        } catch (e) {
            console.error('Alert error', e);
        }
    };

    // --- END HELPERS ---


    // Initial greeting
    useEffect(() => {
        if (showChat && messages.length === 0 && dict) {
            let initialMsgs: Message[] = [];
            let initialStep = 0;
            // logic based on chatMode
            if (chatMode === 'sms') {
                initialMsgs = [{ sender: 'bot', text: dict.chat.responses.greeting_sms }];
                initialStep = 300; // SMS Flow Start
            } else if (chatMode === 'call') {
                initialMsgs = [{ sender: 'bot', text: dict.chat.responses.greeting_call }];
                initialStep = 400; // Call Flow Start
            } else if (chatMode === 'schedule') {
                initialMsgs = [{ sender: 'bot', text: dict.chat.responses.greeting_schedule }];
                initialStep = 500; // Schedule Flow Start
            } else if ((variant === 'fullscreen' && !chatMode) || chatMode === 'standalone') {
                // Standalone Mode
                initialMsgs = [{ sender: 'bot', text: dict.chat.responses.greeting_standalone }];
                initialStep = 10;
            } else if (chatMode === 'high_value_lead') {
                const text = (dict.chat.responses as any).high_value_intro || "Strong likelihood that we may be able to assist...";
                initialMsgs = [{ sender: 'bot', text: text }];
                initialStep = 600;
                sendChatAlert('High Value Lead: Match > 70%');
            } else if (chatMode === 'live') {
                initialMsgs = [{ sender: 'bot', text: dict.chat.responses.greeting_live }];
                // Check if agents are busy logic
                agentTimeoutRef.current = setTimeout(() => {
                    addMessage('bot', dict.chat.responses.busy_agents);
                    setStep(30);
                }, 15000);
            } else {
                initialMsgs = [{ sender: 'bot', text: dict.chat.responses.greeting_standard }];
                initialStep = 1;
            }

            setMessages(initialMsgs);
            setStep(initialStep);
        }
    }, [showChat, chatMode, dict]);

    // Effect to handle "Start Over" when switching modes while already open
    useEffect(() => {
        if (showChat && dict) {
            // Only if mode changes significantly?
            // Actually this effect logic was slightly duplicated in previous code, 
            // but effectively it resets if chatMode changes.
            // Simplified here to avoid conflicts:
            // logic is already in the first useEffect [chatMode] dependency. 
            // But if we need to FORCE reset when chatMode updates:
            // Let's rely on the dependency array of the first effect.
            // Wait, the first effect checks `messages.length === 0`.
            // So if messages exist, it won't reset.
            // We need a separate effect for mode switching if already open.
        }
    }, [chatMode]);
    // Actually, looking at previous code, there was a specific block for this.
    // I shall perform a "soft reset" if chatMode changes and isOpen.
    useEffect(() => {
        if (showChat && dict && chatMode) {
            // Logic to switch context
            let initialMsgs: Message[] = [];
            let initialStep = 0;
            if (chatMode === 'sms') { initialMsgs = [{ sender: 'bot', text: dict.chat.responses.greeting_sms }]; initialStep = 300; }
            else if (chatMode === 'call') { initialMsgs = [{ sender: 'bot', text: dict.chat.responses.greeting_call }]; initialStep = 400; }
            else if (chatMode === 'schedule') { initialMsgs = [{ sender: 'bot', text: dict.chat.responses.greeting_schedule }]; initialStep = 500; }
            else if (chatMode === 'high_value_lead') {
                const text = (dict.chat.responses as any).high_value_intro || "Strong likelihood that we may be able to assist...";
                initialMsgs = [{ sender: 'bot', text: text }];
                initialStep = 600;
                sendChatAlert('High Value Lead: Match > 70%');
            }
            else if (chatMode === 'valuation') {
                const min = chatData?.valuation?.min?.toLocaleString() || '...';
                const max = chatData?.valuation?.max?.toLocaleString() || '...';
                const baseText = (dict.chat.responses as any).greeting_valuation || "I see you're looking at an estimated value of $${min} - $${max}.";
                const text = baseText.replace('${min}', min).replace('${max}', max);
                initialMsgs = [{ sender: 'bot', text }];
                initialStep = 1; // Go to Name input
            }
            else if (chatMode === 'standalone') { initialMsgs = [{ sender: 'bot', text: dict.chat.responses.greeting_standalone }]; initialStep = 10; }

            if (initialMsgs.length > 0) {
                setMessages(initialMsgs);
                setStep(initialStep);
            }
        }
    }, [chatMode]);


    // Auto-scroll
    useEffect(() => {
        if (showChat) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, showChat]);

    // Realtime Session Status & Messages
    useEffect(() => {
        if (!showChat) return;

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
            const key = `session_init_${sessionId}`; // Simple debounce
            if (sessionStorage.getItem(key)) return;
            sessionStorage.setItem(key, 'true');

            let dbPayload: any = {
                session_id: sessionId,
                status: 'bot',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            if (chatData) {
                // Map the data from CaseReviewModal (formData) OR Calculator to Supabase schema

                // 1. Calculator Data Source
                if (chatData.source === 'calculator') {
                    // Mapping Calculator Data
                    const valMin = chatData.valuation?.min?.toLocaleString() || '0';
                    const valMax = chatData.valuation?.max?.toLocaleString() || '0';
                    const vehicleStr = `${chatData.year} ${chatData.make} ${chatData.model} (${chatData.trim})`;

                    dbPayload.user_data = {
                        vehicle_info: vehicleStr,
                        // We use the description field to store the valuation summary
                        description: `Valuation Inquiry: ${vehicleStr}. Est: $${valMin} - $${valMax}. Mileage: ${chatData.mileage}. Condition: ${chatData.condition}. Features: ${chatData.features?.join(', ')}`,

                        // We don't have personal info yet, just the vehicle
                        full_name: 'Guest (Valuation)',
                        imported_from_review: true,
                        raw_review_data: chatData
                    };

                    setUserData((prev: any) => ({ ...prev, ...dbPayload.user_data }));

                    // Optional: auto-send a summary message from the bot perspective? 
                    // No, the greeting covers it: "I see you're looking at..."
                }
                // 2. Case Review Data Source (Existing)
                else {
                    const mappedData = {
                        full_name: chatData.fullName,
                        phone: chatData.phone,
                        city: chatData.cityState,
                        pain_level: chatData.painLevel,
                        // Handle score object or number
                        score: typeof chatData.score === 'object' ? chatData.score?.score : chatData.score,
                        severity: typeof chatData.score === 'object' ? chatData.score?.severity : 'unknown',
                        injury_summary: chatData.bodyParts ? chatData.bodyParts.join(', ') : '',
                        description: `Collision: ${chatData.collisionType}. Vehicle: ${chatData.vehicle}. Liability: ${chatData.faultBelief}.`,
                        best_time: chatData.bestTime,
                        imported_from_review: true,
                        // Store strict raw dump for safety
                        raw_review_data: chatData
                    };
                    dbPayload.user_data = mappedData;

                    // Hydrate local state
                    setUserData((prev: any) => ({ ...prev, ...mappedData }));

                    // Add visible summary message if this is the first load
                    const keyMsg = `summary_sent_${sessionId}`;
                    if (!sessionStorage.getItem(keyMsg)) {
                        sessionStorage.setItem(keyMsg, 'true');
                        // Use a timeout to ensure it appears after greeting
                        setTimeout(() => {
                            addMessage('bot', `📋 Case Review Summary Received:\n\nScore: ${mappedData.score}% (${mappedData.severity?.toUpperCase()})\nInjuries: ${mappedData.injury_summary || 'None Reported'}\nCollision: ${chatData.collisionType}`);
                        }, 500);
                    }
                }
            }

            const { error } = await supabaseClient.from('chat_sessions').upsert(dbPayload, { onConflict: 'session_id' });
            if (error) console.error("Session Init Error:", error);

            // Alert for generic chat start
            if (step === 1 || step === 0 || step === 600 || (chatMode === "valuation")) {
                // Defer slightly to avoid blocking
                const alertMsg = chatMode === 'high_value_lead' ? 'High Value Lead: Match > 70%' : (chatMode === 'valuation' ? 'Valuation Inquiry Started' : 'Generic Chat Open');
                setTimeout(() => sendChatAlert(alertMsg), 1000);
            }
        };
        initSession();

        return () => {
            if (agentTimeoutRef.current) clearTimeout(agentTimeoutRef.current);
            supabaseClient.removeChannel(msgChannel);
            supabaseClient.removeChannel(sessionChannel);
        };
    }, [showChat, sessionId, chatMode, chatData, step]);


    const handleSend = async (textOverride?: string) => {
        // Prevent double submission
        if (processingRef.current) return;

        const userText = textOverride || input;
        if (!userText.trim() || !dict) return;

        processingRef.current = true; // LOCK

        // Validation Logic
        const lowerText = userText.toLowerCase();

        // --- Language Switching Logic ---
        // --- Language Switching Logic ---
        if (lowerText.includes('english') || lowerText.includes('inglés') || lowerText.includes('ingles')) {
            if (window.location.pathname.startsWith('/es')) {
                addMessage('bot', "Switching to English...");
                const newPath = window.location.pathname.replace(/^\/es/, '/en');
                window.location.href = newPath;
                return;
            }
        }
        if (lowerText.includes('spanish') || lowerText.includes('español') || lowerText.includes('espanol')) {
            if (window.location.pathname.startsWith('/en')) {
                addMessage('bot', "Cambiando a Español...");
                const newPath = window.location.pathname.replace(/^\/en/, '/es');
                window.location.href = newPath;
                return;
            } else if (window.location.pathname === '/') {
                addMessage('bot', "Cambiando a Español...");
                window.location.href = '/es';
                return;
            }
        }

        // Contact Info Validation (Step 2, 4, 300, 400, 502, 100)
        const isContactStep = [2, 4, 300, 400, 502, 100].includes(step);
        if (isContactStep) {
            // Regex: At least 10 digits, allows spaces/dashes/parens/plus
            const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
            const cleanNumber = userText.replace(/\D/g, ''); // Strip non-digits

            // Regex: Basic Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            const isValidPhone = phoneRegex.test(userText) && cleanNumber.length >= 10;
            const isValidEmail = emailRegex.test(userText);

            if (!isValidPhone && !isValidEmail) {
                addMessage('user', userText); // Show what they typed
                setTimeout(() => {
                    addMessage('bot', (dict.chat.responses as any).validation_contact || "Please enter a valid phone number OR email address.");
                    processingRef.current = false; // UNLOCK on error
                }, 400);
                setInput('');
                return; // STOP execution
            }
        }

        setInput('');
        addMessage('user', userText);

        setTimeout(() => {
            // UNLOCK after processing response
            processingRef.current = false;

            const d = dict!;
            let nextStep = step;
            let botText = '';
            let newData = { ...userData };

            // === CORE LOGIC ===

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
                if (userText.length < 2) {
                    addMessage('bot', (dict.chat.responses as any).validation_name || "Please enter your full name.");
                    return;
                }
                newData.full_name = userText;
                botText = ((dict.chat.responses as any).ask_email_phone || "Thank you, {name}. In case we get disconnected, what is your email address or cell phone number?").replace('{name}', userText);
                nextStep = 2;
            }
            else if (step === 2) { // Phone
                newData.phone = userText;
                botText = d.chat.responses.ask_contact_method;
                nextStep = 3;
            }

            // --- Qualification Flow ---
            // Transitioning from Contact Info
            else if (step === 301 || step === 3 || step === 4 || step === 100) {
                // Catch-all check
            }

            // Explicit transitions from Contact Flow to Qualification
            if (nextStep === 5) {
                nextStep = 50;
                botText = d.chat.responses.ask_injury_time;
                if (d.chat.time_options) {
                    setCurrentOptions([
                        { label: d.chat.time_options.one_week, value: d.chat.time_options.one_week },
                        { label: d.chat.time_options.one_month, value: d.chat.time_options.one_month },
                        { label: d.chat.time_options.six_months, value: d.chat.time_options.six_months },
                        { label: d.chat.time_options.less_one, value: d.chat.time_options.less_one }
                    ]);
                }
            }

            // Step 50: Injury Time Answered
            else if (step === 50) {
                newData.injury_time = userText;
                botText = d.chat.responses.ask_hospital;
                nextStep = 52;
                setCurrentOptions([
                    { label: d.chat.yes_no?.yes || "Yes", value: "Yes" },
                    { label: d.chat.yes_no?.no || "No", value: "No" }
                ]);
            }

            // Step 52: Hospital Answered
            else if (step === 52) {
                const isYes = lowerText.includes('yes') || lowerText.includes('sí') || lowerText.includes('si');
                const isNo = lowerText.includes('no');

                if (!isYes && !isNo) {
                    addMessage('bot', "Please answer Yes or No.");
                    processingRef.current = false;
                    return;
                }

                newData.hospitalized = isYes;
                botText = d.chat.responses.ask_fault;
                nextStep = 53;
                setCurrentOptions([
                    { label: d.chat.yes_no?.no_fault || "No", value: "No" },
                    { label: d.chat.yes_no?.yes_fault || "Yes", value: "Yes" }
                ]);
            }

            // Step 53: Fault Answered
            else if (step === 53) {
                const isYes = lowerText.includes('yes') || lowerText.includes('sí') || lowerText.includes('si');
                const isNo = lowerText.includes('no');

                if (!isYes && !isNo) {
                    addMessage('bot', "Please answer Yes or No.");
                    processingRef.current = false;
                    return;
                }

                const isAtFault = isYes;
                newData.fault = isAtFault ? 'me' : 'other';

                botText = d.chat.responses.ask_lawyer;
                nextStep = 54;
                setCurrentOptions([
                    { label: d.chat.yes_no?.no || "No", value: "No" },
                    { label: d.chat.yes_no?.yes || "Yes", value: "Yes" }
                ]);
            }

            // Step 54: Lawyer Answered
            else if (step === 54) {
                const isYes = lowerText.includes('yes') || lowerText.includes('sí') || lowerText.includes('si');
                const isNo = lowerText.includes('no');
                if (!isYes && !isNo) {
                    addMessage('bot', (dict.chat.responses as any).validation_yes_no || "Please answer Yes or No.");
                    processingRef.current = false;
                    return;
                }

                newData.has_lawyer = isYes;
                botText = d.chat.responses.ask_injury_type;
                nextStep = 55;

                const opts = d.chat.injury_type_options;
                if (opts) {
                    setCurrentOptions([
                        { label: opts.back_neck, value: opts.back_neck },
                        { label: opts.headaches, value: opts.headaches },
                        { label: opts.cuts_bruises, value: opts.cuts_bruises },
                        { label: opts.broken_bones, value: opts.broken_bones },
                        { label: opts.other, value: opts.other }
                    ]);
                }
            }

            // Step 55: Injury Type Answered
            else if (step === 55) {
                newData.injury_type = userText;
                botText = d.chat.responses.ask_description;
                nextStep = 56;
                setCurrentOptions(null);
            }

            // Step 56: Description Answered -> Photos
            else if (step === 56) {
                newData.description = userText;
                botText = d.chat.responses.ask_photos; // "Do you have photos?"
                nextStep = 57;
                setCurrentOptions([
                    { label: d.chat.yes_no?.yes || "Yes", value: "Yes" },
                    { label: d.chat.yes_no?.no || "No", value: "No" }
                ]);
            }

            // Step 57: Photos Answered
            else if (step === 57) {
                const isYes = lowerText.includes('yes') || lowerText.includes('sí') || lowerText.includes('si');
                const isNo = lowerText.includes('no');

                if (isYes) {
                    botText = d.chat.responses.scene_photo_plates || "Please upload them now (Camera Icon).";
                    nextStep = 201; // Transition to evidence flow
                    setCurrentOptions(null);
                } else {
                    handleScoreAndProceed(newData);
                    return;
                }
            }

            // --- Pre-existing SMS/Call Flow Connections ---
            else if (step === 300) { // SMS Sent
                newData.phone = userText;
                newData.contact_pref = 'text';
                nextStep = 5;
            }
            else if (step === 400) { // Call Dialing
                newData.phone = userText;
                newData.contact_pref = 'call';
                nextStep = 5;
            }
            else if (step === 502) { // Schedule Confirmed
                newData.phone = userText;
                nextStep = 5;
            }

            // --- Standard Contact Connections ---
            else if (step === 3) {
                const isText = lowerText.includes('text') || lowerText.includes('sms') || lowerText.includes('msg');
                const isCall = lowerText.includes('call') || lowerText.includes('phone');
                if (!isText && !isCall) { addMessage('bot', (dict.chat.responses as any).text_or_call_ask || "Text or Call?"); processingRef.current = false; return; }
                newData.contact_pref = isText ? 'text' : 'call';
                if (newData.contact_pref === 'call') { botText = d.chat.responses.ask_call_time; nextStep = 4; }
                else { nextStep = 5; }
            }
            else if (step === 4) {
                newData.best_time = userText;
                nextStep = 5;
            }
            else if (step === 100) {
                newData.phone = userText;
                nextStep = 5;
            }

            // --- High Value Lead Flow ---
            else if (step === 600) {
                const isConsult = lowerText.includes('consult') || lowerText.includes('appoint') || lowerText.includes('sched') || lowerText.includes('call');
                const isChat = lowerText.includes('chat') || lowerText.includes('now') || lowerText.includes('free');

                if (isConsult) {
                    botText = dict.chat.responses.greeting_schedule;
                    nextStep = 500;
                } else if (isChat) {
                    botText = dict.chat.responses.ask_name || "May I have your full name?";
                    nextStep = 1;
                } else {
                    botText = (dict.chat.responses as any).chat_or_schedule || "Would you like to 'Chat Now' or 'Schedule a Consultation'?";
                    // Stay on step 600
                }
            }

            // --- Legacy / Safety Flow ---
            else if (step === 200 || step === 201 || step === 202) {
                if (step === 200) { botText = d.chat.responses.scene_photo_plates; nextStep = 201; }
                else if (step === 201) { botText = d.chat.responses.scene_photo_scene; nextStep = 202; }
                else if (step === 202) { botText = d.chat.responses.scene_photo_docs; nextStep = 203; }
            }
            else if (step === 203) {
                botText = d.chat.responses.scene_processing;
                nextStep = 5; // -> 50
            }


            // Live Mode Check
            if (isLiveMode) {
                setUserData(newData);
                updateSessionData(newData);
                return;
            }

            setUserData(newData);
            updateSessionData(newData); // Sync to DB

            // Handle redirect to Step 50 logic repeated from above?
            // NextStep is already 50 if applicable.
            if (nextStep === 5) {
                nextStep = 50;
                botText = d.chat.responses.ask_injury_time;
                if (d.chat.time_options) {
                    setCurrentOptions([
                        { label: d.chat.time_options.one_week, value: d.chat.time_options.one_week },
                        { label: d.chat.time_options.one_month, value: d.chat.time_options.one_month },
                        { label: d.chat.time_options.six_months, value: d.chat.time_options.six_months },
                        { label: d.chat.time_options.less_one, value: d.chat.time_options.less_one }
                    ]);
                }
            }

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

        addMessage('user', ((dict.chat.responses as any).uploading || "Uploading {file}...").replace('{file}', file.name));

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

    if (variant === 'fullscreen') {
        return (
            <div className="flex flex-col h-[100dvh] bg-gray-50">
                {/* Header */}
                <div className="bg-blue-900 text-white p-4 flex justify-between items-center shrink-0 shadow-md z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center font-bold text-lg">A</div>
                        <div>
                            <h3 className="font-bold text-lg">Angel (AI Specialist)</h3>
                            <p className="text-xs text-blue-200 flex items-center gap-1"><span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online • Private Session</p>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 pb-20">
                    {/* Standalone Start Options (Step 10) */}
                    {step === 10 && messages.length === 1 && (
                        <div className="flex flex-col gap-3 mb-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
                            <button
                                onClick={() => {
                                    if (dict.buttons.options_standalone) openReview();
                                }}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white p-4 rounded-xl shadow-lg border border-blue-400 flex items-center gap-4 transition-all hover:scale-[1.02] group"
                            >
                                <div className="bg-white/20 p-2 rounded-full group-hover:bg-white/30 transition"><SparklesIcon size={24} className="text-yellow-300" /></div>
                                <div className="text-left">
                                    <span className="block text-xs font-bold text-blue-100 uppercase tracking-widest">Recommended</span>
                                    <span className="text-lg font-bold">{dict.buttons.options_standalone?.ai_review || "AI Case Review"}</span>
                                </div>
                            </button>

                            <button
                                onClick={() => {
                                    addMessage('user', dict.buttons.options_standalone?.live_chat || "Live Chat");
                                    setStep(1);
                                    setTimeout(() => addMessage('bot', dict.chat.responses.ask_name || "May I have your full name?"), 600);
                                }}
                                className="w-full bg-white hover:bg-gray-50 text-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4 transition-all hover:scale-[1.02]"
                            >
                                <div className="bg-blue-100/50 p-2 rounded-full"><MessageCircleIcon size={24} className="text-blue-600" /></div>
                                <span className="text-lg font-bold">{dict.buttons.options_standalone?.live_chat || "Live Chat"}</span>
                            </button>

                            <button
                                onClick={() => {
                                    addMessage('user', dict.buttons.options_standalone?.schedule || "Schedule Call");
                                    setStep(500);
                                    setTimeout(() => addMessage('bot', dict.chat.responses.greeting_schedule), 600);
                                }}
                                className="w-full bg-white hover:bg-gray-50 text-gray-800 p-4 rounded-xl shadow-sm border border-gray-200 flex items-center gap-4 transition-all hover:scale-[1.02]"
                            >
                                <div className="bg-purple-100/50 p-2 rounded-full"><CalendarIcon size={24} className="text-purple-600" /></div>
                                <span className="text-lg font-bold">{dict.buttons.options_standalone?.schedule || "Schedule Call"}</span>
                            </button>
                        </div>
                    )}

                    {/* Standard Start Options */}
                    {messages.length < 2 && step !== 10 && (
                        <div className="mb-6">
                            <button
                                onClick={handleAtTheScene}
                                className="w-full bg-red-600 hover:bg-red-700 text-white p-6 rounded-xl shadow-lg border-2 border-red-500 flex items-center justify-between group transition-all mb-4 text-left"
                            >
                                <div>
                                    <span className="block text-sm font-bold text-red-100 uppercase tracking-wider animate-pulse">Just Crashed?</span>
                                    <span className="text-xl font-black">At The Scene? Start Here</span>
                                </div>
                                <AlertTriangleIcon size={32} />
                            </button>
                        </div>
                    )}

                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[85%] p-4 rounded-2xl text-base ${msg.sender === 'user'
                                ? 'bg-blue-600 text-white rounded-tr-none shadow-md'
                                : 'bg-white text-gray-800 border border-gray-200 shadow-sm rounded-tl-none'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    <div ref={bottomRef} />
                </div>

                {/* Input Area - Fixed Bottom for Mobile */}
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 flex gap-2 z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                    <label className="p-3 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 cursor-pointer active:scale-95 transition">
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} ref={fileInputRef} />
                        <span className="text-xl">📷</span>
                    </label>

                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type message..."
                        className="flex-1 bg-gray-100 border-0 rounded-full px-5 text-base text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                    <button
                        onClick={() => handleSend()}
                        className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-md transition transform active:scale-95"
                    >
                        <SendIcon size={20} />
                    </button>
                </div>
            </div>
        );
    }

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
                                <h3 className="font-bold">{dict?.chat?.header_title || "AI Accident Specialist"}</h3>
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

                        {/* Options Buttons */}
                        {currentOptions && (
                            <div className="flex flex-wrap gap-2 mt-2 justify-end animate-in fade-in slide-in-from-bottom-2">
                                {currentOptions.map((opt, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => handleSend(opt.value)} // Send the value as message
                                        className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-4 py-2 rounded-full text-sm font-medium transition"
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        )}
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
                            className="flex-1 bg-gray-100 border-0 rounded-full px-4 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
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
