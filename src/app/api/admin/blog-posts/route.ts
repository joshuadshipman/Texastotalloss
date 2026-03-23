
import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET() {
    // 1. Fetch Posts
    try {
        const snapshot = await adminDb.collection('posts')
            .orderBy('created_at', 'desc')
            .get();

        const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return NextResponse.json({ posts });
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
            try {
                await adminDb.collection('posts').doc(id).delete();
                return NextResponse.json({ success: true });
            } catch (err: any) {
                return NextResponse.json({ success: false, error: err.message });
            }
        }

        if (action === 'update' && id) {
            try {
                await adminDb.collection('posts').doc(id).update(updates);
                return NextResponse.json({ success: true });
            } catch (err: any) {
                return NextResponse.json({ success: false, error: err.message });
            }
        }

        // Generate drafted is handled by generate-blog route mostly, but general updates go here
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (e) {
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
}
