
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(request: Request) {
    try {
        const { sessionId, content } = await request.json();
        if (!sessionId || !content) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

        // 1. Insert Message
        const { error: msgError } = await supabaseAdmin.from('chat_messages').insert({
            session_id: sessionId,
            sender: 'agent',
            content: content
        });

        if (msgError) throw msgError;

        // 2. Update status
        await supabaseAdmin.from('chat_sessions').update({ status: 'live' }).eq('session_id', sessionId);

        return NextResponse.json({ success: true });
    } catch (e: any) {
        console.error('Send Error', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
