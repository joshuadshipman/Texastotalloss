import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
// import { sendLeadEmailPacket } from '@/lib/email'; // Uncomment when email is configured

type DFRequest = {
    session: string;
    queryResult: {
        queryText: string;
        parameters: Record<string, any>;
        intent: { displayName: string };
    };
};

function detectStepFromIntent(intentName: string): string {
    if (intentName.includes('Vehicle')) return 'vehicle';
    if (intentName.includes('Offer')) return 'offer';
    if (intentName.includes('Injury')) return 'injury';
    if (intentName.includes('Contact')) return 'contact';
    return 'general';
}

export async function POST(req: NextRequest) {
    try {
        const body = (await req.json()) as DFRequest;
        const sessionId = body.session;
        const { queryResult } = body;
        const { intent, parameters } = queryResult;
        const intentName = intent.displayName;

        console.log(`Received intent: ${intentName} for session: ${sessionId}`);

        // Log bot message
        await supabaseAdmin.from('chat_transcripts').insert({
            dialogflow_session_id: sessionId,
            sender: 'bot',
            message: `Intent: ${intentName}`,
            raw_payload: body,
            step: detectStepFromIntent(intentName)
        });

        let fulfillmentText = 'Thanks, your information has been received.';

        if (intentName === 'Contact Info and Crash Details' || intentName.includes('Contact')) {
            const leadType = parameters.has_injury ? 'total_loss_plus_injury' : 'total_loss_only';

            const { data, error } = await supabaseAdmin
                .from('total_loss_leads')
                .insert({
                    dialogflow_session_id: sessionId,
                    source: 'chatbot',
                    status: 'new',
                    lead_type: leadType,

                    full_name: parameters.full_name || null,
                    email: parameters.email || null,
                    phone: parameters.phone || null,
                    can_text: parameters.can_text ?? null,
                    preferred_contact_time: parameters.preferred_contact_time || null,

                    crash_date: parameters.crash_date || null,
                    state: parameters.state || null,
                    role: parameters.role || null,
                    other_driver_insured: parameters.other_driver_insured || null,
                    police_report: parameters.police_report ?? null,

                    vehicle_year: parameters.vehicle_year || null,
                    vehicle_make: parameters.vehicle_make || null,
                    vehicle_model: parameters.vehicle_model || null,
                    vehicle_trim: parameters.vehicle_trim || null,
                    vehicle_mileage: parameters.vehicle_mileage || null,
                    vehicle_zip: parameters.vehicle_zip || null,
                    vehicle_condition: parameters.vehicle_condition || null,

                    insurer_name: parameters.insurer_name || null,
                    total_loss_offer_amount: parameters.total_loss_offer_amount || null,
                    total_loss_declared: parameters.total_loss_declared ?? null,
                    total_loss_date: parameters.total_loss_date || null,
                    has_rental: parameters.has_rental ?? null,
                    storage_fees_accruing: parameters.storage_fees_accruing ?? null,

                    has_injury: parameters.has_injury ?? null,
                    treatment_started: parameters.treatment_started ?? null,
                    treatment_types: parameters.treatment_types || null,
                    injury_areas: parameters.injury_areas || null,
                    lost_wages: parameters.lost_wages ?? null,
                    missed_work_days: parameters.missed_work_days || null,
                    er_visit: parameters.er_visit ?? null,
                    imaging_done: parameters.imaging_done ?? null,
                    surgery_recommended: parameters.surgery_recommended ?? null,
                    attorney_already: parameters.attorney_already ?? null
                })
                .select()
                .single();

            if (error) {
                console.error('Error inserting lead', error);
                fulfillmentText =
                    'Thanks, your information was received. If you do not hear from us shortly, please call or text the number on this page.';
            } else {
                fulfillmentText = `Thanks${parameters.full_name ? ', ' + parameters.full_name : ''}. A specialist will review your total loss offer${parameters.has_injury ? ' and injuries' : ''} and contact you shortly. Your reference ID is ${data.id}.`;

                // Asynchronously send email
                // sendLeadEmailPacket(data).catch(console.error);
                console.log('Lead created:', data.id);
            }
        }

        return NextResponse.json({ fulfillmentText });
    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ fulfillmentText: 'An internal error occurred.' }, { status: 500 });
    }
}
