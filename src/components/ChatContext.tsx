'use client';

import React, { createContext, useContext, useState } from 'react';

type ChatContextType = {
    isOpen: boolean;
    chatMode: string | null;
    chatData: any | null;
    openChat: (mode?: string, data?: any) => void;
    closeChat: () => void;
    toggleChat: () => void;
    isReviewOpen: boolean;
    openReview: () => void;
    closeReview: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [chatMode, setChatMode] = useState<string | null>(null);
    const [chatData, setChatData] = useState<any | null>(null);

    const openChat = (mode?: string, data?: any) => {
        if (mode) setChatMode(mode);
        else setChatMode(null);

        if (data) setChatData(data);
        else setChatData(null);

        setIsOpen(true);
    };
    const closeChat = () => setIsOpen(false);
    const toggleChat = () => setIsOpen((prev) => !prev);

    const openReview = () => setIsReviewOpen(true);
    const closeReview = () => setIsReviewOpen(false);

    return (
        <ChatContext.Provider value={{ isOpen, chatMode, chatData, openChat, closeChat, toggleChat, isReviewOpen, openReview, closeReview }}>
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
