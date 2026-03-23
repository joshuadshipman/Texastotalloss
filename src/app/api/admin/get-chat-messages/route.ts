
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
        return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 });
    }

        const msgsSnapshot = await adminDb.collection('chat_messages')
            .where('session_id', '==', sessionId)
            .orderBy('created_at', 'asc')
            .get();

        const messages = msgsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const sessionDoc = await adminDb.collection('chat_sessions').doc(sessionId).get();
        const sessionData = sessionDoc.exists ? sessionDoc.data() : null;

        return NextResponse.json({ messages, details: sessionData?.user_data || {} });
    } catch (e) {
        console.error('Unexpected error:', e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
