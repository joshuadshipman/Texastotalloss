import { NextResponse } from 'next/server';
import { runAutonomousImprovement } from '@/lib/research_loop';

export async function POST(req: Request) {
    try {
        const { topic, role } = await req.json();

        if (!topic) {
            return NextResponse.json({ error: "Topic is required" }, { status: 400 });
        }

        // Trigger the 85% confidence loop
        const result = await runAutonomousImprovement(topic, role || 'CMO');

        return NextResponse.json({
            success: true,
            assignedPersona: result.assignedPersona,
            finalReport: result.finalStrategy,
            critiqueHistory: result.critiqueHistory
        });
        
    } catch (error: any) {
        console.error("Autonomous Research API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
