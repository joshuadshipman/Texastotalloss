
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
        return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

    try {
        const { data, error } = await supabaseAdmin
            .from('chat_messages')
            .select('*')
            .eq('session_id', sessionId)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('Error fetching chat messages:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const { data: sessionData } = await supabaseAdmin
            .from('chat_sessions')
            .select('*')
            .eq('session_id', sessionId)
            .single();

        return NextResponse.json({ messages: data, details: sessionData?.user_data || {} });
    } catch (e) {
        console.error('Unexpected error:', e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
