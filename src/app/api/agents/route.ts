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
    agents = db.prepare('SELECT * FROM agents WHERE org_id = ? ORDER BY created_at DESC').all(orgId);
  } else {
    agents = db.prepare('SELECT * FROM agents ORDER BY created_at DESC').all();
  }

  return NextResponse.json(agents);
}
