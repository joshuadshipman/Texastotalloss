/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Vercel Cron Authentication
// Ensure you set CRON_SECRET in Vercel Environment Variables
export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        // 1. Topic Selection (Simple Rotation or Random)
        const topics = [
            {
                title: 'Diminished Value in Texas: What You Need to Know',
                tag: 'Diminished Value',
                slug: 'diminished-value-texas-guide',
                content: `Did you know Texas is a diminished value state? If you've been in an accident that wasn't your fault, your car has likely lost value even after repairs...`
            },
            {
                title: 'Total Loss Thresholds: The 100% Rule',
                tag: 'Total Loss',
                slug: 'texas-total-loss-threshold-explained',
                content: `Unlike some states with a 75% threshold, Texas requires repair costs to equal or exceed the ACV (Actual Cash Value) to be a statutory total loss...`
            },
            {
                title: 'Safe Driving in Houston: 2026 Update',
                tag: 'Safety',
                slug: 'safe-driving-houston-2026',
                content: `Traffic accidents in Houston are on the rise. Here are the top intersections to avoid this year...`
            }
        ];

        // Randomly pick one for MVP automation demo 
        // (In production, use OpenAI to generate fresh content based on current date items)
        const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
        const selectedTopic = topics[dayOfYear % topics.length];
        const uniqueSlug = `${selectedTopic.slug}-${new Date().toISOString().split('T')[0]}`;

        // 2. Insert into Supabase
        const { data, error } = await supabaseAdmin
            .from('posts')
            .insert({
                title: selectedTopic.title,
                slug: uniqueSlug,
                content: selectedTopic.content + `\n\n*Published automatically on ${new Date().toLocaleDateString()}*`,
                excerpt: selectedTopic.content.substring(0, 150) + '...',
                tags: [selectedTopic.tag, 'Texas Law'],
                status: 'published',
                published_at: new Date().toISOString(),
                author: 'AI Legal Assistant'
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, post: data });
    } catch (error: any) {
        console.error('Blog Automation Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
