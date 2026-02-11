"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Headphones, FileText, Activity, Bot } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Agent {
  id: string;
  name: string;
  type: string;
  status: string;
  model: string;
  created_at: number;
}

const typeConfig: Record<string, { icon: typeof Shield; label: string; color: string; bg: string }> = {
  nrr: { icon: Shield, label: "NRR", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  support: { icon: Headphones, label: "Support", color: "text-blue-400", bg: "bg-blue-500/10" },
  board_pack: { icon: FileText, label: "Board Pack", color: "text-purple-400", bg: "bg-purple-500/10" },
  pipeline: { icon: Activity, label: "Pipeline", color: "text-amber-400", bg: "bg-amber-500/10" },
};

export function AgentHeader({ agent }: { agent: Agent }) {
  const config = typeConfig[agent.type] || { icon: Bot, label: agent.type, color: "text-zinc-400", bg: "bg-zinc-500/10" };
  const Icon = config.icon;
  const daysAgo = Math.floor((Date.now() - agent.created_at) / (1000 * 60 * 60 * 24));

  return (
    <div className="space-y-4">
      <Link href="/agents" className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Fleet
      </Link>
      <div className="flex items-start gap-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", config.bg)}>
          <Icon className={cn("w-6 h-6", config.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-white">{agent.name}</h1>
            <Badge variant="outline" className={cn("text-xs border-transparent", config.color, config.bg)}>
              {config.label}
            </Badge>
            <div className="flex items-center gap-1.5">
              <span className={cn(
                "w-2.5 h-2.5 rounded-full",
                agent.status === "active" ? "bg-emerald-500" : agent.status === "paused" ? "bg-amber-500" : "bg-zinc-500"
              )} />
              <span className="text-sm text-zinc-400 capitalize">{agent.status}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm text-zinc-500 font-mono">{agent.model}</span>
            <span className="text-zinc-700">·</span>
            <span className="text-sm text-zinc-500">Deployed {daysAgo} days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}
