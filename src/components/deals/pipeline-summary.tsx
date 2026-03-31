"use client";

import React from "react";
import { Briefcase, DollarSign, Clock, Target } from "lucide-react";

interface PipelineSummaryProps {
  summary: {
    totalDeals: number;
    totalPipelineValue: number;
    activeDeals: number;
    avgThesisFit: number;
    avgDaysToClose: number;
  };
}

export function PipelineSummary({ summary }: PipelineSummaryProps) {
  const pipelineDisplay =
    summary.totalPipelineValue >= 1_000_000
      ? `$${(summary.totalPipelineValue / 1_000_000).toFixed(0)}M`
      : `$${(summary.totalPipelineValue / 1_000).toFixed(0)}K`;

  const stats = [
    {
      icon: Briefcase,
      label: "Active Deals",
      value: String(summary.activeDeals),
      accent: "text-sky-400",
      bg: "bg-sky-400/10",
    },
    {
      icon: DollarSign,
      label: "Pipeline Value",
      value: pipelineDisplay,
      accent: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      icon: Target,
      label: "Avg Thesis Fit",
      value: `${summary.avgThesisFit}`,
      accent: "text-purple-400",
      bg: "bg-purple-400/10",
    },
    {
      icon: Clock,
      label: "Avg Days to Close",
      value: `${summary.avgDaysToClose}d`,
      accent: "text-orange-400",
      bg: "bg-orange-400/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="glass-card bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 flex items-center gap-3"
        >
          <div
            className={`shrink-0 w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center`}
          >
            <stat.icon className={`w-4.5 h-4.5 ${stat.accent}`} />
          </div>
          <div>
            <p className="text-lg font-bold text-[var(--text-primary)]">
              {stat.value}
            </p>
            <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              {stat.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
