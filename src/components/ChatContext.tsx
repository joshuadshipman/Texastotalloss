'use client';

import React, { createContext, useContext, useState } from 'react';

type ChatContextType = {
    isOpen: boolean;
    chatMode: string | null;
    openChat: (mode?: string) => void;
    closeChat: () => void;
    toggleChat: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [chatMode, setChatMode] = useState<string | null>(null);

    const openChat = (mode?: string) => {
        if (mode) setChatMode(mode);
        else setChatMode(null); // Reset if opened without mode
        setIsOpen(true);
    };
    const closeChat = () => setIsOpen(false);
    const toggleChat = () => setIsOpen((prev) => !prev);

    return (
        <ChatContext.Provider value={{ isOpen, chatMode, openChat, closeChat, toggleChat }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
}
