"use client";

import React from "react";
import { AuditEntry } from "./audit-entry";
import { EmptyState } from "@/components/empty-state";
import { Shield } from "lucide-react";

interface AuditEntryData {
  id: string;
  action: string;
  actor: string;
  resource_type: string | null;
  resource_id: string | null;
  details: string | null;
  hash: string;
  prev_hash: string | null;
  created_at: number;
}

interface AuditTimelineProps {
  entries: AuditEntryData[];
}

export function AuditTimeline({ entries }: AuditTimelineProps) {
  if (entries.length === 0) {
    return (
      <EmptyState
        icon={<Shield className="w-6 h-6" />}
        title="No audit entries found"
        description="No audit entries match the current filters. Adjust your filters or wait for new agent activity."
      />
    );
  }

  return (
    <div className="space-y-0">
      {entries.map((entry, i) => (
        <AuditEntry
          key={entry.id}
          entry={entry}
          isLast={i === entries.length - 1}
        />
      ))}
    </div>
  );
}
