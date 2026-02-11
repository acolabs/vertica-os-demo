"use client";

import React, { useState, useCallback } from "react";
import { AuditEntry } from "./audit-entry";
import { AuditDetailDrawer, type AuditEntryData } from "./audit-detail-drawer";
import { EmptyState } from "@/components/empty-state";
import { Shield } from "lucide-react";

interface AuditTimelineProps {
  entries: AuditEntryData[];
}

export function AuditTimeline({ entries }: AuditTimelineProps) {
  const [selectedEntry, setSelectedEntry] = useState<AuditEntryData | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleEntryClick = useCallback((entry: AuditEntryData) => {
    setSelectedEntry(entry);
    setDrawerOpen(true);
  }, []);

  const handleDrawerOpenChange = useCallback((open: boolean) => {
    setDrawerOpen(open);
    if (!open) {
      // Delay clearing entry so close animation completes
      setTimeout(() => setSelectedEntry(null), 300);
    }
  }, []);

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
    <>
      <div className="space-y-0">
        {entries.map((entry, i) => (
          <AuditEntry
            key={entry.id}
            entry={entry}
            isLast={i === entries.length - 1}
            onClick={handleEntryClick}
          />
        ))}
      </div>
      <AuditDetailDrawer
        entry={selectedEntry}
        open={drawerOpen}
        onOpenChange={handleDrawerOpenChange}
      />
    </>
  );
}
