import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ensureDbInitialized } from '@/lib/api-init';

export async function GET(request: NextRequest) {
  ensureDbInitialized();
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('org_id');
  const isAll = !orgId || orgId === 'all';
  const limit = parseInt(searchParams.get('limit') || '50');
  const offset = parseInt(searchParams.get('offset') || '0');

  const portfolioFilter = `org_id IN (SELECT id FROM organizations WHERE type = 'portfolio')`;

  const entries = isAll
    ? db.prepare(
        `SELECT * FROM audit_log WHERE ${portfolioFilter} ORDER BY created_at DESC LIMIT ? OFFSET ?`
      ).all(limit, offset)
    : db.prepare(
        'SELECT * FROM audit_log WHERE org_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?'
      ).all(orgId, limit, offset);

  const count = isAll
    ? db.prepare(
        `SELECT COUNT(*) as total FROM audit_log WHERE ${portfolioFilter}`
      ).get() as { total: number }
    : db.prepare(
        'SELECT COUNT(*) as total FROM audit_log WHERE org_id = ?'
      ).get(orgId) as { total: number };

  return NextResponse.json({ entries, total: count.total, limit, offset });
}
