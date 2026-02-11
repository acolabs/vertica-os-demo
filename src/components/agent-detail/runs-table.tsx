"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn, formatDuration, formatCurrency } from "@/lib/utils";

interface Run {
  id: string;
  status: string;
  trigger_type: string;
  started_at: number;
  duration_ms: number;
  tools_used: string | string[] | null;
  tokens_used: number;
  cost_usd: number;
  decisions_created: number;
}

type SortKey = "started_at" | "duration_ms" | "tokens_used" | "cost_usd" | "decisions_created";

const statusColors: Record<string, string> = {
  completed: "bg-emerald-500/10 text-emerald-400",
  running: "bg-[var(--primary-10)] text-[var(--primary)]",
  failed: "bg-rose-500/10 text-rose-400",
};

const triggerColors: Record<string, string> = {
  scheduled: "bg-zinc-500/10 text-[var(--text-secondary)]",
  manual: "bg-purple-500/10 text-purple-400",
  event: "bg-amber-500/10 text-amber-400",
};

function parseToolsUsed(tools: string | string[] | null): string[] {
  if (!tools) return [];
  if (Array.isArray(tools)) return tools;
  try { return JSON.parse(tools); } catch { return []; }
}

export function RunsTable({ runs }: { runs: Run[] }) {
  const router = useRouter();
  const [sortKey, setSortKey] = useState<SortKey>("started_at");
  const [sortAsc, setSortAsc] = useState(false);

  const sorted = useMemo(() => {
    return [...runs].sort((a, b) => {
      const av = a[sortKey] ?? 0;
      const bv = b[sortKey] ?? 0;
      return sortAsc ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
  }, [runs, sortKey, sortAsc]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(false); }
  }

  function SortIndicator({ col }: { col: SortKey }) {
    if (sortKey !== col) return null;
    return <span className="ml-1 text-[var(--text-muted)]">{sortAsc ? "↑" : "↓"}</span>;
  }

  return (
    <Card className="bg-[var(--card-bg)] border-[var(--card-border)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">All Runs ({runs.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-[var(--card-border)] hover:bg-transparent">
              <TableHead className="text-[var(--text-muted)] text-xs">Status</TableHead>
              <TableHead className="text-[var(--text-muted)] text-xs">Trigger</TableHead>
              <TableHead className="text-[var(--text-muted)] text-xs cursor-pointer select-none" onClick={() => toggleSort("started_at")}>
                Started<SortIndicator col="started_at" />
              </TableHead>
              <TableHead className="text-[var(--text-muted)] text-xs cursor-pointer select-none" onClick={() => toggleSort("duration_ms")}>
                Duration<SortIndicator col="duration_ms" />
              </TableHead>
              <TableHead className="text-[var(--text-muted)] text-xs">Tools</TableHead>
              <TableHead className="text-[var(--text-muted)] text-xs cursor-pointer select-none" onClick={() => toggleSort("tokens_used")}>
                Tokens<SortIndicator col="tokens_used" />
              </TableHead>
              <TableHead className="text-[var(--text-muted)] text-xs cursor-pointer select-none" onClick={() => toggleSort("cost_usd")}>
                Cost<SortIndicator col="cost_usd" />
              </TableHead>
              <TableHead className="text-[var(--text-muted)] text-xs cursor-pointer select-none" onClick={() => toggleSort("decisions_created")}>
                Decisions<SortIndicator col="decisions_created" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((run) => {
              const tools = parseToolsUsed(run.tools_used);
              return (
                <TableRow
                  key={run.id}
                  className="border-[var(--card-border)] cursor-pointer hover:bg-[var(--card-hover)]"
                  onClick={() => router.push(`/runs/${run.id}`)}
                >
                  <TableCell>
                    <Badge variant="outline" className={cn("text-[10px] border-transparent capitalize", statusColors[run.status])}>
                      {run.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={cn("text-[10px] border-transparent capitalize", triggerColors[run.trigger_type])}>
                      {run.trigger_type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-[var(--text-secondary)]">
                    {new Date(run.started_at).toLocaleString("en-US", {
                      month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="text-xs text-[var(--text-secondary)]">{formatDuration(run.duration_ms || 0)}</TableCell>
                  <TableCell className="text-xs text-[var(--text-secondary)]">{tools.length}</TableCell>
                  <TableCell className="text-xs text-[var(--text-secondary)]">{(run.tokens_used || 0).toLocaleString()}</TableCell>
                  <TableCell className="text-xs text-[var(--text-secondary)]">{formatCurrency(run.cost_usd || 0)}</TableCell>
                  <TableCell className="text-xs text-[var(--text-secondary)]">{run.decisions_created}</TableCell>
                </TableRow>
              );
            })}
            {sorted.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-[var(--text-muted)] text-sm py-8">
                  No runs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
