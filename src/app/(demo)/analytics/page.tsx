"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useOrg } from "@/lib/hooks/use-org";
import { BarChart3, DollarSign, TrendingUp, Target } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";
import { BigNumberCard } from "@/components/analytics/big-number-card";
import { RevenueImpactChart } from "@/components/analytics/revenue-impact-chart";
import { SupportMetricsChart } from "@/components/analytics/support-metrics-chart";
import { OperatorHoursChart } from "@/components/analytics/operator-hours-chart";
import { AgentEfficiencyTable } from "@/components/analytics/agent-efficiency-table";
import { DemoTooltip } from "@/components/demo-tooltip";
import { ToastWrapper } from "@/components/toast-wrapper";

interface AnalyticsData {
  decisions: {
    byStatus: Array<{ status: string; count: number }>;
    bySeverity: Array<{ severity: string; count: number }>;
    valueAtRisk: Array<{ severity: string; total_value: number }>;
  };
  agents: Array<{
    id: string;
    name: string;
    type: string;
    total_runs: number;
    total_decisions: number;
    total_value_created: number;
    accuracy_rate: number;
  }>;
  runs: {
    total_runs: number;
    completed: number;
    failed: number;
    avg_duration_ms: number;
    total_tokens: number;
    total_cost: number;
  };
  kpiTrend: Array<Record<string, number | string>>;
}

interface KpiSnapshot {
  date: string;
  nrr_percent: number;
  churn_rate_percent: number;
  churn_prevented_dollars: number;
  expansion_revenue: number;
  support_deflection_rate: number;
  support_cost_per_ticket: number;
  avg_handle_time_minutes: number;
  csat_score: number;
  operator_hours_saved: number;
  board_pack_hours: number;
  agent_cost_total: number;
}

export default function AnalyticsPage() {
  const { orgId } = useOrg();

  const { data: analytics, isLoading: analyticsLoading } = useQuery<AnalyticsData>({
    queryKey: ["analytics", orgId],
    queryFn: () => fetch(`/api/analytics?org_id=${orgId}`).then((r) => r.json()),
    refetchInterval: 30000,
  });

  const { data: kpiData, isLoading: kpiLoading } = useQuery<KpiSnapshot[]>({
    queryKey: ["kpi", orgId],
    queryFn: () => fetch(`/api/kpi?org_id=${orgId}&days=90`).then((r) => r.json()),
    refetchInterval: 30000,
  });

  const isLoading = analyticsLoading || kpiLoading;

  // Calculate big numbers
  const totalValueCreated = analytics?.agents?.reduce((sum, a) => sum + a.total_value_created, 0) || 0;
  const totalCost = analytics?.runs?.total_cost || 0;
  const roiMultiple = totalCost > 0 ? Math.round(totalValueCreated / totalCost) : 0;
  const totalDecisions = analytics?.agents?.reduce((sum, a) => sum + a.total_decisions, 0) || 0;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 bg-[var(--skeleton)]" />
          <Skeleton className="h-4 w-72 mt-2 bg-[var(--skeleton)]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 bg-[var(--skeleton)] rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 bg-[var(--skeleton)] rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-80 bg-[var(--skeleton)] rounded-xl" />
          <Skeleton className="h-80 bg-[var(--skeleton)] rounded-xl" />
        </div>
        <Skeleton className="h-80 bg-[var(--skeleton)] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Analytics & Impact"
        description="Outcome dashboards that attribute business impact directly to agent actions. These produce the board-ready value creation reports for each pilot phase."
        features={[
          "Total value created, agent cost, and ROI multiple",
          "Revenue impact charts — churn prevented, expansion revenue",
          "Support metrics — deflection rate, handle time, cost per ticket",
          "Operator hours saved tracking",
          "Agent efficiency table with per-agent cost and acceptance rate",
        ]}
      />

      <ToastWrapper />
      {/* Row 1: Big Impact Numbers */}
      <DemoTooltip content="Executive summary metrics for board reporting. All values are directly attributable to agent actions with full audit trail." side="right">
        <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Impact Summary</h2>
      </DemoTooltip>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <BigNumberCard
          title="Total Value Created"
          value={formatLargeNumber(totalValueCreated)}
          subtitle="Across all agents"
          icon={DollarSign}
          color="emerald"
        />
        <BigNumberCard
          title="Total Agent Cost"
          value={`$${totalCost.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          subtitle="Compute + API costs"
          icon={TrendingUp}
          color="rose"
        />
        <BigNumberCard
          title="ROI Multiple"
          value={`${roiMultiple.toLocaleString()}x`}
          subtitle="Value / Cost ratio"
          icon={Target}
          color="emerald"
        />
        <BigNumberCard
          title="Decisions Made"
          value={totalDecisions.toLocaleString()}
          subtitle="Agent-generated decisions"
          icon={BarChart3}
          color="red"
        />
      </div>

      {/* Row 2: Revenue Impact */}
      {kpiData && kpiData.length > 0 && (
        <div>
          <DemoTooltip content="Churn prevention is the highest-ROI agent capability for PE-backed SaaS. Each dollar saved compounds at your revenue multiple." side="right">
            <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Revenue Impact</h2>
          </DemoTooltip>
          <RevenueImpactChart kpiData={kpiData} />
        </div>
      )}

      {/* Row 3: Operational Impact */}
      {kpiData && kpiData.length > 0 && (
        <div>
          <DemoTooltip content="Support automation delivers immediate cost savings with measurable deflection rates and handle time reduction." side="right">
            <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Support & Operations</h2>
          </DemoTooltip>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <SupportMetricsChart kpiData={kpiData} />
            <OperatorHoursChart kpiData={kpiData} />
          </div>
        </div>
      )}

      {/* Row 4: Agent Efficiency */}
      {analytics && (
        <div>
          <DemoTooltip content="Operational metrics showing agent reliability and cost-effectiveness. Acceptance rate indicates alignment with human judgment." side="right">
            <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">Agent Efficiency</h2>
          </DemoTooltip>
          <AgentEfficiencyTable
            agents={analytics.agents}
            runStats={analytics.runs}
          />
        </div>
      )}
    </div>
  );
}

function formatLargeNumber(num: number): string {
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${Math.round(num).toLocaleString()}`;
  return `$${num.toFixed(2)}`;
}
