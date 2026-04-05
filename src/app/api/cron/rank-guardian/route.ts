import { NextResponse } from 'next/server';
import { runRankGuardianTask } from '../../../../lib/rankGuardian';

// ── RankGuardian CRON — AEO Self-Healing SEO Agent ───────────────────────────
// Monitors Google Search Console for TTL ranking drops.
// Generates AEO Schema recovery plans for pages slipping out of Top 3.
// Deploy: Vercel CRON or external scheduler hitting POST /api/cron/rank-guardian
// with Authorization: Bearer <CRON_SECRET>

export async function POST(req: Request) {
  // Protect this route from public access
  const authHeader = req.headers.get('authorization');
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.texastotalloss.com/';

    console.log(`[RankGuardian CRON] Triggered for TTL: ${siteUrl}`);
    const recoveryPlans = await runRankGuardianTask(siteUrl);

    if (recoveryPlans.length > 0) {
      // TODO: Email or Firestore alert when pages need intervention
      console.log(
        '[RankGuardian CRON] TTL AEO Recovery Plans Generated:',
        JSON.stringify(recoveryPlans, null, 2)
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Rank Guardian sweep completed.',
      interventions: recoveryPlans.length,
      details: recoveryPlans,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    console.error('[RankGuardian CRON] Error:', msg);
    return NextResponse.json(
      { success: false, error: 'Failed to run Rank Guardian sweep.' },
      { status: 500 }
    );
  }
}
