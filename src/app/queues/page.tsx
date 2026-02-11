"use client";

import React from "react";
import { Layers, TrendingUp, Headphones, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useOrg } from "@/lib/hooks/use-org";
import { DemoTooltip } from "@/components/demo-tooltip";
import { ToastWrapper } from "@/components/toast-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { QueueStatsBar } from "@/components/queues/queue-stats-bar";
import { QueueLane } from "@/components/queues/queue-lane";

interface QueueItemData {
  id: string;
  title: string;
  severity: string;
  account_name: string | null;
  account_arr: number | null;
  impact_dollars: number | null;
  confidence: number | null;
  created_at: number;
  agent_type: string;
  agent_name: string;
}

interface QueuesResponse {
  stats: {
    total: number;
    avgTimeHours: number;
    processedToday: number;
    slaCompliance: number;
  };
  queues: Record<string, QueueItemData[]>;
}

export default function QueuesPage() {
  const { orgId } = useOrg();

  const { data, isLoading } = useQuery<QueuesResponse>({
    queryKey: ["queues", orgId],
    queryFn: () =>
      fetch(`/api/queues?org_id=${orgId}`).then((r) => r.json()),
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 bg-[var(--skeleton)]" />
          <Skeleton className="h-4 w-72 mt-2 bg-[var(--skeleton)]" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-20 bg-[var(--skeleton)] rounded-xl"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-96 bg-[var(--skeleton)] rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  const queues = data?.queues || {};

  return (
    <div className="space-y-6">
      <ToastWrapper />

      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--primary-10)] flex items-center justify-center">
            <Layers className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <div>
            <DemoTooltip
              content="Work queues organize agent outputs by capability. Portfolio operators work from their queue — Revenue leaders see pipeline items, Support leads see deflection opportunities."
              side="right"
            >
              <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
                Work Queues
              </h1>
            </DemoTooltip>
            <p className="text-[var(--text-secondary)] text-sm mt-0.5">
              Operational queues organized by agent capability
            </p>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <QueueStatsBar stats={data?.stats} isLoading={isLoading} />

      {/* Queue Lanes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <QueueLane
          title="Revenue Cadence"
          icon={TrendingUp}
          borderColor="border-l-emerald-500"
          iconColor="text-emerald-400"
          items={queues.revenue_cadence || []}
          summaryMetric="at risk"
        />
        <QueueLane
          title="Support Deflection"
          icon={Headphones}
          borderColor="border-l-sky-400"
          iconColor="text-sky-400"
          items={queues.support_deflection || []}
          summaryMetric="affected"
        />
        <QueueLane
          title="Renewals & Expansion"
          icon={Shield}
          borderColor="border-l-purple-400"
          iconColor="text-purple-400"
          items={queues.nrr || []}
          summaryMetric="ARR at risk"
        />
      </div>
    </div>
  );
}
