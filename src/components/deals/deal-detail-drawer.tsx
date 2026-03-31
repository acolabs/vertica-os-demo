"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  CheckCircle,
  Circle,
  AlertTriangle,
  Building2,
  Users,
  Calendar,
  TrendingUp,
  DollarSign,
  Target,
  ArrowRight,
} from "lucide-react";
import type { Deal } from "@/app/api/deals/route";

interface DealDetailDrawerProps {
  deal: Deal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function thesisFitColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-yellow-400";
  return "text-red-400";
}

function thesisFitBg(score: number): string {
  if (score >= 80) return "bg-emerald-400/10";
  if (score >= 60) return "bg-yellow-400/10";
  return "bg-red-400/10";
}

const stageColors: Record<string, string> = {
  Sourcing: "bg-sky-400/15 text-sky-400",
  Screening: "bg-yellow-400/15 text-yellow-400",
  "Deep Dive": "bg-orange-400/15 text-orange-400",
  Diligence: "bg-purple-400/15 text-purple-400",
  "IC Decision": "bg-blue-400/15 text-blue-400",
  Closed: "bg-emerald-400/15 text-emerald-400",
};

export function DealDetailDrawer({
  deal,
  open,
  onOpenChange,
}: DealDetailDrawerProps) {
  if (!deal) return null;

  const diligenceDone = deal.diligenceChecklist.filter((i) => i.done).length;
  const diligenceTotal = deal.diligenceChecklist.length;
  const diligencePct = Math.round((diligenceDone / diligenceTotal) * 100);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="!w-[520px] !max-w-[520px] bg-[var(--background)] border-l border-[var(--card-border)] overflow-y-auto"
      >
        <SheetHeader className="pb-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <SheetTitle className="text-xl text-[var(--text-primary)]">
                {deal.company}
              </SheetTitle>
              <SheetDescription className="flex items-center gap-2 mt-1">
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${stageColors[deal.stage] || ""}`}
                >
                  {deal.stage}
                </span>
                <span className="text-[var(--text-muted)] text-xs">
                  {deal.sector}
                </span>
              </SheetDescription>
            </div>
            <div
              className={`shrink-0 flex flex-col items-center px-3 py-2 rounded-lg ${thesisFitBg(deal.thesisFit)}`}
            >
              <span className={`text-2xl font-bold ${thesisFitColor(deal.thesisFit)}`}>
                {deal.thesisFit}
              </span>
              <span className="text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                Thesis Fit
              </span>
            </div>
          </div>
        </SheetHeader>

        <div className="px-4 pb-6 space-y-5">
          {/* Company Overview */}
          <section className="glass-card bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
              Company Overview
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <MetricItem icon={DollarSign} label="ARR" value={deal.arrDisplay} />
              <MetricItem
                icon={TrendingUp}
                label="YoY Growth"
                value={`+${deal.yoyGrowth}%`}
                valueClass="text-emerald-400"
              />
              <MetricItem icon={Target} label="NRR" value={`${deal.nrr}%`} />
              <MetricItem
                icon={Building2}
                label="Gross Margin"
                value={`${deal.grossMargin}%`}
              />
              <MetricItem icon={Users} label="Headcount" value={String(deal.headcount)} />
              <MetricItem
                icon={Calendar}
                label="Founded"
                value={String(deal.founded)}
              />
            </div>
          </section>

          {/* Investment Thesis */}
          <section className="glass-card bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">
              Investment Thesis
            </h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {deal.investmentThesis}
            </p>
          </section>

          {/* Financial Summary */}
          <section className="glass-card bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
              Financial Summary
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[var(--surface)] rounded-lg p-3">
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                  Enterprise Value
                </span>
                <p className="text-lg font-bold text-[var(--text-primary)]">
                  {deal.evDisplay}
                </p>
              </div>
              <div className="bg-[var(--surface)] rounded-lg p-3">
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                  Check Size
                </span>
                <p className="text-lg font-bold text-[var(--text-primary)]">
                  {deal.checkSizeDisplay}
                </p>
              </div>
              <div className="bg-[var(--surface)] rounded-lg p-3">
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                  Ownership
                </span>
                <p className="text-lg font-bold text-[var(--text-primary)]">
                  {deal.ownershipPercent}%
                </p>
              </div>
              <div className="bg-[var(--surface)] rounded-lg p-3">
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                  Projected MOIC
                </span>
                <p className="text-lg font-bold text-emerald-400">
                  {deal.projectedMoic}x
                </p>
              </div>
            </div>
            <div className="mt-3 bg-[var(--surface)] rounded-lg p-3 flex items-center justify-between">
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                Projected IRR
              </span>
              <span className="text-lg font-bold text-emerald-400">
                {deal.projectedIrr}%
              </span>
            </div>
          </section>

          {/* Diligence Checklist */}
          <section className="glass-card bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                Diligence Checklist
              </h3>
              <span className="text-xs font-medium text-[var(--text-secondary)]">
                {diligenceDone}/{diligenceTotal} ({diligencePct}%)
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full h-1.5 rounded-full bg-[var(--surface)] mb-3">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${diligencePct}%`,
                  background:
                    diligencePct === 100
                      ? "var(--success)"
                      : "var(--primary)",
                }}
              />
            </div>
            <ul className="space-y-2">
              {deal.diligenceChecklist.map((item, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  {item.done ? (
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                  ) : (
                    <Circle className="w-4 h-4 shrink-0 text-[var(--text-muted)]" />
                  )}
                  <span
                    className={`text-sm ${item.done ? "text-[var(--text-secondary)]" : "text-[var(--text-muted)]"}`}
                  >
                    {item.item}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Red Flags */}
          {deal.redFlags.length > 0 && (
            <section className="glass-card bg-red-500/5 border border-red-500/20 rounded-xl p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-red-400 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Red Flags
              </h3>
              <ul className="space-y-1.5">
                {deal.redFlags.map((flag, i) => (
                  <li
                    key={i}
                    className="text-sm text-red-300/80 flex items-start gap-2"
                  >
                    <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-red-400" />
                    {flag}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Team Assignment */}
          <section className="glass-card bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">
              Deal Team
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[var(--primary-10)] flex items-center justify-center">
                <span
                  className="text-xs font-semibold"
                  style={{ color: "var(--primary)" }}
                >
                  {deal.assignedInitial}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">
                  {deal.assignedTo}
                </p>
                <p className="text-xs text-[var(--text-muted)]">Deal Lead</p>
              </div>
            </div>
          </section>

          {/* Stage History Timeline */}
          <section className="glass-card bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl p-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">
              Stage History
            </h3>
            <div className="space-y-0">
              {deal.stageHistory.map((entry, i) => {
                const isLast = i === deal.stageHistory.length - 1;
                const isCurrent = entry.stage === deal.stage;
                return (
                  <div key={i} className="flex items-start gap-3">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          isCurrent
                            ? "bg-[var(--primary)] ring-2 ring-[var(--primary-20)]"
                            : "bg-[var(--text-muted)]"
                        }`}
                      />
                      {!isLast && (
                        <div className="w-px h-8 bg-[var(--card-border)]" />
                      )}
                    </div>
                    <div className="pb-3 -mt-0.5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-sm font-medium ${isCurrent ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}
                        >
                          {entry.stage}
                        </span>
                        {!isLast && (
                          <ArrowRight className="w-3 h-3 text-[var(--text-muted)]" />
                        )}
                        {entry.daysSpent > 0 && (
                          <span className="text-[10px] text-[var(--text-muted)]">
                            {entry.daysSpent}d
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[var(--text-muted)]">
                        {entry.enteredDate}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function MetricItem({
  icon: Icon,
  label,
  value,
  valueClass,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="w-3.5 h-3.5 text-[var(--text-muted)]" />
      <div>
        <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
          {label}
        </span>
        <p className={`text-sm font-semibold ${valueClass || "text-[var(--text-primary)]"}`}>
          {value}
        </p>
      </div>
    </div>
  );
}
