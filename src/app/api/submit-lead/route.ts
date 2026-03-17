
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendLeadEmailPacket } from '@/lib/email';
import { calculateLeadScore, LeadScoringInput } from '@/lib/scoring';
import { decodeVin, getMockValuation } from '@/lib/valuation';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Basic validation
        if (!body.session || !body.full_name || !body.phone) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // --- ENRICHMENT ---
        let vehicleValue = body.vehicle_value;
        const toolsUsed: string[] = body.tools_used || [];

        // 1. VIN Decoding & Valuation
        if (body.vin && !vehicleValue) {
            const specs = await decodeVin(body.vin);
            if (!specs.error) {
                const valuation = await getMockValuation(specs);
                vehicleValue = valuation.estimatedValue;
            }
        }

        // 2. Days Since Loss
        let daysSinceLoss: number | undefined;
        if (body.accident_date) {
            const accidentDate = new Date(body.accident_date);
            const today = new Date();
            const diffTime = Math.abs(today.getTime() - accidentDate.getTime());
            daysSinceLoss = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        // 3. Scoring
        const scoringInput: LeadScoringInput = {
            vehicleValue,
            disputeGap: body.dispute_gap,
            insuranceCompany: body.insurance_company,
            toolsUsed,
            chatMessageCount: body.chat_messages_count,
            formCompleteness: body.vin && body.accident_date ? 'full' : 'partial',
            lastActivityAt: new Date(),
            daysSinceLoss,
            insuranceOfferStatus: body.offer_status,
            source: body.source_type || 'organic',
            city: body.city,
            language: body.language || 'en',
            deviceType: req.headers.get('user-agent')?.toLowerCase().includes('mobile') ? 'mobile' : 'desktop'
        };

        const scoreResult = calculateLeadScore(scoringInput);

        // --- 1. Insert into Supabase ---
        const { data, error } = await supabaseAdmin
            .from('total_loss_leads')
            .upsert({
                dialogflow_session_id: body.session,
                status: 'new',
                source: body.source || 'empathy-bot',
                full_name: body.full_name,
                phone: body.phone,
                can_text: body.contact_pref === 'text',
                preferred_contact_time: body.best_time,
                description: body.description || body.incident_details,
                role: body.role || body.fault_info,
                has_injury: body.has_injury,

                // New Structured Fields
                language: body.language || 'en',
                score: scoreResult.totalScore, // Use calculated score
                pain_level: body.pain_level || 0,
                accident_date: body.accident_date,
                city: body.city,
                injury_summary: body.injury_summary,
                liability_summary: body.liability_summary,
                files_count: body.files_count || 0,

                // Meta info for scoring later
                user_data: {
                    scoring_breakdown: scoreResult.breakdown,
                    tier: scoreResult.tier,
                    vehicle_value: vehicleValue,
                    vin: body.vin
                }
            }, { onConflict: 'dialogflow_session_id' })
            .select()
            .single();

        if (error) {
            console.error('Supabase Error:', error);
            throw new Error(error.message);
        }

        // 2. Send Email
        await sendLeadEmailPacket(data);

        return NextResponse.json({
            success: true,
            id: data.id,
            score: scoreResult.totalScore,
            tier: scoreResult.tier
        });

    } catch (error: any) {
        console.error('Submit Lead Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
