"use client";

import React from "react";
import { Clock, TrendingUp } from "lucide-react";
import type { Deal } from "@/app/api/deals/route";

interface DealCardProps {
  deal: Deal;
  onClick: (deal: Deal) => void;
}

function thesisFitColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-yellow-400";
  return "text-red-400";
}

function thesisFitBg(score: number): string {
  if (score >= 80) return "bg-emerald-400/10 border-emerald-400/20";
  if (score >= 60) return "bg-yellow-400/10 border-yellow-400/20";
  return "bg-red-400/10 border-red-400/20";
}

export function DealCard({ deal, onClick }: DealCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(deal)}
      className="w-full text-left glass-card card-hover-lift bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4 cursor-pointer transition-all hover:bg-[var(--card-hover)]"
    >
      {/* Header: company + avatar */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <h4 className="font-semibold text-sm text-[var(--text-primary)] truncate">
            {deal.company}
          </h4>
          <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[var(--badge-muted-bg)] text-[var(--badge-muted-text)]">
            {deal.sector}
          </span>
        </div>
        <div className="shrink-0 w-7 h-7 rounded-full bg-[var(--primary-10)] flex items-center justify-center">
          <span className="text-[10px] font-semibold" style={{ color: "var(--primary)" }}>
            {deal.assignedInitial}
          </span>
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mb-3">
        <div>
          <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">ARR</span>
          <p className="text-sm font-semibold text-[var(--text-primary)]">{deal.arrDisplay}</p>
        </div>
        <div>
          <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Growth</span>
          <p className="text-sm font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span className="text-emerald-400">+{deal.yoyGrowth}%</span>
          </p>
        </div>
        <div>
          <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Check</span>
          <p className="text-xs font-medium text-[var(--text-secondary)]">{deal.checkSizeDisplay}</p>
        </div>
        <div>
          <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">EV</span>
          <p className="text-xs font-medium text-[var(--text-secondary)]">{deal.evDisplay}</p>
        </div>
      </div>

      {/* Footer: days in stage + thesis fit */}
      <div className="flex items-center justify-between pt-2 border-t border-[var(--card-border)]">
        <div className="flex items-center gap-1 text-[var(--text-muted)]">
          <Clock className="w-3 h-3" />
          <span className="text-[10px]">
            {deal.daysInStage > 0 ? `${deal.daysInStage}d in stage` : "Closed"}
          </span>
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${thesisFitBg(deal.thesisFit)} ${thesisFitColor(deal.thesisFit)}`}
        >
          Fit {deal.thesisFit}
        </div>
      </div>
    </button>
  );
}
