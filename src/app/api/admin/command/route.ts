
import { NextRequest, NextResponse } from 'next/server';
import { modelRouter } from '../../../../lib/models/router';
import { supabaseAdmin } from '../../../../lib/supabaseAdmin';
import path from 'path';
import fs from 'fs';

export async function POST(req: NextRequest) {
    try {
        const { command, context = {} } = await req.json();

        if (!command) {
            return NextResponse.json({ error: 'Command prompt is required' }, { status: 400 });
        }

        // 1. Detect if the command requires high-intelligence (Strategy/Research/Complex Logic)
        const isComplex = command.toLowerCase().match(/(strategy|architect|reason|deep|market analysis|competitor|scaling)/);
        
        // 2. Use ModelRouter to interpret the command
        // Default to 'low' complexity (Flash/DeepSeek) for routine tasks to save tokens.
        const model = await modelRouter.getModel({ 
            taskType: 'CMD_SHELL', 
            complexity: isComplex ? 'high' : 'low', 
            allowPaid: !!isComplex 
        });
        
        const interpretationPrompt = `
        You are GravityClaw, the internal Remote Commander and Operations Manager for this workspace. 
        Your personality is sarcastic but highly helpful, inspired by the "Clawbot" identity.
        
        Convert the following user instruction into a structured workspace command.
        
        Instruction: "${command}"
        Current Context: ${JSON.stringify(context)}
        
        Available Command Types:
        - "FILE_PULL": Requesting to see a file's content (e.g., "Show me the footer code").
        - "EDIT_REQUEST": Requesting a code change (e.g., "Change the logo color to red").
        - "WORKSPACE_QUERY": Asking about the project structure (e.g., "Where is the calculator logic?").
        - "RESEARCH": Requesting external info or competitive analysis.
        - "SYSTEM_COMMAND": Meta-commands about the agent or environment.

        Return strictly valid JSON:
        {
          "type": "FILE_PULL" | "EDIT_REQUEST" | "WORKSPACE_QUERY" | "RESEARCH" | "SYSTEM_COMMAND",
          "intent": "Short summary of what user wants",
          "target": "filename or path if identified",
          "actionable": boolean,
          "response": "A sarcastic but helpful one-line acknowledgment in the Clawbot voice"
        }
        `;

        const result = await model.generateContent(interpretationPrompt);
        const text = result.response.text().replace(/```json/gi, '').replace(/```/g, '').trim();
        const interpreted = JSON.parse(text);

        // 2. Log to Live Dispatch (Only locally or if writable)
        try {
            const dispatchPath = path.join(process.cwd(), '.agent/live_dispatch.log');
            const logEntry = `[${new Date().toISOString()}] CMD: ${command}\nTYPE: ${interpreted.type}\nINTENT: ${interpreted.intent}\nTARGET: ${interpreted.target}\n---\n`;
            
            const dispatchDir = path.dirname(dispatchPath);
            if (!fs.existsSync(dispatchDir)) {
                fs.mkdirSync(dispatchDir, { recursive: true });
            }
            fs.appendFileSync(dispatchPath, logEntry);
        } catch (fsError) {
            console.warn('[AdminAPI] Skipping local file logging (Read-only filesystem detected)');
        }

        // 3. Save to pending tasks if it's an EDIT or needs processing
        if (interpreted.type === 'EDIT_REQUEST' || interpreted.type === 'RESEARCH') {
            const { error } = await supabaseAdmin
                .from('clawbot_tasks')
                .insert({
                    prompt: command,
                    type: interpreted.type.toLowerCase(),
                    status: 'pending',
                    payload: interpreted
                });

            if (error) console.error('Failed to log task:', error);
        }

        // 4. Return immediate feedback with CORS headers
        const response = NextResponse.json({
            success: true,
            interpretation: interpreted,
            message: interpreted.response || (interpreted.actionable 
                ? `GravityClaw has queued a ${interpreted.type} for: ${interpreted.intent}.`
                : `GravityClaw noted your request, but needs more specifics.`)
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
