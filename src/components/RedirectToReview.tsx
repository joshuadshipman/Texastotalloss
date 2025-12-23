'use client';
import { useEffect } from 'react';
import { useChat } from './ChatContext';

export default function RedirectToReview() {
    const { openReview } = useChat();
    useEffect(() => {
        openReview();
    }, [openReview]);
    return null;
}
