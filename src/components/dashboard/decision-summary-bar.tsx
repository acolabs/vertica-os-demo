"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface DecisionCount {
  severity: string;
  count: number;
}

interface DecisionSummaryBarProps {
  decisionCounts: DecisionCount[];
  totalExposure: number;
}

const severityConfig: Record<string, { color: string; bg: string }> = {
  critical: { color: "text-rose-400", bg: "bg-rose-500/15 border-rose-500/20" },
  high: { color: "text-amber-400", bg: "bg-amber-500/15 border-amber-500/20" },
  medium: { color: "text-blue-400", bg: "bg-blue-500/15 border-blue-500/20" },
  low: { color: "text-zinc-400", bg: "bg-zinc-500/15 border-zinc-500/20" },
};

export function DecisionSummaryBar({
  decisionCounts,
  totalExposure,
}: DecisionSummaryBarProps) {
  const getCount = (severity: string) =>
    decisionCounts.find((d) => d.severity === severity)?.count ?? 0;

  const totalPending = decisionCounts.reduce((sum, d) => sum + d.count, 0);

  return (
    <Card className="bg-[#111118] border-[#1a1a24]">
      <CardContent className="py-4 px-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-white">
                {totalPending} Pending Decisions
              </span>
            </div>
            <div className="h-4 w-px bg-zinc-800" />
            <div className="flex items-center gap-2">
              {(["critical", "high", "medium", "low"] as const).map(
                (severity) => {
                  const count = getCount(severity);
                  if (count === 0) return null;
                  const config = severityConfig[severity];
                  return (
                    <Badge
                      key={severity}
                      variant="outline"
                      className={`${config.bg} ${config.color} border text-xs`}
                    >
                      {count} {severity.charAt(0).toUpperCase() + severity.slice(1)}
                    </Badge>
                  );
                }
              )}
            </div>
            <div className="h-4 w-px bg-zinc-800" />
            <span className="text-sm text-zinc-400">
              <span className="font-semibold text-rose-400">
                {formatCurrency(totalExposure)}
              </span>{" "}
              total exposure
            </span>
          </div>
          <Link
            href="/decisions"
            className="flex items-center gap-1.5 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            View Inbox
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
