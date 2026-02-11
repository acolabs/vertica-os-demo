"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, CheckCircle, Clock, DollarSign, TrendingUp } from "lucide-react";
import { cn, formatCurrency, formatDuration, formatPercent } from "@/lib/utils";

interface AgentStatsProps {
  totalRuns: number;
  successRate: number;
  avgDuration: number;
  totalCost: number;
  valueCreated: number;
}

export function AgentStats({ totalRuns, successRate, avgDuration, totalCost, valueCreated }: AgentStatsProps) {
  const stats = [
    {
      label: "Total Runs",
      value: totalRuns.toLocaleString(),
      icon: Activity,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      label: "Success Rate",
      value: formatPercent(successRate),
      icon: CheckCircle,
      color: successRate > 90 ? "text-emerald-400" : successRate > 75 ? "text-amber-400" : "text-rose-400",
      bg: successRate > 90 ? "bg-emerald-500/10" : successRate > 75 ? "bg-amber-500/10" : "bg-rose-500/10",
    },
    {
      label: "Avg Duration",
      value: formatDuration(avgDuration),
      icon: Clock,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
    {
      label: "Total Cost",
      value: formatCurrency(totalCost),
      icon: DollarSign,
      color: "text-zinc-400",
      bg: "bg-zinc-500/10",
    },
    {
      label: "Value Created",
      value: formatCurrency(valueCreated),
      icon: TrendingUp,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="bg-[#111118] border-[#1a1a24] py-4">
            <CardContent className="px-4 py-0">
              <div className="flex items-center gap-2 mb-2">
                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", stat.bg)}>
                  <Icon className={cn("w-3.5 h-3.5", stat.color)} />
                </div>
                <span className="text-[11px] text-zinc-500 uppercase tracking-wider">{stat.label}</span>
              </div>
              <p className={cn(
                "text-xl font-bold",
                stat.label === "Value Created" ? "text-emerald-400" : "text-white"
              )}>
                {stat.value}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
