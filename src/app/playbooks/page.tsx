"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DemoTooltip } from "@/components/demo-tooltip";
import { ToastWrapper } from "@/components/toast-wrapper";
import { PlaybookCard, type Playbook } from "@/components/playbooks/playbook-card";
import { DeployPlaybookDialog } from "@/components/playbooks/deploy-playbook-dialog";

export default function PlaybooksPage() {
  const [deployOpen, setDeployOpen] = useState(false);
  const [selectedPlaybook, setSelectedPlaybook] = useState<Playbook | null>(
    null
  );

  const { data: playbooks, isLoading } = useQuery<Playbook[]>({
    queryKey: ["playbooks"],
    queryFn: () => fetch("/api/playbooks").then((r) => r.json()),
  });

  const handleDeploy = (playbook: Playbook) => {
    setSelectedPlaybook(playbook);
    setDeployOpen(true);
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

      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: "var(--primary-10)" }}
        >
          <BookOpen className="w-5 h-5" style={{ color: "var(--primary)" }} />
        </div>
        <div>
          <DemoTooltip
            content="Agent playbooks are reusable templates that encode Vertica's operational DNA. Deploy across portfolio companies in days, not months."
            side="right"
          >
            <h1
              className="text-2xl font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Agent Playbooks
            </h1>
          </DemoTooltip>
          <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
            Template library for portfolio-wide deployment
          </p>
        </div>
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(playbooks ?? []).map((playbook) => (
          <PlaybookCard
            key={playbook.id}
            playbook={playbook}
            onDeploy={handleDeploy}
          />
        ))}
      </div>
    </div>
  );
}
