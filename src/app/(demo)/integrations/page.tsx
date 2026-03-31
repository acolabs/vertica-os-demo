"use client";

import React, { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useOrg } from "@/lib/hooks/use-org";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { IntegrationStatusBanner } from "@/components/integrations/integration-status-banner";
import { IntegrationCard } from "@/components/integrations/integration-card";
import { AvailableIntegrations } from "@/components/integrations/available-integrations";
import { DemoTooltip } from "@/components/demo-tooltip";
import { ToastWrapper } from "@/components/toast-wrapper";
import { toast } from "sonner";

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
    toast.info("Integration catalog", {
      description: "Contact your administrator to connect new data sources.",
    });
  }, []);

  const handleConnect = useCallback((name: string) => {
    toast.success("Integration connection initiated", {
      description: `OAuth flow would start here for ${name}. Demo mode — no actual connection.`,
    });
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 bg-[var(--skeleton)]" />
          <Skeleton className="h-4 w-72 mt-2 bg-[var(--skeleton)]" />
        </div>
        <Skeleton className="h-20 bg-[var(--skeleton)] rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 bg-[var(--skeleton)] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ToastWrapper />
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1 mr-4">
          <PageHeader
            title="Integrations"
            description="Connected systems that agents read from and write to. All connections are scoped per portfolio company with configurable permissions."
            features={[
              "CRM, support desk, billing, and analytics integrations",
              "Per-company connection status and health",
              "Sync frequency and last-sync timestamps",
            ]}
          />
        </div>
        <div className="shrink-0 pt-5">
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
      </div>

      {/* Status Banner */}
      {integrations && integrations.length > 0 && (
        <IntegrationStatusBanner integrations={integrations} />
      )}

      {/* Connected Integration Cards */}
      {integrations && integrations.length > 0 && (
        <div>
          <DemoTooltip content="Sourced from the integrations table via /api/integrations. Each row stores name, type (crm/support/data_warehouse/communication), status (connected/disconnected/error), health_score (0-100%), config JSON, and last_sync_at timestamp. Polled every 30s." side="right">
            <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Connected</h2>
          </DemoTooltip>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {integrations.map((integration) => (
              <IntegrationCard key={integration.id} integration={integration} />
            ))}
          </div>
        </div>
      )}

      {/* Available Integrations */}
      <DemoTooltip content="Available integrations are a static catalog of supported connectors. When connected, a new row is created in the integrations table with initial config, health_score, and sync scheduling. All connection events are logged to audit_log." side="right">
        <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Available Integrations</h2>
      </DemoTooltip>
      <AvailableIntegrations onConnect={handleConnect} />
    </div>
  );
}
