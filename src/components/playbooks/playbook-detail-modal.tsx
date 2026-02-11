"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Rocket,
  CheckCircle2,
  Database,
  HelpCircle,
  Zap,
  TrendingUp,
  Headphones,
  Shield,
  Activity,
  type LucideIcon,
} from "lucide-react";
import type { Playbook } from "./playbook-card";

const TYPE_ICONS: Record<string, LucideIcon> = {
  revenue_cadence: TrendingUp,
  support_deflection: Headphones,
  nrr: Shield,
  pipeline: Activity,
};

interface PlaybookDetailModalProps {
  playbook: Playbook | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeploy: (playbook: Playbook) => void;
}

export function PlaybookDetailModal({
  playbook,
  open,
  onOpenChange,
  onDeploy,
}: PlaybookDetailModalProps) {
  if (!playbook) return null;

  const Icon = TYPE_ICONS[playbook.type] ?? Activity;
  const isDeployed = playbook.status === "deployed";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-4xl p-0 gap-0 max-h-[90vh] flex flex-col"
        style={{
          backgroundColor: "var(--surface-elevated)",
          borderColor: "var(--card-border)",
        }}
      >
        {/* Header */}
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "var(--primary-10)" }}
            >
              <Icon className="w-5 h-5" style={{ color: "var(--primary)" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <DialogTitle
                  className="text-lg font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {playbook.name}
                </DialogTitle>
                <Badge
                  className="text-[10px] px-2 py-0.5"
                  style={{
                    backgroundColor: isDeployed
                      ? "var(--success-10)"
                      : "var(--warning-10)",
                    color: isDeployed ? "var(--success)" : "var(--warning)",
                    borderColor: isDeployed
                      ? "var(--success)"
                      : "var(--warning)",
                  }}
                >
                  {isDeployed
                    ? `Deployed to ${playbook.deployedCount} org${playbook.deployedCount !== 1 ? "s" : ""}`
                    : "In development"}
                </Badge>
              </div>
              <DialogDescription
                className="text-sm mt-1"
                style={{ color: "var(--text-secondary)" }}
              >
                {playbook.description}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Separator style={{ backgroundColor: "var(--card-border)" }} />

        {/* Scrollable content */}
        <ScrollArea className="flex-1 overflow-auto">
          <div className="p-6 space-y-6">
            {/* Section 1: How It Works */}
            {playbook.howItWorks && (
              <section>
                <SectionTitle>How It Works</SectionTitle>
                <div className="space-y-3 mt-3">
                  {playbook.howItWorks.map((step, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{
                          backgroundColor: "var(--primary-10)",
                          color: "var(--primary)",
                        }}
                      >
                        {i + 1}
                      </div>
                      <p
                        className="text-sm leading-relaxed pt-0.5"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <Separator style={{ backgroundColor: "var(--card-border)" }} />

            {/* Section 2: Deliverables */}
            {playbook.deliverables && (
              <section>
                <SectionTitle>Deliverables</SectionTitle>
                <div className="space-y-2 mt-3">
                  {playbook.deliverables.map((item, i) => (
                    <div key={i} className="flex gap-2 items-start">
                      <CheckCircle2
                        className="w-4 h-4 mt-0.5 flex-shrink-0"
                        style={{ color: "var(--success)" }}
                      />
                      <p
                        className="text-sm"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <Separator style={{ backgroundColor: "var(--card-border)" }} />

            {/* Section 3: Configuration & Setup */}
            {playbook.configurationSteps && (
              <section>
                <SectionTitle>Configuration &amp; Setup</SectionTitle>
                <div className="space-y-3 mt-3">
                  {playbook.configurationSteps.map((step, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{
                          backgroundColor: "var(--primary-10)",
                          color: "var(--primary)",
                        }}
                      >
                        {i + 1}
                      </div>
                      <p
                        className="text-sm leading-relaxed pt-0.5"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {step}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Data Requirements */}
                {playbook.dataRequirements && (
                  <div className="mt-4">
                    <div className="flex items-center gap-1.5 mb-2">
                      <Database
                        className="w-3.5 h-3.5"
                        style={{ color: "var(--text-muted)" }}
                      />
                      <span
                        className="text-xs font-medium uppercase tracking-wider"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Data Requirements
                      </span>
                    </div>
                    <div
                      className="rounded-lg p-3 space-y-1.5"
                      style={{
                        backgroundColor: "var(--surface)",
                        border: "1px solid var(--card-border)",
                      }}
                    >
                      {playbook.dataRequirements.map((req, i) => (
                        <p
                          key={i}
                          className="text-xs"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          • {req}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            <Separator style={{ backgroundColor: "var(--card-border)" }} />

            {/* Section 4: ROI Methodology */}
            {playbook.roiMethodology && (
              <section>
                <SectionTitle>ROI Methodology</SectionTitle>
                <p
                  className="text-sm leading-relaxed mt-3"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {playbook.roiMethodology}
                </p>

                {playbook.roiExample && (
                  <div
                    className="rounded-lg p-4 mt-4 space-y-3"
                    style={{
                      backgroundColor: "var(--surface)",
                      border: "1px solid var(--card-border)",
                    }}
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Zap
                        className="w-3.5 h-3.5"
                        style={{ color: "var(--primary)" }}
                      />
                      <span
                        className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--primary)" }}
                      >
                        Concrete Example
                      </span>
                    </div>
                    <RoiRow label="Scenario" value={playbook.roiExample.scenario} />
                    <RoiRow label="Baseline" value={playbook.roiExample.baseline} />
                    <RoiRow label="Improvement" value={playbook.roiExample.improvement} />
                    <RoiRow label="Dollar Impact" value={playbook.roiExample.dollarImpact} highlight />
                    <RoiRow label="Calculation" value={playbook.roiExample.calculation} highlight />
                  </div>
                )}
              </section>
            )}

            <Separator style={{ backgroundColor: "var(--card-border)" }} />

            {/* Section 5: Rollout Phases */}
            {playbook.rolloutPhases && (
              <section>
                <SectionTitle>Rollout Phases</SectionTitle>
                <div className="grid gap-3 mt-3">
                  {playbook.rolloutPhases.map((phase, i) => (
                    <div
                      key={i}
                      className="rounded-lg p-3 flex gap-4"
                      style={{
                        backgroundColor: "var(--surface)",
                        border: "1px solid var(--card-border)",
                      }}
                    >
                      <div className="flex-shrink-0">
                        <div
                          className="text-xs font-bold px-2.5 py-1 rounded-md text-center"
                          style={{
                            backgroundColor: "var(--primary-10)",
                            color: "var(--primary)",
                          }}
                        >
                          {phase.phase}
                        </div>
                        <p
                          className="text-[10px] text-center mt-1"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {phase.duration}
                        </p>
                      </div>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {phase.description}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <Separator style={{ backgroundColor: "var(--card-border)" }} />

            {/* Section 6: FAQ */}
            {playbook.faq && (
              <section>
                <SectionTitle>Frequently Asked Questions</SectionTitle>
                <div className="space-y-4 mt-3">
                  {playbook.faq.map((item, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-start gap-2">
                        <HelpCircle
                          className="w-4 h-4 mt-0.5 flex-shrink-0"
                          style={{ color: "var(--primary)" }}
                        />
                        <p
                          className="text-sm font-medium"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {item.q}
                        </p>
                      </div>
                      <p
                        className="text-sm leading-relaxed ml-6"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {item.a}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <Separator style={{ backgroundColor: "var(--card-border)" }} />

            {/* Section 7: Integrations & KPIs */}
            <section>
              <SectionTitle>Required Integrations &amp; KPIs</SectionTitle>
              <div className="mt-3 space-y-3">
                <div>
                  <span
                    className="text-[10px] font-medium uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Integrations
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {playbook.integrations.map((integration) => (
                      <span
                        key={integration}
                        className="text-xs px-2.5 py-1 rounded-full"
                        style={{
                          backgroundColor: "var(--surface)",
                          color: "var(--text-secondary)",
                          border: "1px solid var(--card-border)",
                        }}
                      >
                        {integration}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span
                    className="text-[10px] font-medium uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    KPI Impact
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {playbook.kpis.map((kpi) => (
                      <span
                        key={kpi}
                        className="text-xs px-2.5 py-1 rounded-md font-medium"
                        style={{
                          backgroundColor: "var(--primary-10)",
                          color: "var(--primary)",
                        }}
                      >
                        {kpi}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Deploy button at bottom */}
            <div className="pt-2">
              <Button
                onClick={() => {
                  onOpenChange(false);
                  onDeploy(playbook);
                }}
                className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm"
                size="sm"
              >
                <Rocket className="w-4 h-4 mr-1.5" />
                Deploy to Portfolio Company
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      className="text-sm font-semibold"
      style={{ color: "var(--text-primary)" }}
    >
      {children}
    </h3>
  );
}

function RoiRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex gap-3">
      <span
        className="text-xs font-medium w-24 flex-shrink-0 pt-0.5"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </span>
      <span
        className="text-sm"
        style={{
          color: highlight ? "var(--primary)" : "var(--text-secondary)",
          fontWeight: highlight ? 600 : 400,
        }}
      >
        {value}
      </span>
    </div>
  );
}
