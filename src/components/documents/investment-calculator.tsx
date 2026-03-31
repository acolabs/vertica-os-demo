"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  ArrowRight,
  CheckCircle,
  Bot,
  Headphones,
  TrendingUp,
  Search,
  Settings,
  Zap,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

interface AgentOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  pilotCost: number;
  monthlyCost: number;
}

const agents: AgentOption[] = [
  {
    id: "revenue",
    name: "Revenue Cadence Agent",
    description: "Pipeline monitoring, deal scoring, cadence automation",
    icon: <TrendingUp className="w-4 h-4" />,
    pilotCost: 8000,
    monthlyCost: 4000,
  },
  {
    id: "support",
    name: "Support Deflection Agent",
    description: "Ticket triage, auto-resolution, KB matching",
    icon: <Headphones className="w-4 h-4" />,
    pilotCost: 7000,
    monthlyCost: 3500,
  },
  {
    id: "nrr",
    name: "NRR & Retention Agent",
    description: "Churn prediction, renewal risk, expansion signals",
    icon: <Shield className="w-4 h-4" />,
    pilotCost: 9000,
    monthlyCost: 5000,
  },
  {
    id: "pipeline",
    name: "Pipeline Intelligence Agent",
    description: "Deal sourcing, thesis scoring, diligence automation",
    icon: <Search className="w-4 h-4" />,
    pilotCost: 10000,
    monthlyCost: 5500,
  },
];

type Tier = "minimal" | "standard" | "full";

interface TierConfig {
  label: string;
  description: string;
  pilotMultiplier: number;
  monthlyMultiplier: number;
  features: string[];
}

const tiers: Record<Tier, TierConfig> = {
  minimal: {
    label: "Minimal Setup",
    description: "Shadow mode only — agents observe, no actions taken",
    pilotMultiplier: 0.6,
    monthlyMultiplier: 0.5,
    features: [
      "Shadow mode (observe only)",
      "Basic dashboards",
      "Email reports",
    ],
  },
  standard: {
    label: "Standard",
    description: "Suggestion mode with human approval for all actions",
    pilotMultiplier: 1.0,
    monthlyMultiplier: 1.0,
    features: [
      "Suggestion mode (HITL)",
      "Full dashboard suite",
      "Slack + email alerts",
      "Weekly optimization reviews",
    ],
  },
  full: {
    label: "Full Implementation",
    description: "Autonomous low-risk actions + HITL for high-stakes",
    pilotMultiplier: 1.4,
    monthlyMultiplier: 1.5,
    features: [
      "Autonomous + HITL hybrid",
      "Full dashboard + analytics",
      "Custom integrations",
      "Dedicated operator support",
      "Quarterly business reviews",
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

function formatPrice(value: number): string {
  if (value >= 1000) {
    const k = value / 1000;
    return k % 1 === 0 ? `$${k}K` : `$${k.toFixed(1)}K`;
  }
  return `$${value.toLocaleString()}`;
}

export function InvestmentCalculator() {
  const [selectedAgents, setSelectedAgents] = useState<Set<string>>(
    new Set(["revenue", "support", "nrr"])
  );
  const [tier, setTier] = useState<Tier>("standard");

  const toggleAgent = (id: string) => {
    setSelectedAgents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        if (next.size > 1) next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const pricing = useMemo(() => {
    const tierConfig = tiers[tier];
    const selected = agents.filter((a) => selectedAgents.has(a.id));
    const basePilot = selected.reduce((sum, a) => sum + a.pilotCost, 0);
    const baseMonthly = selected.reduce((sum, a) => sum + a.monthlyCost, 0);
    // Platform fee
    const platformPilot = 5000;
    const platformMonthly = 2000;
    const pilotTotal = Math.round(
      (basePilot + platformPilot) * tierConfig.pilotMultiplier
    );
    const monthlyTotal = Math.round(
      (baseMonthly + platformMonthly) * tierConfig.monthlyMultiplier
    );
    return { pilotTotal, monthlyTotal, agentCount: selected.length };
  }, [selectedAgents, tier]);

  const nextSteps = [
    "Select pilot portfolio company (recommendation: DSN Software \u2014 richest data, 3 agents deployed)",
    "Define primary KPI target (NRR, pipeline conversion, or support cost)",
    "Confirm system access (CRM, support platform, analytics)",
    "Identify daily operator/approver for the pilot",
    "Kick off Week 0 setup (target: within 5 business days)",
  ];

  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());
  const toggleStep = (i: number) => {
    setCheckedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <Card className="glass-card shadow-premium border-[var(--primary)]/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
          <DollarSign className="w-5 h-5 text-[var(--primary)]" />
          Investment & Next Steps
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Agent Selection */}
        <div>
          <p className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Bot className="w-3 h-3" />
            Select Agents
          </p>
          <div className="grid grid-cols-2 gap-2">
            {agents.map((agent) => {
              const selected = selectedAgents.has(agent.id);
              return (
                <button
                  key={agent.id}
                  onClick={() => toggleAgent(agent.id)}
                  className={cn(
                    "p-3 rounded-lg border text-left transition-all",
                    selected
                      ? "bg-[var(--primary-10)] border-[var(--primary)]/40"
                      : "bg-[var(--surface)] border-[var(--border-subtle)] opacity-60 hover:opacity-80"
                  )}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className={cn(
                        "w-5 h-5 rounded flex items-center justify-center",
                        selected
                          ? "bg-[var(--primary)] text-white"
                          : "bg-[var(--border-subtle)] text-[var(--text-muted)]"
                      )}
                    >
                      {selected ? (
                        <CheckCircle className="w-3.5 h-3.5" />
                      ) : (
                        <span className="w-3.5 h-3.5" />
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        selected
                          ? "text-[var(--text-primary)]"
                          : "text-[var(--text-secondary)]"
                      )}
                    >
                      {agent.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-[var(--text-muted)] ml-7 leading-snug">
                    {agent.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Configuration Tier */}
        <div>
          <p className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Settings className="w-3 h-3" />
            Configuration Tier
          </p>
          <div className="grid grid-cols-3 gap-2">
            {(Object.entries(tiers) as [Tier, TierConfig][]).map(
              ([key, config]) => {
                const active = tier === key;
                return (
                  <button
                    key={key}
                    onClick={() => setTier(key)}
                    className={cn(
                      "p-3 rounded-lg border text-left transition-all",
                      active
                        ? "bg-[var(--primary-10)] border-[var(--primary)]/40"
                        : "bg-[var(--surface)] border-[var(--border-subtle)] opacity-60 hover:opacity-80"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div
                        className={cn(
                          "w-2.5 h-2.5 rounded-full border-2",
                          active
                            ? "border-[var(--primary)] bg-[var(--primary)]"
                            : "border-[var(--text-muted)] bg-transparent"
                        )}
                      />
                      <span
                        className={cn(
                          "text-xs font-medium",
                          active
                            ? "text-[var(--text-primary)]"
                            : "text-[var(--text-secondary)]"
                        )}
                      >
                        {config.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] ml-[18px] leading-snug mb-2">
                      {config.description}
                    </p>
                    <div className="ml-[18px] space-y-1">
                      {config.features.map((f) => (
                        <div key={f} className="flex items-center gap-1.5">
                          <Zap
                            className={cn(
                              "w-2.5 h-2.5 shrink-0",
                              active
                                ? "text-[var(--primary)]"
                                : "text-[var(--text-muted)]"
                            )}
                          />
                          <span className="text-[10px] text-[var(--text-secondary)]">
                            {f}
                          </span>
                        </div>
                      ))}
                    </div>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* Dynamic Pricing */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--primary)]/30 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--primary)]" />
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
              Pilot (1 company)
            </p>
            <p className="text-2xl font-bold text-[var(--primary)]">
              {formatPrice(pricing.pilotTotal)}
            </p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              30-day proof of value &middot; {pricing.agentCount} agent
              {pricing.agentCount !== 1 ? "s" : ""}
            </p>
            <Badge
              variant="outline"
              className="mt-2 text-[9px] border-[var(--primary)]/20 text-[var(--primary)]"
            >
              {tiers[tier].label}
            </Badge>
          </div>
          <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)] relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--text-muted)]" />
            <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">
              Per Company / Month
            </p>
            <p className="text-2xl font-bold text-[var(--text-primary)]">
              {formatPrice(pricing.monthlyTotal)}
            </p>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Ongoing operation + optimization + support
            </p>
            <Badge
              variant="outline"
              className="mt-2 text-[9px] border-[var(--border-subtle)] text-[var(--text-muted)]"
            >
              {pricing.agentCount} agent{pricing.agentCount !== 1 ? "s" : ""}{" "}
              selected
            </Badge>
          </div>
        </div>

        {/* Next Steps with Checkboxes */}
        <div className="p-4 rounded-lg bg-[var(--primary-10)] border border-[var(--primary)]/20">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              Immediate Next Steps
            </h3>
            <Badge
              variant="outline"
              className="text-[9px] border-[var(--primary)]/30 text-[var(--primary)]"
            >
              {checkedSteps.size}/{nextSteps.length} complete
            </Badge>
          </div>
          <div className="space-y-1.5">
            {nextSteps.map((step, i) => {
              const checked = checkedSteps.has(i);
              return (
                <button
                  key={i}
                  onClick={() => toggleStep(i)}
                  className="flex items-start gap-2.5 w-full text-left group py-1"
                >
                  <div
                    className={cn(
                      "w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5 transition-all",
                      checked
                        ? "bg-[var(--primary)] border-[var(--primary)]"
                        : "border-[var(--primary)]/40 bg-transparent group-hover:border-[var(--primary)]/70"
                    )}
                  >
                    {checked && (
                      <CheckCircle className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-xs transition-all",
                      checked
                        ? "text-[var(--text-muted)] line-through"
                        : "text-[var(--text-secondary)]"
                    )}
                  >
                    {step}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
