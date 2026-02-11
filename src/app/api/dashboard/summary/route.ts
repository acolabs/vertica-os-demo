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

  // Recent activity (last 10 audit entries)
  const recentActivity = db.prepare(
    'SELECT * FROM audit_log WHERE org_id = ? ORDER BY created_at DESC LIMIT 10'
  ).all(orgId);

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
    valueAtRisk: valueAtRisk?.total || 0,
    valueCreated: valueCreated?.total || 0,
  });
}
