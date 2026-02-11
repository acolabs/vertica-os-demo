"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  AlertTriangle,
  Target,
  TrendingUp,
  Headphones,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface ScorecardData {
  id: string;
  agent: string;
  evalName: string;
  dataset: string;
  runDate: string;
  accuracy: number;
  precision: number;
  recall: number;
  truePositives: number;
  falsePositives: number;
  missed: number;
  valueCaptured: number;
  valueMissed: number;
  totalOpportunity: number;
  status: "passed" | "review" | "failed";
  statusLabel: string;
  type: string;
  csatImpact?: string;
}

const typeIcons: Record<string, typeof Target> = {
  revenue: TrendingUp,
  support: Headphones,
  nrr: Shield,
};

function formatValue(v: number): string {
  if (v >= 1_000_000) return `$${(v / 1_000_000).toFixed(1)}M`;
  if (v >= 1_000) return `$${(v / 1_000).toFixed(0)}K`;
  return `$${v.toLocaleString()}`;
}

export function EvalScorecard({ data }: { data: ScorecardData }) {
  const Icon = typeIcons[data.type] || Target;
  const capturedPct =
    data.totalOpportunity > 0
      ? (data.valueCaptured / data.totalOpportunity) * 100
      : 100;

  return (
    <Card className="border-[var(--card-border)] bg-[var(--card-bg)] glass-card shadow-premium card-hover-lift">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[var(--surface)]">
              <Icon className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[var(--text-primary)] truncate">
                {data.agent}
              </p>
              <p className="text-xs text-[var(--text-muted)]">{data.evalName}</p>
            </div>
          </div>
          <Badge
            className={cn(
              "text-xs shrink-0",
              data.status === "passed" &&
                "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
              data.status === "review" &&
                "bg-amber-500/15 text-amber-400 border-amber-500/30",
              data.status === "failed" &&
                "bg-red-500/15 text-red-400 border-red-500/30"
            )}
            variant="outline"
          >
            {data.status === "passed" && (
              <CheckCircle className="w-3 h-3 mr-1" />
            )}
            {data.status === "review" && (
              <AlertTriangle className="w-3 h-3 mr-1" />
            )}
            {data.statusLabel}
          </Badge>
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-2">
          {data.dataset} · {data.runDate}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 2x3 metric grid */}
        <div className="grid grid-cols-3 gap-3">
          <MetricCell label="Accuracy" value={`${data.accuracy}%`} />
          <MetricCell label="Precision" value={`${data.precision}%`} />
          <MetricCell label="Recall" value={`${data.recall}%`} />
          <MetricCell
            label="True Positives"
            value={data.truePositives.toLocaleString()}
          />
          <MetricCell
            label="False Positives"
            value={data.falsePositives.toLocaleString()}
          />
          <MetricCell label="Missed" value={data.missed.toLocaleString()} />
        </div>

        {/* Value bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-[var(--text-secondary)]">
              Value Captured: {formatValue(data.valueCaptured)}
            </span>
            {data.valueMissed > 0 && (
              <span className="text-amber-400">
                Missed: {formatValue(data.valueMissed)}
              </span>
            )}
          </div>
          <div className="h-2.5 rounded-full bg-[var(--surface)] overflow-hidden flex">
            <div
              className="h-full bg-[var(--primary)] rounded-l-full transition-all"
              style={{ width: `${capturedPct}%` }}
            />
            {data.valueMissed > 0 && (
              <div
                className="h-full bg-amber-500/60 rounded-r-full transition-all"
                style={{ width: `${100 - capturedPct}%` }}
              />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[var(--surface)] px-3 py-2 text-center">
      <p className="text-xs text-[var(--text-muted)]">{label}</p>
      <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">
        {value}
      </p>
    </div>
  );
}
