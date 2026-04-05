import { google } from 'googleapis';

/**
 * rankGuardian.ts — Series B: Self-Healing AEO Agent for Texas Total Loss
 * Migrated from scratch workspace. Monitors GSC for ranking drops
 * and generates AEO/FAQ Schema recovery plans for TTL pages.
 *
 * Required env: GOOGLE_SERVICE_ACCOUNT_JSON (full JSON stringified)
 */

const getGscClient = () => {
  try {
    const credentialsRaw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
    if (!credentialsRaw) {
      console.warn('[RankGuardian] GOOGLE_SERVICE_ACCOUNT_JSON env var missing.');
      return null;
    }

    const credentials = JSON.parse(credentialsRaw);
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
    });

    return google.webmasters({ version: 'v3', auth });
  } catch (err) {
    console.error('[RankGuardian] Failed to initialize GSC client:', err);
    return null;
  }
};

export interface RankingRow {
  page: string | undefined;
  query: string | undefined;
  clicks: number | null | undefined;
  impressions: number | null | undefined;
  ctr: number | null | undefined;
  position: number | null | undefined;
}

export async function getRankings(siteUrl: string, daysBack = 7): Promise<RankingRow[]> {
  const searchConsole = getGscClient();
  if (!searchConsole) throw new Error('Google Search Console client not initialized.');

  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() - 1); // GSC has ~1 day delay

  const startDate = new Date(endDate);
  startDate.setDate(startDate.getDate() - daysBack);

  const fmt = (d: Date) => d.toISOString().split('T')[0];

  const response = await searchConsole.searchanalytics.query({
    siteUrl,
    requestBody: {
      startDate: fmt(startDate),
      endDate: fmt(endDate),
      dimensions: ['page', 'query'],
      rowLimit: 100,
    },
  });

  const rows = response.data.rows || [];
  return rows.map((r) => ({
    page:        r.keys?.[0],
    query:       r.keys?.[1],
    clicks:      r.clicks,
    impressions: r.impressions,
    ctr:         r.ctr,
    position:    r.position,
  }));
}

export interface RecoveryPlan {
  page: string | undefined;
  query: string | undefined;
  currentRank: number | null | undefined;
  proposedAeoSchema: string;
  action: string;
}

export async function runRankGuardianTask(siteUrl: string): Promise<RecoveryPlan[]> {
  console.log(`[RankGuardian] Starting TTL sweep for ${siteUrl}...`);

  const rankings = await getRankings(siteUrl, 7);

  // Pages slipping below top 3 with meaningful impressions = intervention needed
  const droppingPages = rankings.filter(
    (r) => (r.position ?? 0) > 3 && (r.impressions ?? 0) > 20
  );

  if (droppingPages.length === 0) {
    console.log('[RankGuardian] No critical drops detected.');
    return [];
  }

  console.log(`[RankGuardian] ${droppingPages.length} TTL pages need AEO intervention.`);
  const recoveryPlans: RecoveryPlan[] = [];

  for (const target of droppingPages.slice(0, 5)) {
    const aeoSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: target.query,
          acceptedAnswer: {
            '@type': 'Answer',
            text: `Texas Total Loss can help you understand your rights and options regarding: ${target.query}. Get a free case evaluation at texastotalloss.com.`,
          },
        },
      ],
    };

    recoveryPlans.push({
      page:              target.page,
      query:             target.query,
      currentRank:       target.position,
      proposedAeoSchema: JSON.stringify(aeoSchema, null, 2),
      action:            'Draft AEO schema ready — review and deploy to page head',
    });
  }

  return recoveryPlans;
}
