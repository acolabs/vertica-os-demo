"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useOrg } from "@/lib/hooks/use-org";
import { KpiCard } from "@/components/dashboard/kpi-card";
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
  valueAtRisk: number;
  valueCreated: number;
}

interface KpiSnapshot {
  date: string;
  nrr_percent: number;
  churn_rate_percent: number;
}

export default function DashboardPage() {
  const { orgId } = useOrg();

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
  const agentCostTotal = kpi?.agent_cost_total ?? 1;
  const totalValueCreated = data?.valueCreated ?? 0;
  const roi = agentCostTotal > 0 ? totalValueCreated / agentCostTotal : 0;

  // Get org display name
  const orgName = orgId
    .replace("org_", "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-80 bg-[#111118]" />
          <Skeleton className="h-4 w-60 bg-[#111118] mt-2" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 bg-[#111118] rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-14 bg-[#111118] rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-72 bg-[#111118] rounded-xl" />
          <Skeleton className="h-72 bg-[#111118] rounded-xl" />
        </div>
        <Skeleton className="h-80 bg-[#111118] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Row 1: Welcome + KPI Cards */}
      <div>
        <h1 className="text-2xl font-semibold text-white">
          Agent OS — Command Center
        </h1>
        <p className="text-zinc-400 mt-1 text-sm">
          Portfolio intelligence for{" "}
          <span className="text-white font-medium">{orgName}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Churn Prevented"
          value={formatCurrency(kpi?.churn_prevented_dollars ?? 0)}
          subtitle="This quarter"
          trend="up"
          trendLabel="+12%"
          icon={<DollarSign className="w-4 h-4" />}
          accentColor="text-emerald-400"
        />
        <KpiCard
          title="Support Deflection"
          value={formatPercent(kpi?.support_deflection_rate ?? 0)}
          subtitle="Auto-resolved"
          trend="up"
          trendLabel="+8%"
          icon={<Headphones className="w-4 h-4" />}
          accentColor="text-blue-400"
        />
        <KpiCard
          title="Hours Saved"
          value={String(Math.round(kpi?.operator_hours_saved ?? 0))}
          subtitle="Operator hours this month"
          trend="up"
          trendLabel="+23"
          icon={<Clock className="w-4 h-4" />}
          accentColor="text-amber-400"
        />
        <KpiCard
          title="Agent ROI"
          value={`${roi.toFixed(1)}x`}
          subtitle="Return on agent investment"
          trend={roi > 1 ? "up" : "flat"}
          trendLabel={roi > 1 ? "Positive" : "Neutral"}
          icon={<TrendingUp className="w-4 h-4" />}
          accentColor="text-purple-400"
        />
      </div>

      {/* Row 2: Decision Summary Bar */}
      <DecisionSummaryBar
        decisionCounts={data?.decisionCounts ?? []}
        totalExposure={data?.valueAtRisk ?? 0}
      />

      {/* Row 3: Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AgentMiniCards agents={data?.agents ?? []} />
        <ActivityFeed entries={data?.recentActivity ?? []} />
      </div>

      {/* Row 4: KPI Trend Chart */}
      {kpiData && kpiData.length > 0 && <KpiTrendChart data={kpiData} />}
    </div>
  );
}
