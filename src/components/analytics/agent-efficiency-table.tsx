"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface AgentStat {
  id: string;
  name: string;
  type: string;
  total_runs: number;
  total_decisions: number;
  total_value_created: number;
  accuracy_rate: number;
}

interface RunStats {
  total_runs: number;
  completed: number;
  failed: number;
  avg_duration_ms: number;
  total_tokens: number;
  total_cost: number;
}

interface AgentEfficiencyTableProps {
  agents: AgentStat[];
  runStats: RunStats;
}

const typeColors: Record<string, string> = {
  nrr: "bg-emerald-500/10 text-emerald-400",
  support: "bg-[var(--primary-10)] text-[var(--primary)]",
  board_pack: "bg-purple-500/10 text-purple-400",
  pipeline: "bg-amber-500/10 text-amber-400",
};

const typeLabels: Record<string, string> = {
  nrr: "NRR",
  support: "Support",
  board_pack: "Board Pack",
  pipeline: "Pipeline",
};

export function AgentEfficiencyTable({ agents, runStats }: AgentEfficiencyTableProps) {
  const totalCost = runStats?.total_cost || 0;
  const avgDuration = runStats?.avg_duration_ms || 0;
  const successRate = runStats?.total_runs
    ? ((runStats.completed / runStats.total_runs) * 100)
    : 0;

  return (
    <Card className="border-[var(--card-border)] bg-[var(--card-bg)] glass-card shadow-premium">
      <CardHeader>
        <CardTitle className="text-[var(--text-primary)]">Agent Performance Metrics</CardTitle>
        <CardDescription>
          {agents.length} agents · {runStats?.total_runs?.toLocaleString() || 0} total runs · Overall success rate: {successRate.toFixed(1)}%
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-[var(--card-border)] hover:bg-transparent">
                <TableHead className="text-[var(--text-secondary)]">Agent Name</TableHead>
                <TableHead className="text-[var(--text-secondary)]">Type</TableHead>
                <TableHead className="text-[var(--text-secondary)] text-right">Total Runs</TableHead>
                <TableHead className="text-[var(--text-secondary)] text-right">Success Rate</TableHead>
                <TableHead className="text-[var(--text-secondary)] text-right">Avg Duration</TableHead>
                <TableHead className="text-[var(--text-secondary)] text-right">Total Cost</TableHead>
                <TableHead className="text-[var(--text-secondary)] text-right">Value Created</TableHead>
                <TableHead className="text-[var(--text-secondary)] text-right">ROI</TableHead>
                <TableHead className="text-[var(--text-secondary)] text-right">Decisions</TableHead>
                <TableHead className="text-[var(--text-secondary)] text-right">Accuracy</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agents.map((agent) => {
                const agentCostShare = agents.length > 0
                  ? (agent.total_runs / (runStats?.total_runs || 1)) * totalCost
                  : 0;
                const roi = agentCostShare > 0
                  ? Math.round(agent.total_value_created / agentCostShare)
                  : 0;
                const agentDuration = avgDuration;

                return (
                  <TableRow key={agent.id} className="border-[var(--card-border)] hover:bg-[var(--surface)]">
                    <TableCell className="font-medium text-[var(--text-primary)]">{agent.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={cn("text-xs", typeColors[agent.type] || "bg-zinc-500/10 text-[var(--text-secondary)]")}
                      >
                        {typeLabels[agent.type] || agent.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-[var(--text-secondary)]">
                      {agent.total_runs.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={cn(
                          "font-medium",
                          agent.accuracy_rate >= 0.9
                            ? "text-emerald-400"
                            : agent.accuracy_rate >= 0.75
                            ? "text-amber-400"
                            : "text-rose-400"
                        )}
                      >
                        {(agent.accuracy_rate * 100).toFixed(0)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-[var(--text-secondary)]">
                      {agentDuration < 60000
                        ? `${(agentDuration / 1000).toFixed(1)}s`
                        : `${(agentDuration / 60000).toFixed(1)}m`}
                    </TableCell>
                    <TableCell className="text-right text-[var(--text-secondary)]">
                      ${agentCostShare.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-emerald-400 font-medium">
                      {agent.total_value_created >= 1000
                        ? `$${(agent.total_value_created / 1000).toFixed(0)}K`
                        : `$${agent.total_value_created.toLocaleString()}`}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-bold text-emerald-400">
                        {roi > 0 ? `${roi.toLocaleString()}x` : "—"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-[var(--text-secondary)]">
                      {agent.total_decisions}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={cn(
                          "font-medium",
                          agent.accuracy_rate >= 0.9
                            ? "text-emerald-400"
                            : agent.accuracy_rate >= 0.75
                            ? "text-amber-400"
                            : "text-rose-400"
                        )}
                      >
                        {(agent.accuracy_rate * 100).toFixed(0)}%
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
