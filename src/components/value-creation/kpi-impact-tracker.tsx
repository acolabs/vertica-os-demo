"use client";

import React from "react";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface KpiMetric {
  metric: string;
  baseline: string;
  current: string;
  target: string;
  status: "on-track" | "at-risk" | "behind";
}

interface KpiImpactTrackerProps {
  kpis: KpiMetric[];
  currentDay: number;
}

function StatusBadge({ status }: { status: KpiMetric["status"] }) {
  const config = {
    "on-track": {
      icon: <TrendingUp className="w-3 h-3" />,
      label: "On Track",
      className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    },
    "at-risk": {
      icon: <AlertTriangle className="w-3 h-3" />,
      label: "At Risk",
      className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    },
    behind: {
      icon: <TrendingDown className="w-3 h-3" />,
      label: "Behind",
      className: "bg-red-500/15 text-red-400 border-red-500/30",
    },
  };
  const c = config[status];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${c.className}`}>
      {c.icon}
      {c.label}
    </span>
  );
}

export function KpiImpactTracker({ kpis, currentDay }: KpiImpactTrackerProps) {
  const onTrackCount = kpis.filter(k => k.status === "on-track").length;

  return (
    <div className="glass-card shadow-premium rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-[var(--card-border)] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            KPI Impact Tracker
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            Before vs. After comparison at Day {currentDay}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[var(--text-muted)]">
            {onTrackCount}/{kpis.length} on track
          </span>
          <div className="h-2 w-16 rounded-full bg-[var(--surface)] overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500"
              style={{ width: `${(onTrackCount / kpis.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--card-border)]">
              <th className="text-left text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider px-4 py-2.5">
                Metric
              </th>
              <th className="text-center text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider px-4 py-2.5">
                Baseline (Day 0)
              </th>
              <th className="text-center text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider px-4 py-2.5">
                Current (Day {currentDay})
              </th>
              <th className="text-center text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider px-4 py-2.5">
                Target (Day 90)
              </th>
              <th className="text-center text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider px-4 py-2.5">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {kpis.map((kpi, i) => (
              <tr
                key={kpi.metric}
                className={`border-b border-[var(--card-border)] last:border-b-0 hover:bg-white/5 transition-colors ${
                  i % 2 === 0 ? "" : "bg-white/[0.02]"
                }`}
              >
                <td className="px-4 py-3">
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {kpi.metric}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-sm text-[var(--text-muted)]">
                    {kpi.baseline}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-sm font-semibold text-[var(--text-primary)]">
                    {kpi.current}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="text-sm text-[var(--text-secondary)]">
                    {kpi.target}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={kpi.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
