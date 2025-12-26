
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data, error } = await supabaseAdmin
            .from('chat_sessions')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching chat sessions:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ sessions: data });
    } catch (e) {
        console.error('Unexpected error:', e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
