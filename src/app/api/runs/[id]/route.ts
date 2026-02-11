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
  const run = db.prepare('SELECT * FROM runs WHERE id = ?').get(id);
  if (!run) {
    return NextResponse.json({ error: 'Run not found' }, { status: 404 });
  }
  return NextResponse.json(run);
}
