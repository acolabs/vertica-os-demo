"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ToastWrapper } from "@/components/toast-wrapper";
import { PageHeader } from "@/components/layout/page-header";
import { PipelineSummary } from "@/components/deals/pipeline-summary";
import { DealPipeline } from "@/components/deals/deal-pipeline";
import { DealDetailDrawer } from "@/components/deals/deal-detail-drawer";
import { useOrg } from "@/lib/hooks/use-org";
import type { Deal } from "@/app/api/deals/route";

export default function DealsPage() {
  const { orgId } = useOrg();
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["deals", orgId],
    queryFn: async () => {
      const res = await fetch(`/api/deals?org_id=${orgId}`);
      if (!res.ok) throw new Error("Failed to fetch deals");
      return res.json();
    },
  });

  const handleDealClick = (deal: Deal) => {
    setSelectedDeal(deal);
    setDrawerOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-lg bg-[var(--skeleton)]" />
          <div className="space-y-1.5">
            <Skeleton className="h-7 w-48 bg-[var(--skeleton)]" />
            <Skeleton className="h-4 w-72 bg-[var(--skeleton)]" />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-20 bg-[var(--skeleton)] rounded-xl"
            />
          ))}
        </div>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-96 w-[260px] shrink-0 bg-[var(--skeleton)] rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ToastWrapper />
      <DealDetailDrawer
        deal={selectedDeal}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />

      <PageHeader
        title="Deal Room"
        description="Track every deal from first look through close. Kanban pipeline with thesis scoring, diligence tracking, and financial modeling across your entire deal flow."
        features={[
          "Kanban pipeline with 6 stages from Sourcing to Closed",
          "Thesis fit scoring with automated red flag detection",
          "Diligence checklist tracking with completion percentage",
          "Financial summary with projected MOIC and IRR per deal",
          "Stage history timeline with days-in-stage analytics",
        ]}
      />

      {data?.summary && <PipelineSummary summary={data.summary} />}

      {data?.pipeline && (
        <DealPipeline pipeline={data.pipeline} onDealClick={handleDealClick} />
      )}
    </div>
  );
}
