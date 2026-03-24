
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
        You are the Antigravity Core (v1), the unified intelligence managing this workspace.
        You are currently in a live session with the Lead Developer.
        
        Convert the following user instruction or query into a structured workspace action.
        Note: If you are returning a simple chat response, make it professional, proactive, and directly addressing the workspace context.
        
        Instruction: "${command}"
        Current Context: ${JSON.stringify(context)}
        
        Available Command Types:
        - "FILE_PULL": Requesting to see a file's content.
        - "EDIT_REQUEST": Requesting a code change.
        - "WORKSPACE_QUERY": Asking about the project structure.
        - "RESEARCH": Requesting external info or competitive analysis.
        - "CHAT": A conversational query, question, or comment that requires a direct response from the Core.
        - "SYSTEM_COMMAND": Meta-commands about the agent or environment.

        Return strictly valid JSON:
        {
          "type": "FILE_PULL" | "EDIT_REQUEST" | "WORKSPACE_QUERY" | "RESEARCH" | "CHAT" | "SYSTEM_COMMAND",
          "intent": "Short summary of what user wants",
          "target": "filename or path if identified",
          "actionable": boolean,
          "response": "A direct, professional, and proactive response from the Antigravity Core"
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

        // 5. Return immediate feedback with CORS headers
        const response = NextResponse.json({
            success: true,
            interpretation: interpreted,
            message: interpreted.response || `GravityClaw has queued a ${interpreted.type} for: ${interpreted.intent}.`
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
