"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useOrg } from "@/lib/hooks/use-org";
import { Bot, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FleetHealthBanner } from "@/components/agents/fleet-health-banner";
import { AgentCard } from "@/components/agents/agent-card";
import { AgentPerformanceTable } from "@/components/agents/agent-performance-table";

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
}

export default function AgentsPage() {
  const { orgId } = useOrg();
  const [deployMessage, setDeployMessage] = useState<string | null>(null);

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
    setDeployMessage("Coming soon — contact your administrator");
    setTimeout(() => setDeployMessage(null), 3000);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-60 bg-[#111118]" />
          <Skeleton className="h-9 w-40 bg-[#111118]" />
        </div>
        <Skeleton className="h-14 bg-[#111118] rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 bg-[#111118] rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-60 bg-[#111118] rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Bot className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">Agent Fleet</h1>
            <p className="text-zinc-400 text-sm mt-0.5">
              Deployed agents for{" "}
              <span className="text-white font-medium">{orgName}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {deployMessage && (
            <span className="text-xs text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg">
              {deployMessage}
            </span>
          )}
          <Button
            onClick={handleDeploy}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Deploy New Agent
          </Button>
        </div>
      </div>

      {/* Fleet Health Banner */}
      <FleetHealthBanner agents={agents ?? []} />

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(agents ?? []).map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {/* Performance Table */}
      {agents && agents.length > 0 && (
        <AgentPerformanceTable agents={agents} />
      )}
    </div>
  );
}
