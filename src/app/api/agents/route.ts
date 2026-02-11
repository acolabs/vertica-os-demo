import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ensureDbInitialized } from '@/lib/api-init';

export async function GET(request: NextRequest) {
  ensureDbInitialized();
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('org_id');

  let agents;
  if (orgId) {
    agents = db.prepare(`
      SELECT a.*, COALESCE(SUM(r.cost_usd), 0) as total_cost
      FROM agents a
      LEFT JOIN runs r ON r.agent_id = a.id
      WHERE a.org_id = ?
      GROUP BY a.id
      ORDER BY a.created_at DESC
    `).all(orgId);
  } else {
    agents = db.prepare(`
      SELECT a.*, COALESCE(SUM(r.cost_usd), 0) as total_cost
      FROM agents a
      LEFT JOIN runs r ON r.agent_id = a.id
      GROUP BY a.id
      ORDER BY a.created_at DESC
    `).all();
  }

  return NextResponse.json(agents);
}
