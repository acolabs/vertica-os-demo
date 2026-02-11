"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import type { Step } from "./timeline-step";

interface CostBreakdownProps {
  totalCost: number;
  tokensUsed: number;
  model: string;
  decisionsCreated: number;
  steps: Step[];
}

// Approximate cost rates for claude-sonnet-4.5
const INPUT_RATE = 3.0 / 1_000_000; // $3 per 1M input tokens
const OUTPUT_RATE = 15.0 / 1_000_000; // $15 per 1M output tokens

export function CostBreakdown({ totalCost, tokensUsed, model, decisionsCreated, steps }: CostBreakdownProps) {
  // Estimate ~60% input, 40% output token split
  const inputTokens = Math.round(tokensUsed * 0.6);
  const outputTokens = tokensUsed - inputTokens;
  const inputCost = inputTokens * INPUT_RATE;
  const outputCost = outputTokens * OUTPUT_RATE;
  const costPerDecision = decisionsCreated > 0 ? totalCost / decisionsCreated : 0;

  // Per-step cost approximation
  const totalStepTokens = steps.reduce((s, st) => s + (st.tokens || 0), 0);

  return (
    <Card className="bg-[var(--card-bg)] border-[var(--card-border)]">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">Cost Breakdown</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Cost */}
        <div className="bg-[var(--surface)] rounded-xl p-4 text-center">
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Total Cost</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{formatCurrency(totalCost)}</p>
        </div>

        {/* Token Breakdown */}
        <div className="space-y-2">
          <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Token Breakdown</p>
          <div className="flex items-center justify-between bg-[var(--surface)] rounded-lg px-3 py-2">
            <span className="text-xs text-[var(--text-secondary)]">Input tokens</span>
            <div className="text-right">
              <span className="text-xs text-[var(--text-primary)] font-semibold">{inputTokens.toLocaleString()}</span>
              <span className="text-[10px] text-[var(--text-muted)] ml-1.5">{formatCurrency(inputCost)}</span>
            </div>
          </div>
          <div className="flex items-center justify-between bg-[var(--surface)] rounded-lg px-3 py-2">
            <span className="text-xs text-[var(--text-secondary)]">Output tokens</span>
            <div className="text-right">
              <span className="text-xs text-[var(--text-primary)] font-semibold">{outputTokens.toLocaleString()}</span>
              <span className="text-[10px] text-[var(--text-muted)] ml-1.5">{formatCurrency(outputCost)}</span>
            </div>
          </div>
        </div>

        {/* Per-Step Breakdown */}
        {steps.length > 0 && totalStepTokens > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Per-Step Estimate</p>
            {steps.filter(s => s.tokens && s.tokens > 0).map((step, i) => {
              const stepCost = totalStepTokens > 0 ? (totalCost * (step.tokens! / totalStepTokens)) : 0;
              return (
                <div key={i} className="flex items-center justify-between bg-[var(--surface)] rounded-lg px-3 py-2">
                  <span className="text-xs text-[var(--text-secondary)] truncate max-w-[140px]">{step.title}</span>
                  <span className="text-xs text-[var(--text-secondary)] font-mono">{formatCurrency(stepCost)}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Model */}
        <div className="space-y-2">
          <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider">Model</p>
          <div className="bg-[var(--surface)] rounded-lg px-3 py-2">
            <span className="text-xs text-[var(--text-primary)] font-mono">{model}</span>
          </div>
        </div>

        {/* Cost per Decision */}
        {decisionsCreated > 0 && (
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-3 text-center">
            <p className="text-[10px] text-emerald-500/60 uppercase tracking-wider mb-1">Cost per Decision</p>
            <p className="text-lg font-bold text-emerald-400">{formatCurrency(costPerDecision)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
