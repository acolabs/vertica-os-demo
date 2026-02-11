"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";

interface Agent {
  id: string;
  name: string;
  type: string;
  status: string;
  total_runs: number;
  total_decisions: number;
  accuracy_rate: number;
  total_value_created: number;
}

interface AgentPerformanceTableProps {
  agents: Agent[];
}

const typeColors: Record<string, string> = {
  nrr: "bg-emerald-500/15 text-emerald-400",
  support: "bg-blue-500/15 text-blue-400",
  board_pack: "bg-purple-500/15 text-purple-400",
  pipeline: "bg-amber-500/15 text-amber-400",
};

const typeLabels: Record<string, string> = {
  nrr: "NRR",
  support: "Support",
  board_pack: "Board Pack",
  pipeline: "Pipeline",
};

export function AgentPerformanceTable({ agents }: AgentPerformanceTableProps) {
  const sorted = [...agents].sort(
    (a, b) => b.total_value_created - a.total_value_created
  );

  return (
    <Card className="bg-[#111118] border-[#1a1a24]">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-400" />
          <h3 className="text-sm font-semibold text-white">
            Agent Performance Comparison
          </h3>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow className="border-[#1a1a24] hover:bg-transparent">
              <TableHead className="text-zinc-500 text-xs">Agent</TableHead>
              <TableHead className="text-zinc-500 text-xs">Type</TableHead>
              <TableHead className="text-zinc-500 text-xs">Status</TableHead>
              <TableHead className="text-zinc-500 text-xs text-right">
                Runs
              </TableHead>
              <TableHead className="text-zinc-500 text-xs text-right">
                Decisions
              </TableHead>
              <TableHead className="text-zinc-500 text-xs text-right">
                Accuracy
              </TableHead>
              <TableHead className="text-zinc-500 text-xs text-right">
                Value Created
              </TableHead>
              <TableHead className="text-zinc-500 text-xs text-right">
                Est. Cost
              </TableHead>
              <TableHead className="text-zinc-500 text-xs text-right">
                ROI
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((agent) => {
              const estimatedCost = agent.total_runs * 0.05;
              const roi =
                estimatedCost > 0
                  ? agent.total_value_created / estimatedCost
                  : 0;

              return (
                <TableRow
                  key={agent.id}
                  className="border-[#1a1a24] hover:bg-white/[0.03]"
                >
                  <TableCell className="font-medium text-white text-sm">
                    {agent.name}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] border-transparent",
                        typeColors[agent.type]
                      )}
                    >
                      {typeLabels[agent.type] || agent.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "w-2 h-2 rounded-full",
                          agent.status === "active"
                            ? "bg-emerald-500"
                            : agent.status === "paused"
                            ? "bg-amber-500"
                            : "bg-zinc-500"
                        )}
                      />
                      <span className="text-xs text-zinc-400 capitalize">
                        {agent.status}
                      </span>
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-300 text-right">
                    {agent.total_runs.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm text-zinc-300 text-right">
                    {agent.total_decisions}
                  </TableCell>
                  <TableCell className="text-sm text-right">
                    <span
                      className={cn(
                        agent.accuracy_rate >= 90
                          ? "text-emerald-400"
                          : agent.accuracy_rate >= 80
                          ? "text-amber-400"
                          : "text-rose-400"
                      )}
                    >
                      {formatPercent(agent.accuracy_rate)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-emerald-400 font-semibold text-right">
                    {formatCurrency(agent.total_value_created)}
                  </TableCell>
                  <TableCell className="text-sm text-zinc-400 text-right">
                    {formatCurrency(estimatedCost)}
                  </TableCell>
                  <TableCell className="text-sm text-right">
                    <span
                      className={cn(
                        "font-semibold",
                        roi >= 100
                          ? "text-emerald-400"
                          : roi >= 50
                          ? "text-blue-400"
                          : "text-zinc-400"
                      )}
                    >
                      {roi > 0 ? `${roi.toFixed(0)}x` : "—"}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
