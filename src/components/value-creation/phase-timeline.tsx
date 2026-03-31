"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  Lock,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
} from "lucide-react";

interface Milestone {
  id: string;
  name: string;
  owner: string;
  status: "complete" | "in-progress" | "not-started";
  dueDay: number;
}

interface Phase {
  id: string;
  name: string;
  label: string;
  dayRange: [number, number];
  accent: string;
  progress: number;
  milestones: Milestone[];
  gate: string;
  gateStatus: "passed" | "in-progress" | "locked";
}

interface PhaseTimelineProps {
  phases: Phase[];
  currentDay: number;
}

const accentColors: Record<string, { bg: string; border: string; text: string; fill: string; progressBg: string; progressFill: string; dot: string; glow: string }> = {
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/30",
    text: "text-blue-400",
    fill: "bg-blue-500",
    progressBg: "bg-blue-500/15",
    progressFill: "bg-blue-500",
    dot: "bg-blue-500",
    glow: "shadow-[0_0_12px_rgba(59,130,246,0.3)]",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/30",
    text: "text-purple-400",
    fill: "bg-purple-500",
    progressBg: "bg-purple-500/15",
    progressFill: "bg-purple-500",
    dot: "bg-purple-500",
    glow: "shadow-[0_0_12px_rgba(168,85,247,0.3)]",
  },
  green: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    fill: "bg-emerald-500",
    progressBg: "bg-emerald-500/15",
    progressFill: "bg-emerald-500",
    dot: "bg-emerald-500",
    glow: "shadow-[0_0_12px_rgba(16,185,129,0.3)]",
  },
};

function StatusIcon({ status }: { status: Milestone["status"] }) {
  switch (status) {
    case "complete":
      return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
    case "in-progress":
      return <Clock className="w-4 h-4 text-blue-400 shrink-0 animate-pulse" />;
    case "not-started":
      return <Circle className="w-4 h-4 text-[var(--text-muted)] shrink-0" />;
  }
}

function GateIcon({ status }: { status: Phase["gateStatus"] }) {
  switch (status) {
    case "passed":
      return <ShieldCheck className="w-4 h-4 text-emerald-400" />;
    case "in-progress":
      return <Clock className="w-4 h-4 text-amber-400" />;
    case "locked":
      return <Lock className="w-4 h-4 text-[var(--text-muted)]" />;
  }
}

function PhaseCard({ phase, currentDay, isActive }: { phase: Phase; currentDay: number; isActive: boolean }) {
  const [expanded, setExpanded] = useState(isActive);
  const colors = accentColors[phase.accent] || accentColors.blue;
  const completedCount = phase.milestones.filter(m => m.status === "complete").length;
  const totalCount = phase.milestones.length;

  return (
    <div
      className={`relative rounded-xl border ${colors.border} ${colors.bg} p-5 transition-all duration-300 ${
        isActive ? colors.glow : ""
      }`}
    >
      {/* Phase header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${colors.dot} ${isActive ? "animate-pulse" : ""}`} />
          <div>
            <span className={`text-xs font-semibold uppercase tracking-wider ${colors.text}`}>
              {phase.label}
            </span>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              {phase.name}
            </h3>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-sm font-medium ${colors.text}`}>
            Days {phase.dayRange[0]}-{phase.dayRange[1]}
          </div>
          <div className="text-xs text-[var(--text-muted)]">
            {completedCount}/{totalCount} milestones
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className={`h-2.5 rounded-full ${colors.progressBg} overflow-hidden mb-3`}>
        <div
          className={`h-full rounded-full ${colors.progressFill} transition-all duration-700 ease-out`}
          style={{ width: `${phase.progress}%` }}
        />
      </div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-[var(--text-primary)]">
          {phase.progress}% complete
        </span>
        {isActive && (
          <span className={`text-xs font-medium ${colors.text} px-2 py-0.5 rounded-full ${colors.bg} border ${colors.border}`}>
            CURRENT PHASE
          </span>
        )}
      </div>

      {/* Milestones toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
      >
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        {expanded ? "Hide milestones" : "Show milestones"}
      </button>

      {/* Milestone checklist */}
      {expanded && (
        <div className="mt-3 space-y-2 border-t border-[var(--card-border)] pt-3">
          {phase.milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <StatusIcon status={milestone.status} />
              <div className="flex-1 min-w-0">
                <span className={`text-sm ${
                  milestone.status === "complete"
                    ? "text-[var(--text-secondary)] line-through opacity-60"
                    : milestone.status === "in-progress"
                    ? "text-[var(--text-primary)] font-medium"
                    : "text-[var(--text-muted)]"
                }`}>
                  {milestone.name}
                </span>
              </div>
              <span className="text-xs text-[var(--text-muted)] shrink-0">
                {milestone.owner}
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full shrink-0 font-medium ${
                milestone.status === "complete"
                  ? "bg-emerald-500/15 text-emerald-400"
                  : milestone.status === "in-progress"
                  ? "bg-blue-500/15 text-blue-400"
                  : "bg-zinc-500/15 text-zinc-500"
              }`}>
                {milestone.status === "complete" ? "Done" : milestone.status === "in-progress" ? "Active" : "Pending"}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Gate */}
      <div className="mt-3 pt-3 border-t border-[var(--card-border)] flex items-center gap-2">
        <GateIcon status={phase.gateStatus} />
        <span className="text-xs text-[var(--text-muted)]">
          <span className="font-semibold text-[var(--text-secondary)]">Gate:</span>{" "}
          {phase.gate}
        </span>
        {phase.gateStatus === "passed" && (
          <span className="ml-auto text-[10px] font-semibold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">
            PASSED
          </span>
        )}
      </div>
    </div>
  );
}

export function PhaseTimeline({ phases, currentDay }: PhaseTimelineProps) {
  // Day progress indicator position
  const totalDays = 90;
  const dayProgress = Math.min((currentDay / totalDays) * 100, 100);

  return (
    <div className="space-y-4">
      {/* Day progress indicator */}
      <div className="glass-card shadow-premium rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
            90-Day Plan Progress
          </span>
          <span className="text-sm font-bold text-[var(--text-primary)]">
            Day {currentDay} of 90
          </span>
        </div>
        <div className="relative h-3 rounded-full bg-[var(--surface)] overflow-hidden">
          {/* Phase segments */}
          <div className="absolute inset-0 flex">
            <div className="w-[33.3%] border-r border-[var(--card-border)]" />
            <div className="w-[33.3%] border-r border-[var(--card-border)]" />
            <div className="w-[33.4%]" />
          </div>
          {/* Progress fill */}
          <div
            className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 transition-all duration-700"
            style={{ width: `${dayProgress}%` }}
          />
          {/* Current day marker */}
          <div
            className="absolute top-[-3px] h-[18px] w-[3px] bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.5)]"
            style={{ left: `${dayProgress}%`, transform: "translateX(-50%)" }}
          />
        </div>
        <div className="flex justify-between mt-1.5 text-[10px] text-[var(--text-muted)]">
          <span>Day 0</span>
          <span>Day 30</span>
          <span>Day 60</span>
          <span>Day 90</span>
        </div>
      </div>

      {/* Phase cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {phases.map((phase) => {
          const isActive = currentDay >= phase.dayRange[0] && currentDay <= phase.dayRange[1];
          return (
            <PhaseCard
              key={phase.id}
              phase={phase}
              currentDay={currentDay}
              isActive={isActive}
            />
          );
        })}
      </div>
    </div>
  );
}
