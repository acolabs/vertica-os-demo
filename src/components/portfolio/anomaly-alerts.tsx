"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Bell, CheckCircle2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AnomalyAlert, AlertSeverity, AlertStatus } from "@/app/api/portfolio/route";

const severityConfig: Record<
  AlertSeverity,
  { color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  High: {
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    icon: <AlertTriangle className="w-3.5 h-3.5 text-red-400" />,
  },
  Medium: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    icon: <Bell className="w-3.5 h-3.5 text-amber-400" />,
  },
  Low: {
    color: "text-[var(--text-muted)]",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/20",
    icon: <Eye className="w-3.5 h-3.5 text-[var(--text-muted)]" />,
  },
};

const statusConfig: Record<
  AlertStatus,
  { color: string; bg: string }
> = {
  New: { color: "text-red-400", bg: "bg-red-500/15 border-red-500/20" },
  Acknowledged: {
    color: "text-amber-400",
    bg: "bg-amber-500/15 border-amber-500/20",
  },
  Resolved: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/15 border-emerald-500/20",
  },
};

function formatTimestamp(ts: string): string {
  const date = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffHours < 1) return "Just now";
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "1 day ago";
  return `${diffDays} days ago`;
}

export function AnomalyAlerts({ alerts }: { alerts: AnomalyAlert[] }) {
  if (alerts.length === 0) return null;

  const activeAlerts = alerts.filter((a) => a.status !== "Resolved");
  const resolvedAlerts = alerts.filter((a) => a.status === "Resolved");

  return (
    <div className="glass-card shadow-premium rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">
            Anomaly Alerts
          </h2>
          {activeAlerts.length > 0 && (
            <Badge
              variant="outline"
              className="text-[9px] px-1.5 py-0 border-red-500/30 text-red-400 bg-red-500/10"
            >
              {activeAlerts.length} active
            </Badge>
          )}
        </div>
        <span className="text-[10px] text-[var(--text-muted)]">
          Last 7 days
        </span>
      </div>

      <div className="space-y-2">
        {activeAlerts.map((alert) => {
          const sev = severityConfig[alert.severity];
          const stat = statusConfig[alert.status];

          return (
            <div
              key={alert.id}
              className={cn(
                "rounded-lg border p-3",
                sev.bg,
                sev.border
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  <div className="mt-0.5 shrink-0">{sev.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-xs font-semibold text-[var(--text-primary)]">
                        {alert.companyName}
                      </span>
                      <span className="text-[10px] text-[var(--text-muted)]">
                        /
                      </span>
                      <span className={cn("text-xs font-medium", sev.color)}>
                        {alert.kpi}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                      {alert.description}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <Badge
                    variant="outline"
                    className={cn("text-[8px] px-1.5 py-0 border", sev.color, sev.border)}
                  >
                    {alert.severity}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn("text-[8px] px-1.5 py-0 border", stat.bg)}
                  >
                    <span className={stat.color}>{alert.status}</span>
                  </Badge>
                  <span className="text-[9px] text-[var(--text-muted)]">
                    {formatTimestamp(alert.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {resolvedAlerts.length > 0 && (
          <>
            <div className="flex items-center gap-2 pt-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
                Resolved
              </span>
            </div>
            {resolvedAlerts.map((alert) => (
              <div
                key={alert.id}
                className="rounded-lg border border-[var(--card-border)]/50 bg-[var(--card-bg)]/50 p-3 opacity-60"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-[var(--text-secondary)]">
                          {alert.companyName}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)]">
                          /
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">
                          {alert.kpi}
                        </span>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                        {alert.description}
                      </p>
                    </div>
                  </div>
                  <span className="text-[9px] text-[var(--text-muted)] shrink-0">
                    {formatTimestamp(alert.timestamp)}
                  </span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
