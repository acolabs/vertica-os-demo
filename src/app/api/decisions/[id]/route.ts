import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ensureDbInitialized } from '@/lib/api-init';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  ensureDbInitialized();
  const db = getDb();
  const { id } = await params;
  const decision = db.prepare('SELECT * FROM decisions WHERE id = ?').get(id);
  if (!decision) {
    return NextResponse.json({ error: 'Decision not found' }, { status: 404 });
  }
  return NextResponse.json(decision);
}
