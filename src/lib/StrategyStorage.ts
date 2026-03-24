import fs from 'fs';
import path from 'path';

/**
 * Strategy Knowledge Base (Persistence Layer)
 * 
 * Stores research reports, performance metrics, and cost audits.
 */

export interface SavedStrategy {
  id: string;
  timestamp: string;
  topic: string;
  persona: string;
  content: string;
  confidenceScore: number;
  totalCost: number; // Simulated USD
  status: 'Production' | 'Draft' | 'Archived';
}

const DB_PATH = path.join(process.cwd(), 'src/data/strategy_reports.json');

/**
 * Ensures the data directory exists
 */
function ensureDb() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) fs.writeFileSync(DB_PATH, JSON.stringify([]));
}

/**
 * Saves a new strategy report
 */
export async function saveStrategyReport(report: Omit<SavedStrategy, 'id' | 'timestamp'>) {
  ensureDb();
  const data = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8')) as SavedStrategy[];
  
  const newReport: SavedStrategy = {
    ...report,
    id: `STRAT-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };

  data.unshift(newReport); // Newest first
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  return newReport;
}

/**
 * Fetches the history of strategies
 */
export async function getStrategyHistory(): Promise<SavedStrategy[]> {
  ensureDb();
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

/**
 * Calculates total operational burn (Sum of all costs)
 */
export async function getPerformanceSummary() {
  const history = await getStrategyHistory();
  return {
    totalReports: history.length,
    totalSpent: history.reduce((sum, r) => sum + r.totalCost, 0),
    avgConfidence: history.reduce((sum, r) => sum + r.confidenceScore, 0) / (history.length || 1),
    failureCosts: history.filter(r => r.confidenceScore < 85).reduce((sum, r) => sum + r.totalCost, 0)
  };
}
