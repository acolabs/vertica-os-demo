"use client";

import React from "react";
import {
  Zap,
  DollarSign,
  UserPlus,
  Settings2,
  Pause,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

interface Intervention {
  id: string;
  name: string;
  type: string;
  owner: string;
  startDate: string;
  targetDate: string;
  progress: number;
  impactProjection: number;
  status: "active" | "paused" | "complete";
}

interface ActiveInterventionsProps {
  interventions: Intervention[];
}

const typeConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  "Pipeline Reset": {
    icon: <Zap className="w-3 h-3" />,
    color: "text-blue-400",
    bg: "bg-blue-500/15 border-blue-500/30",
  },
  "Comp Redesign": {
    icon: <DollarSign className="w-3 h-3" />,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15 border-emerald-500/30",
  },
  "Talent Upgrade": {
    icon: <UserPlus className="w-3 h-3" />,
    color: "text-purple-400",
    bg: "bg-purple-500/15 border-purple-500/30",
  },
  "Process Redesign": {
    icon: <Settings2 className="w-3 h-3" />,
    color: "text-amber-400",
    bg: "bg-amber-500/15 border-amber-500/30",
  },
};

function formatCurrency(amount: number): string {
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount}`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function StatusIndicator({ status }: { status: Intervention["status"] }) {
  switch (status) {
    case "active":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Active
        </span>
      );
    case "paused":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-400">
          <Pause className="w-3 h-3" />
          Paused
        </span>
      );
    case "complete":
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-blue-400">
          <CheckCircle2 className="w-3 h-3" />
          Complete
        </span>
      );
  }
}

export function ActiveInterventions({ interventions }: ActiveInterventionsProps) {
  const totalImpact = interventions.reduce((sum, i) => sum + i.impactProjection, 0);
  const activeCount = interventions.filter(i => i.status === "active").length;

  return (
    <div className="glass-card shadow-premium rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)]">
      {/* Header */}
      <div className="p-4 border-b border-[var(--card-border)] flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            Active Interventions
          </h3>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {activeCount} active, {formatCurrency(totalImpact)} projected impact
          </p>
        </div>
      </div>

      {/* Intervention list */}
      <div className="divide-y divide-[var(--card-border)]">
        {interventions.map((intervention) => {
          const tc = typeConfig[intervention.type] || typeConfig["Process Redesign"];

          return (
            <div
              key={intervention.id}
              className="p-4 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {intervention.name}
                    </h4>
                    <StatusIndicator status={intervention.status} />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${tc.bg} ${tc.color}`}>
                      {tc.icon}
                      {intervention.type}
                    </span>
                    <span className="text-xs text-[var(--text-muted)]">
                      {intervention.owner}
                    </span>
                    <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                      {formatDate(intervention.startDate)}
                      <ArrowRight className="w-3 h-3" />
                      {formatDate(intervention.targetDate)}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-sm font-bold text-[var(--text-primary)]">
                    {formatCurrency(intervention.impactProjection)}
                  </span>
                  <div className="text-[10px] text-[var(--text-muted)]">projected</div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-[var(--surface)] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      intervention.status === "complete"
                        ? "bg-blue-500"
                        : intervention.status === "paused"
                        ? "bg-amber-500"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${intervention.progress}%` }}
                  />
                </div>
                <span className="text-[10px] font-medium text-[var(--text-muted)] w-8 text-right">
                  {intervention.progress}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
