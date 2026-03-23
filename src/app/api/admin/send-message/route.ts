
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function POST(request: Request) {
    try {
        const { sessionId, content } = await request.json();
        if (!sessionId || !content) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

        // 1. Insert Message
        await adminDb.collection('chat_messages').add({
            session_id: sessionId,
            sender: 'agent',
            content: content,
            created_at: new Date().toISOString()
        });

        // 2. Update status
        await adminDb.collection('chat_sessions').doc(sessionId).set({ status: 'live' }, { merge: true });

        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error('Send Error', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
