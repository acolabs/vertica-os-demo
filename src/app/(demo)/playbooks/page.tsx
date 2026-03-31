"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ToastWrapper } from "@/components/toast-wrapper";
import { PageHeader } from "@/components/layout/page-header";
import { PlaybookCard, type Playbook } from "@/components/playbooks/playbook-card";
import { DeployPlaybookDialog } from "@/components/playbooks/deploy-playbook-dialog";
import { PlaybookDetailModal } from "@/components/playbooks/playbook-detail-modal";

export default function PlaybooksPage() {
  const [deployOpen, setDeployOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(
    null
  );
  const [detailPlaybook, setDetailPlaybook] = useState<Playbook | null>(null);

  const { data: playbooks, isLoading } = useQuery<Playbook[]>({
    queryKey: ["playbooks"],
    queryFn: () => fetch("/api/playbooks").then((r) => r.json()),
  });

  const handleDeploy = (playbook: Playbook) => {
    setSelectedPlaybook(playbook);
    setDeployOpen(true);
  };

  const handleViewDetails = (playbook: Playbook) => {
    setDetailPlaybook(playbook);
    setDetailOpen(true);
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-80 bg-[var(--skeleton)] rounded-xl"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ToastWrapper />
      <DeployPlaybookDialog
        open={deployOpen}
        onOpenChange={setDeployOpen}
        playbook={selectedPlaybook}
      />
      <PlaybookDetailModal
        open={detailOpen}
        onOpenChange={setDetailOpen}
        playbook={detailPlaybook}
        onDeploy={handleDeploy}
      />

      {/* Header */}
      <PageHeader
        title="Playbook Library"
        description="Reusable agent templates that encode specific operational capabilities. Deploy to any portfolio company with configurable autonomy levels."
        features={[
          "Playbook templates with required integrations and expected ROI",
          "One-click deploy to any portfolio company with mode selection",
          "Detailed methodology, deliverables, and rollout phases per template",
        ]}
      />

      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(playbooks ?? []).map((playbook) => (
          <PlaybookCard
            key={playbook.id}
            playbook={playbook}
            onDeploy={handleDeploy}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>
    </div>
  );
}
