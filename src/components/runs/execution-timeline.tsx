"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TimelineStep, type Step } from "./timeline-step";
import { Cpu } from "lucide-react";

interface ExecutionTimelineProps {
  steps: Step[];
}

export function ExecutionTimeline({ steps }: ExecutionTimelineProps) {
  if (!steps || steps.length === 0) {
    return (
      <Card className="bg-[var(--card-bg)] border-[var(--card-border)]">
        <CardContent className="py-12">
          <p className="text-center text-[var(--text-muted)] text-sm">No execution steps recorded</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Cpu className="w-5 h-5 text-[var(--primary)]" />
        <h3 className="text-base font-semibold text-[var(--text-primary)]">Execution Timeline</h3>
        <span className="text-xs text-[var(--text-muted)] ml-1">({steps.length} steps)</span>
      </div>

      <div className="relative">
        {steps.map((step, i) => {
          const elapsed = i > 0 && steps[i - 1].duration_ms ? steps[i - 1].duration_ms : undefined;
          return (
            <TimelineStep
              key={i}
              step={step}
              index={i}
              isLast={i === steps.length - 1}
              elapsedBetween={i > 0 ? elapsed : undefined}
            />
          );
        })}
      </div>
    </div>
  );
}
