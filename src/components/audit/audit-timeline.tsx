"use client";

import React from "react";
import { AuditEntry } from "./audit-entry";

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
      <div className="text-center py-12 text-zinc-500">
        No audit entries found
      </div>
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
