"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Brain, Wrench, Sparkles, AlertCircle, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step {
  type: string;
  title: string;
  detail: string;
  duration_ms?: number;
  tokens?: number;
  system?: string;
}

interface TimelineStepProps {
  step: Step;
  index: number;
  isLast: boolean;
  elapsedBetween?: number;
}

const stepConfig: Record<string, { icon: typeof Brain; color: string; bg: string; border: string; label: string; glow: string }> = {
  plan: {
    icon: Brain,
    color: "text-[var(--primary)]",
    bg: "bg-[var(--primary-10)]",
    border: "border-[var(--primary)]/30",
    label: "Planning",
    glow: "shadow-[var(--primary)]/20",
  },
  tool_call: {
    icon: Wrench,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    label: "Tool Call",
    glow: "shadow-purple-500/20",
  },
  analysis: {
    icon: Sparkles,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    label: "Analysis",
    glow: "shadow-amber-500/20",
  },
  decision: {
    icon: AlertCircle,
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    label: "Decision",
    glow: "shadow-rose-500/20",
  },
  output: {
    icon: CheckCircle,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    label: "Output",
    glow: "shadow-emerald-500/20",
  },
};

const dotColors: Record<string, string> = {
  plan: "bg-[var(--primary)]",
  tool_call: "bg-purple-500",
  analysis: "bg-amber-500",
  decision: "bg-rose-500",
  output: "bg-emerald-500",
};

export function TimelineStep({ step, index, isLast, elapsedBetween }: TimelineStepProps) {
  const [expanded, setExpanded] = useState(false);
  const config = stepConfig[step.type] || stepConfig.plan;
  const Icon = config.icon;
  const dotColor = dotColors[step.type] || "bg-zinc-500";
  const duration = step.duration_ms ? (step.duration_ms / 1000).toFixed(1) : null;
  const detail = step.detail || "";
  const isLong = detail.length > 180;
  const displayDetail = expanded || !isLong ? detail : detail.slice(0, 180) + "...";

  return (
    <div className="relative">
      {/* Elapsed time indicator between steps */}
      {elapsedBetween != null && elapsedBetween > 0 && (
        <div className="flex items-center ml-[15px] -mt-1 mb-1">
          <div className="w-[2px] h-4 bg-[var(--surface)]" />
          <span className="text-[10px] text-[var(--text-muted)] ml-3 font-mono">+{(elapsedBetween / 1000).toFixed(1)}s</span>
        </div>
      )}

      <div className="flex gap-4">
        {/* Timeline connector */}
        <div className="flex flex-col items-center shrink-0 w-[32px]">
          {/* Dot */}
          <div className={cn(
            "w-[14px] h-[14px] rounded-full border-2 border-[#0a0a0f] z-10 ring-2 ring-offset-0",
            dotColor,
            step.type === "decision" ? "ring-rose-500/30" : step.type === "output" ? "ring-emerald-500/30" : "ring-transparent"
          )} />
          {/* Connector line */}
          {!isLast && (
            <div className="w-[2px] flex-1 bg-[var(--surface)] min-h-[16px]" />
          )}
        </div>

        {/* Step card */}
        <div className={cn(
          "flex-1 mb-4 rounded-xl border bg-[var(--card-bg)] p-4 transition-all hover:border-opacity-80",
          config.border,
          "shadow-md",
          config.glow
        )}>
          {/* Step header */}
          <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", config.bg)}>
                <Icon className={cn("w-3.5 h-3.5", config.color)} />
              </div>
              <span className="text-xs text-[var(--text-muted)]">
                Step {index + 1} · <span className={config.color}>{config.label}</span>
                {duration && <span className="text-[var(--text-muted)]"> · {duration}s</span>}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {step.system && (
                <Badge variant="outline" className="text-[10px] border-[var(--border)] text-purple-300 bg-purple-500/5 font-mono">
                  {step.system}
                </Badge>
              )}
              {step.tokens != null && step.tokens > 0 && (
                <Badge variant="outline" className="text-[10px] border-[var(--border)] text-[var(--text-secondary)] bg-[var(--surface)] font-mono">
                  {step.tokens.toLocaleString()} tokens
                </Badge>
              )}
            </div>
          </div>

          {/* Step title */}
          <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1">{step.title}</h4>

          {/* Step detail */}
          {detail && (
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed whitespace-pre-wrap">{displayDetail}</p>
          )}
          {isLong && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-[11px] text-[var(--primary)] hover:text-[var(--primary)] mt-1.5 transition-colors"
            >
              {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              {expanded ? "Show less" : "Show more"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
