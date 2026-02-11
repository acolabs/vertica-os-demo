import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ensureDbInitialized } from '@/lib/api-init';

export async function GET(request: NextRequest) {
  ensureDbInitialized();
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('org_id');
  const agentId = searchParams.get('agent_id');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  let query = 'SELECT * FROM runs WHERE 1=1';
  const params: (string | number)[] = [];

  if (orgId) {
    query += ' AND org_id = ?';
    params.push(orgId);
  }
  if (agentId) {
    query += ' AND agent_id = ?';
    params.push(agentId);
  }

  query += ' ORDER BY started_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const runs = db.prepare(query).all(...params);
  return NextResponse.json(runs);
}
