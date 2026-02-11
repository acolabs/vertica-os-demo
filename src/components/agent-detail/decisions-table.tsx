"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn, formatCurrency } from "@/lib/utils";

interface Decision {
  id: string;
  severity: string;
  status: string;
  title: string;
  account_name: string | null;
  impact_dollars: number | null;
  confidence: number | null;
  created_at: number;
}

const severityColors: Record<string, string> = {
  critical: "bg-rose-500/10 text-rose-400",
  high: "bg-amber-500/10 text-amber-400",
  medium: "bg-[var(--primary-10)] text-[var(--primary)]",
  low: "bg-zinc-500/10 text-[var(--text-secondary)]",
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400",
  approved: "bg-emerald-500/10 text-emerald-400",
  rejected: "bg-rose-500/10 text-rose-400",
  auto_resolved: "bg-[var(--primary-10)] text-[var(--primary)]",
  escalated: "bg-purple-500/10 text-purple-400",
};

export function DecisionsTable({ decisions }: { decisions: Decision[] }) {
  return (
    <Card className="bg-[var(--card-bg)] border-[var(--card-border)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">Agent Decisions ({decisions.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-[var(--card-border)] hover:bg-transparent">
              <TableHead className="text-[var(--text-muted)] text-xs">Severity</TableHead>
              <TableHead className="text-[var(--text-muted)] text-xs">Account</TableHead>
              <TableHead className="text-[var(--text-muted)] text-xs">Title</TableHead>
              <TableHead className="text-[var(--text-muted)] text-xs">Impact</TableHead>
              <TableHead className="text-[var(--text-muted)] text-xs">Confidence</TableHead>
              <TableHead className="text-[var(--text-muted)] text-xs">Status</TableHead>
              <TableHead className="text-[var(--text-muted)] text-xs">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {decisions.map((d) => (
              <TableRow key={d.id} className="border-[var(--card-border)] hover:bg-[var(--card-hover)]">
                <TableCell>
                  <Badge variant="outline" className={cn("text-[10px] border-transparent capitalize", severityColors[d.severity])}>
                    {d.severity}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-[var(--text-secondary)]">{d.account_name || "—"}</TableCell>
                <TableCell className="text-xs text-[var(--text-secondary)] max-w-[240px] truncate">{d.title}</TableCell>
                <TableCell className="text-xs text-[var(--text-secondary)]">
                  {d.impact_dollars != null ? formatCurrency(d.impact_dollars) : "—"}
                </TableCell>
                <TableCell className="text-xs text-[var(--text-secondary)]">
                  {d.confidence != null ? `${(d.confidence * 100).toFixed(0)}%` : "—"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("text-[10px] border-transparent capitalize", statusColors[d.status])}>
                    {d.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-[var(--text-muted)]">
                  {new Date(d.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </TableCell>
              </TableRow>
            ))}
            {decisions.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-[var(--text-muted)] text-sm py-8">
                  No decisions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
