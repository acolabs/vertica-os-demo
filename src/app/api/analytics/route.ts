import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ensureDbInitialized } from '@/lib/api-init';

export async function GET(request: NextRequest) {
  ensureDbInitialized();
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('org_id');

  if (!orgId) {
    return NextResponse.json({ error: 'org_id is required' }, { status: 400 });
  }

  // Total decisions by status
  const decisionsByStatus = db.prepare(`
    SELECT status, COUNT(*) as count FROM decisions WHERE org_id = ? GROUP BY status
  `).all(orgId);

  // Total decisions by severity
  const decisionsBySeverity = db.prepare(`
    SELECT severity, COUNT(*) as count FROM decisions WHERE org_id = ? GROUP BY severity
  `).all(orgId);

  // Total value at risk by severity
  const valueAtRisk = db.prepare(`
    SELECT severity, SUM(impact_dollars) as total_value FROM decisions WHERE org_id = ? AND status IN ('pending','escalated') GROUP BY severity
  `).all(orgId);

  // Agent stats
  const agentStats = db.prepare(`
    SELECT id, name, type, total_runs, total_decisions, total_value_created, accuracy_rate FROM agents WHERE org_id = ?
  `).all(orgId);

  // Run stats
  const runStats = db.prepare(`
    SELECT 
      COUNT(*) as total_runs,
      SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
      SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
      AVG(duration_ms) as avg_duration_ms,
      SUM(tokens_used) as total_tokens,
      SUM(cost_usd) as total_cost
    FROM runs WHERE org_id = ?
  `).get(orgId);

  // Recent KPI trend (last 30 days)
  const kpiTrend = db.prepare(`
    SELECT * FROM kpi_snapshots WHERE org_id = ? ORDER BY date DESC LIMIT 30
  `).all(orgId);

  return NextResponse.json({
    decisions: { byStatus: decisionsByStatus, bySeverity: decisionsBySeverity, valueAtRisk },
    agents: agentStats,
    runs: runStats,
    kpiTrend: kpiTrend.reverse(),
  });
}
