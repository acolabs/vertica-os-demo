"use client";

import { Layers, Clock, CheckCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface QueueStats {
  total: number;
  avgTimeHours: number;
  processedToday: number;
  slaCompliance: number;
}

interface QueueStatsBarProps {
  stats: QueueStats | undefined;
  isLoading: boolean;
}

const statCards: Array<{
  key: keyof QueueStats;
  label: string;
  icon: typeof Layers;
  format: (v: number) => string;
  color: string;
}> = [
  {
    key: "total",
    label: "Items in Queue",
    icon: Layers,
    format: (v) => String(v),
    color: "text-[var(--primary)]",
  },
  {
    key: "avgTimeHours",
    label: "Avg Time in Queue",
    icon: Clock,
    format: (v) => `${v} hrs`,
    color: "text-amber-400",
  },
  {
    key: "processedToday",
    label: "Processed Today",
    icon: CheckCircle,
    format: (v) => String(v),
    color: "text-emerald-400",
  },
  {
    key: "slaCompliance",
    label: "SLA Compliance",
    icon: ShieldCheck,
    format: (v) => `${v}%`,
    color: "text-sky-400",
  },
];

export function QueueStatsBar({ stats, isLoading }: QueueStatsBarProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statCards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.key}
            className="glass-card shadow-premium rounded-xl px-4 py-3 flex items-center gap-3"
          >
            <div
              className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
                "bg-[var(--surface-elevated)]"
              )}
            >
              <Icon className={cn("w-4 h-4", card.color)} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-[var(--text-muted)] truncate">
                {card.label}
              </p>
              {isLoading ? (
                <div className="h-6 w-12 bg-accent animate-pulse rounded mt-0.5" />
              ) : (
                <p className="text-lg font-semibold text-[var(--text-primary)]">
                  {stats ? card.format(stats[card.key]) : "—"}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
