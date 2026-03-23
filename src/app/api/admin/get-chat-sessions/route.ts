
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const snapshot = await adminDb.collection('chat_sessions')
            .orderBy('created_at', 'desc')
            .get();

        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return NextResponse.json({ sessions: data });
    } catch (e) {
        console.error('Unexpected error:', e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
