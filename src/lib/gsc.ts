import { google } from 'googleapis';

/**
 * Google Search Console (GSC) Connector
 * 
 * This library retrieves actual ranking data from texastotalloss.com
 * to find "Striking Distance" keywords (Rank 4-20) for auto-optimization.
 */

const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/webmasters.readonly'],
});

const searchconsole = google.searchconsole('v1');

export interface GscPerformanceRow {
  keys: string[]; // [page_url, query]
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

/**
 * Fetches performance data for the last 30 days
 */
export async function getPagePerformance(siteUrl: string = 'https://texastotalloss.com'): Promise<GscPerformanceRow[]> {
  try {
    const authClient = await auth.getClient();
    google.options({ auth: authClient });

    const res = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        dimensions: ['page', 'query'],
        rowLimit: 1000,
      },
    });

    return (res.data.rows || []) as GscPerformanceRow[];
  } catch (error) {
    console.error('GSC Fetch Error:', error);
    return [];
  }
}

/**
 * Filters for "Striking Distance" pages (Rank 4 to 20)
 */
export function getStrikingDistancePages(rows: GscPerformanceRow[]) {
  return rows.filter(row => row.position >= 3.5 && row.position <= 20);
}
