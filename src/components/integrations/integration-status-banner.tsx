"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Plug } from "lucide-react";
import { cn } from "@/lib/utils";

interface Integration {
  status: string;
  health_score: number;
  last_sync_at: number;
}

interface IntegrationStatusBannerProps {
  integrations: Integration[];
}

export function IntegrationStatusBanner({ integrations }: IntegrationStatusBannerProps) {
  const connected = integrations.filter((i) => i.status === "connected").length;
  const healthy = integrations.filter((i) => i.status === "connected" && i.health_score >= 0.9).length;
  const degraded = integrations.filter((i) => i.status === "connected" && i.health_score < 0.9).length;
  const allHealthy = degraded === 0;

  const lastSync = integrations.reduce((max, i) => {
    return i.last_sync_at > max ? i.last_sync_at : max;
  }, 0);

  const syncAgo = lastSync > 0 ? Math.round((Date.now() - lastSync) / 60000) : 0;
  const syncText = syncAgo <= 1 ? "just now" : `${syncAgo} min ago`;

  return (
    <Card className={cn(
      "border-[var(--card-border)] bg-[var(--card-bg)]",
      allHealthy ? "border-emerald-500/20" : "border-amber-500/20"
    )}>
      <CardContent className="pt-0">
        <div className="flex items-center gap-4">
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center shrink-0",
            allHealthy ? "bg-emerald-500/10" : "bg-amber-500/10"
          )}>
            <Plug className={cn(
              "w-6 h-6",
              allHealthy ? "text-emerald-400" : "text-amber-400"
            )} />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--text-primary)]">{connected}</span> integrations connected
            </span>
            <span className="text-sm text-[var(--text-muted)]">|</span>
            <span className="text-sm text-emerald-400">
              <span className="font-semibold">{healthy}</span> healthy
            </span>
            <span className="text-sm text-[var(--text-muted)]">|</span>
            <span className={cn(
              "text-sm",
              degraded > 0 ? "text-amber-400" : "text-[var(--text-secondary)]"
            )}>
              <span className="font-semibold">{degraded}</span> degraded
            </span>
            <span className="text-sm text-[var(--text-muted)]">|</span>
            <span className="text-sm text-[var(--text-secondary)]">Last sync: {syncText}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
