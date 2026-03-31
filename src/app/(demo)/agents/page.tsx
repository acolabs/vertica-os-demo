"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useOrg } from "@/lib/hooks/use-org";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FleetHealthBanner } from "@/components/agents/fleet-health-banner";
import { AgentCard } from "@/components/agents/agent-card";
import { AgentPerformanceTable } from "@/components/agents/agent-performance-table";
import { DeployDialog } from "@/components/agents/deploy-dialog";
import { ToastWrapper } from "@/components/toast-wrapper";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/layout/page-header";
import { Bot } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  type: string;
  status: string;
  description: string;
  model: string;
  total_runs: number;
  total_decisions: number;
  total_value_created: number;
  accuracy_rate: number;
  created_at: number;
  total_cost?: number;
}

export default function AgentsPage() {
  const { orgId } = useOrg();
  const [deployOpen, setDeployOpen] = useState(false);

  const orgName = orgId
    .replace("org_", "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  const { data: agents, isLoading } = useQuery({
    queryKey: ["agents", orgId],
    queryFn: async () => {
      const res = await fetch(`/api/agents?org_id=${orgId}`);
      if (!res.ok) throw new Error("Failed to fetch agents");
      return res.json() as Promise<Agent[]>;
    },
    refetchInterval: 30_000,
  });

  const handleDeploy = () => {
    setDeployOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-60 bg-[var(--skeleton)]" />
          <Skeleton className="h-9 w-40 bg-[var(--skeleton)]" />
        </div>
        <Skeleton className="h-14 bg-[var(--skeleton)] rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 bg-[var(--skeleton)] rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-60 bg-[var(--skeleton)] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ToastWrapper />
      <DeployDialog open={deployOpen} onOpenChange={setDeployOpen} />
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1 mr-4">
          <PageHeader
            title="Agent Fleet"
            description="Monitor deployed agents and manage the reusable template library that scales across the portfolio. Each playbook encodes a specific operational capability."
            features={[
              "Live agent status with accuracy, value created, and run counts",
              "Deployment stage indicators — shadow, suggest, gated auto, full auto",
              "KPI impact mapping per playbook template",
            ]}
          />
        </div>
        <div className="flex items-center gap-3 shrink-0 pt-5">
          <Button
            onClick={handleDeploy}
            className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Deploy New Agent
          </Button>
        </div>
      </div>

      {/* Fleet Health Banner */}
      <FleetHealthBanner agents={agents ?? []} />

      {/* Agent Cards Grid */}
      {(agents ?? []).length === 0 ? (
        <EmptyState
          icon={<Bot className="w-6 h-6" />}
          title="No agents deployed"
          description="No agents deployed for this organization. Click Deploy New Agent to get started."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(agents ?? []).map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}

      {/* Performance Table */}
      {agents && agents.length > 0 && (
        <AgentPerformanceTable agents={agents} />
      )}
    </div>
  );
}
