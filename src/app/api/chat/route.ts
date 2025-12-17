import { NextRequest, NextResponse } from 'next/server';
import dialogflow from '@google-cloud/dialogflow';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { sendLeadEmailPacket } from '@/lib/email';
import path from 'path';
import fs from 'fs';

// Service Account Key Path
const CREDENTIALS_PATH = path.join(process.cwd(), 'service-account.json');
const PROJECT_ID = 'total-loss-intake-bot';

let credentials: any;
try {
    // Try Environment Variable first (Vercel)
    if (process.env.GOOGLE_SERVICE_ACCOUNT_JSON) {
        credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON);
    }
    // Fallback to local file
    else if (fs.existsSync(CREDENTIALS_PATH)) {
        const keyFileContent = fs.readFileSync(CREDENTIALS_PATH, 'utf-8');
        credentials = JSON.parse(keyFileContent);
    } else {
        console.error(`Credential file not found at: ${CREDENTIALS_PATH} and GOOGLE_SERVICE_ACCOUNT_JSON not set.`);
    }
} catch (e) {
    console.error('Failed to read service-account credentials', e);
}

// Instantiate a Dialogflow Client
const sessionClient = new dialogflow.SessionsClient({
    projectId: PROJECT_ID,
    credentials: {
        client_email: credentials?.client_email,
        private_key: credentials?.private_key,
    },
});

export async function POST(req: NextRequest) {
    try {
        if (!credentials) {
            throw new Error('Server missing credentials (GOOGLE_SERVICE_ACCOUNT_JSON or service-account.json)');
        }

        const body = await req.json();
        const { message, session } = body;

        if (!message || !session) {
            return NextResponse.json({ error: 'Message and session are required' }, { status: 400 });
        }

        const sessionPath = sessionClient.projectAgentSessionPath(PROJECT_ID, session);

        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: message,
                    languageCode: 'en-US',
                },
            },
        };

        console.log(`Sending to Dialogflow: ${message} (Session: ${session})`);
        const responses = await sessionClient.detectIntent(request);
        const result = responses[0].queryResult;

        if (!result) {
            throw new Error('No result from Dialogflow');
        }

        let fulfillmentText = result.fulfillmentText || 'I didn\'t catch that.';
        const intentName = result.intent?.displayName;
        const parameters = result.parameters?.fields;

        console.log(`Dialogflow Response: Intent=${intentName}, Text=${fulfillmentText}`);

        await supabaseAdmin.from('chat_transcripts').insert({
            dialogflow_session_id: session,
            sender: 'user',
            message: message,
            step: intentName
        });

        await supabaseAdmin.from('chat_transcripts').insert({
            dialogflow_session_id: session,
            sender: 'bot',
            message: fulfillmentText,
            step: intentName,
            raw_payload: result
        });

        const outputContexts = result.outputContexts || [];
        const isEndConversation = outputContexts.some(ctx =>
            ctx.name && ctx.name.endsWith('/contexts/end_conversation')
        );

        if (intentName === 'Receive VIN') {
            const vin = (parameters?.['vin']?.stringValue || '').trim();
            console.log(`Processing VIN: ${vin}`);

            // Decode VIN logic here (using your new library)
            // For now, we will just acknowledge it. 
            // In a real app, await decodeVin(vin) here.
            fulfillmentText += ` I've looked up VIN ${vin}. It appears to be a [Year Make Model].`;
        }

        // Check if this message is a photo upload (from frontend hidden message)
        if (body.isAttachment) {
            console.log('Received attachment:', message);
            await supabaseAdmin.from('total_loss_leads').update({
                photos: supabaseAdmin.rpc('array_append', {
                    arr: 'photos',
                    elem: message.replace('Uploaded photo: ', '')
                })
            }).match({ dialogflow_session_id: session });
        }

        // Final save logic
        if (isEndConversation || intentName === 'Collect Phone') {
            // ... existing save logic ...
            console.log('Conversation ended, saving lead...');

            let collectedData: any = {};
            const getParam = (key: string) => {
                const field = parameters?.[key];
                if (field?.stringValue) return field.stringValue;
                return null;
            };

            for (const ctx of outputContexts) {
                if (ctx.parameters && ctx.parameters.fields) {
                    for (const [key, val] of Object.entries(ctx.parameters.fields)) {
                        if (val.stringValue) {
                            collectedData[key] = val.stringValue;
                        }
                    }
                }
            }

            const leadData = {
                dialogflow_session_id: session,
                status: 'new',
                source: 'chatbot',
                full_name: collectedData['given-name'] || getParam('given-name'),
                vehicle_year: collectedData['vehicle'] || getParam('vehicle'),
                crash_date: collectedData['date'] || getParam('date'),
                description: collectedData['description'] || getParam('description'),
                has_injury: collectedData['injury_status']?.toLowerCase().includes('yes'),
                phone: collectedData['phone-number'] || getParam('phone-number'),
            };

            const { data, error } = await supabaseAdmin
                .from('total_loss_leads')
                .insert(leadData)
                .select()
                .single();

            if (!error && data) {
                console.log('Lead saved:', data.id);
                sendLeadEmailPacket(data).catch(err => {
                    console.error('Failed to send email automation:', err);
                });
            } else {
                console.error('Error saving lead:', error);
            }
        }

        return NextResponse.json({
            fulfillmentText: fulfillmentText,
            outputContext: null
        });

    } catch (error: any) {
        console.error('Dialogflow API Error:', error);
        return NextResponse.json({
            fulfillmentText: 'Sorry, I am having trouble connecting to the agent right now.',
            debugError: error.message
        }, { status: 500 });
    }
}
