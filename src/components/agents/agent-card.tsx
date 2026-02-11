"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Headphones, FileText, Activity, Bot, ArrowRight, TrendingUp, Eye, Lightbulb, ShieldCheck, Zap } from "lucide-react";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

interface Agent {
  id: string;
  name: string;
  type: string;
  status: string;
  description: string;
  model: string;
  config?: string;
  total_runs: number;
  total_decisions: number;
  total_value_created: number;
  accuracy_rate: number;
  created_at: number;
}

type DeploymentStage = "shadow" | "suggest" | "gated_auto" | "full_auto";

const stageConfig: Record<DeploymentStage, { icon: typeof Eye; label: string; color: string; bg: string }> = {
  shadow: { icon: Eye, label: "Shadow", color: "text-zinc-400", bg: "bg-zinc-500/10" },
  suggest: { icon: Lightbulb, label: "Suggest", color: "text-amber-400", bg: "bg-amber-500/10" },
  gated_auto: { icon: ShieldCheck, label: "Gated Auto", color: "text-sky-400", bg: "bg-sky-500/10" },
  full_auto: { icon: Zap, label: "Full Auto", color: "text-emerald-400", bg: "bg-emerald-500/10" },
};

function getDeploymentStage(agent: Agent): DeploymentStage {
  if (agent.config) {
    try {
      const parsed = JSON.parse(agent.config);
      if (parsed.stage && parsed.stage in stageConfig) return parsed.stage as DeploymentStage;
    } catch { /* ignore parse errors */ }
  }
  if (agent.status === "active") return "gated_auto";
  if (agent.status === "paused") return "shadow";
  if (agent.status === "deploying") return "suggest";
  return "shadow";
}

interface AgentCardProps {
  agent: Agent;
}

const typeConfig: Record<
  string,
  { icon: typeof Shield; label: string; color: string; bg: string }
> = {
  nrr: {
    icon: Shield,
    label: "NRR",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  support: {
    icon: Headphones,
    label: "Support",
    color: "text-[var(--primary)]",
    bg: "bg-[var(--primary-10)]",
  },
  board_pack: {
    icon: FileText,
    label: "Board Pack",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  pipeline: {
    icon: Activity,
    label: "Pipeline",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
  revenue_cadence: {
    icon: TrendingUp,
    label: "Revenue Cadence",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  support_deflection: {
    icon: Headphones,
    label: "Support",
    color: "text-sky-400",
    bg: "bg-sky-500/10",
  },
};

export function AgentCard({ agent }: AgentCardProps) {
  const config = typeConfig[agent.type] || {
    icon: Bot,
    label: agent.type,
    color: "text-[var(--text-muted)]",
    bg: "bg-[var(--badge-muted-bg)]",
  };
  const Icon = config.icon;

  const stage = getDeploymentStage(agent);
  const stageInfo = stageConfig[stage];
  const StageIcon = stageInfo.icon;

  return (
    <Card className="bg-[var(--card-bg)] border-[var(--card-border)] glass-card shadow-premium card-hover-lift transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center",
                config.bg
              )}
            >
              <Icon className={cn("w-5 h-5", config.color)} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                {agent.name}
              </h3>
              <p className="text-[11px] text-[var(--text-muted)] font-mono">
                {agent.model}
              </p>
              <div className={cn("inline-flex items-center gap-1 mt-1 px-1.5 py-0.5 rounded text-[10px] font-medium", stageInfo.bg, stageInfo.color)}>
                <StageIcon className="w-3 h-3" />
                {stageInfo.label}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn(
                "text-[10px] border-transparent",
                config.color,
                config.bg
              )}
            >
              {config.label}
            </Badge>
            <span
              className={cn(
                "w-2.5 h-2.5 rounded-full",
                agent.status === "active"
                  ? "bg-emerald-500"
                  : agent.status === "paused"
                  ? "bg-amber-500"
                  : "bg-[var(--text-muted)]"
              )}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {agent.description && (
          <p className="text-xs text-[var(--text-muted)] mb-3 line-clamp-2">
            {agent.description}
          </p>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[var(--surface)] rounded-lg p-2.5">
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              Total Runs
            </p>
            <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">
              {agent.total_runs.toLocaleString()}
            </p>
          </div>
          <div className="bg-[var(--surface)] rounded-lg p-2.5">
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              Decisions
            </p>
            <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">
              {agent.total_decisions}
            </p>
          </div>
          <div className="bg-[var(--surface)] rounded-lg p-2.5">
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              Accuracy
            </p>
            <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">
              {formatPercent(agent.accuracy_rate * 100)}
            </p>
          </div>
          <div className="bg-[var(--surface)] rounded-lg p-2.5">
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              Value Created
            </p>
            <p className="text-sm font-semibold text-emerald-400 mt-0.5">
              {formatCurrency(agent.total_value_created)}
            </p>
          </div>
        </div>

        {/* Activity sparkline placeholder */}
        <div className="mt-3 pt-3 border-t border-[var(--card-border)]/50">
          <div className="flex items-end gap-[3px] h-5">
            {Array.from({ length: 14 }).map((_, i) => {
              const height =
                20 + Math.sin(i * 0.8 + agent.total_runs * 0.01) * 40 + Math.random() * 20;
              return (
                <div
                  key={i}
                  className="flex-1 rounded-[2px] transition-all bg-[var(--primary-20)]"
                  style={{ height: `${Math.max(height, 15)}%` }}
                />
              );
            })}
          </div>
          <p className="text-[10px] text-[var(--text-muted)] mt-1">Last 14 days activity</p>
        </div>

        <Link
          href={`/agents/${agent.id}`}
          className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors pt-3 border-t border-[var(--card-border)]/50"
        >
          View Details <ArrowRight className="w-3 h-3" />
        </Link>
      </CardContent>
    </Card>
  );
}
