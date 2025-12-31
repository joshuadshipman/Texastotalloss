import { NextRequest, NextResponse } from 'next/server';
import { sendChatAlertEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { sessionId, userName, language, initialMessage } = body;

        // Basic validation
        if (!sessionId) {
            return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });
        }

        // Send Email Alert
        await sendChatAlertEmail({
            sessionId,
            userName: userName || 'Anonymous',
            language: language || 'en',
            initialMessage: initialMessage || 'User started a chat session.'
        });

        return NextResponse.json({ success: true, message: 'Alert sent' });

    } catch (error) {
        console.error('Error sending chat alert:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
