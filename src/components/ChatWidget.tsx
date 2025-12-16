'use client';

import { useState, useRef, useEffect } from 'react';

type Message = {
    sender: 'user' | 'bot';
    text: string;
};

export default function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'bot', text: 'Totaled car? Injured? check your payout now.' }
    ]);
    const [input, setInput] = useState('');
    const [context, setContext] = useState('');
    const [sessionId] = useState(() => Math.random().toString(36).substring(7));
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
        setInput('');

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
            setMessages(prev => [...prev, { sender: 'bot', text: 'Sorry, I encountered an error.' }]);
        }
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition z-50 font-bold"
            >
                {isOpen ? 'Close' : 'Check My Offer'}
            </button>

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-20 right-4 w-80 md:w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden">
                    <div className="bg-blue-600 text-white p-4 rounded-t-lg font-bold">
                        Total Loss Check
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                        <div ref={bottomRef} />
                    </div>

                    <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-lg flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Type your answer..."
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
