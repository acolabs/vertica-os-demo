import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ensureDbInitialized } from '@/lib/api-init';

export async function GET(request: NextRequest) {
  ensureDbInitialized();
  const db = getDb();
  const { searchParams } = new URL(request.url);
  const orgId = searchParams.get('org_id');
  const isAll = !orgId || orgId === 'all';

  const policies = isAll
    ? db.prepare(
        `SELECT * FROM policies WHERE org_id IN (SELECT id FROM organizations WHERE type = 'portfolio') ORDER BY name`
      ).all()
    : db.prepare(
        'SELECT * FROM policies WHERE org_id = ? ORDER BY name'
      ).all(orgId);

  return NextResponse.json(policies);
}
