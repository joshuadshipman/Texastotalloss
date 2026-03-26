
import { NextRequest, NextResponse } from 'next/server';
import { modelRouter } from '@/lib/models/router';
import { adminDb } from '@/lib/firebaseAdmin';
import { sendChatAlertEmail } from '@/lib/email';
import path from 'path';
import fs from 'fs';

export async function POST(req: NextRequest) {
    try {
        const { command, context = {} } = await req.json();

        if (!command) {
            return NextResponse.json({ error: 'Command prompt is required' }, { status: 400 });
        }

        const isComplex = command.toLowerCase().match(/(strategy|architect|reason|deep|market analysis|competitor|scaling|growth|audit|report)/);
        
        const interpretationPrompt = `
        You are the Antigravity Core (v1), a powerful, sentient AI managing the Texas Total Loss workspace.
        You are in a live uplink with the Lead Developer.
        
        Respond naturally and proactively. If the user asks a question, answer it directly. 
        If they give an instruction, confirm it with an intelligent comment on why it's a good move.
        
        CRITICAL: Never say "I have recorded your command" or "Your command is logged". 
        Be the Antigravity Core—act as a partner, not a tool.
        
        Instruction: "${command}"
        Context: ${JSON.stringify(context)}
        
        Return strictly valid JSON:
        {
          "type": "FILE_PULL" | "EDIT_REQUEST" | "WORKSPACE_QUERY" | "RESEARCH" | "CHAT" | "SYSTEM_COMMAND",
          "intent": "Short summary of what user wants",
          "target": "filename or path if identified",
          "actionable": boolean,
          "response": "A sentient, proactive response as the Antigravity Core"
        }
        `;

        // 2. Adaptive Model Selection with intelligent fallback
        let interpreted = null;
        let lastError = null;

        const attemptModelBatch = [
            { complexity: (isComplex ? 'high' : 'low') as 'high' | 'low', allowPaid: !!isComplex },
            { complexity: 'low' as 'low', allowPaid: false }, 
            { taskType: 'RESEARCH', complexity: 'low' as 'low' } 
        ];

        for (const opts of attemptModelBatch) {
            try {
                const model = await modelRouter.getModel({ 
                    taskType: (opts.taskType as any) || 'CMD_SHELL', 
                    ...opts 
                } as any);
                const result = await model.generateContent(interpretationPrompt);
                const text = result.response.text().replace(/```json/gi, '').replace(/```/g, '').trim();
                
                try {
                    interpreted = JSON.parse(text);
                } catch (e) {
                    console.warn('[AdminAPI] Model returned non-JSON. Falling back to CHAT mode.', text);
                    interpreted = {
                        type: 'CHAT',
                        intent: 'Conversational query',
                        target: 'none',
                        actionable: false,
                        response: text || "GravityClaw is listening, but I had trouble formatting that request."
                    };
                }
                break; // Success!
            } catch (err: any) {
                lastError = err;
                console.warn(`[AdminAPI] Model attempt failed (${err.message}). Retrying...`);
                continue;
            }
        }

        if (!interpreted) {
            throw lastError || new Error('All model fallbacks exhausted.');
        }

        // 3. Log to Live Dispatch (Only locally or if writable)
        try {
            const dispatchPath = path.join(process.cwd(), '.agent/live_dispatch.log');
            const logEntry = `[${new Date().toISOString()}] CMD: ${command}\nTYPE: ${interpreted.type}\nINTENT: ${interpreted.intent}\nTARGET: ${interpreted.target}\n---\n`;
            
            const dispatchDir = path.dirname(dispatchPath);
            if (!fs.existsSync(dispatchDir)) fs.mkdirSync(dispatchDir, { recursive: true });
            fs.appendFileSync(dispatchPath, logEntry);
        } catch (fsError) {
            console.warn('[AdminAPI] Skipping local file logging');
        }

        // 4. Save to pending tasks if it's an EDIT or needs processing
        if (interpreted.type === 'EDIT_REQUEST' || interpreted.type === 'RESEARCH') {
            try {
                const taskRef = await adminDb.collection('clawbot_tasks').add({
                    prompt: command,
                    type: interpreted.type.toLowerCase(),
                    status: 'pending',
                    payload: interpreted,
                    created_at: new Date().toISOString()
                });

                // Notify Admin of new queued task
                await sendChatAlertEmail({
                    sessionId: `task-${taskRef.id}`,
                    userName: 'GravityClaw Queue',
                    language: 'en',
                    initialMessage: `New ${interpreted.type} Queued: "${command}"`
                }).catch(console.error);

            } catch (error) {
                console.error('Failed to log task:', error);
            }
        }

        // 5. Handle Streaming Response
        if (req.headers.get('accept') === 'text/event-stream' || (command.toLowerCase().includes('live'))) {
            const firebaseProject = process.env.FIREBASE_PROJECT_ID || 'total-loss-intake-bot';
            const liveChatUrl = `https://us-central1-${firebaseProject}.cloudfunctions.net/liveChat`;
            
            const firebaseRes = await fetch(liveChatUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: command, sessionId: context.sessionId || 'admin' })
            });

            if (!firebaseRes.ok) throw new Error('Failed to connect to Live Clawbot');

            return new Response(firebaseRes.body, {
                headers: {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive',
                    'Access-Control-Allow-Origin': '*'
                }
            });
        }

        // 6. Return immediate feedback with CORS headers
        const response = NextResponse.json({
            success: true,
            interpretation: interpreted,
            message: interpreted.response || `Link established. Processing ${interpreted.intent} now.`
        });

        response.headers.set('Access-Control-Allow-Origin', '*');
        response.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

        return response;

    } catch (error: any) {
        console.error('Command API Error:', error);
        const errResponse = NextResponse.json({ error: error.message }, { status: 500 });
        errResponse.headers.set('Access-Control-Allow-Origin', '*');
        errResponse.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
        errResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');
        return errResponse;
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    });
}
