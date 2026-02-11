import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ensureDbInitialized } from '@/lib/api-init';

export async function GET(request: NextRequest) {
  ensureDbInitialized();
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('org_id');
  const isAll = !orgId || orgId === 'all';

  let agents;
  if (isAll) {
    agents = db.prepare(`
      SELECT a.*, COALESCE(SUM(r.cost_usd), 0) as total_cost
      FROM agents a
      LEFT JOIN runs r ON r.agent_id = a.id
      WHERE a.org_id IN (SELECT id FROM organizations WHERE type = 'portfolio')
      GROUP BY a.id
      ORDER BY a.created_at DESC
    `).all();
  } else {
    agents = db.prepare(`
      SELECT a.*, COALESCE(SUM(r.cost_usd), 0) as total_cost
      FROM agents a
      LEFT JOIN runs r ON r.agent_id = a.id
      WHERE a.org_id = ?
      GROUP BY a.id
      ORDER BY a.created_at DESC
    `).all(orgId);
  }

  return NextResponse.json(agents);
}
