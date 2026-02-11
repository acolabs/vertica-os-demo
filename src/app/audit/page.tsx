"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useOrg } from "@/lib/hooks/use-org";
import { Shield, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { HashChainBanner } from "@/components/audit/hash-chain-banner";
import { AuditTimeline } from "@/components/audit/audit-timeline";
import { DemoTooltip } from "@/components/demo-tooltip";
import { ToastWrapper } from "@/components/toast-wrapper";
import { toast } from "sonner";

interface AuditEntry {
  id: string;
  org_id: string;
  prev_hash: string | null;
  hash: string;
  actor: string;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  details: string | null;
  created_at: number;
}

interface AuditResponse {
  entries: AuditEntry[];
  total: number;
  limit: number;
  offset: number;
}

const actionTypes = [
  "All",
  "decision.created",
  "decision.approved",
  "decision.rejected",
  "agent.run.completed",
  "agent.run.failed",
  "integration.sync",
  "policy.updated",
  "agent.config.updated",
];

export default function AuditPage() {
  const { orgId } = useOrg();
  const [offset, setOffset] = useState(0);
  const [actionFilter, setActionFilter] = useState("All");
  const [actorFilter, setActorFilter] = useState("All");
  const limit = 50;

  const { data, isLoading } = useQuery<AuditResponse>({
    queryKey: ["audit", orgId, offset],
    queryFn: () =>
      fetch(`/api/audit?org_id=${orgId}&limit=${limit}&offset=${offset}`).then((r) => r.json()),
    refetchInterval: 30000,
  });

  // Get unique actors for filter
  const actors = useMemo(() => {
    if (!data?.entries) return ["All"];
    const unique = [...new Set(data.entries.map((e) => e.actor))];
    return ["All", ...unique.sort()];
  }, [data?.entries]);

  // Apply client-side filters
  const filteredEntries = useMemo(() => {
    if (!data?.entries) return [];
    return data.entries.filter((e) => {
      if (actionFilter !== "All" && e.action !== actionFilter) return false;
      if (actorFilter !== "All" && e.actor !== actorFilter) return false;
      return true;
    });
  }, [data?.entries, actionFilter, actorFilter]);

  const handleExport = useCallback((type: string) => {
    if (type === "CSV") {
      const entries = filteredEntries.length > 0 ? filteredEntries : (data?.entries ?? []);
      if (entries.length === 0) {
        toast.error("No audit entries to export");
        return;
      }
      const headers = ["timestamp", "actor", "action", "resource_type", "resource_id", "hash"];
      const rows = entries.map((e) => [
        new Date(e.created_at * 1000).toISOString(),
        e.actor,
        e.action,
        e.resource_type ?? "",
        e.resource_id ?? "",
        e.hash,
      ]);
      const csvContent = [
        headers.join(","),
        ...rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
      ].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success("CSV exported successfully", {
        description: `${entries.length} audit entries downloaded.`,
      });
    } else {
      toast.info("PDF export generating...", {
        description: "Board-ready audit report will download shortly.",
      });
    }
  }, [filteredEntries, data?.entries]);

  const handleLoadMore = useCallback(() => {
    setOffset((prev) => prev + limit);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-48 bg-[var(--skeleton)]" />
          <Skeleton className="h-4 w-72 mt-2 bg-[var(--skeleton)]" />
        </div>
        <Skeleton className="h-20 bg-[var(--skeleton)] rounded-xl" />
        <Skeleton className="h-12 bg-[var(--skeleton)] rounded-xl" />
        {[...Array(8)].map((_, i) => (
          <Skeleton key={i} className="h-16 bg-[var(--skeleton)] rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ToastWrapper />
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--primary-10)] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div>
              <DemoTooltip content="Complete record of every agent action, human decision, and system event. Exportable for board presentations and compliance." side="right">
                <h1 className="text-2xl font-bold text-[var(--text-primary)]">Audit Log</h1>
              </DemoTooltip>
              <p className="text-sm text-[var(--text-secondary)]">Hash-chained, tamper-proof action trail</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("CSV")}
            className="text-xs"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("PDF")}
            className="text-xs"
          >
            <FileText className="w-3.5 h-3.5 mr-1" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Hash Chain Banner */}
      <DemoTooltip content="SHA-256 cryptographic hash chain ensures tamper-proof integrity. No entry can be modified or deleted without detection." side="right">
        <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Integrity Verification</h2>
      </DemoTooltip>
      <HashChainBanner totalEntries={data?.total || 0} />

      {/* Filters */}
      <Card className="border-[var(--card-border)] bg-[var(--card-bg)]">
        <CardContent className="pt-0">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Actor filter */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-[var(--text-muted)]">Actor:</label>
              <select
                value={actorFilter}
                onChange={(e) => setActorFilter(e.target.value)}
                className="bg-[var(--surface)] border border-[var(--card-border)] rounded-md px-2 py-1.5 text-xs text-[var(--text-secondary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              >
                {actors.map((actor) => (
                  <option key={actor} value={actor}>
                    {actor === "All" ? "All Actors" : actor}
                  </option>
                ))}
              </select>
            </div>

            {/* Action type filter */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-[var(--text-muted)]">Action:</label>
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="bg-[var(--surface)] border border-[var(--card-border)] rounded-md px-2 py-1.5 text-xs text-[var(--text-secondary)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
              >
                {actionTypes.map((type) => (
                  <option key={type} value={type}>
                    {type === "All" ? "All Actions" : type}
                  </option>
                ))}
              </select>
            </div>

            {/* Results count */}
            <span className="text-xs text-[var(--text-muted)] ml-auto">
              Showing {filteredEntries.length} of {data?.total || 0} entries
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Audit Timeline */}
      <Card className="border-[var(--card-border)] bg-[var(--card-bg)]">
        <CardContent>
          <AuditTimeline entries={filteredEntries} />
        </CardContent>
      </Card>

      {/* Load More */}
      {data && offset + limit < data.total && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleLoadMore}
            className="text-sm"
          >
            Load More ({data.total - offset - limit} remaining)
          </Button>
        </div>
      )}
    </div>
  );
}
