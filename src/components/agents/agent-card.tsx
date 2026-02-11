"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Headphones, FileText, Activity, Bot } from "lucide-react";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

interface Agent {
  id: string;
  name: string;
  type: string;
  status: string;
  description: string;
  model: string;
  total_runs: number;
  total_decisions: number;
  total_value_created: number;
  accuracy_rate: number;
  created_at: number;
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
    color: "text-blue-400",
    bg: "bg-blue-500/10",
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
};

export function AgentCard({ agent }: AgentCardProps) {
  const config = typeConfig[agent.type] || {
    icon: Bot,
    label: agent.type,
    color: "text-zinc-400",
    bg: "bg-zinc-500/10",
  };
  const Icon = config.icon;

  const roi =
    agent.total_value_created > 0
      ? (agent.total_value_created / Math.max(agent.total_runs * 0.05, 1)).toFixed(
          0
        )
      : "—";

  return (
    <Card className="bg-[#111118] border-[#1a1a24] hover:border-[#2a2a34] transition-colors">
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
              <h3 className="text-sm font-semibold text-white">
                {agent.name}
              </h3>
              <p className="text-[11px] text-zinc-500 font-mono">
                {agent.model}
              </p>
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
                  : "bg-zinc-500"
              )}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {agent.description && (
          <p className="text-xs text-zinc-500 mb-3 line-clamp-2">
            {agent.description}
          </p>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#0a0a0f] rounded-lg p-2.5">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider">
              Total Runs
            </p>
            <p className="text-sm font-semibold text-white mt-0.5">
              {agent.total_runs.toLocaleString()}
            </p>
          </div>
          <div className="bg-[#0a0a0f] rounded-lg p-2.5">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider">
              Decisions
            </p>
            <p className="text-sm font-semibold text-white mt-0.5">
              {agent.total_decisions}
            </p>
          </div>
          <div className="bg-[#0a0a0f] rounded-lg p-2.5">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider">
              Accuracy
            </p>
            <p className="text-sm font-semibold text-white mt-0.5">
              {formatPercent(agent.accuracy_rate)}
            </p>
          </div>
          <div className="bg-[#0a0a0f] rounded-lg p-2.5">
            <p className="text-[10px] text-zinc-600 uppercase tracking-wider">
              Value Created
            </p>
            <p className="text-sm font-semibold text-emerald-400 mt-0.5">
              {formatCurrency(agent.total_value_created)}
            </p>
          </div>
        </div>

        {/* Activity sparkline placeholder — represented as simple bars */}
        <div className="mt-3 pt-3 border-t border-zinc-800/50">
          <div className="flex items-end gap-[3px] h-5">
            {Array.from({ length: 14 }).map((_, i) => {
              const height =
                20 + Math.sin(i * 0.8 + agent.total_runs * 0.01) * 40 + Math.random() * 20;
              return (
                <div
                  key={i}
                  className={cn(
                    "flex-1 rounded-[2px] transition-all",
                    config.bg.replace("/10", "/30")
                  )}
                  style={{ height: `${Math.max(height, 15)}%` }}
                />
              );
            })}
          </div>
          <p className="text-[10px] text-zinc-600 mt-1">Last 14 days activity</p>
        </div>
      </CardContent>
    </Card>
  );
}
