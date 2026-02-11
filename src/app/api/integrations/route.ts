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

  const integrations = db.prepare(
    'SELECT * FROM integrations WHERE org_id = ? ORDER BY name'
  ).all(orgId);

  return NextResponse.json(integrations);
}
