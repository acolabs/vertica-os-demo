import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ensureDbInitialized } from '@/lib/api-init';

export async function GET(request: NextRequest) {
  ensureDbInitialized();
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('org_id');
  const isAll = !orgId || orgId === 'all';
  const days = parseInt(searchParams.get('days') || '90');

  const snapshots = isAll
    ? db.prepare(
        `SELECT date,
                AVG(nrr_percent) as nrr_percent,
                AVG(churn_rate_percent) as churn_rate_percent,
                SUM(agent_cost_total) as agent_cost_total
         FROM kpi_snapshots
         WHERE org_id IN (SELECT id FROM organizations WHERE type = 'portfolio')
         GROUP BY date
         ORDER BY date DESC
         LIMIT ?`
      ).all(days)
    : db.prepare(
        'SELECT * FROM kpi_snapshots WHERE org_id = ? ORDER BY date DESC LIMIT ?'
      ).all(orgId, days);

  return NextResponse.json(snapshots.reverse());
}
