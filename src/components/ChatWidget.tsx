'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from './ChatContext';

type Message = {
    sender: 'user' | 'bot';
    text: string;
};

import { supabaseClient } from '@/lib/supabaseClient';

export default function ChatWidget() {
    const { isOpen, toggleChat, chatMode } = useChat();
    // Reset messages when opening/mode changes? Ideally yes for clean start.
    // For now, let's append or reset based on effect.
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        // Init messages based on mode
        if (messages.length === 0) {
            setMessages([{ sender: 'bot', text: 'Hi! I\'m Angel. Tell me why your vehicle is or might be a total loss. Where and when was the accident?  Did the police issues any tickets? Anyone hurt? As much detail as you can recall.' }]);
        }
    }, []);

    useEffect(() => {
        if (isOpen && chatMode === 'callback') {
            setMessages([
                { sender: 'bot', text: 'To request a callback, I need to ask a few quick questions.' },
                { sender: 'bot', text: '1) Who was at fault for the accident?' }
            ]);
            setCallbackStep(1); // Start callback flow
        }
    }, [isOpen, chatMode]);

    const [callbackStep, setCallbackStep] = useState(0); // 0=none, 1=Q1, 2=Q2, 3=Done
    const [input, setInput] = useState('');
    const [context, setContext] = useState('');
    const [sessionId] = useState(() => Math.random().toString(36).substring(7));
    const bottomRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setMessages(prev => [...prev, { sender: 'user', text: `Uploading ${file.name}...` }]);

        try {
            const fileName = `${sessionId}/${Date.now()}-${file.name}`;
            const { data, error } = await supabaseClient.storage
                .from('vehicle-photos')
                .upload(fileName, file);

            if (error) throw error;

            const { data: { publicUrl } } = supabaseClient.storage
                .from('vehicle-photos')
                .getPublicUrl(fileName);

            const msgText = `Uploaded photo: ${publicUrl}`;

            // Send hidden URL message to bot to save in context
            await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: msgText,
                    session: sessionId,
                    context,
                    isAttachment: true
                })
            });

            setMessages(prev => [...prev, { sender: 'user', text: `✅ Photo uploaded!` }]);

        } catch (error) {
            console.error('Upload error:', error);
            setMessages(prev => [...prev, { sender: 'bot', text: 'Failed to upload photo. Please try again.' }]);
        }
    };

    const handleCallbackOption = (option: string) => {
        const newMsgs = [...messages, { sender: 'user', text: option } as Message];

        if (callbackStep === 1) {
            setMessages([...newMsgs, { sender: 'bot', text: '2) Was anyone taken for injuries or does anyone plan on seeking medical treatment?' }]);
            setCallbackStep(2);
        } else if (callbackStep === 2) {
            setMessages([...newMsgs, { sender: 'bot', text: 'Thank you. An agent will contact you shortly based on these details.' }]);
            setCallbackStep(0); // End flow
            // Here you would send the data to backend
        }
    };

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');

        // If in callback flow and user types instead of clicks?
        // Let's assume standard chat resumes or we block input?
        // Let's just allow standard chat to takeover or handle basic answers.

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg, session: sessionId, context })
            });
            const data = await res.json();
            setMessages(prev => [...prev, { sender: 'bot', text: data.fulfillmentText }]);
            setContext(data.outputContext);
        } catch (e) {
            console.error(e);
            setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I encountered an error. Please try again later.' }]);
        }
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={toggleChat}
                className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition z-50 font-bold"
            >
                {isOpen ? 'Close' : 'Check My Offer'}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed inset-0 md:inset-auto md:bottom-20 md:right-4 md:w-96 md:h-[500px] bg-white md:rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden">
                    <div className="bg-blue-600 text-white p-4 rounded-t-none md:rounded-t-lg font-bold flex justify-between items-center">
                        <span>Ask Angel - Total Loss Help</span>
                        <button onClick={toggleChat} className="text-sm opacity-75 hover:opacity-100">✕</button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-lg text-sm ${m.sender === 'user'
                                        ? 'bg-blue-600 text-white rounded-br-none'
                                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                                        }`}
                                >
                                    {m.text}
                                </div>
                            </div>
                        ))}

                        {/* Callback Options */}
                        {isOpen && chatMode === 'callback' && callbackStep > 0 && (
                            <div className="flex gap-2 justify-end mt-2">
                                <button onClick={() => handleCallbackOption('Yes')} className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full hover:bg-blue-200 font-medium">Yes</button>
                                <button onClick={() => handleCallbackOption('No')} className="bg-gray-100 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-200 font-medium">No</button>
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </div>

                    <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-lg flex gap-2 items-center">
                        <label className="cursor-pointer text-gray-500 hover:text-blue-600 p-2">
                            📷
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
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Type..."
                            className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-black"
                        />
                        <button
                            onClick={sendMessage}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
