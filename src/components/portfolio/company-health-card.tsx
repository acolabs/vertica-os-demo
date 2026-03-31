"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  PortfolioCompany,
  HealthStatus,
  MetricStatus,
  Trend,
} from "@/app/api/portfolio/route";

const statusConfig: Record<
  HealthStatus,
  { color: string; bg: string; border: string; label: string; glow: string }
> = {
  GREEN: {
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    border: "border-emerald-500/30",
    label: "Healthy",
    glow: "shadow-[0_0_12px_rgba(52,211,153,0.15)]",
  },
  YELLOW: {
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-500/30",
    label: "Watch",
    glow: "shadow-[0_0_12px_rgba(251,191,36,0.15)]",
  },
  RED: {
    color: "text-red-400",
    bg: "bg-red-400/10",
    border: "border-red-500/30",
    label: "Critical",
    glow: "shadow-[0_0_12px_rgba(248,113,113,0.15)]",
  },
};

const metricColors: Record<MetricStatus, string> = {
  green: "text-emerald-400",
  yellow: "text-amber-400",
  red: "text-red-400",
};

const trendIcons: Record<Trend, React.ReactNode> = {
  up: <TrendingUp className="w-3 h-3" />,
  down: <TrendingDown className="w-3 h-3" />,
  flat: <Minus className="w-3 h-3" />,
};

function formatArr(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

interface Props {
  company: PortfolioCompany;
  onClick: () => void;
}

export function CompanyHealthCard({ company, onClick }: Props) {
  const status = statusConfig[company.healthStatus];

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative w-full text-left glass-card rounded-xl border bg-[var(--card-bg)] card-hover-lift cursor-pointer overflow-hidden transition-all",
        company.healthStatus === "RED"
          ? "critical-pulse-border"
          : `border-[var(--card-border)]`,
        status.glow
      )}
    >
      {/* Status bar on left */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-1 rounded-l-xl",
          company.healthStatus === "GREEN" && "bg-emerald-400",
          company.healthStatus === "YELLOW" && "bg-amber-400",
          company.healthStatus === "RED" && "bg-red-400"
        )}
      />

      <div className="pl-4 pr-4 pt-4 pb-3">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate">
                {company.name}
              </h3>
              {company.escalationLevel && (
                <Badge
                  variant="outline"
                  className="text-[9px] px-1.5 py-0 border-red-500/30 text-red-400 bg-red-500/10 shrink-0"
                >
                  {company.escalationLevel}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="text-[9px] px-1.5 py-0 border-[var(--card-border)] text-[var(--text-muted)] bg-[var(--badge-muted-bg)]"
              >
                {company.industry}
              </Badge>
              <Badge
                variant="outline"
                className="text-[9px] px-1.5 py-0 border-[var(--card-border)] text-[var(--text-muted)] bg-[var(--badge-muted-bg)]"
              >
                {company.stage}
              </Badge>
            </div>
          </div>

          {/* Health status indicator */}
          <div
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-full shrink-0",
              status.bg,
              status.border,
              "border"
            )}
          >
            <span
              className={cn(
                "w-2.5 h-2.5 rounded-full",
                company.healthStatus === "GREEN" && "bg-emerald-400",
                company.healthStatus === "YELLOW" && "bg-amber-400",
                company.healthStatus === "RED" && "bg-red-400"
              )}
            />
            <span className={cn("text-[10px] font-semibold uppercase", status.color)}>
              {status.label}
            </span>
          </div>
        </div>

        {/* ARR headline */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-xl font-bold text-[var(--text-primary)]">
            {formatArr(company.arr)}
          </span>
          <span className="text-xs text-[var(--text-muted)]">ARR</span>
          <span
            className={cn(
              "text-xs font-medium flex items-center gap-0.5",
              metricColors[
                company.kpis.find((k) => k.label === "ARR Growth")?.status ??
                  "green"
              ]
            )}
          >
            {
              trendIcons[
                company.kpis.find((k) => k.label === "ARR Growth")?.trend ??
                  "flat"
              ]
            }
            {company.arrGrowth}% YoY
          </span>
        </div>

        {/* KPI mini-grid */}
        <div className="grid grid-cols-3 gap-x-3 gap-y-2 mb-3">
          {company.kpis
            .filter((k) => k.label !== "ARR Growth")
            .map((kpi) => (
              <div key={kpi.label} className="min-w-0">
                <p className="text-[9px] text-[var(--text-muted)] uppercase tracking-wider truncate">
                  {kpi.label}
                </p>
                <div className="flex items-center gap-1">
                  <span
                    className={cn(
                      "text-sm font-semibold",
                      metricColors[kpi.status]
                    )}
                  >
                    {kpi.displayValue}
                  </span>
                  <span className={cn("opacity-60", metricColors[kpi.status])}>
                    {trendIcons[kpi.trend]}
                  </span>
                </div>
              </div>
            ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-[var(--card-border)]/50">
          <div className="flex items-center gap-1 text-[var(--text-muted)]">
            <Clock className="w-3 h-3" />
            <span className="text-[10px]">
              {company.daysSinceRefresh === 0
                ? "Updated today"
                : company.daysSinceRefresh === 1
                  ? "1 day ago"
                  : `${company.daysSinceRefresh} days ago`}
            </span>
          </div>
          {company.healthStatus === "RED" && (
            <div className="flex items-center gap-1 text-red-400">
              <AlertTriangle className="w-3 h-3" />
              <span className="text-[10px] font-medium">Action Required</span>
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
