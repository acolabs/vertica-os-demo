"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface BeforeAfterRow {
  metric: string;
  before: number;
  after: number;
  unit: string;
  prefix?: string;
  lowerBetter?: boolean;
}

function formatValue(value: number, unit: string, prefix?: string): string {
  const p = prefix || "";
  const v = Number.isInteger(value) ? value.toString() : value.toFixed(1);
  return `${p}${v}${unit}`;
}

function computeChange(before: number, after: number, lowerBetter: boolean): { pct: number; improved: boolean; arrow: string } {
  if (before === 0) {
    return { pct: after > 0 ? 100 : 0, improved: true, arrow: "↑" };
  }
  const rawPct = Math.abs(((after - before) / before) * 100);
  const pct = Math.round(rawPct);
  const wentUp = after > before;
  const improved = lowerBetter ? !wentUp : wentUp;
  const arrow = wentUp ? "↑" : "↓";
  return { pct, improved, arrow };
}

export function BeforeAfterChart({ data }: { data: BeforeAfterRow[] }) {
  return (
    <Card className="border-[var(--card-border)] bg-[var(--card-bg)] glass-card shadow-premium">
      <CardHeader>
        <CardTitle className="text-[var(--text-primary)]">
          Before vs After Agent Deployment
        </CardTitle>
        <CardDescription className="text-[var(--text-secondary)]">
          Validated results from historical replay runs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {data.map((m) => {
            const { pct, improved, arrow } = computeChange(m.before, m.after, !!m.lowerBetter);
            // Bar: normalize after value relative to the larger of before/after
            const max = Math.max(m.before, m.after);
            const beforeBarPct = max > 0 ? (m.before / max) * 100 : 0;
            const afterBarPct = max > 0 ? (m.after / max) * 100 : 0;

            return (
              <div
                key={m.metric}
                className="bg-[var(--surface)] rounded-lg p-3 card-hover-lift transition-all"
              >
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-medium leading-tight min-h-[24px]">
                  {m.metric}
                </p>
                <div className="flex items-baseline gap-2 mt-1.5">
                  <span className="text-sm text-[var(--text-muted)] line-through decoration-[var(--text-muted)]/40">
                    {formatValue(m.before, m.unit, m.prefix)}
                  </span>
                  <span className="text-lg font-bold text-[var(--primary)]">
                    {formatValue(m.after, m.unit, m.prefix)}
                  </span>
                </div>
                <div className="mt-1.5">
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px] px-1.5 py-0",
                      improved
                        ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                        : "bg-red-500/15 text-red-400 border-red-500/30"
                    )}
                  >
                    {arrow} {pct}%
                  </Badge>
                </div>
                {/* Before bar (gray) */}
                <div className="mt-2.5 space-y-1">
                  <div className="h-1.5 rounded-full bg-[#52525b]/20 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#52525b] transition-all duration-500"
                      style={{ width: `${beforeBarPct}%` }}
                    />
                  </div>
                  {/* After bar (green or red) */}
                  <div className="h-1.5 rounded-full bg-[#52525b]/20 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        improved ? "bg-[var(--primary)]" : "bg-red-500/60"
                      )}
                      style={{ width: `${afterBarPct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
