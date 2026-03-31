"use client";

import React from "react";
import { DealCard } from "./deal-card";
import type { Deal } from "@/app/api/deals/route";

interface StageColumn {
  stage: string;
  count: number;
  totalValue: number;
  totalValueDisplay: string;
  deals: Deal[];
}

interface DealPipelineProps {
  pipeline: StageColumn[];
  onDealClick: (deal: Deal) => void;
}

const stageAccents: Record<string, { border: string; bg: string; text: string; dot: string }> = {
  Sourcing: {
    border: "border-sky-400/30",
    bg: "bg-sky-400/5",
    text: "text-sky-400",
    dot: "bg-sky-400",
  },
  Screening: {
    border: "border-yellow-400/30",
    bg: "bg-yellow-400/5",
    text: "text-yellow-400",
    dot: "bg-yellow-400",
  },
  "Deep Dive": {
    border: "border-orange-400/30",
    bg: "bg-orange-400/5",
    text: "text-orange-400",
    dot: "bg-orange-400",
  },
  Diligence: {
    border: "border-purple-400/30",
    bg: "bg-purple-400/5",
    text: "text-purple-400",
    dot: "bg-purple-400",
  },
  "IC Decision": {
    border: "border-blue-400/30",
    bg: "bg-blue-400/5",
    text: "text-blue-400",
    dot: "bg-blue-400",
  },
  Closed: {
    border: "border-emerald-400/30",
    bg: "bg-emerald-400/5",
    text: "text-emerald-400",
    dot: "bg-emerald-400",
  },
};

export function DealPipeline({ pipeline, onDealClick }: DealPipelineProps) {
  return (
    <div className="overflow-x-auto pb-4 -mx-2 px-2">
      <div className="flex gap-4 min-w-max">
        {pipeline.map((col) => {
          const accent = stageAccents[col.stage] || stageAccents.Sourcing;
          return (
            <div
              key={col.stage}
              className={`w-[260px] shrink-0 flex flex-col rounded-xl border ${accent.border} ${accent.bg} bg-[var(--card-bg)]`}
            >
              {/* Column header */}
              <div className="px-4 py-3 border-b border-[var(--card-border)]">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`w-2 h-2 rounded-full ${accent.dot}`} />
                  <h3 className={`text-sm font-semibold ${accent.text}`}>
                    {col.stage}
                  </h3>
                  <span className="ml-auto text-xs font-medium bg-[var(--badge-muted-bg)] text-[var(--badge-muted-text)] rounded-full px-2 py-0.5">
                    {col.count}
                  </span>
                </div>
                <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                  {col.totalValueDisplay} pipeline
                </p>
              </div>

              {/* Cards */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto max-h-[calc(100vh-340px)]">
                {col.deals.length === 0 ? (
                  <div className="flex items-center justify-center h-20 text-xs text-[var(--text-muted)] italic">
                    No deals
                  </div>
                ) : (
                  col.deals.map((deal) => (
                    <DealCard
                      key={deal.id}
                      deal={deal}
                      onClick={onDealClick}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
