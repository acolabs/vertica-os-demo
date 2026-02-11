"use client";

import React, { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useOrg } from "@/lib/hooks/use-org";
import { Plug, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { IntegrationStatusBanner } from "@/components/integrations/integration-status-banner";
import { IntegrationCard } from "@/components/integrations/integration-card";
import { AvailableIntegrations } from "@/components/integrations/available-integrations";

interface Integration {
  id: string;
  name: string;
  type: string;
  status: string;
  config: string | null;
  last_sync_at: number;
  health_score: number;
}

export default function IntegrationsPage() {
  const { orgId } = useOrg();

  const { data: integrations, isLoading } = useQuery<Integration[]>({
    queryKey: ["integrations", orgId],
    queryFn: () => fetch(`/api/integrations?org_id=${orgId}`).then((r) => r.json()),
    refetchInterval: 30000,
  });

  const handleAddIntegration = useCallback(() => {
    alert("Contact administrator to add new integrations");
  }, []);

  const handleConnect = useCallback((name: string) => {
    alert(`Contact administrator to connect ${name}`);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 bg-zinc-800" />
          <Skeleton className="h-4 w-72 mt-2 bg-zinc-800" />
        </div>
        <Skeleton className="h-20 bg-zinc-800 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 bg-zinc-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Plug className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Integrations</h1>
              <p className="text-sm text-zinc-400">Connected systems and data sources</p>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddIntegration}
          className="text-xs"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Integration
        </Button>
      </div>

      {/* Status Banner */}
      {integrations && integrations.length > 0 && (
        <IntegrationStatusBanner integrations={integrations} />
      )}

      {/* Connected Integration Cards */}
      {integrations && integrations.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Connected</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations.map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        </div>
      )}

      {/* Available Integrations */}
      <AvailableIntegrations onConnect={handleConnect} />
    </div>
  );
}
