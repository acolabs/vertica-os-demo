"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { DemoTooltip } from "@/components/demo-tooltip";
import { CheckCircle, AlertTriangle, XCircle, Target } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuotaEconomicsCardProps {
  quotaToOteRatio: number;
  basePercent: number;
  variablePercent: number;
  magicNumber: number;
}

function getRatioVerdict(ratio: number) {
  if (ratio >= 4 && ratio <= 6) {
    return {
      label: "Vertica Sweet Spot",
      icon: CheckCircle,
      color: "text-emerald-400",
      badgeBg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      borderColor: "border-l-emerald-500",
    };
  }
  if (ratio >= 3 && ratio < 4) {
    return {
      label: "Below optimal",
      icon: AlertTriangle,
      color: "text-amber-400",
      badgeBg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      borderColor: "border-l-amber-500",
    };
  }
  if (ratio > 6 && ratio <= 7) {
    return {
      label: "Slightly high",
      icon: AlertTriangle,
      color: "text-amber-400",
      badgeBg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      borderColor: "border-l-amber-500",
    };
  }
  if (ratio < 3) {
    return {
      label: "Below optimal",
      icon: AlertTriangle,
      color: "text-amber-400",
      badgeBg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      borderColor: "border-l-amber-500",
    };
  }
  return {
    label: "Overloaded",
    icon: XCircle,
    color: "text-red-400",
    badgeBg: "bg-red-500/15 text-red-400 border-red-500/30",
    borderColor: "border-l-red-500",
  };
}

function getSplitVerdict(basePercent: number) {
  if (basePercent >= 45 && basePercent <= 55) {
    return {
      label: "Industry standard",
      icon: CheckCircle,
      color: "text-emerald-400",
      badgeBg: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    };
  }
  if (basePercent >= 35 && basePercent <= 65) {
    return {
      label: "Acceptable range",
      icon: AlertTriangle,
      color: "text-amber-400",
      badgeBg: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    };
  }
  return {
    label: "Outside norm",
    icon: XCircle,
    color: "text-red-400",
    badgeBg: "bg-red-500/15 text-red-400 border-red-500/30",
  };
}

export function QuotaEconomicsCard({
  quotaToOteRatio,
  basePercent,
  variablePercent,
  magicNumber,
}: QuotaEconomicsCardProps) {
  const ratioVerdict = getRatioVerdict(quotaToOteRatio);
  const splitVerdict = getSplitVerdict(basePercent);
  const RatioIcon = ratioVerdict.icon;
  const SplitIcon = splitVerdict.icon;

  return (
    <Card
      className={cn(
        "glass-card shadow-premium border-l-4",
        ratioVerdict.borderColor
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
          <Target className="w-5 h-5 text-[var(--primary)]" />
          Quota Economics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quota-to-OTE Ratio */}
        <div className="space-y-1">
          <DemoTooltip
            content="Calculated client-side: Quota-to-OTE Ratio = Annual Quota / OTE. Industry benchmark is 4-6x (the '5x rule'). All quota economics are derived from the plan builder inputs — no external data sources."
            side="left"
          >
            <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
              Quota-to-OTE Ratio
            </span>
          </DemoTooltip>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-[var(--text-primary)]">
              {quotaToOteRatio.toFixed(1)}x
            </span>
            <Badge variant="outline" className={cn("gap-1", ratioVerdict.badgeBg)}>
              <RatioIcon className="w-3 h-3" />
              {ratioVerdict.label}
            </Badge>
          </div>
        </div>

        <Separator className="bg-[var(--card-border)]" />

        {/* Base/Variable Split */}
        <div className="space-y-1">
          <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
            Base / Variable Split
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-[var(--text-primary)]">
              {Math.round(basePercent)}/{Math.round(variablePercent)}
            </span>
            <Badge variant="outline" className={cn("gap-1", splitVerdict.badgeBg)}>
              <SplitIcon className="w-3 h-3" />
              {splitVerdict.label}
            </Badge>
          </div>
          {/* Visual bar */}
          <div className="flex h-2 rounded-full overflow-hidden mt-2">
            <div
              className="bg-[var(--primary)] transition-all duration-300"
              style={{ width: `${basePercent}%` }}
            />
            <div
              className="bg-[var(--primary)]/40 transition-all duration-300"
              style={{ width: `${variablePercent}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-[var(--text-muted)]">
            <span>Base {Math.round(basePercent)}%</span>
            <span>Variable {Math.round(variablePercent)}%</span>
          </div>
        </div>

        <Separator className="bg-[var(--card-border)]" />

        {/* Magic Number */}
        <div className="space-y-1">
          <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
            Magic Number
          </span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-[var(--text-primary)]">
              {magicNumber.toFixed(2)}
            </span>
            <span className="text-xs text-[var(--text-muted)]">
              Capital Efficiency
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
