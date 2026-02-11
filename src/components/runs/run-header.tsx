"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Coins, Hash, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, formatDuration, formatCurrency } from "@/lib/utils";

interface RunHeaderProps {
  run: {
    id: string;
    agent_id: string;
    status: string;
    trigger_type: string;
    duration_ms: number;
    tokens_used: number;
    cost_usd: number;
    decisions_created: number;
  };
  agentName: string;
}

const statusColors: Record<string, string> = {
  completed: "bg-emerald-500/10 text-emerald-400",
  running: "bg-blue-500/10 text-blue-400",
  failed: "bg-rose-500/10 text-rose-400",
};

const triggerColors: Record<string, string> = {
  scheduled: "bg-zinc-500/10 text-zinc-400",
  manual: "bg-purple-500/10 text-purple-400",
  event: "bg-amber-500/10 text-amber-400",
};

export function RunHeader({ run, agentName }: RunHeaderProps) {
  const shortId = run.id.slice(0, 8);

  const stats = [
    { label: "Duration", value: formatDuration(run.duration_ms || 0), icon: Clock, color: "text-purple-400" },
    { label: "Tokens Used", value: (run.tokens_used || 0).toLocaleString(), icon: Hash, color: "text-blue-400" },
    { label: "Cost", value: formatCurrency(run.cost_usd || 0), icon: Coins, color: "text-zinc-400" },
    { label: "Decisions", value: String(run.decisions_created || 0), icon: Zap, color: "text-amber-400" },
  ];

  return (
    <div className="space-y-4">
      <Link href={`/agents/${run.agent_id}`} className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Agent
      </Link>

      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-white">Run {shortId}</h1>
            <Badge variant="outline" className={cn("text-xs border-transparent capitalize", statusColors[run.status])}>
              {run.status}
            </Badge>
            <span className="text-sm text-zinc-400">{agentName}</span>
            <Badge variant="outline" className={cn("text-[10px] border-transparent capitalize", triggerColors[run.trigger_type])}>
              {run.trigger_type}
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex items-center gap-2 bg-[#111118] border border-[#1a1a24] rounded-lg px-3 py-2">
              <Icon className={cn("w-3.5 h-3.5", stat.color)} />
              <span className="text-[11px] text-zinc-500">{stat.label}</span>
              <span className="text-sm font-semibold text-white">{stat.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
