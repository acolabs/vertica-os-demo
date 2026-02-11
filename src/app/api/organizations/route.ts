import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ensureDbInitialized } from '@/lib/api-init';

export async function GET() {
  ensureDbInitialized();
  const db = getDb();
  const orgs = db.prepare('SELECT * FROM organizations ORDER BY type, name').all();
  return NextResponse.json(orgs);
}
