"use client";

import React, { useState } from "react";
import {
  Plus,
  Check,
  X,
  Play,
  AlertCircle,
  RefreshCw,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AuditEntryData } from "./audit-detail-drawer";

interface AuditEntryProps {
  entry: AuditEntryData;
  isLast: boolean;
  onClick?: (entry: AuditEntryData) => void;
}

const actionConfig: Record<string, { icon: React.ElementType; color: string; bgColor: string }> = {
  "decision.created": { icon: Plus, color: "text-[var(--primary)]", bgColor: "bg-[var(--primary-10)]" },
  "decision.approved": { icon: Check, color: "text-emerald-400", bgColor: "bg-emerald-500/10" },
  "decision.rejected": { icon: X, color: "text-rose-400", bgColor: "bg-rose-500/10" },
  "agent.run.completed": { icon: Play, color: "text-emerald-400", bgColor: "bg-emerald-500/10" },
  "agent.run.failed": { icon: AlertCircle, color: "text-rose-400", bgColor: "bg-rose-500/10" },
  "integration.sync": { icon: RefreshCw, color: "text-[var(--primary)]", bgColor: "bg-[var(--primary-10)]" },
  "policy.updated": { icon: Settings, color: "text-amber-400", bgColor: "bg-amber-500/10" },
  "agent.config.updated": { icon: Settings, color: "text-[var(--primary)]", bgColor: "bg-[var(--primary-10)]" },
};

function getActionDescription(entry: AuditEntryData): string {
  const details = entry.details ? safeParseJSON(entry.details) : null;

  switch (entry.action) {
    case "decision.created":
      return `Decision created: ${details?.title || entry.resource_id || "Unknown"}`;
    case "decision.approved":
      return `Decision approved: ${details?.title || entry.resource_id || "Unknown"}`;
    case "decision.rejected":
      return `Decision rejected: ${details?.title || entry.resource_id || "Unknown"}${details?.reason ? ` — ${details.reason}` : ""}`;
    case "agent.run.completed":
      return `Agent run completed: ${details?.agent_name || entry.resource_id || "Unknown"} (${details?.duration || "N/A"})`;
    case "agent.run.failed":
      return `Agent run failed: ${details?.agent_name || entry.resource_id || "Unknown"} — ${details?.error || "Unknown error"}`;
    case "integration.sync":
      return `Integration synced: ${details?.integration_name || entry.resource_id || "Unknown"}`;
    case "policy.updated":
      return `Policy updated: ${details?.policy_name || entry.resource_id || "Unknown"}`;
    case "agent.config.updated":
      return `Agent config updated: ${details?.agent_name || entry.resource_id || "Unknown"}`;
    default:
      return `${entry.action}: ${entry.resource_id || "Unknown"}`;
  }
}

function safeParseJSON(str: string): Record<string, string> | null {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

function formatTimestamp(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function AuditEntry({ entry, isLast, onClick }: AuditEntryProps) {
  const [expanded, setExpanded] = useState(false);
  const config = actionConfig[entry.action] || {
    icon: Settings,
    color: "text-[var(--text-secondary)]",
    bgColor: "bg-zinc-500/10",
  };
  const Icon = config.icon;

  return (
    <div className="relative flex gap-4">
      {/* Timeline connector */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
            config.bgColor
          )}
        >
          <Icon className={cn("w-4 h-4", config.color)} />
        </div>
        {!isLast && (
          <div className="w-px flex-1 bg-[var(--surface)] mt-2" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-6 min-w-0">
        <div
          className={cn(
            "flex items-start justify-between gap-4 rounded-lg px-2 py-1.5 -mx-2 -my-1.5 transition-colors",
            onClick && "cursor-pointer hover:bg-[var(--surface)]/60"
          )}
          onClick={() => onClick?.(entry)}
          role={onClick ? "button" : undefined}
          tabIndex={onClick ? 0 : undefined}
          onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(entry); } } : undefined}
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm text-[var(--text-primary)] leading-relaxed">
              {getActionDescription(entry)}
            </p>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="text-xs text-[var(--text-muted)]">{entry.actor}</span>
              <span className="text-xs text-[var(--text-muted)]">·</span>
              <span className="text-xs text-[var(--text-muted)]">
                {formatTimestamp(entry.created_at)}
              </span>
            </div>
          </div>

          {/* Hash + expand */}
          <div className="flex items-center gap-2 shrink-0">
            <code className="text-xs font-mono text-[var(--text-muted)]">
              {entry.hash.substring(0, 8)}
            </code>
            <button
              onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
              className="p-1 rounded hover:bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
            >
              {expanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-3 p-3 rounded-lg bg-[var(--surface)] border border-[var(--card-border)] space-y-2">
            <div>
              <span className="text-xs text-[var(--text-muted)]">Hash:</span>
              <code className="text-xs font-mono text-[var(--text-secondary)] ml-2 break-all">
                {entry.hash}
              </code>
            </div>
            <div>
              <span className="text-xs text-[var(--text-muted)]">Prev Hash:</span>
              <code className="text-xs font-mono text-[var(--text-secondary)] ml-2 break-all">
                {entry.prev_hash || "genesis"}
              </code>
            </div>
            <div>
              <span className="text-xs text-[var(--text-muted)]">Resource:</span>
              <span className="text-xs text-[var(--text-secondary)] ml-2">
                {entry.resource_type} / {entry.resource_id}
              </span>
            </div>
            {entry.details && (
              <div>
                <span className="text-xs text-[var(--text-muted)]">Details:</span>
                <pre className="text-xs font-mono text-[var(--text-secondary)] mt-1 overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(safeParseJSON(entry.details), null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
