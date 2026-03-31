import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ensureDbInitialized } from '@/lib/api-init';

export async function GET(request: NextRequest) {
  ensureDbInitialized();
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('org_id');
  const isAll = !orgId || orgId === 'all';

  // Latest KPI — for "all", get per-org latest KPIs
  let latestKpi;
  let perOrgKpis: Array<Record<string, unknown>> | undefined;

  if (isAll) {
    // Get latest KPI for each portfolio org
    perOrgKpis = db.prepare(
      `SELECT k.* FROM kpi_snapshots k
       INNER JOIN (
         SELECT org_id, MAX(date) as max_date
         FROM kpi_snapshots
         WHERE org_id IN (SELECT id FROM organizations WHERE type = 'portfolio')
         GROUP BY org_id
       ) latest ON k.org_id = latest.org_id AND k.date = latest.max_date`
    ).all() as Array<Record<string, unknown>>;

    // Compute aggregated KPI for "all" view (averages for rates, sums for absolutes)
    if (perOrgKpis.length > 0) {
      const count = perOrgKpis.length;
      latestKpi = {
        org_id: 'all',
        date: perOrgKpis[0].date,
        nrr_percent: perOrgKpis.reduce((s, k) => s + (k.nrr_percent as number || 0), 0) / count,
        churn_rate_percent: perOrgKpis.reduce((s, k) => s + (k.churn_rate_percent as number || 0), 0) / count,
        churn_prevented_dollars: perOrgKpis.reduce((s, k) => s + (k.churn_prevented_dollars as number || 0), 0),
        expansion_revenue: perOrgKpis.reduce((s, k) => s + (k.expansion_revenue as number || 0), 0),
        support_deflection_rate: perOrgKpis.reduce((s, k) => s + (k.support_deflection_rate as number || 0), 0) / count,
        support_cost_per_ticket: perOrgKpis.reduce((s, k) => s + (k.support_cost_per_ticket as number || 0), 0) / count,
        avg_handle_time_minutes: perOrgKpis.reduce((s, k) => s + (k.avg_handle_time_minutes as number || 0), 0) / count,
        csat_score: perOrgKpis.reduce((s, k) => s + (k.csat_score as number || 0), 0) / count,
        operator_hours_saved: perOrgKpis.reduce((s, k) => s + (k.operator_hours_saved as number || 0), 0),
        board_pack_hours: perOrgKpis.reduce((s, k) => s + (k.board_pack_hours as number || 0), 0),
        agent_cost_total: perOrgKpis.reduce((s, k) => s + (k.agent_cost_total as number || 0), 0),
      };
    }
  } else {
    latestKpi = db.prepare(
      'SELECT * FROM kpi_snapshots WHERE org_id = ? ORDER BY date DESC LIMIT 1'
    ).get(orgId);
  }

  // Quarterly agent cost (sum of daily agent_cost_total over last 90 snapshots)
  const quarterlyAgentCostRow = isAll
    ? db.prepare(`
        SELECT SUM(agent_cost_total) as total FROM (
          SELECT agent_cost_total FROM kpi_snapshots
          WHERE org_id IN (SELECT id FROM organizations WHERE type = 'portfolio')
          ORDER BY date DESC LIMIT 270
        )
      `).get() as { total: number | null }
    : db.prepare(`
        SELECT SUM(agent_cost_total) as total FROM (
          SELECT agent_cost_total FROM kpi_snapshots
          WHERE org_id = ? ORDER BY date DESC LIMIT 90
        )
      `).get(orgId) as { total: number | null };

  const quarterlyAgentCost = quarterlyAgentCostRow?.total || 0;

  // Decision counts by severity (pending only)
  const decisionCounts = isAll
    ? db.prepare(`
        SELECT severity, COUNT(*) as count 
        FROM decisions WHERE org_id IN (SELECT id FROM organizations WHERE type = 'portfolio') AND status = 'pending' 
        GROUP BY severity
      `).all()
    : db.prepare(`
        SELECT severity, COUNT(*) as count 
        FROM decisions WHERE org_id = ? AND status = 'pending' 
        GROUP BY severity
      `).all(orgId);

  // Agent stats
  const agents = isAll
    ? db.prepare(
        `SELECT id, name, type, status, total_runs, total_decisions, total_value_created, accuracy_rate, org_id FROM agents WHERE org_id IN (SELECT id FROM organizations WHERE type = 'portfolio')`
      ).all()
    : db.prepare(
        'SELECT id, name, type, status, total_runs, total_decisions, total_value_created, accuracy_rate FROM agents WHERE org_id = ?'
      ).all(orgId);

  // Recent activity
  const recentActivity = isAll
    ? db.prepare(
        `SELECT * FROM audit_log WHERE org_id IN (SELECT id FROM organizations WHERE type = 'portfolio') ORDER BY created_at DESC LIMIT 10`
      ).all()
    : db.prepare(
        'SELECT * FROM audit_log WHERE org_id = ? ORDER BY created_at DESC LIMIT 10'
      ).all(orgId);

  // All agents across all portfolio orgs (only needed for cross-portfolio view)
  const allAgents = isAll
    ? db.prepare(
        `SELECT a.id, a.name, a.type, a.status, a.total_runs, a.total_decisions, a.total_value_created, a.accuracy_rate, a.org_id, o.name as org_name
         FROM agents a JOIN organizations o ON o.id = a.org_id WHERE o.type = 'portfolio' ORDER BY a.total_value_created DESC`
      ).all()
    : undefined;

  // All recent activity across all portfolio orgs
  const allActivity = isAll
    ? db.prepare(
        `SELECT al.* FROM audit_log al JOIN organizations o ON o.id = al.org_id WHERE o.type = 'portfolio' ORDER BY al.created_at DESC LIMIT 20`
      ).all()
    : undefined;

  // Total value at risk
  const valueAtRisk = isAll
    ? db.prepare(`
        SELECT SUM(impact_dollars) as total FROM decisions WHERE org_id IN (SELECT id FROM organizations WHERE type = 'portfolio') AND status = 'pending' AND severity IN ('critical','high')
      `).get() as { total: number | null }
    : db.prepare(`
        SELECT SUM(impact_dollars) as total FROM decisions WHERE org_id = ? AND status = 'pending' AND severity IN ('critical','high')
      `).get(orgId) as { total: number | null };

  // Total value created (all time)
  const valueCreated = isAll
    ? db.prepare(`
        SELECT SUM(total_value_created) as total FROM agents WHERE org_id IN (SELECT id FROM organizations WHERE type = 'portfolio')
      `).get() as { total: number | null }
    : db.prepare(`
        SELECT SUM(total_value_created) as total FROM agents WHERE org_id = ?
      `).get(orgId) as { total: number | null };

  // Recent decisions for KPI detail drawer (last 10)
  const recentDecisions = isAll
    ? db.prepare(`
        SELECT id, title, type, agent_id, org_id, impact_dollars, status, severity, created_at, account_name
        FROM decisions
        WHERE org_id IN (SELECT id FROM organizations WHERE type = 'portfolio')
        ORDER BY created_at DESC LIMIT 10
      `).all()
    : db.prepare(`
        SELECT id, title, type, agent_id, org_id, impact_dollars, status, severity, created_at, account_name
        FROM decisions WHERE org_id = ?
        ORDER BY created_at DESC LIMIT 10
      `).all(orgId);

  return NextResponse.json({
    kpi: latestKpi,
    perOrgKpis,
    quarterlyAgentCost,
    decisionCounts,
    agents,
    recentActivity,
    allAgents,
    allActivity,
    valueAtRisk: valueAtRisk?.total || 0,
    valueCreated: valueCreated?.total || 0,
    recentDecisions,
  });
}
