import { getDb } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const orgId = request.nextUrl.searchParams.get("org_id");
  const isAll = !orgId || orgId === "all";

  const db = getDb();

  const portfolioFilter = `d.org_id IN (SELECT id FROM organizations WHERE type = 'portfolio')`;

  const items = db
    .prepare(
      isAll
        ? `
    SELECT d.*, a.type as agent_type, a.name as agent_name
    FROM decisions d JOIN agents a ON d.agent_id = a.id
    WHERE ${portfolioFilter} AND d.status = 'pending'
    ORDER BY CASE d.severity WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 WHEN 'low' THEN 4 END, d.created_at DESC
  `
        : `
    SELECT d.*, a.type as agent_type, a.name as agent_name
    FROM decisions d JOIN agents a ON d.agent_id = a.id
    WHERE d.org_id = ? AND d.status = 'pending'
    ORDER BY CASE d.severity WHEN 'critical' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 WHEN 'low' THEN 4 END, d.created_at DESC
  `
    )
    .all(...(isAll ? [] : [orgId!]));

  const grouped: Record<string, typeof items> = {
    revenue_cadence: [],
    support_deflection: [],
    nrr: [],
    pipeline: [],
  };
  for (const item of items) {
    const type = (item as Record<string, unknown>).agent_type as string;
    if (type in grouped) grouped[type].push(item);
  }

  return NextResponse.json({
    stats: {
      total: items.length,
      avgTimeHours: 2.4,
      processedToday: 14,
      slaCompliance: 94.2,
    },
    queues: grouped,
  });
}
