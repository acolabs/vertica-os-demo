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
  medium: "bg-blue-500/10 text-blue-400",
  low: "bg-zinc-500/10 text-zinc-400",
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400",
  approved: "bg-emerald-500/10 text-emerald-400",
  rejected: "bg-rose-500/10 text-rose-400",
  auto_resolved: "bg-blue-500/10 text-blue-400",
  escalated: "bg-purple-500/10 text-purple-400",
};

export function DecisionsTable({ decisions }: { decisions: Decision[] }) {
  return (
    <Card className="bg-[#111118] border-[#1a1a24]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-zinc-300">Agent Decisions ({decisions.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-[#1a1a24] hover:bg-transparent">
              <TableHead className="text-zinc-500 text-xs">Severity</TableHead>
              <TableHead className="text-zinc-500 text-xs">Account</TableHead>
              <TableHead className="text-zinc-500 text-xs">Title</TableHead>
              <TableHead className="text-zinc-500 text-xs">Impact</TableHead>
              <TableHead className="text-zinc-500 text-xs">Confidence</TableHead>
              <TableHead className="text-zinc-500 text-xs">Status</TableHead>
              <TableHead className="text-zinc-500 text-xs">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {decisions.map((d) => (
              <TableRow key={d.id} className="border-[#1a1a24] hover:bg-[#0f0f17]">
                <TableCell>
                  <Badge variant="outline" className={cn("text-[10px] border-transparent capitalize", severityColors[d.severity])}>
                    {d.severity}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-zinc-300">{d.account_name || "—"}</TableCell>
                <TableCell className="text-xs text-zinc-300 max-w-[240px] truncate">{d.title}</TableCell>
                <TableCell className="text-xs text-zinc-400">
                  {d.impact_dollars != null ? formatCurrency(d.impact_dollars) : "—"}
                </TableCell>
                <TableCell className="text-xs text-zinc-400">
                  {d.confidence != null ? `${(d.confidence * 100).toFixed(0)}%` : "—"}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn("text-[10px] border-transparent capitalize", statusColors[d.status])}>
                    {d.status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-xs text-zinc-500">
                  {new Date(d.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </TableCell>
              </TableRow>
            ))}
            {decisions.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-zinc-500 text-sm py-8">
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
