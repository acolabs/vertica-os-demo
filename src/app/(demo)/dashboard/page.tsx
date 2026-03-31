"use client";

import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useOrg } from "@/lib/hooks/use-org";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { KpiDetailDrawer, KpiType, buildKpiDrawerData } from "@/components/dashboard/kpi-detail-drawer";
import { DecisionSummaryBar } from "@/components/dashboard/decision-summary-bar";
import { AgentMiniCards } from "@/components/dashboard/agent-mini-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { KpiTrendChart } from "@/components/dashboard/kpi-trend-chart";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DollarSign,
  Headphones,
  Clock,
  TrendingUp,
} from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { DemoTooltip } from "@/components/demo-tooltip";
import { ToastWrapper } from "@/components/toast-wrapper";
import { PageHeader } from "@/components/layout/page-header";

interface DashboardData {
  kpi: {
    nrr_percent: number;
    churn_rate_percent: number;
    churn_prevented_dollars: number;
    support_deflection_rate: number;
    operator_hours_saved: number;
    agent_cost_total: number;
    expansion_revenue: number;
  } | null;
  perOrgKpis?: Array<Record<string, unknown>>;
  quarterlyAgentCost: number;
  decisionCounts: Array<{ severity: string; count: number }>;
  agents: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    total_runs: number;
    total_decisions: number;
    total_value_created: number;
    accuracy_rate: number;
  }>;
  recentActivity: Array<{
    id: string;
    actor: string;
    action: string;
    resource_type: string;
    resource_id: string;
    details: string;
    created_at: number;
  }>;
  allAgents?: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    total_runs: number;
    total_decisions: number;
    total_value_created: number;
    accuracy_rate: number;
    org_id: string;
    org_name: string;
  }>;
  allActivity?: Array<{
    id: string;
    actor: string;
    action: string;
    resource_type: string;
    resource_id: string;
    details: string;
    created_at: number;
  }>;
  valueAtRisk: number;
  valueCreated: number;
  recentDecisions: Array<{
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
  }>;
}

interface KpiSnapshot {
  date: string;
  nrr_percent: number;
  churn_rate_percent: number;
  agent_cost_total?: number;
}

export default function DashboardPage() {
  const { orgId } = useOrg();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeKpi, setActiveKpi] = useState<KpiType | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", orgId],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/summary?org_id=${orgId}`);
      if (!res.ok) throw new Error("Failed to fetch dashboard");
      return res.json() as Promise<DashboardData>;
    },
    refetchInterval: 30_000,
  });

  const { data: kpiData } = useQuery({
    queryKey: ["kpi", orgId],
    queryFn: async () => {
      const res = await fetch(`/api/kpi?org_id=${orgId}&days=90`);
      if (!res.ok) throw new Error("Failed to fetch KPI");
      return res.json() as Promise<KpiSnapshot[]>;
    },
    refetchInterval: 60_000,
  });

  const kpi = data?.kpi;
  const quarterlyAgentCost = data?.quarterlyAgentCost ?? 0;

  // KPI display values:
  // churn_prevented_dollars = monthly snapshot → multiply by 3 for quarterly
  // operator_hours_saved = monthly value (already in 15-35 range per org)
  // support_deflection_rate = percentage (average for "all")
  const quarterlyChurn = Math.round((kpi?.churn_prevented_dollars ?? 0) * 3);
  const supportDeflectionRate = kpi?.support_deflection_rate ?? 0;
  const monthlyHours = Math.round(kpi?.operator_hours_saved ?? 0);
  const quarterlyValue = quarterlyChurn;
  const roi = quarterlyAgentCost > 0 ? quarterlyValue / quarterlyAgentCost : null;

  // Org-specific trend labels
  const trendLabels: Record<string, { churn: string; deflection: string; hours: string; roi: string }> = {
    org_dsn: { churn: "+14%", deflection: "+6%", hours: "+28", roi: "Positive" },
    org_campspot: { churn: "+11%", deflection: "+9%", hours: "+19", roi: "Positive" },
    org_condocontrol: { churn: "+8%", deflection: "+5%", hours: "+12", roi: "Positive" },
    all: { churn: "+12%", deflection: "+7%", hours: "+23", roi: "Positive" },
  };
  const trends = trendLabels[orgId] || trendLabels["all"];

  // Handle KPI card click
  const handleKpiClick = useCallback((type: KpiType) => {
    setActiveKpi(type);
    setDrawerOpen(true);
  }, []);

  // Build drawer data
  const drawerData = activeKpi && data
    ? buildKpiDrawerData(activeKpi, {
        quarterlyChurn,
        supportDeflectionRate,
        monthlyHours,
        agentCostDaily: kpi?.agent_cost_total ?? 0,
        quarterlyAgentCost,
        valueCreated: data.valueCreated,
        orgId,
      }, data.recentDecisions ?? [])
    : null;

  // Get org display name
  const orgName = orgId
    .replace("org_", "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-80 bg-[var(--skeleton)]" />
          <Skeleton className="h-4 w-60 bg-[var(--skeleton)] mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 bg-[var(--skeleton)] rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-14 bg-[var(--skeleton)] rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-72 bg-[var(--skeleton)] rounded-xl" />
          <Skeleton className="h-72 bg-[var(--skeleton)] rounded-xl" />
        </div>
        <Skeleton className="h-80 bg-[var(--skeleton)] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ToastWrapper />
      {/* Row 1: Welcome + KPI Cards */}
      <DemoTooltip content="Real-time metrics calculated from agent activity across all connected systems. Updated every 15 seconds." side="right">
        <div>
          <PageHeader
            title="Command Center"
            description="Real-time portfolio intelligence. Agents monitor every connected system across your portfolio companies — surfacing risks, opportunities, and operational insights before they become problems."
            features={[
              "Live KPI cards — churn prevention, support efficiency, operational savings, agent ROI",
              "90-day trend analysis with pre/post agent deployment inflection points",
              "Decision queue summary with pending approval counts by severity",
              "Agent fleet status across all portfolio companies",
              "Multi-tenant isolation — switch between portfolio companies or view aggregate",
            ]}
          />
        </div>
      </DemoTooltip>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Churn Prevented"
          value={formatCurrency(quarterlyChurn)}
          subtitle="This quarter"
          trend="up"
          trendLabel={trends.churn}
          icon={<DollarSign className="w-4 h-4" />}
          accentColor="text-emerald-400"
          onClick={() => handleKpiClick("churn_prevented")}
        />
        <KpiCard
          title="Support Deflection"
          value={formatPercent(supportDeflectionRate)}
          subtitle="Auto-resolved"
          trend="up"
          trendLabel={trends.deflection}
          icon={<Headphones className="w-4 h-4" />}
          accentColor="text-[var(--primary)]"
          onClick={() => handleKpiClick("support_deflection")}
        />
        <KpiCard
          title="Hours Saved"
          value={String(monthlyHours)}
          subtitle="Operator hours this month"
          trend="up"
          trendLabel={trends.hours}
          icon={<Clock className="w-4 h-4" />}
          accentColor="text-amber-400"
          onClick={() => handleKpiClick("hours_saved")}
        />
        <KpiCard
          title="Agent ROI"
          value={roi !== null ? `${roi.toFixed(1)}x` : "—"}
          subtitle="Return on agent investment"
          trend={roi !== null && roi > 1 ? "up" : "flat"}
          trendLabel={roi !== null && roi > 1 ? trends.roi : "Calculating..."}
          icon={<TrendingUp className="w-4 h-4" />}
          accentColor="text-purple-400"
          onClick={() => handleKpiClick("agent_roi")}
        />
      </div>

      {/* KPI Detail Drawer */}
      <KpiDetailDrawer
        data={drawerData}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />

      {/* Row 2: KPI Trend Chart */}
      {kpiData && kpiData.length > 0 && (
        <div>
          <DemoTooltip content="90-day trend showing business impact. The inflection point marks agent deployment — before and after is clearly visible." side="right">
            <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">KPI Trends</h2>
          </DemoTooltip>
          <KpiTrendChart data={kpiData} />
        </div>
      )}

      {/* Row 3: Decision Summary Bar */}
      <div>
        <DemoTooltip content="Agents continuously monitor your customer base and flag findings requiring human review. Critical items have the highest dollar exposure." side="right">
          <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Decision Summary</h2>
        </DemoTooltip>
        <DecisionSummaryBar
          decisionCounts={data?.decisionCounts ?? []}
          totalExposure={data?.valueAtRisk ?? 0}
        />
      </div>

      {/* Row 4: Two columns */}
      <div>
        <DemoTooltip content="Your deployed AI agent fleet. Each agent is specialized for a specific operational function with governed permissions." side="right">
          <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
            Active Agents & Activity — {orgId === "all" ? "All Portfolios" : orgName}
          </h2>
        </DemoTooltip>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AgentMiniCards agents={orgId === "all" ? (data?.allAgents ?? data?.agents ?? []) : (data?.agents ?? [])} />
          <ActivityFeed entries={orgId === "all" ? (data?.allActivity ?? data?.recentActivity ?? []) : (data?.recentActivity ?? [])} />
        </div>
      </div>
    </div>
  );
}
