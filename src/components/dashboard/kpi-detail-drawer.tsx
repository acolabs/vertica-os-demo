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
import {
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Headphones,
  Clock,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import { cn, formatCurrency, timeAgo } from "@/lib/utils";
import Link from "next/link";

export type KpiType = "churn_prevented" | "support_deflection" | "hours_saved" | "agent_roi";

interface SubMetric {
  label: string;
  value: string;
}

interface LinkedArea {
  label: string;
  href: string;
}

interface RecentDecision {
  id: string;
  title: string;
  type: string;
  agent_id: string;
  org_id: string;
  impact_dollars: number;
  status: string;
  severity: string;
  created_at: number;
  account_name: string;
}

export interface KpiDrawerData {
  type: KpiType;
  title: string;
  value: string;
  trend: "up" | "down" | "flat";
  trendLabel: string;
  accentColor: string;
  icon: React.ReactNode;
  calculationBreakdown: string;
  subMetrics: SubMetric[];
  linkedAreas: LinkedArea[];
  recentDecisions: RecentDecision[];
}

interface KpiDetailDrawerProps {
  data: KpiDrawerData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const severityColors: Record<string, string> = {
  critical: "bg-rose-500/15 text-rose-400 border-rose-500/20",
  high: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  medium: "bg-[var(--primary-10)] text-[var(--primary)] border-[var(--primary)]/20",
  low: "bg-zinc-500/15 text-[var(--text-secondary)] border-zinc-500/20",
};

export function KpiDetailDrawer({ data, open, onOpenChange }: KpiDetailDrawerProps) {
  if (!data) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[480px] bg-[var(--surface)] border-[var(--card-border)] p-0 flex flex-col glass"
      >
        <SheetHeader className="px-5 pt-5 pb-4 border-b border-[var(--card-border)]/50">
          <div className="flex items-center gap-2 mb-1">
            <div className={cn("p-1.5 rounded-lg bg-[var(--card-bg)]", data.accentColor)}>
              {data.icon}
            </div>
            <SheetTitle className="text-sm font-medium text-[var(--text-primary)] uppercase tracking-wider">
              {data.title}
            </SheetTitle>
          </div>
          <div className="flex items-end gap-3 mt-2">
            <p className={cn("text-3xl font-bold tracking-tight", data.accentColor)}>
              {data.value}
            </p>
            <span
              className={cn(
                "flex items-center gap-0.5 text-xs font-medium pb-1",
                data.trend === "up" && "text-emerald-400",
                data.trend === "down" && "text-rose-400",
                data.trend === "flat" && "text-[var(--text-muted)]"
              )}
            >
              {data.trend === "up" && <TrendingUp className="w-3.5 h-3.5" />}
              {data.trend === "down" && <TrendingDown className="w-3.5 h-3.5" />}
              {data.trend === "flat" && <Minus className="w-3.5 h-3.5" />}
              {data.trendLabel}
            </span>
          </div>
          <SheetDescription className="text-xs text-[var(--text-muted)] mt-1 sr-only">
            Detailed breakdown of {data.title}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="px-5 py-4 space-y-6">
            {/* Calculation Breakdown */}
            <section>
              <h3 className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                How this is calculated
              </h3>
              <div className="bg-[var(--card-bg)] border border-[var(--card-border)]/50 rounded-lg p-3">
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {data.calculationBreakdown}
                </p>
              </div>
            </section>

            {/* Component Metrics */}
            <section>
              <h3 className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Component Metrics
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {data.subMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="bg-[var(--card-bg)] border border-[var(--card-border)]/50 rounded-lg p-3"
                  >
                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">
                      {metric.label}
                    </p>
                    <p className="text-sm font-semibold text-[var(--text-primary)]">
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Linked Areas */}
            <section>
              <h3 className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Related Areas
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.linkedAreas.map((area) => (
                  <Link
                    key={area.href}
                    href={area.href}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 transition-colors"
                  >
                    {area.label}
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                ))}
              </div>
            </section>

            {/* Recent Contributing Decisions */}
            <section>
              <h3 className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                Recent Contributing Decisions
              </h3>
              {data.recentDecisions.length === 0 ? (
                <p className="text-xs text-[var(--text-muted)]">No recent decisions</p>
              ) : (
                <div className="space-y-2">
                  {data.recentDecisions.map((decision) => (
                    <Link
                      key={decision.id}
                      href="/inbox"
                      className="block bg-[var(--card-bg)] border border-[var(--card-border)]/50 rounded-lg p-3 hover:border-[var(--primary)]/30 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-[9px] border px-1.5 py-0",
                                severityColors[decision.severity]
                              )}
                            >
                              {decision.severity}
                            </Badge>
                            <span className="text-[10px] text-[var(--text-muted)]">
                              {timeAgo(decision.created_at)}
                            </span>
                          </div>
                          <p className="text-xs text-[var(--text-primary)] font-medium truncate">
                            {decision.title}
                          </p>
                          {decision.account_name && (
                            <p className="text-[10px] text-[var(--text-muted)] mt-0.5">
                              {decision.account_name}
                            </p>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-xs font-semibold text-[var(--text-primary)]">
                            {decision.impact_dollars > 0
                              ? formatCurrency(decision.impact_dollars)
                              : "—"}
                          </p>
                          <ArrowRight className="w-3 h-3 text-[var(--text-muted)] ml-auto mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

// --- Helper to build drawer data from dashboard context ---

interface KpiValues {
  /** Quarterly cumulative churn prevented dollars */
  quarterlyChurn: number;
  supportDeflectionRate: number;
  /** Monthly cumulative operator hours saved */
  monthlyHours: number;
  agentCostDaily: number;
  quarterlyAgentCost: number;
  valueCreated: number;
  orgId: string;
}

interface DecisionForDrawer {
  id: string;
  title: string;
  type: string;
  agent_id: string;
  org_id: string;
  impact_dollars: number;
  status: string;
  severity: string;
  created_at: number;
  account_name: string;
}

export function buildKpiDrawerData(
  kpiType: KpiType,
  values: KpiValues,
  recentDecisions: DecisionForDrawer[]
): KpiDrawerData {
  const {
    quarterlyChurn,
    supportDeflectionRate,
    monthlyHours,
    agentCostDaily,
    quarterlyAgentCost,
    orgId,
  } = values;

  const quarterlyValue = quarterlyChurn;
  const roi = quarterlyAgentCost > 0 ? quarterlyValue / quarterlyAgentCost : 0;

  // Org-specific trend multipliers for variety
  const trendVariants: Record<string, Record<KpiType, string>> = {
    org_dsn: {
      churn_prevented: "+14%",
      support_deflection: "+6%",
      hours_saved: "+28",
      agent_roi: "+2.1x",
    },
    org_campspot: {
      churn_prevented: "+11%",
      support_deflection: "+9%",
      hours_saved: "+19",
      agent_roi: "+1.8x",
    },
    org_condocontrol: {
      churn_prevented: "+8%",
      support_deflection: "+5%",
      hours_saved: "+12",
      agent_roi: "+1.4x",
    },
    all: {
      churn_prevented: "+12%",
      support_deflection: "+7%",
      hours_saved: "+23",
      agent_roi: "+1.9x",
    },
  };

  const trends = trendVariants[orgId] || trendVariants["all"];

  switch (kpiType) {
    case "churn_prevented": {
      // Derive realistic sub-metrics
      const avgSaveValue = orgId === "org_dsn" ? 24200 : orgId === "org_campspot" ? 18900 : 14100;
      const accountsSaved = Math.round(quarterlyChurn / avgSaveValue);
      const saveRate = orgId === "org_dsn" ? 73 : orgId === "org_campspot" ? 68 : 61;
      const atRisk = Math.round(accountsSaved * (100 - saveRate) / saveRate);

      const relevantDecisions = recentDecisions
        .filter((d) => d.type === "renewal_risk" || d.type === "expansion")
        .slice(0, 3);

      return {
        type: "churn_prevented",
        title: "Churn Prevented",
        value: formatCurrency(quarterlyChurn),
        trend: "up",
        trendLabel: trends.churn_prevented,
        accentColor: "text-emerald-400",
        icon: <DollarSign className="w-4 h-4" />,
        calculationBreakdown:
          "Accounts flagged as at-risk by agents where intervention was successful × account ARR impact. Measured over the trailing 90-day window.",
        subMetrics: [
          { label: "Accounts Saved", value: String(accountsSaved) },
          { label: "Avg Save Value", value: formatCurrency(avgSaveValue) },
          { label: "Save Rate", value: `${saveRate}%` },
          { label: "Still At Risk", value: String(atRisk) },
        ],
        linkedAreas: [
          { label: "Decision Inbox", href: "/inbox?type=renewal_risk" },
          { label: "Analytics", href: "/analytics" },
        ],
        recentDecisions: relevantDecisions,
      };
    }

    case "support_deflection": {
      const totalTicketsMonthly = orgId === "org_dsn" ? 2840 : orgId === "org_campspot" ? 1920 : 1260;
      const autoResolved = Math.round(totalTicketsMonthly * (supportDeflectionRate / 100));
      const avgResTime = orgId === "org_dsn" ? "2.3 min" : orgId === "org_campspot" ? "1.8 min" : "3.1 min";
      const kbArticles = orgId === "org_dsn" ? 847 : orgId === "org_campspot" ? 523 : 312;

      const relevantDecisions = recentDecisions
        .filter((d) => d.type === "support_resolution")
        .slice(0, 3);

      return {
        type: "support_deflection",
        title: "Support Deflection",
        value: `${supportDeflectionRate.toFixed(1)}%`,
        trend: "up",
        trendLabel: trends.support_deflection,
        accentColor: "text-[var(--primary)]",
        icon: <Headphones className="w-4 h-4" />,
        calculationBreakdown:
          "Tickets auto-resolved by agents / total tickets processed. Includes auto-categorization, KB-matched responses, and fully automated resolutions.",
        subMetrics: [
          { label: "Auto-Resolved", value: autoResolved.toLocaleString() },
          { label: "Total Tickets", value: totalTicketsMonthly.toLocaleString() },
          { label: "Avg Resolution", value: avgResTime },
          { label: "KB Articles Used", value: kbArticles.toLocaleString() },
        ],
        linkedAreas: [
          { label: "Work Queues", href: "/queues" },
          { label: "Analytics", href: "/analytics" },
        ],
        recentDecisions: relevantDecisions,
      };
    }

    case "hours_saved": {
      const triageHrs = Math.round(monthlyHours * 0.35);
      const researchHrs = Math.round(monthlyHours * 0.28);
      const reportingHrs = Math.round(monthlyHours * 0.22);
      const commsHrs = monthlyHours - triageHrs - researchHrs - reportingHrs;

      const relevantDecisions = recentDecisions.slice(0, 3);

      return {
        type: "hours_saved",
        title: "Hours Saved",
        value: String(monthlyHours),
        trend: "up",
        trendLabel: trends.hours_saved,
        accentColor: "text-amber-400",
        icon: <Clock className="w-4 h-4" />,
        calculationBreakdown:
          "Estimated manual hours replaced by agent automation including ticket triage, data lookup, report generation, and customer communications.",
        subMetrics: [
          { label: "Triage Hours", value: String(triageHrs) },
          { label: "Research Hours", value: String(researchHrs) },
          { label: "Reporting Hours", value: String(reportingHrs) },
          { label: "Comms Hours", value: String(commsHrs) },
        ],
        linkedAreas: [
          { label: "Agents", href: "/agents" },
          { label: "Analytics", href: "/analytics" },
        ],
        recentDecisions: relevantDecisions,
      };
    }

    case "agent_roi": {
      const costPerDecision = recentDecisions.length > 0
        ? agentCostDaily * 30 / Math.max(recentDecisions.length * 3, 1)
        : agentCostDaily;
      const agentCount = orgId === "org_dsn" ? 3 : orgId === "org_campspot" ? 2 : 2;
      const revenuePerAgent = quarterlyValue / agentCount;

      const relevantDecisions = recentDecisions.slice(0, 3);

      return {
        type: "agent_roi",
        title: "Agent ROI",
        value: `${roi.toFixed(1)}x`,
        trend: roi > 1 ? "up" : "flat",
        trendLabel: roi > 1 ? trends.agent_roi : "Calculating...",
        accentColor: "text-purple-400",
        icon: <TrendingUp className="w-4 h-4" />,
        calculationBreakdown:
          "Total value created (churn prevented) over the quarter / total agent operating cost over the same period. Includes compute, API, and infrastructure costs.",
        subMetrics: [
          { label: "Quarterly Value", value: formatCurrency(quarterlyValue) },
          { label: "Quarterly Cost", value: formatCurrency(quarterlyAgentCost) },
          { label: "Cost per Decision", value: `$${costPerDecision.toFixed(2)}` },
          { label: "Value per Agent", value: formatCurrency(revenuePerAgent) },
        ],
        linkedAreas: [
          { label: "Analytics", href: "/analytics" },
          { label: "Audit Log", href: "/audit" },
        ],
        recentDecisions: relevantDecisions,
      };
    }
  }
}
