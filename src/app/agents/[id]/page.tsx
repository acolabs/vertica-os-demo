"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useOrg } from "@/lib/hooks/use-org";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AgentHeader } from "@/components/agent-detail/agent-header";
import { AgentStats } from "@/components/agent-detail/agent-stats";
import { RunsChart } from "@/components/agent-detail/runs-chart";
import { DecisionsPie } from "@/components/agent-detail/decisions-pie";
import { CostTrendChart } from "@/components/agent-detail/cost-trend-chart";
import { RunsTable } from "@/components/agent-detail/runs-table";
import { DecisionsTable } from "@/components/agent-detail/decisions-table";
import { AgentConfig } from "@/components/agent-detail/agent-config";
import { AgentMemory } from "@/components/agent-detail/agent-memory";
import { DemoTooltip } from "@/components/demo-tooltip";
import { ToastWrapper } from "@/components/toast-wrapper";

interface Agent {
  id: string;
  name: string;
  type: string;
  status: string;
  description: string;
  model: string;
  config: string | Record<string, unknown> | null;
  total_runs: number;
  total_decisions: number;
  total_value_created: number;
  accuracy_rate: number;
  created_at: number;
}

interface Run {
  id: string;
  status: string;
  trigger_type: string;
  started_at: number;
  duration_ms: number;
  tools_used: string | string[] | null;
  tokens_used: number;
  cost_usd: number;
  decisions_created: number;
}

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

function safeParse<T>(val: T | string | null): T | null {
  if (val == null) return null;
  if (typeof val === "string") {
    try { return JSON.parse(val) as T; } catch { return null; }
  }
  return val;
}

export default function AgentDetailPage() {
  const params = useParams();
  const agentId = params.id as string;
  const { orgId } = useOrg();

  const { data: agent, isLoading: agentLoading } = useQuery<Agent>({
    queryKey: ["agent", agentId],
    queryFn: async () => {
      const res = await fetch(`/api/agents/${agentId}`);
      if (!res.ok) throw new Error("Failed to fetch agent");
      return res.json();
    },
  });

  const { data: runs, isLoading: runsLoading } = useQuery<Run[]>({
    queryKey: ["agent-runs", agentId, orgId],
    queryFn: async () => {
      const res = await fetch(`/api/runs?org_id=${orgId}&agent_id=${agentId}&limit=500`);
      if (!res.ok) throw new Error("Failed to fetch runs");
      return res.json();
    },
    enabled: !!agent,
  });

  const { data: decisionsResp, isLoading: decisionsLoading } = useQuery<{ decisions: Decision[] }>({
    queryKey: ["agent-decisions", agentId, orgId],
    queryFn: async () => {
      const res = await fetch(`/api/decisions?org_id=${orgId}&agent_id=${agentId}&limit=200`);
      if (!res.ok) throw new Error("Failed to fetch decisions");
      return res.json();
    },
    enabled: !!agent,
  });

  const isLoading = agentLoading || runsLoading || decisionsLoading;

  if (isLoading || !agent) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-32 bg-[var(--skeleton)]" />
        <div className="flex items-start gap-4">
          <Skeleton className="h-12 w-12 rounded-xl bg-[var(--skeleton)]" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-8 w-64 bg-[var(--skeleton)]" />
            <Skeleton className="h-4 w-48 bg-[var(--skeleton)]" />
          </div>
        </div>
        <div className="grid grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 bg-[var(--skeleton)] rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-10 w-96 bg-[var(--skeleton)] rounded-lg" />
        <Skeleton className="h-80 bg-[var(--skeleton)] rounded-xl" />
      </div>
    );
  }

  const allRuns = runs || [];
  const decisions = decisionsResp?.decisions || [];

  // Compute stats
  const completedRuns = allRuns.filter((r) => r.status === "completed");
  const successRate = allRuns.length > 0 ? (completedRuns.length / allRuns.length) * 100 : 0;
  const avgDuration = completedRuns.length > 0
    ? completedRuns.reduce((s, r) => s + (r.duration_ms || 0), 0) / completedRuns.length
    : 0;
  const totalCost = allRuns.reduce((s, r) => s + (r.cost_usd || 0), 0);

  const agentConfig = safeParse<Record<string, unknown>>(agent.config);

  return (
    <div className="space-y-6">
      <ToastWrapper />
      <AgentHeader agent={agent} />

      <DemoTooltip content="Key performance indicators for this specific agent. Value Created represents direct dollar impact attributed to agent actions." side="right">
        <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Agent Performance</h2>
      </DemoTooltip>
      <AgentStats
        totalRuns={agent.total_runs}
        successRate={successRate}
        avgDuration={avgDuration}
        totalCost={totalCost}
        valueCreated={agent.total_value_created}
      />

      <Tabs defaultValue="overview">
        <TabsList variant="line" className="border-b border-[var(--card-border)] w-full justify-start">
          <TabsTrigger value="overview" className="text-sm">Overview</TabsTrigger>
          <TabsTrigger value="runs" className="text-sm">Runs</TabsTrigger>
          <TabsTrigger value="decisions" className="text-sm">Decisions</TabsTrigger>
          <TabsTrigger value="config" className="text-sm">Configuration</TabsTrigger>
          <TabsTrigger value="memory" className="text-sm">Memory</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <RunsChart runs={allRuns} />
            <DecisionsPie decisions={decisions} />
          </div>
          <CostTrendChart runs={allRuns} />
        </TabsContent>

        <TabsContent value="runs" className="mt-4">
          <RunsTable runs={allRuns} />
        </TabsContent>

        <TabsContent value="decisions" className="mt-4">
          <DecisionsTable decisions={decisions} />
        </TabsContent>

        <TabsContent value="config" className="mt-4">
          <DemoTooltip content="Agent capabilities define what systems it can access and what actions it can take. Changes require governance approval." side="right">
            <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Configuration</h3>
          </DemoTooltip>
          <AgentConfig config={agentConfig} model={agent.model} />
        </TabsContent>

        <TabsContent value="memory" className="mt-4">
          <DemoTooltip content="Agents learn patterns from historical data, improving accuracy over time. All learned patterns are explainable and auditable." side="right">
            <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">Memory</h3>
          </DemoTooltip>
          <AgentMemory agentType={agent.type} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
