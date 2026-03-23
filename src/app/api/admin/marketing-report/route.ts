import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';
import * as fs from 'fs';
import * as path from 'path';

export async function GET() {
    try {
        // 1. Fetch Spend Data from Local Docs
        type Campaign = {
            id: string;
            name: string;
            spend: number;
            leads_target?: number;
        };

        const spendPath = path.join(process.cwd(), 'docs', 'campaigns', 'current_spend.json');
        let campaignData: { monthly_budget: number; campaigns: Campaign[] } = { 
            monthly_budget: 0, 
            campaigns: [] 
        };
        
        if (fs.existsSync(spendPath)) {
            campaignData = JSON.parse(fs.readFileSync(spendPath, 'utf8'));
        } else {
            // Default placeholder if file not found
            campaignData = {
                monthly_budget: 5000,
                campaigns: [
                    { id: "FB-DAL-001", name: "Dallas Total Loss - Facebook", spend: 1200, leads_target: 50 },
                    { id: "GG-HOU-001", name: "Houston Injury - Google Search", spend: 2500, leads_target: 100 }
                ]
            };
        }

        // 2. Fetch Lead Data from Firestore
        const snapshot = await adminDb.collection('total_loss_leads').get();
        const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 3. Process Metrics
        const totalSpend = campaignData.campaigns.reduce((acc: number, c: Campaign) => acc + c.spend, 0);
        const totalLeads = leads?.length || 0;
        const globalCPA = totalLeads > 0 ? totalSpend / totalLeads : 0;

        const estimatedRetentionRate = 0.10;
        const estimatedCaseValue = 2500;
        const estimatedRevenue = (totalLeads * estimatedRetentionRate) * estimatedCaseValue;
        const roi = totalSpend > 0 ? (estimatedRevenue - totalSpend) / totalSpend : 0;

        const campaignPerformance = campaignData.campaigns.map((c: Campaign) => {
            const campaignLeads = leads?.filter((l: any) => l.source === c.id || l.source === c.name).length || 0;
            return {
                name: c.name,
                spend: c.spend,
                leads: campaignLeads,
                cpa: campaignLeads > 0 ? c.spend / campaignLeads : 0
            };
        });

        return NextResponse.json({
            generated_at: new Date().toISOString(),
            total_spend: totalSpend,
            total_leads: totalLeads,
            cpa: globalCPA,
            roi: roi,
            campaign_performance: campaignPerformance
        });

    } catch (error: any) {
        console.error('Marketing Report Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
