/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import dialogflow from '@google-cloud/dialogflow';
import { adminDb } from '@/lib/firebaseAdmin';
import { sendLeadEmailPacket } from '@/lib/email';
import path from 'path';
import fs from 'fs';
import { applyComplianceFilter } from '@/lib/compliance';

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

// Removed custom Google APIs Firestore helper in favor of `firebaseAdmin`

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

        let fulfillmentText = applyComplianceFilter(result.fulfillmentText || '...');
        const intentName = result.intent?.displayName;
        const parameters = result.parameters?.fields;

        // --- Persistence: Firestore ---
        const timestamp = new Date().toISOString();
        const transcriptBaseId = `${session}-${Date.now()}`;
        
        await adminDb.collection('transcripts').doc(transcriptBaseId).set({
            session_id: session,
            sender: 'user',
            message,
            intent: intentName || null,
            timestamp
        });

        await adminDb.collection('transcripts').doc(`${transcriptBaseId}-reply`).set({
            session_id: session,
            sender: 'bot',
            message: fulfillmentText,
            intent: intentName || null,
            raw_payload: JSON.stringify(result),
            timestamp
        });

        // --- Special Logic: Attachments ---
        if (isAttachment) {
            const photoUrl = message.replace('Uploaded photo: ', '');
            const leadRef = adminDb.collection('total_loss_leads').doc(session);
            const leadDoc = await leadRef.get();
            const currentPhotos = leadDoc.exists ? (leadDoc.data()?.photos || []) : [];
            await leadRef.set({ photos: [...currentPhotos, photoUrl] }, { merge: true });
            await adminDb.collection('attachments').doc(transcriptBaseId).set({ session_id: session, photo_url: photoUrl, timestamp });
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

            try {
                await adminDb.collection('total_loss_leads').doc(session).set(leadData, { merge: true });
                sendLeadEmailPacket(leadData as any).catch(console.error);
            } catch (err) {
                console.error('Failed to log lead:', err);
            }
        }

        return NextResponse.json({ fulfillmentText, outputContext: null });

    } catch (error: any) {
        console.error('Chat API Error:', error);
        return NextResponse.json({ fulfillmentText: `Error: ${error.message}` }, { status: 200 });
    }
}
