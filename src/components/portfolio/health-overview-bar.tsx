"use client";

import React from "react";
import {
  Building2,
  TrendingUp,
  ShieldAlert,
  DollarSign,
  Activity,
} from "lucide-react";

interface PortfolioSummary {
  totalCompanies: number;
  greenCount: number;
  yellowCount: number;
  redCount: number;
  totalArr: number;
  avgNrr: number;
  valueAtRisk: number;
}

function formatCompact(n: number): string {
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

export function HealthOverviewBar({ summary }: { summary: PortfolioSummary }) {
  const stats = [
    {
      label: "Portfolio Companies",
      value: String(summary.totalCompanies),
      icon: <Building2 className="w-4 h-4" />,
      accent: "text-[var(--text-primary)]",
    },
    {
      label: "Health Status",
      value: "",
      custom: (
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <span className="text-lg font-bold text-emerald-400">
              {summary.greenCount}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-lg font-bold text-amber-400">
              {summary.yellowCount}
            </span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="text-lg font-bold text-red-400">
              {summary.redCount}
            </span>
          </span>
        </div>
      ),
      icon: <Activity className="w-4 h-4" />,
      accent: "text-[var(--text-primary)]",
    },
    {
      label: "Total Portfolio ARR",
      value: formatCompact(summary.totalArr),
      icon: <DollarSign className="w-4 h-4" />,
      accent: "text-emerald-400",
    },
    {
      label: "Avg NRR",
      value: `${summary.avgNrr}%`,
      icon: <TrendingUp className="w-4 h-4" />,
      accent: summary.avgNrr >= 110 ? "text-emerald-400" : "text-amber-400",
    },
    {
      label: "Value at Risk",
      value: formatCompact(summary.valueAtRisk),
      icon: <ShieldAlert className="w-4 h-4" />,
      accent: summary.valueAtRisk > 0 ? "text-red-400" : "text-emerald-400",
    },
  ];

  return (
    <div className="glass-card shadow-premium rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
              {stat.icon}
              <span className="text-[10px] font-medium uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
            {stat.custom ? (
              stat.custom
            ) : (
              <p className={`text-lg font-bold tracking-tight ${stat.accent}`}>
                {stat.value}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
