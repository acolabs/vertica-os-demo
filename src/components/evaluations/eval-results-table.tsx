"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EvalHistoryRow {
  agent: string;
  dataset: string;
  date: string;
  accuracy: number;
  status: "passed" | "review" | "failed";
  duration: string;
}

const statusConfig = {
  passed: {
    icon: CheckCircle,
    label: "Passed",
    className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  review: {
    icon: AlertTriangle,
    label: "Review",
    className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  failed: {
    icon: XCircle,
    label: "Failed",
    className: "bg-red-500/15 text-red-400 border-red-500/30",
  },
} as const;

export function EvalResultsTable({ rows }: { rows: EvalHistoryRow[] }) {
  return (
    <div className="glass-card shadow-premium rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-[var(--card-border)]">
            <TableHead className="text-[var(--text-muted)]">Agent</TableHead>
            <TableHead className="text-[var(--text-muted)]">Dataset</TableHead>
            <TableHead className="text-[var(--text-muted)]">Date</TableHead>
            <TableHead className="text-[var(--text-muted)]">Accuracy</TableHead>
            <TableHead className="text-[var(--text-muted)]">Status</TableHead>
            <TableHead className="text-[var(--text-muted)]">Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, i) => {
            const config = statusConfig[row.status];
            const StatusIcon = config.icon;
            return (
              <TableRow
                key={`${row.agent}-${row.date}-${i}`}
                className="border-[var(--card-border)] hover:bg-[var(--surface)]"
              >
                <TableCell className="font-medium text-[var(--text-primary)]">
                  {row.agent}
                </TableCell>
                <TableCell className="text-[var(--text-secondary)]">
                  {row.dataset}
                </TableCell>
                <TableCell className="text-[var(--text-muted)]">
                  {row.date}
                </TableCell>
                <TableCell className="text-[var(--text-primary)] font-mono">
                  {row.accuracy}%
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn("text-xs", config.className)}
                  >
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {config.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-[var(--text-muted)] font-mono">
                  {row.duration}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
