import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ensureDbInitialized } from '@/lib/api-init';
import { hashEntry } from '@/lib/utils';
import { randomUUID } from 'crypto';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  ensureDbInitialized();
  const db = getDb();
  const { id } = await params;
  const body = await request.json();
  const { approved_by } = body;

  if (!approved_by) {
    return NextResponse.json({ error: 'approved_by is required' }, { status: 400 });
  }

  const decision = db.prepare('SELECT * FROM decisions WHERE id = ?').get(id) as { id: string; org_id: string } | undefined;
  if (!decision) {
    return NextResponse.json({ error: 'Decision not found' }, { status: 404 });
  }

  const now = Date.now();
  db.prepare('UPDATE decisions SET status = ?, approved_by = ?, approved_at = ? WHERE id = ?')
    .run('approved', approved_by, now, id);

  // Create audit entry
  const lastAudit = db.prepare('SELECT hash FROM audit_log WHERE org_id = ? ORDER BY created_at DESC LIMIT 1')
    .get(decision.org_id) as { hash: string } | undefined;
  const prevHash = lastAudit?.hash || null;
  const auditId = randomUUID();
  const hash = hashEntry(prevHash, `decision.approved${id}${now}`);

  db.prepare(`INSERT INTO audit_log (id, org_id, prev_hash, hash, actor, action, resource_type, resource_id, details, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(auditId, decision.org_id, prevHash, hash, approved_by, 'decision.approved', 'decision', id, JSON.stringify({ approved_by }), now);

  return NextResponse.json({ success: true, id, status: 'approved', approved_at: now });
}
