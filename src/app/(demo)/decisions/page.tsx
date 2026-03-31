"use client";

import React from "react";
import { CommandFeed } from "@/components/inbox/command-feed";
import { ToastWrapper } from "@/components/toast-wrapper";
import { PageHeader } from "@/components/layout/page-header";

export default function DecisionInboxPage() {
  return (
    <div className="space-y-4">
      <ToastWrapper />
      {/* Header */}
      <PageHeader
        title="Decision Inbox"
        description="Every agent recommendation surfaces here for human review. The HITL (Human-in-the-Loop) framework ensures high-stakes actions require explicit approval — from autonomous low-risk actions to multi-person approval for fund-level decisions."
        features={[
          "HITL Tier system — Tier 1 (auto), Tier 2 (async review), Tier 3 (real-time approval), Tier 4 (multi-person)",
          "Confidence scoring with color-coded thresholds (red <60%, yellow 60-80%, green >80%)",
          "Evidence panel with linked source data from CRM, support, billing systems",
          "Action preview showing exact changes before approval",
          "Full audit trail with SHA-256 hash chain for compliance",
        ]}
      />

      {/* Command Feed */}
      <CommandFeed />
    </div>
  );
}
