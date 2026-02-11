"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

interface ScenarioOutputProps {
  baseSalary: number;
  ote: number;
  annualQuota: number;
  accelerator: number;
  teamSize: number;
  avgAttainment: number;
}

function calcComp(
  baseSalary: number,
  ote: number,
  attainmentPct: number,
  accelerator: number
): number {
  const variablePay = ote - baseSalary;
  if (attainmentPct <= 100) {
    return baseSalary + variablePay * (attainmentPct / 100);
  }
  // Above 100%: base variable + accelerated portion
  const aboveQuotaPct = attainmentPct - 100;
  return (
    baseSalary +
    variablePay +
    variablePay * (aboveQuotaPct / 100) * accelerator
  );
}

export function ScenarioOutput({
  baseSalary,
  ote,
  annualQuota,
  accelerator,
  teamSize,
  avgAttainment,
}: ScenarioOutputProps) {
  // Cost Analysis
  const compAtTarget = ote;
  const compAtAttainment = calcComp(baseSalary, ote, avgAttainment, accelerator);
  const totalTeamCostTarget = ote * teamSize;
  const totalTeamCostAttainment = compAtAttainment * teamSize;
  const revenuePerRep = annualQuota * (avgAttainment / 100);
  const totalRevenue = revenuePerRep * teamSize;
  const costOfRevenuePct =
    totalRevenue > 0 ? (totalTeamCostAttainment / totalRevenue) * 100 : 0;

  // Scenario Comparison
  const scenarios = [
    {
      name: "Conservative",
      attainment: 80,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
    },
    {
      name: "Target",
      attainment: 100,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      name: "Stretch",
      attainment: 120,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
  ].map((s) => {
    const comp = calcComp(baseSalary, ote, s.attainment, accelerator);
    const totalCost = comp * teamSize;
    const totalRev = annualQuota * (s.attainment / 100) * teamSize;
    const roi = totalCost > 0 ? totalRev / totalCost : 0;
    return { ...s, comp, totalCost, totalRev, roi };
  });

  // Best Practices checks
  const quotaToOte = ote > 0 ? annualQuota / ote : 0;
  const basePercent = ote > 0 ? (baseSalary / ote) * 100 : 0;
  const fiveXGood = quotaToOte >= 4 && quotaToOte <= 6;
  const fiftyFiftyGood = basePercent >= 45 && basePercent <= 55;
  const acceleratorGood = accelerator >= 1.5 && accelerator <= 2.0;

  return (
    <div className="space-y-4">
      {/* Cost Analysis Card */}
      <Card className="glass-card shadow-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
            <DollarSign className="w-5 h-5 text-[var(--primary)]" />
            Cost Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-xs text-[var(--text-muted)]">
                Comp per rep (at target)
              </span>
              <p className="text-lg font-bold text-[var(--text-primary)]">
                {fmt.format(compAtTarget)}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-[var(--text-muted)]">
                Comp per rep (at {avgAttainment}%)
              </span>
              <p className="text-lg font-bold text-[var(--text-primary)]">
                {fmt.format(compAtAttainment)}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-[var(--text-muted)]">
                Team cost (at target)
              </span>
              <p className="text-lg font-bold text-[var(--text-primary)]">
                {fmt.format(totalTeamCostTarget)}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-[var(--text-muted)]">
                Team cost (at {avgAttainment}%)
              </span>
              <p className="text-lg font-bold text-[var(--text-primary)]">
                {fmt.format(totalTeamCostAttainment)}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-[var(--text-muted)]">
                Revenue per rep
              </span>
              <p className="text-lg font-bold text-[var(--text-primary)]">
                {fmt.format(revenuePerRep)}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-[var(--text-muted)]">
                Cost of Revenue
              </span>
              <p
                className={cn(
                  "text-lg font-bold",
                  costOfRevenuePct <= 25
                    ? "text-emerald-400"
                    : costOfRevenuePct <= 35
                      ? "text-amber-400"
                      : "text-red-400"
                )}
              >
                {costOfRevenuePct.toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scenario Comparison */}
      <Card className="glass-card shadow-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
            <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
            Scenario Comparison
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {scenarios.map((s) => (
              <div
                key={s.name}
                className={cn(
                  "rounded-lg p-3 border border-[var(--card-border)]",
                  s.bgColor
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={cn("text-xs font-semibold", s.color)}>
                    {s.name}
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1.5 py-0 border-[var(--card-border)]"
                  >
                    {s.attainment}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block">
                      Total Cost
                    </span>
                    <span className="text-sm font-bold text-[var(--text-primary)]">
                      {fmt.format(s.totalCost)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block">
                      Total Revenue
                    </span>
                    <span className="text-sm font-bold text-[var(--text-primary)]">
                      {fmt.format(s.totalRev)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] block">
                      ROI
                    </span>
                    <span
                      className={cn(
                        "text-sm font-bold",
                        s.roi >= 4
                          ? "text-emerald-400"
                          : s.roi >= 3
                            ? "text-amber-400"
                            : "text-red-400"
                      )}
                    >
                      {s.roi.toFixed(1)}x
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vertica Best Practices */}
      <Card className="glass-card shadow-premium border-l-4 border-l-[var(--primary)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
            <Users className="w-5 h-5 text-[var(--primary)]" />
            Vertica Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <BestPracticeRow
            isGood={fiveXGood}
            title="The 5x Rule"
            description="Set quota at 5x OTE for optimal balance of rep motivation and company economics"
          />
          <Separator className="bg-[var(--card-border)]" />
          <BestPracticeRow
            isGood={fiftyFiftyGood}
            title="50/50 Split"
            description="Equal base/variable ratio attracts top talent while maintaining performance incentive"
          />
          <Separator className="bg-[var(--card-border)]" />
          <BestPracticeRow
            isGood={acceleratorGood}
            title="Accelerator Range"
            description="Accelerators above 100% attainment should be 1.5-2x to reward top performers without over-paying"
          />
        </CardContent>
      </Card>
    </div>
  );
}

function BestPracticeRow({
  isGood,
  title,
  description,
}: {
  isGood: boolean;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      {isGood ? (
        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
      ) : (
        <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
      )}
      <div>
        <p className="text-sm font-medium text-[var(--text-primary)]">
          {title}
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">{description}</p>
      </div>
    </div>
  );
}
