"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Headphones, FileText, Activity, Bot, TrendingUp } from "lucide-react";
import { cn, formatPercent } from "@/lib/utils";

interface Agent {
  id: string;
  name: string;
  type: string;
  status: string;
  total_runs: number;
  total_decisions: number;
  total_value_created: number;
  accuracy_rate: number;
}

interface AgentMiniCardProps {
  agents: Agent[];
}

const typeConfig: Record<string, { icon: typeof Shield; label: string; color: string }> = {
  nrr: { icon: Shield, label: "NRR", color: "text-emerald-400" },
  support: { icon: Headphones, label: "Support", color: "text-[var(--primary)]" },
  board_pack: { icon: FileText, label: "Board Pack", color: "text-purple-400" },
  pipeline: { icon: Activity, label: "Pipeline", color: "text-amber-400" },
  revenue_cadence: { icon: TrendingUp, label: "Revenue Cadence", color: "text-emerald-400" },
  support_deflection: { icon: Headphones, label: "Support", color: "text-sky-400" },
};

export function AgentMiniCards({ agents }: AgentMiniCardProps) {
  return (
    <Card className="bg-[var(--card-bg)] border-[var(--card-border)] glass-card shadow-premium">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-[var(--primary)]" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Active Agents</h3>
          </div>
          <Link
            href="/agents"
            className="text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            View all →
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-0 max-h-[280px] overflow-y-auto">
        {agents.map((agent) => {
          const config = typeConfig[agent.type] || {
            icon: Bot,
            label: agent.type,
            color: "text-[var(--text-muted)]",
          };
          const Icon = config.icon;

          return (
            <Link key={agent.id} href="/agents">
              <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-[var(--card-hover)] transition-colors group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Icon className={cn("w-4 h-4", config.color)} />
                    <span
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[var(--card-bg)]",
                        agent.status === "active"
                          ? "bg-emerald-500"
                          : agent.status === "paused"
                          ? "bg-amber-500"
                          : "bg-[var(--text-muted)]"
                      )}
                    />
                    {agent.status === "active" && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full agent-pulse" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                      {agent.name}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)]">
                      {agent.total_runs} runs • {formatPercent(agent.accuracy_rate)} accuracy
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] border",
                    config.color,
                    "border-transparent"
                  )}
                >
                  {config.label}
                </Badge>
              </div>
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
