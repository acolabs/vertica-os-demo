"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Headphones, FileText, Activity, Bot } from "lucide-react";
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
  support: { icon: Headphones, label: "Support", color: "text-blue-400" },
  board_pack: { icon: FileText, label: "Board Pack", color: "text-purple-400" },
  pipeline: { icon: Activity, label: "Pipeline", color: "text-amber-400" },
};

export function AgentMiniCards({ agents }: AgentMiniCardProps) {
  return (
    <Card className="bg-[#111118] border-[#1a1a24]">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">Active Agents</h3>
          </div>
          <Link
            href="/agents"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            View all →
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        {agents.map((agent) => {
          const config = typeConfig[agent.type] || {
            icon: Bot,
            label: agent.type,
            color: "text-zinc-400",
          };
          const Icon = config.icon;

          return (
            <Link key={agent.id} href="/agents">
              <div className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-white/[0.03] transition-colors group cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Icon className={cn("w-4 h-4", config.color)} />
                    <span
                      className={cn(
                        "absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-[#111118]",
                        agent.status === "active"
                          ? "bg-emerald-500"
                          : agent.status === "paused"
                          ? "bg-amber-500"
                          : "bg-zinc-500"
                      )}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                      {agent.name}
                    </p>
                    <p className="text-[11px] text-zinc-600">
                      {agent.total_runs} runs • {formatPercent(agent.accuracy_rate)} accuracy
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] border",
                    config.color,
                    `bg-${config.color.replace("text-", "").replace("-400", "-500")}/10`,
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
