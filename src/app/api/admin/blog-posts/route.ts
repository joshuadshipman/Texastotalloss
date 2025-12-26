
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET() {
    // 1. Fetch Posts
    try {
        const { data, error } = await supabaseAdmin
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) return NextResponse.json({ error: error.message }, { status: 500 });
        return NextResponse.json({ posts: data });
    } catch (e) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    // 2. Create/Update Post, Tweet, or Status
    try {
        const body = await request.json();
        const { action, id, ...updates } = body;

        if (action === 'delete' && id) {
            const { error } = await supabaseAdmin.from('posts').delete().eq('id', id);
            return NextResponse.json({ success: !error, error: error?.message });
        }

        if (action === 'update' && id) {
            const { error } = await supabaseAdmin.from('posts').update(updates).eq('id', id);
            return NextResponse.json({ success: !error, error: error?.message });
        }

        // Generate drafted is handled by generate-blog route mostly, but general updates go here
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (e) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
