import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const bucketName = 'vehicle-photos';

        // 1. Create Bucket if not exists
        const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
        if (listError) return NextResponse.json({ error: listError }, { status: 500 });

        const exists = buckets.find(b => b.name === bucketName);

        if (!exists) {
            const { error: createError } = await supabaseAdmin.storage.createBucket(bucketName, {
                public: true,
                fileSizeLimit: 5242880, // 5MB
                allowedMimeTypes: ['image/*', 'application/pdf']
            });
            if (createError) return NextResponse.json({ error: createError }, { status: 500 });
        } else {
            // Ensure public
            await supabaseAdmin.storage.updateBucket(bucketName, { public: true });
        }

        return NextResponse.json({ message: 'Bucket setup complete', bucket: bucketName });

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
