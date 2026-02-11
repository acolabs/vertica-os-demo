"use client";

import React, { useState, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Clock,
  User,
  Hash,
  FileText,
  Box,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface AuditEntryData {
  id: string;
  org_id?: string;
  prev_hash: string | null;
  hash: string;
  actor: string;
  action: string;
  resource_type: string | null;
  resource_id: string | null;
  details: string | null;
  created_at: number;
}

interface AuditDetailDrawerProps {
  entry: AuditEntryData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function safeParseJSON(str: string): Record<string, unknown> | null {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

function formatFullTimestamp(ts: number): string {
  const d = new Date(ts);
  return d.toLocaleString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function getActionBadge(action: string): { label: string; className: string } {
  if (action.includes("approved") || action.includes("completed")) {
    return {
      label: "Success",
      className: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    };
  }
  if (action.includes("rejected") || action.includes("failed")) {
    return {
      label: "Failed",
      className: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    };
  }
  if (action.includes("created") || action.includes("sync")) {
    return {
      label: "Info",
      className: "bg-[var(--primary)]/15 text-[var(--primary)] border-[var(--primary)]/30",
    };
  }
  if (action.includes("updated")) {
    return {
      label: "Updated",
      className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    };
  }
  return {
    label: "Event",
    className: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  };
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded hover:bg-[var(--surface)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-3 h-3 text-emerald-400" />
      ) : (
        <Copy className="w-3 h-3" />
      )}
    </button>
  );
}

function DetailRow({
  icon: Icon,
  label,
  children,
}: {
  icon: React.ElementType;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-[var(--card-border)]/50 last:border-0">
      <div className="w-7 h-7 rounded-md bg-[var(--surface)] flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-[var(--text-muted)]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-0.5">
          {label}
        </p>
        <div className="text-sm text-[var(--text-primary)]">{children}</div>
      </div>
    </div>
  );
}

export function AuditDetailDrawer({
  entry,
  open,
  onOpenChange,
}: AuditDetailDrawerProps) {
  const [rawExpanded, setRawExpanded] = useState(false);

  if (!entry) return null;

  const badge = getActionBadge(entry.action);
  const parsedDetails = entry.details ? safeParseJSON(entry.details) : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn(
          "glass-card sm:max-w-md w-full",
          "bg-[var(--card-bg)]/95 backdrop-blur-xl border-l border-[var(--card-border)]",
          "overflow-y-auto"
        )}
      >
        <SheetHeader className="pb-2 border-b border-[var(--card-border)]/50">
          <div className="flex items-center gap-2 flex-wrap">
            <SheetTitle className="text-[var(--text-primary)] text-base font-semibold font-mono">
              {entry.action}
            </SheetTitle>
            <Badge
              variant="outline"
              className={cn("text-[10px] px-2 py-0", badge.className)}
            >
              {badge.label}
            </Badge>
          </div>
          <SheetDescription className="text-xs text-[var(--text-muted)]">
            Audit entry #{entry.id.substring(0, 8)}
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-6 space-y-0">
          {/* Actor */}
          <DetailRow icon={User} label="Actor">
            <span className="font-medium">{entry.actor}</span>
          </DetailRow>

          {/* Timestamp */}
          <DetailRow icon={Clock} label="Timestamp">
            {formatFullTimestamp(entry.created_at)}
          </DetailRow>

          {/* Resource */}
          <DetailRow icon={Box} label="Resource">
            <div className="flex items-center gap-2">
              {entry.resource_type && (
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 bg-[var(--surface)] text-[var(--text-secondary)] border-[var(--card-border)]"
                >
                  {entry.resource_type}
                </Badge>
              )}
              <code className="text-xs font-mono text-[var(--text-secondary)] break-all">
                {entry.resource_id || "—"}
              </code>
            </div>
          </DetailRow>

          {/* Parsed Details */}
          {parsedDetails && Object.keys(parsedDetails).length > 0 && (
            <DetailRow icon={FileText} label="Details">
              <div className="space-y-1.5 mt-1">
                {Object.entries(parsedDetails).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-start gap-2 text-xs"
                  >
                    <span className="text-[var(--text-muted)] shrink-0 min-w-[80px]">
                      {key}:
                    </span>
                    <span className="text-[var(--text-secondary)] break-all">
                      {typeof value === "object"
                        ? JSON.stringify(value)
                        : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </DetailRow>
          )}

          {/* Hash Chain */}
          <DetailRow icon={ShieldCheck} label="Hash Chain">
            <div className="space-y-2 mt-1">
              {/* Prev Hash */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[var(--text-muted)] uppercase w-[52px] shrink-0">
                  prev
                </span>
                <code className="text-xs font-mono text-[var(--text-secondary)] bg-[var(--surface)] px-2 py-1 rounded flex-1 truncate">
                  {entry.prev_hash
                    ? entry.prev_hash.substring(0, 16) + "…"
                    : "genesis"}
                </code>
                {entry.prev_hash && <CopyButton text={entry.prev_hash} />}
              </div>
              {/* Arrow */}
              <div className="flex items-center gap-2 pl-[52px]">
                <ArrowRight className="w-3 h-3 text-[var(--text-muted)]" />
              </div>
              {/* Current Hash */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[var(--text-muted)] uppercase w-[52px] shrink-0">
                  hash
                </span>
                <code className="text-xs font-mono text-[var(--primary)] bg-[var(--primary)]/5 px-2 py-1 rounded flex-1 truncate">
                  {entry.hash.substring(0, 16) + "…"}
                </code>
                <CopyButton text={entry.hash} />
              </div>
            </div>
          </DetailRow>

          {/* Raw JSON collapsible */}
          {entry.details && (
            <div className="pt-3">
              <button
                onClick={() => setRawExpanded(!rawExpanded)}
                className="flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors w-full"
              >
                {rawExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
                <Hash className="w-3.5 h-3.5" />
                <span>Raw JSON</span>
              </button>
              {rawExpanded && (
                <div className="mt-2 relative">
                  <pre className="text-xs font-mono text-[var(--text-secondary)] bg-[var(--surface)] border border-[var(--card-border)] rounded-lg p-3 overflow-x-auto whitespace-pre-wrap max-h-64 overflow-y-auto">
                    {JSON.stringify(safeParseJSON(entry.details), null, 2)}
                  </pre>
                  <div className="absolute top-2 right-2">
                    <CopyButton text={entry.details} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
