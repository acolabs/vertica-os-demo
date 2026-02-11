"use client";

import { Check, X, Clock, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency, timeAgo } from "@/lib/utils";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useOrg } from "@/lib/hooks/use-org";
import { useState } from "react";

interface QueueItemData {
  id: string;
  title: string;
  severity: string;
  account_name: string | null;
  account_arr: number | null;
  impact_dollars: number | null;
  confidence: number | null;
  created_at: number;
}

interface QueueItemProps {
  item: QueueItemData;
}

const severityConfig: Record<
  string,
  { label: string; className: string }
> = {
  critical: {
    label: "Critical",
    className: "bg-red-500/15 text-red-400 border-red-500/30",
  },
  high: {
    label: "High",
    className: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  medium: {
    label: "Medium",
    className: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
  low: {
    label: "Low",
    className: "bg-zinc-500/15 text-zinc-400 border-zinc-500/30",
  },
};

export function QueueItem({ item }: QueueItemProps) {
  const queryClient = useQueryClient();
  const { orgId } = useOrg();
  const [acting, setActing] = useState<"approve" | "reject" | null>(null);

  const sev = severityConfig[item.severity] || severityConfig.low;

  async function handleAction(action: "approve" | "reject") {
    setActing(action);
    try {
      const res = await fetch(`/api/decisions/${item.id}/${action}`, {
        method: "POST",
      });
      if (!res.ok) throw new Error(`Failed to ${action}`);
      toast.success(
        `${action === "approve" ? "Approved" : "Rejected"}: ${item.title}`
      );
      queryClient.invalidateQueries({ queryKey: ["queues", orgId] });
    } catch {
      toast.error(`Failed to ${action} decision`);
    } finally {
      setActing(null);
    }
  }

  return (
    <div className="rounded-lg bg-[var(--surface)] border border-[var(--card-border)] p-3 space-y-2 hover:bg-[var(--surface-elevated)] transition-colors">
      {/* Top row: severity + time */}
      <div className="flex items-center justify-between gap-2">
        <Badge
          variant="outline"
          className={cn("text-[10px] px-1.5 py-0", sev.className)}
        >
          {item.severity === "critical" && (
            <AlertTriangle className="w-3 h-3 mr-0.5" />
          )}
          {sev.label}
        </Badge>
        <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {timeAgo(item.created_at)}
        </span>
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-[var(--text-primary)] leading-snug line-clamp-2">
        {item.title}
      </p>

      {/* Account + ARR */}
      {item.account_name && (
        <p className="text-xs text-[var(--text-secondary)] truncate">
          {item.account_name}
          {item.account_arr ? (
            <span className="text-[var(--text-muted)]">
              {" "}
              · {formatCurrency(item.account_arr)} ARR
            </span>
          ) : null}
        </p>
      )}

      {/* Impact + Confidence */}
      <div className="flex items-center justify-between gap-2">
        {item.impact_dollars != null && (
          <span className="text-xs font-medium text-emerald-400">
            {formatCurrency(item.impact_dollars)} impact
          </span>
        )}
        {item.confidence != null && (
          <div className="flex items-center gap-1.5">
            <div className="w-16 h-1.5 rounded-full bg-[var(--surface-elevated)] overflow-hidden">
              <div
                className="h-full rounded-full bg-[var(--primary)]"
                style={{ width: `${Math.round(item.confidence * 100)}%` }}
              />
            </div>
            <span className="text-[10px] text-[var(--text-muted)]">
              {Math.round(item.confidence * 100)}%
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-1.5 pt-1">
        <Button
          variant="ghost"
          size="icon-xs"
          className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
          disabled={acting !== null}
          onClick={() => handleAction("approve")}
        >
          <Check className="w-3.5 h-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon-xs"
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
          disabled={acting !== null}
          onClick={() => handleAction("reject")}
        >
          <X className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
