import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ensureDbInitialized } from '@/lib/api-init';

export async function GET(request: NextRequest) {
  ensureDbInitialized();
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('org_id');
  const isAll = !orgId || orgId === 'all';

  const portfolioFilter = `org_id IN (SELECT id FROM organizations WHERE type = 'portfolio')`;

  // Total decisions by status
  const decisionsByStatus = db.prepare(
    isAll
      ? `SELECT status, COUNT(*) as count FROM decisions WHERE ${portfolioFilter} GROUP BY status`
      : `SELECT status, COUNT(*) as count FROM decisions WHERE org_id = ? GROUP BY status`
  ).all(...(isAll ? [] : [orgId!]));

  // Total decisions by severity
  const decisionsBySeverity = db.prepare(
    isAll
      ? `SELECT severity, COUNT(*) as count FROM decisions WHERE ${portfolioFilter} GROUP BY severity`
      : `SELECT severity, COUNT(*) as count FROM decisions WHERE org_id = ? GROUP BY severity`
  ).all(...(isAll ? [] : [orgId!]));

  // Total value at risk by severity
  const valueAtRisk = db.prepare(
    isAll
      ? `SELECT severity, SUM(impact_dollars) as total_value FROM decisions WHERE ${portfolioFilter} AND status IN ('pending','escalated') GROUP BY severity`
      : `SELECT severity, SUM(impact_dollars) as total_value FROM decisions WHERE org_id = ? AND status IN ('pending','escalated') GROUP BY severity`
  ).all(...(isAll ? [] : [orgId!]));

  // Agent stats
  const agentStats = db.prepare(
    isAll
      ? `SELECT id, name, type, total_runs, total_decisions, total_value_created, accuracy_rate FROM agents WHERE ${portfolioFilter}`
      : `SELECT id, name, type, total_runs, total_decisions, total_value_created, accuracy_rate FROM agents WHERE org_id = ?`
  ).all(...(isAll ? [] : [orgId!]));

  // Run stats
  const runStats = db.prepare(
    isAll
      ? `SELECT 
          COUNT(*) as total_runs,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
          AVG(duration_ms) as avg_duration_ms,
          SUM(tokens_used) as total_tokens,
          SUM(cost_usd) as total_cost
        FROM runs WHERE ${portfolioFilter}`
      : `SELECT 
          COUNT(*) as total_runs,
          SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failed,
          AVG(duration_ms) as avg_duration_ms,
          SUM(tokens_used) as total_tokens,
          SUM(cost_usd) as total_cost
        FROM runs WHERE org_id = ?`
  ).get(...(isAll ? [] : [orgId!]));

  // Recent KPI trend (last 30 days)
  const kpiTrend = db.prepare(
    isAll
      ? `SELECT * FROM kpi_snapshots WHERE ${portfolioFilter} ORDER BY date DESC LIMIT 30`
      : `SELECT * FROM kpi_snapshots WHERE org_id = ? ORDER BY date DESC LIMIT 30`
  ).all(...(isAll ? [] : [orgId!]));

  return NextResponse.json({
    decisions: { byStatus: decisionsByStatus, bySeverity: decisionsBySeverity, valueAtRisk },
    agents: agentStats,
    runs: runStats,
    kpiTrend: (kpiTrend as Record<string, unknown>[]).reverse(),
  });
}
