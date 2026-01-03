
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendLeadEmailPacket } from '@/lib/email';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Basic validation
        if (!body.session || !body.full_name || !body.phone) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Insert into Supabase
        const { data, error } = await supabaseAdmin
            .from('total_loss_leads')
            .upsert({
                dialogflow_session_id: body.session,
                status: 'new',
                source: 'empathy-bot',
                full_name: body.full_name,
                phone: body.phone,
                can_text: body.contact_pref === 'text',
                preferred_contact_time: body.best_time,
                description: body.description || body.incident_details,
                role: body.role || body.fault_info, // Handle both
                has_injury: body.has_injury,

                // New Structured Fields
                language: body.language || 'en',
                score: body.score || 0,
                pain_level: body.pain_level || 0,
                accident_date: body.accident_date,
                city: body.city,
                injury_summary: body.injury_summary,
                liability_summary: body.liability_summary,
                files_count: body.files_count || 0
            }, { onConflict: 'dialogflow_session_id' })
            .select()
            .single();

        if (error) {
            console.error('Supabase Error:', error);
            throw new Error(error.message);
        }

        // 2. Send Email
        await sendLeadEmailPacket(data);

        return NextResponse.json({ success: true, id: data.id });

    } catch (error: any) {
        console.error('Submit Lead Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
