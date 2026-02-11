"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";
import { AgentValueDrawer } from "./agent-value-drawer";

interface Agent {
  id: string;
  name: string;
  type: string;
  status: string;
  total_runs: number;
  total_decisions: number;
  accuracy_rate: number;
  total_value_created: number;
  total_cost?: number;
}

interface AgentPerformanceTableProps {
  agents: Agent[];
}

const typeColors: Record<string, string> = {
  nrr: "bg-emerald-500/15 text-emerald-400",
  support: "bg-sky-500/15 text-sky-400",
  support_deflection: "bg-sky-500/15 text-sky-400",
  board_pack: "bg-purple-500/15 text-purple-400",
  pipeline: "bg-amber-500/15 text-amber-400",
  revenue_cadence: "bg-emerald-500/15 text-emerald-400",
};

const typeLabels: Record<string, string> = {
  nrr: "NRR",
  support: "Support",
  support_deflection: "Support Deflection",
  board_pack: "Board Pack",
  pipeline: "Pipeline",
  revenue_cadence: "Revenue Cadence",
};

export function AgentPerformanceTable({ agents }: AgentPerformanceTableProps) {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const sorted = [...agents].sort(
    (a, b) => b.total_value_created - a.total_value_created
  );

  return (
    <Card className="bg-[var(--card-bg)] border-[var(--card-border)] glass-card shadow-premium">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[var(--primary)]" />
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            Agent Performance Comparison
          </h3>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <Table>
          <TableHeader>
            <TableRow className="border-[var(--card-border)] hover:bg-transparent">
              <TableHead className="text-[var(--text-muted)] text-xs">Agent</TableHead>
              <TableHead className="text-[var(--text-muted)] text-xs">Type</TableHead>
              <TableHead className="text-[var(--text-muted)] text-xs">Status</TableHead>
              <TableHead className="text-[var(--text-muted)] text-xs text-right">Runs</TableHead>
              <TableHead className="text-[var(--text-muted)] text-xs text-right">Decisions</TableHead>
              <TableHead className="text-[var(--text-muted)] text-xs text-right">Accuracy</TableHead>
              <TableHead className="text-[var(--text-muted)] text-xs text-right">Value Created</TableHead>
              <TableHead className="text-[var(--text-muted)] text-xs text-right">Est. Cost</TableHead>
              <TableHead className="text-[var(--text-muted)] text-xs text-right">ROI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map((agent) => {
              // Use actual cost from DB; fall back to type-based estimates
              const costPerRun: Record<string, number> = {
                revenue_cadence: 3.50,
                nrr: 2.00,
                support_deflection: 1.00,
                support: 1.00,
                pipeline: 1.50,
                board_pack: 2.50,
              };
              const perRun = costPerRun[agent.type] || 2.00;
              const fallbackCost = agent.total_runs * perRun;
              const estimatedCost = (agent.total_cost && agent.total_cost > fallbackCost * 0.1)
                ? agent.total_cost
                : fallbackCost;
              const roi =
                estimatedCost > 0
                  ? agent.total_value_created / estimatedCost
                  : 0;

              return (
                <TableRow
                  key={agent.id}
                  className="border-[var(--card-border)] hover:bg-[var(--card-hover)] cursor-pointer"
                  onClick={() => setSelectedAgent(agent)}
                >
                  <TableCell className="font-medium text-[var(--text-primary)] text-sm">
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
                            : "bg-[var(--text-muted)]"
                        )}
                      />
                      <span className="text-xs text-[var(--text-secondary)] capitalize">
                        {agent.status}
                      </span>
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-[var(--text-secondary)] text-right">
                    {agent.total_runs.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm text-[var(--text-secondary)] text-right">
                    {agent.total_decisions}
                  </TableCell>
                  <TableCell className="text-sm text-right">
                    <span
                      className={cn(
                        agent.accuracy_rate >= 0.9
                          ? "text-emerald-400"
                          : agent.accuracy_rate >= 0.8
                          ? "text-amber-400"
                          : "text-rose-400"
                      )}
                    >
                      {formatPercent(agent.accuracy_rate * 100)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-emerald-400 font-semibold text-right">
                    {formatCurrency(agent.total_value_created)}
                  </TableCell>
                  <TableCell className="text-sm text-[var(--text-secondary)] text-right">
                    {formatCurrency(estimatedCost)}
                  </TableCell>
                  <TableCell className="text-sm text-right">
                    <span
                      className={cn(
                        "font-semibold",
                        roi >= 100
                          ? "text-emerald-400"
                          : roi >= 50
                          ? "text-[var(--primary)]"
                          : "text-[var(--text-muted)]"
                      )}
                    >
                      {roi > 0 ? `${roi.toFixed(1)}x` : "—"}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>

      <Sheet open={!!selectedAgent} onOpenChange={(open) => !open && setSelectedAgent(null)}>
        <SheetContent className="w-[500px] sm:max-w-[500px] bg-[var(--card-bg)] border-[var(--card-border)] overflow-y-auto">
          {selectedAgent && <AgentValueDrawer agent={selectedAgent} />}
        </SheetContent>
      </Sheet>
    </Card>
  );
}
