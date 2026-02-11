"use client";

import type { LucideIcon } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { QueueItem } from "./queue-item";

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

interface QueueLaneProps {
  title: string;
  icon: LucideIcon;
  borderColor: string;
  iconColor: string;
  items: QueueItemData[];
  summaryMetric: string;
}

export function QueueLane({
  title,
  icon: Icon,
  borderColor,
  iconColor,
  items,
  summaryMetric,
}: QueueLaneProps) {
  const criticalCount = items.filter((i) => i.severity === "critical").length;
  const totalImpact = items.reduce(
    (sum, i) => sum + (i.impact_dollars || 0),
    0
  );

  return (
    <div
      className={cn(
        "glass-card shadow-premium rounded-xl overflow-hidden flex flex-col",
        "border-l-4",
        borderColor
      )}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--card-border)] bg-[var(--surface-elevated)]/50">
        <div className="flex items-center gap-2">
          <Icon className={cn("w-4 h-4 flex-shrink-0", iconColor)} />
          <h3 className="text-sm font-semibold text-[var(--text-primary)] truncate">
            {title}
          </h3>
        </div>
        <p className="text-[11px] text-[var(--text-muted)] mt-1">
          {items.length} items
          {criticalCount > 0 && (
            <span className="text-red-400"> · {criticalCount} critical</span>
          )}
          {totalImpact > 0 && (
            <span>
              {" "}
              · {formatCurrency(totalImpact)} {summaryMetric}
            </span>
          )}
        </p>
      </div>

      {/* Items */}
      <div className="p-3 space-y-2 overflow-y-auto max-h-[calc(100vh-340px)] min-h-[200px]">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-[var(--text-muted)]">
            No pending items
          </div>
        ) : (
          items.map((item) => <QueueItem key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
}
