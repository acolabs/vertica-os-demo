"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  AlertTriangle,
  Calendar,
  Clock,
  Shield,
  Lightbulb,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  PortfolioCompany,
  HealthStatus,
  MetricStatus,
  Trend,
  EscalationLevel,
} from "@/app/api/portfolio/route";

const statusColors: Record<HealthStatus, string> = {
  GREEN: "text-emerald-400",
  YELLOW: "text-amber-400",
  RED: "text-red-400",
};

const statusBgs: Record<HealthStatus, string> = {
  GREEN: "bg-emerald-400",
  YELLOW: "bg-amber-400",
  RED: "bg-red-400",
};

const metricStatusColors: Record<MetricStatus, string> = {
  green: "text-emerald-400",
  yellow: "text-amber-400",
  red: "text-red-400",
};

const metricStatusBg: Record<MetricStatus, string> = {
  green: "bg-emerald-400/10 border-emerald-500/20",
  yellow: "bg-amber-400/10 border-amber-500/20",
  red: "bg-red-400/10 border-red-500/20",
};

const trendIcons: Record<Trend, React.ReactNode> = {
  up: <TrendingUp className="w-3.5 h-3.5" />,
  down: <TrendingDown className="w-3.5 h-3.5" />,
  flat: <Minus className="w-3.5 h-3.5" />,
};

const trendLabels: Record<Trend, string> = {
  up: "Improving",
  down: "Declining",
  flat: "Stable",
};

const escalationColors: Record<EscalationLevel, string> = {
  L0: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
  L1: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  L2: "bg-orange-500/15 text-orange-400 border-orange-500/20",
  L3: "bg-red-500/15 text-red-400 border-red-500/20",
  L4: "bg-rose-500/15 text-rose-400 border-rose-500/20",
};

function formatArr(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

interface Props {
  company: PortfolioCompany | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CompanyDetailDrawer({ company, open, onOpenChange }: Props) {
  if (!company) return null;

  const anomalyKpis = company.kpis.filter((k) => k.status === "red");

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[520px] bg-[var(--surface)] border-[var(--card-border)] p-0 flex flex-col glass"
      >
        <SheetHeader className="px-5 pt-5 pb-4 border-b border-[var(--card-border)]/50">
          <div className="flex items-center gap-3 mb-1">
            <div
              className={cn(
                "w-3 h-3 rounded-full shrink-0",
                statusBgs[company.healthStatus]
              )}
            />
            <SheetTitle className="text-lg font-semibold text-[var(--text-primary)]">
              {company.name}
            </SheetTitle>
            {company.escalationLevel && (
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] border px-1.5 py-0",
                  escalationColors[company.escalationLevel]
                )}
              >
                {company.escalationLevel}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-[9px] px-1.5 py-0 border-[var(--card-border)] text-[var(--text-muted)]"
            >
              {company.industry}
            </Badge>
            <Badge
              variant="outline"
              className="text-[9px] px-1.5 py-0 border-[var(--card-border)] text-[var(--text-muted)]"
            >
              {company.stage}
            </Badge>
            <span
              className={cn(
                "text-xs font-semibold uppercase",
                statusColors[company.healthStatus]
              )}
            >
              {company.healthStatus}
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-[var(--text-primary)]">
              {formatArr(company.arr)}
            </span>
            <span className="text-xs text-[var(--text-muted)]">ARR</span>
          </div>
          <SheetDescription className="sr-only">
            Detailed metrics for {company.name}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="px-5 py-4 space-y-5">
            {/* Full KPI Table */}
            <section>
              <h3 className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Activity className="w-3 h-3" />
                Key Performance Indicators
              </h3>
              <div className="space-y-1.5">
                {company.kpis.map((kpi) => (
                  <div
                    key={kpi.label}
                    className={cn(
                      "flex items-center justify-between p-2.5 rounded-lg border",
                      metricStatusBg[kpi.status]
                    )}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs text-[var(--text-secondary)] font-medium">
                        {kpi.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span
                          className={cn(
                            "text-sm font-bold",
                            metricStatusColors[kpi.status]
                          )}
                        >
                          {kpi.displayValue}
                        </span>
                        <span className="text-[9px] text-[var(--text-muted)] ml-1.5">
                          target {kpi.displayTarget}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "flex items-center gap-0.5 text-[10px]",
                          kpi.trend === "up" && "text-emerald-400",
                          kpi.trend === "down" && "text-red-400",
                          kpi.trend === "flat" && "text-[var(--text-muted)]"
                        )}
                      >
                        {trendIcons[kpi.trend]}
                        <span>{trendLabels[kpi.trend]}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[8px] px-1 py-0 uppercase font-bold border",
                          kpi.status === "green" &&
                            "text-emerald-400 border-emerald-500/30",
                          kpi.status === "yellow" &&
                            "text-amber-400 border-amber-500/30",
                          kpi.status === "red" &&
                            "text-red-400 border-red-500/30"
                        )}
                      >
                        {kpi.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Anomaly Alerts */}
            {anomalyKpis.length > 0 && (
              <section>
                <h3 className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3 h-3 text-red-400" />
                  Threshold Breaches
                </h3>
                <div className="space-y-1.5">
                  {anomalyKpis.map((kpi) => (
                    <div
                      key={kpi.label}
                      className="bg-red-500/5 border border-red-500/20 rounded-lg p-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-red-400">
                          {kpi.label} at {kpi.displayValue}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[8px] px-1 py-0 border-red-500/30 text-red-400"
                        >
                          BREACH
                        </Badge>
                      </div>
                      <p className="text-[10px] text-[var(--text-muted)] mt-1">
                        Below target of {kpi.displayTarget} for {company.stage}{" "}
                        companies
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <Separator className="bg-[var(--card-border)]/50" />

            {/* Escalation History */}
            <section>
              <h3 className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Shield className="w-3 h-3" />
                Escalation History
              </h3>
              {company.escalationHistory.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)] italic">
                  No escalations recorded
                </p>
              ) : (
                <div className="space-y-1.5">
                  {company.escalationHistory.map((entry, i) => (
                    <div
                      key={i}
                      className="bg-[var(--card-bg)] border border-[var(--card-border)]/50 rounded-lg p-2.5"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[9px] border px-1.5 py-0",
                            escalationColors[entry.level]
                          )}
                        >
                          {entry.level}
                        </Badge>
                        <span className="text-[10px] text-[var(--text-muted)]">
                          {entry.date}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {entry.reason}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Recommended Interventions */}
            <section>
              <h3 className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-3 h-3" />
                Recommended Interventions
              </h3>
              <div className="space-y-1.5">
                {company.recommendedInterventions.map((intervention, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 bg-[var(--card-bg)] border border-[var(--card-border)]/50 rounded-lg p-2.5"
                  >
                    <span className="text-[10px] font-bold text-[var(--text-muted)] mt-px shrink-0">
                      {i + 1}.
                    </span>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {intervention}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <Separator className="bg-[var(--card-border)]/50" />

            {/* Operating Cadence */}
            <section>
              <h3 className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                Operating Cadence
              </h3>
              <div className="bg-[var(--card-bg)] border border-[var(--card-border)]/50 rounded-lg p-2.5">
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {company.operatingCadence}
                </p>
              </div>
            </section>

            {/* Last Board Pack */}
            <section>
              <h3 className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Calendar className="w-3 h-3" />
                Last Board Pack
              </h3>
              <div className="bg-[var(--card-bg)] border border-[var(--card-border)]/50 rounded-lg p-2.5">
                <p className="text-xs text-[var(--text-secondary)]">
                  {company.lastBoardPackDate}
                </p>
              </div>
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
