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

  // Latest KPI
  const latestKpi = db.prepare(
    'SELECT * FROM kpi_snapshots WHERE org_id = ? ORDER BY date DESC LIMIT 1'
  ).get(orgId);

  // Decision counts by severity (pending only)
  const decisionCounts = db.prepare(`
    SELECT severity, COUNT(*) as count 
    FROM decisions WHERE org_id = ? AND status = 'pending' 
    GROUP BY severity
  `).all(orgId);

  // Agent stats
  const agents = db.prepare(
    'SELECT id, name, type, status, total_runs, total_decisions, total_value_created, accuracy_rate FROM agents WHERE org_id = ?'
  ).all(orgId);

  // Recent activity (last 10 audit entries for this org)
  const recentActivity = db.prepare(
    'SELECT * FROM audit_log WHERE org_id = ? ORDER BY created_at DESC LIMIT 10'
  ).all(orgId);

  // All agents across all portfolio orgs (for cross-portfolio view)
  const allAgents = db.prepare(
    `SELECT a.id, a.name, a.type, a.status, a.total_runs, a.total_decisions, a.total_value_created, a.accuracy_rate, a.org_id, o.name as org_name
     FROM agents a JOIN organizations o ON o.id = a.org_id WHERE o.type = 'portfolio' ORDER BY a.total_value_created DESC`
  ).all();

  // All recent activity across all portfolio orgs
  const allActivity = db.prepare(
    `SELECT al.* FROM audit_log al JOIN organizations o ON o.id = al.org_id WHERE o.type = 'portfolio' ORDER BY al.created_at DESC LIMIT 20`
  ).all();

  // Total value at risk
  const valueAtRisk = db.prepare(`
    SELECT SUM(impact_dollars) as total FROM decisions WHERE org_id = ? AND status = 'pending' AND severity IN ('critical','high')
  `).get(orgId) as { total: number | null };

  // Total value created (all time)
  const valueCreated = db.prepare(`
    SELECT SUM(total_value_created) as total FROM agents WHERE org_id = ?
  `).get(orgId) as { total: number | null };

  return NextResponse.json({
    kpi: latestKpi,
    decisionCounts,
    agents,
    recentActivity,
    allAgents,
    allActivity,
    valueAtRisk: valueAtRisk?.total || 0,
    valueCreated: valueCreated?.total || 0,
  });
}
