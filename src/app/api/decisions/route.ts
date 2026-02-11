import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ensureDbInitialized } from '@/lib/api-init';

export async function GET(request: NextRequest) {
  ensureDbInitialized();
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('org_id');
  const severity = searchParams.get('severity');
  const status = searchParams.get('status');
  const agentId = searchParams.get('agent_id');
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  let query = 'SELECT * FROM decisions WHERE 1=1';
  const params: (string | number)[] = [];

  if (orgId) {
    query += ' AND org_id = ?';
    params.push(orgId);
  }
  if (severity) {
    query += ' AND severity = ?';
    params.push(severity);
  }
  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  if (agentId) {
    query += ' AND agent_id = ?';
    params.push(agentId);
  }

  query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const decisions = db.prepare(query).all(...params);

  // Get total count
  let countQuery = 'SELECT COUNT(*) as total FROM decisions WHERE 1=1';
  const countParams: string[] = [];
  if (orgId) { countQuery += ' AND org_id = ?'; countParams.push(orgId); }
  if (severity) { countQuery += ' AND severity = ?'; countParams.push(severity); }
  if (status) { countQuery += ' AND status = ?'; countParams.push(status); }
  if (agentId) { countQuery += ' AND agent_id = ?'; countParams.push(agentId); }

  const count = db.prepare(countQuery).get(...countParams) as { total: number };

  return NextResponse.json({ decisions, total: count.total, limit, offset });
}
