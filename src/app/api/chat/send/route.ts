
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { session_id, sender, content } = body;

        if (!session_id || !sender || !content) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const msgData = {
            session_id,
            sender,
            content,
            created_at: new Date().toISOString()
        };
        const docRef = await adminDb.collection('chat_messages').add(msgData);
        const data = { id: docRef.id, ...msgData };

        return NextResponse.json({ success: true, data });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
