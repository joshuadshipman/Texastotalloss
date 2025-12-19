
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { session_id, sender, content } = body;

        if (!session_id || !sender || !content) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        const { data, error } = await supabaseAdmin
            .from('chat_messages')
            .insert({
                session_id,
                sender,
                content
            })
            .select()
            .single();

        if (error) {
            console.error('Chat Insert Error:', error);
            throw error;
        }

        return NextResponse.json({ success: true, data });

    } catch (error: any) {
        console.error('API Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
