"use client";

import React, { useMemo } from "react";
import { SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn, formatCurrency } from "@/lib/utils";
import {
  TrendingUp,
  Activity,
  Clock,
  CheckCircle,
  DollarSign,
  Zap,
  Target,
  Timer,
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  type: string;
  status: string;
  total_runs: number;
  total_decisions: number;
  accuracy_rate: number;
  total_value_created: number;
  total_cost?: number;
}

interface AgentValueDrawerProps {
  agent: Agent;
}

/* ── Value attribution models per agent type ─────────────────────── */

const valueModels: Record<
  string,
  {
    formula: string;
    metrics: string[];
    example: string;
  }
> = {
  revenue_cadence: {
    formula:
      "Value = incremental revenue attributed to agent-recommended pipeline actions",
    metrics: [
      "Pipeline coverage improvement",
      "Stage conversion uplift",
      "Deals accelerated",
      "Forecast accuracy improvement",
    ],
    example:
      "Agent flagged 84 pipeline gaps. 67 were acted on. Those deals showed 31% higher conversion rate vs control.",
  },
  support_deflection: {
    formula:
      "Value = support cost savings from auto-resolved tickets + AHT reduction",
    metrics: [
      "Tickets deflected",
      "Cost per deflection",
      "AHT reduction",
      "CSAT maintained",
    ],
    example:
      "Agent auto-resolved 1,892 tickets at $14 avg savings = $26,488. AHT reduced 35% on remaining tickets saving $12,400/mo.",
  },
  nrr: {
    formula:
      "Value = ARR saved from prevented churn + expansion revenue from identified opportunities",
    metrics: [
      "Accounts flagged at-risk",
      "Save rate",
      "Expansion deals surfaced",
      "NRR impact",
    ],
    example:
      "Agent identified 31 at-risk accounts ($2.1M ARR). 28 were saved through recommended interventions.",
  },
  pipeline: {
    formula:
      "Value = revenue uplift from improved win rate + cycle time reduction",
    metrics: [
      "Win rate change",
      "Cycle time reduction",
      "Deals influenced",
      "Pattern accuracy",
    ],
    example:
      "Agent identified 12 winning playbook patterns. Reps following recommendations showed 5pt higher win rate.",
  },
};

/* ── Chart trend config per type ─────────────────────────────────── */

const trendConfigs: Record<
  string,
  { label: string; start: number; end: number; unit: string }
> = {
  revenue_cadence: { label: "Pipeline Coverage", start: 2.8, end: 3.6, unit: "x" },
  support_deflection: { label: "Deflection Rate", start: 12, end: 38, unit: "%" },
  nrr: { label: "Churn Risk Score", start: 8.2, end: 5.4, unit: "%" },
  pipeline: { label: "Win Rate", start: 22, end: 28, unit: "%" },
};

function generateTrendData(type: string) {
  const config = trendConfigs[type] || trendConfigs.revenue_cadence;
  return Array.from({ length: 30 }, (_, i) => ({
    day: `Day ${i + 1}`,
    value: +(
      config.start +
      (config.end - config.start) * (i / 29) +
      (Math.random() - 0.5) * 0.5
    ).toFixed(1),
  }));
}

/* ── Efficiency metrics per type ─────────────────────────────────── */

const acceptanceRates: Record<string, number> = {
  revenue_cadence: 82,
  support_deflection: 92,
  nrr: 78,
  pipeline: 85,
};

const timeToAction: Record<string, number> = {
  revenue_cadence: 4.2,
  support_deflection: 2.4,
  nrr: 8.1,
  pipeline: 5.6,
};

/* ── Type labels and colors ──────────────────────────────────────── */

const typeColors: Record<string, string> = {
  nrr: "bg-emerald-500/15 text-emerald-400",
  support: "bg-sky-500/15 text-sky-400",
  support_deflection: "bg-sky-500/15 text-sky-400",
  board_pack: "bg-purple-500/15 text-purple-400",
  pipeline: "bg-amber-500/15 text-amber-400",
  revenue_cadence: "bg-emerald-500/15 text-emerald-400",
};

const typeLabels: Record<string, string> = {
  nrr: "NRR",
  support: "Support",
  support_deflection: "Support Deflection",
  board_pack: "Board Pack",
  pipeline: "Pipeline",
  revenue_cadence: "Revenue Cadence",
};

/* ── Component ───────────────────────────────────────────────────── */

export function AgentValueDrawer({ agent }: AgentValueDrawerProps) {
  const model = valueModels[agent.type] || valueModels.revenue_cadence;
  const trendConfig = trendConfigs[agent.type] || trendConfigs.revenue_cadence;
  const trendData = useMemo(() => generateTrendData(agent.type), [agent.type]);

  const costPerDecision =
    agent.total_decisions > 0
      ? (agent.total_cost || agent.total_runs * 2) / agent.total_decisions
      : 0;
  const valuePerDecision =
    agent.total_decisions > 0
      ? agent.total_value_created / agent.total_decisions
      : 0;
  const acceptance = acceptanceRates[agent.type] || 80;
  const tta = timeToAction[agent.type] || 4.0;

  // Run stats — derive from agent data
  const completedRuns = Math.round(agent.total_runs * (agent.accuracy_rate || 0.9));
  const failedRuns = agent.total_runs - completedRuns;
  const avgDurationMs = agent.type === "support_deflection" ? 8400 : agent.type === "nrr" ? 42000 : 24000;

  return (
    <div className="flex flex-col gap-5 pb-6">
      {/* Header */}
      <SheetHeader className="pb-0">
        <div className="flex items-center gap-3 mb-1">
          <SheetTitle className="text-lg text-[var(--text-primary)]">
            {agent.name}
          </SheetTitle>
          <Badge
            variant="outline"
            className={cn("text-[10px] border-transparent", typeColors[agent.type])}
          >
            {typeLabels[agent.type] || agent.type}
          </Badge>
          <span
            className={cn(
              "w-2.5 h-2.5 rounded-full ml-auto",
              agent.status === "active"
                ? "bg-emerald-500"
                : agent.status === "paused"
                ? "bg-amber-500"
                : "bg-[var(--text-muted)]"
            )}
          />
        </div>
        <SheetDescription className="text-[var(--text-muted)] text-xs">
          How value is quantified for {agent.name}
        </SheetDescription>
      </SheetHeader>

      {/* Section 1: Value Attribution Model */}
      <section className="mx-4 rounded-lg bg-[var(--surface)] border border-[var(--card-border)] p-4">
        <h4 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-3 flex items-center gap-2">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
          Value Attribution Model
        </h4>
        <p className="text-sm text-[var(--text-secondary)] font-medium mb-3">
          {model.formula}
        </p>
        <div className="mb-3">
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1.5">
            Metrics Tracked
          </p>
          <div className="flex flex-wrap gap-1.5">
            {model.metrics.map((m) => (
              <span
                key={m}
                className="text-[11px] bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--text-secondary)] rounded px-2 py-0.5"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-3">
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">
            Example
          </p>
          <p className="text-xs text-[var(--text-secondary)] italic leading-relaxed">
            &ldquo;{model.example}&rdquo;
          </p>
        </div>
      </section>

      {/* Section 2: KPI Trend Chart */}
      <section className="mx-4 rounded-lg bg-[var(--surface)] border border-[var(--card-border)] p-4">
        <h4 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-3 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-[var(--primary)]" />
          {trendConfig.label} — Last 30 Days
        </h4>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={trendData}
              margin={{ top: 4, right: 4, bottom: 0, left: -10 }}
            >
              <defs>
                <linearGradient id={`valueGrad-${agent.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#1a1a24"
                vertical={false}
              />
              <XAxis
                dataKey="day"
                tick={{ fill: "#52525b", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval={6}
              />
              <YAxis
                tick={{ fill: "#52525b", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `${v}${trendConfig.unit}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111118",
                  border: "1px solid #1a1a24",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "#a1a1aa" }}
                formatter={(value) => [
                  `${Number(value)}${trendConfig.unit}`,
                  trendConfig.label,
                ]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#10b981"
                fill={`url(#valueGrad-${agent.id})`}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Section 3: Efficiency Metrics */}
      <section className="mx-4">
        <h4 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-3 flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          Efficiency Metrics
        </h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[var(--surface)] border border-[var(--card-border)] rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <DollarSign className="w-3 h-3 text-[var(--text-muted)]" />
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                Cost / Decision
              </span>
            </div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              ${costPerDecision.toFixed(2)}
            </p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--card-border)] rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                Value / Decision
              </span>
            </div>
            <p className="text-sm font-semibold text-emerald-400">
              {formatCurrency(valuePerDecision)}
            </p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--card-border)] rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Target className="w-3 h-3 text-[var(--primary)]" />
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                Acceptance Rate
              </span>
            </div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {acceptance}%
            </p>
          </div>
          <div className="bg-[var(--surface)] border border-[var(--card-border)] rounded-lg p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <Timer className="w-3 h-3 text-purple-400" />
              <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                Time to Action
              </span>
            </div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {tta}h
            </p>
          </div>
        </div>
      </section>

      {/* Section 4: Run Summary */}
      <section className="mx-4 rounded-lg bg-[var(--surface)] border border-[var(--card-border)] p-4">
        <h4 className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wider mb-3 flex items-center gap-2">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
          Run Summary
        </h4>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              Total Runs
            </p>
            <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">
              {agent.total_runs.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              Completed
            </p>
            <p className="text-sm font-semibold text-emerald-400 mt-0.5">
              {completedRuns.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              Failed
            </p>
            <p className="text-sm font-semibold text-rose-400 mt-0.5">
              {failedRuns.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-[var(--card-border)]">
          <div>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              Avg Duration
            </p>
            <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">
              {avgDurationMs < 60000
                ? `${(avgDurationMs / 1000).toFixed(1)}s`
                : `${(avgDurationMs / 60000).toFixed(1)}m`}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              Last Run
            </p>
            <p className="text-sm font-semibold text-[var(--text-primary)] mt-0.5">
              <Clock className="w-3 h-3 inline mr-1 text-[var(--text-muted)]" />
              2h ago
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
