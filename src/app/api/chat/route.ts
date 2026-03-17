/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import dialogflow from '@google-cloud/dialogflow';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendLeadEmailPacket } from '@/lib/email';
import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';

// 1. Basic Configuration
const CREDENTIALS_PATH = path.join(process.cwd(), 'service-account.json');
const PROJECT_ID = 'total-loss-intake-bot';

// 2. Credentials Loading
let credentials: any;
try {
    if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    } else if (fs.existsSync(CREDENTIALS_PATH)) {
        credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf-8'));
    }
} catch (e) {
    console.error('Failed to load credentials:', e);
}

// 3. Client Initialization
const sessionClient = new dialogflow.SessionsClient({
    projectId: PROJECT_ID,
    credentials: {
        client_email: credentials?.client_email,
        private_key: credentials?.private_key,
    },
});

const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/datastore', 'https://www.googleapis.com/auth/cloud-platform'],
});
const firestore = google.firestore({ version: 'v1', auth });

// 4. Firestore Helper
async function saveToFirestore(collection: string, id: string, data: any) {
    if (!credentials) return;
    try {
        const parent = `projects/${PROJECT_ID}/databases/(default)/documents`;
        const fields = Object.entries(data).reduce((acc: any, [key, value]) => {
            acc[key] = { stringValue: String(value ?? '') };
            return acc;
        }, {});

        // Use patch (update/create)
        await firestore.projects.databases.documents.patch({
            name: `${parent}/${collection}/${id}`,
            requestBody: { fields }
        });
        console.log(`[Firestore] Sync: ${collection}/${id}`);
    } catch (e: any) {
        console.error('[Firestore] Sync Error:', e.message);
    }
}

// 5. Main Route Handler
export async function POST(req: NextRequest) {
    try {
        if (!credentials) {
            throw new Error('Server missing credentials');
        }

        const body = await req.json();
        const { message, session, isAttachment } = body;

        if (!message || !session) {
            return NextResponse.json({ error: 'Message and session required' }, { status: 400 });
        }

        const sessionPath = sessionClient.projectAgentSessionPath(PROJECT_ID, session);
        const request = {
            session: sessionPath,
            queryInput: { text: { text: message, languageCode: 'en-US' } },
        };

        const [response] = await sessionClient.detectIntent(request);
        const result = response.queryResult;
        if (!result) throw new Error('No result from Dialogflow');

        let fulfillmentText = result.fulfillmentText || '...';
        const intentName = result.intent?.displayName;
        const parameters = result.parameters?.fields;

        // --- Persistence: Supabase ---
        await supabaseAdmin.from('chat_transcripts').insert([
            { dialogflow_session_id: session, sender: 'user', message, step: intentName },
            { dialogflow_session_id: session, sender: 'bot', message: fulfillmentText, step: intentName, raw_payload: result }
        ]);

        // --- Persistence: Firestore (Mirroring for user) ---
        const timestamp = new Date().toISOString();
        const transcriptBaseId = `${session}-${Date.now()}`;
        
        saveToFirestore('transcripts', transcriptBaseId, {
            session_id: session,
            sender: 'user',
            message,
            intent: intentName,
            timestamp
        });

        saveToFirestore('transcripts', `${transcriptBaseId}-reply`, {
            session_id: session,
            sender: 'bot',
            message: fulfillmentText,
            intent: intentName,
            timestamp
        });

        // --- Special Logic: Attachments ---
        if (isAttachment) {
            const photoUrl = message.replace('Uploaded photo: ', '');
            const { data: current } = await supabaseAdmin.from('total_loss_leads').select('photos').eq('dialogflow_session_id', session).single();
            const photos = [...(current?.photos || []), photoUrl];
            await supabaseAdmin.from('total_loss_leads').update({ photos }).eq('dialogflow_session_id', session);
            saveToFirestore('attachments', transcriptBaseId, { session_id: session, photo_url: photoUrl, timestamp });
        }

        // --- Lead Logic ---
        const outputContexts = result.outputContexts || [];
        const isEnd = outputContexts.some(ctx => ctx.name?.endsWith('/contexts/end_conversation'));

        if (isEnd || intentName === 'Collect Phone') {
            const collected: any = {};
            for (const ctx of outputContexts) {
                if (ctx.parameters?.fields) {
                    for (const [key, val] of Object.entries(ctx.parameters.fields)) {
                        if ((val as any).stringValue) collected[key] = (val as any).stringValue;
                    }
                }
            }

            const leadData = {
                dialogflow_session_id: session,
                status: 'new',
                source: 'chatbot',
                full_name: collected['given-name'] || parameters?.['given-name']?.stringValue,
                vehicle_year: collected['vehicle'] || parameters?.['vehicle']?.stringValue,
                crash_date: collected['date'] || parameters?.['date']?.stringValue,
                description: collected['description'] || parameters?.['description']?.stringValue,
                has_injury: collected['injury_status']?.toLowerCase().includes('yes'),
                phone: collected['phone-number'] || parameters?.['phone-number']?.stringValue,
            };

            const { data: lead, error } = await supabaseAdmin
                .from('total_loss_leads')
                .upsert(leadData, { onConflict: 'dialogflow_session_id' })
                .select()
                .single();

            if (!error && lead) {
                sendLeadEmailPacket(lead).catch(console.error);
                saveToFirestore('leads', session, lead);
            }
        }

        return NextResponse.json({ fulfillmentText, outputContext: null });

    } catch (error: any) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ fulfillmentText: `Error: ${error.message}` }, { status: 200 });
    }
}
