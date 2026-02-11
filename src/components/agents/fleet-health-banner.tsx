"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, CheckCircle } from "lucide-react";

interface Agent {
  id: string;
  status: string;
  total_runs: number;
  total_value_created: number;
  accuracy_rate: number;
}

interface FleetHealthBannerProps {
  agents: Agent[];
}

export function FleetHealthBanner({ agents }: FleetHealthBannerProps) {
  const activeCount = agents.filter((a) => a.status === "active").length;
  const totalRuns = agents.reduce((sum, a) => sum + (a.total_runs || 0), 0);
  const avgAccuracy =
    agents.length > 0
      ? agents.reduce((sum, a) => sum + (a.accuracy_rate || 0), 0) /
        agents.length
      : 0;
  const totalValue = agents.reduce(
    (sum, a) => sum + (a.total_value_created || 0),
    0
  );
  const allHealthy = agents.every((a) => a.status === "active");

  return (
    <Card className="bg-[#111118] border-[#1a1a24]">
      <CardContent className="py-4 px-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              {allHealthy ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : (
                <Activity className="w-4 h-4 text-amber-400" />
              )}
              <span className="text-sm font-medium text-white">
                Fleet Status
              </span>
            </div>
            <div className="h-4 w-px bg-zinc-800" />
            <div className="flex items-center gap-4 text-sm">
              <span className="text-zinc-400">
                <span className="text-emerald-400 font-semibold">
                  {activeCount}
                </span>{" "}
                agents active
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">
                <span className="text-white font-semibold">
                  {totalRuns.toLocaleString()}
                </span>{" "}
                total runs
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">
                <span className="text-white font-semibold">
                  {avgAccuracy.toFixed(1)}%
                </span>{" "}
                avg accuracy
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">
                <span className="text-emerald-400 font-semibold">
                  ${(totalValue / 1_000_000).toFixed(1)}M
                </span>{" "}
                value created
              </span>
            </div>
          </div>
          {allHealthy && (
            <span className="flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              All Healthy
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
