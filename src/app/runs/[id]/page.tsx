"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { RunHeader } from "@/components/runs/run-header";
import { ExecutionTimeline } from "@/components/runs/execution-timeline";
import { CostBreakdown } from "@/components/runs/cost-breakdown";
import type { Step } from "@/components/runs/timeline-step";

interface RunData {
  id: string;
  org_id: string;
  agent_id: string;
  status: string;
  trigger_type: string;
  started_at: number;
  completed_at: number | null;
  duration_ms: number;
  steps: string | Step[] | null;
  tools_used: string | string[] | null;
  tokens_used: number;
  cost_usd: number;
  decisions_created: number;
  error: string | null;
}

interface Agent {
  id: string;
  name: string;
  model: string;
}

interface Decision {
  id: string;
  title: string;
  severity: string;
  status: string;
}

function safeParse<T>(val: T | string | null): T | null {
  if (val == null) return null;
  if (typeof val === "string") {
    try { return JSON.parse(val) as T; } catch { return null; }
  }
  return val;
}

const severityColors: Record<string, string> = {
  critical: "bg-rose-500/10 text-rose-400",
  high: "bg-amber-500/10 text-amber-400",
  medium: "bg-[var(--primary-10)] text-[var(--primary)]",
  low: "bg-[var(--badge-muted-bg)] text-[var(--badge-muted-text)]",
};

export default function RunDetailPage() {
  const params = useParams();
  const runId = params.id as string;

  const { data: run, isLoading: runLoading } = useQuery<RunData>({
    queryKey: ["run", runId],
    queryFn: async () => {
      const res = await fetch(`/api/runs/${runId}`);
      if (!res.ok) throw new Error("Failed to fetch run");
      return res.json();
    },
  });

  const { data: agent } = useQuery<Agent>({
    queryKey: ["agent-for-run", run?.agent_id],
    queryFn: async () => {
      const res = await fetch(`/api/agents/${run!.agent_id}`);
      if (!res.ok) throw new Error("Failed to fetch agent");
      return res.json();
    },
    enabled: !!run?.agent_id,
  });

  // Fetch decisions if run created any
  const { data: decisionsResp } = useQuery<{ decisions: Decision[] }>({
    queryKey: ["run-decisions", run?.agent_id, run?.org_id],
    queryFn: async () => {
      const res = await fetch(`/api/decisions?org_id=${run!.org_id}&agent_id=${run!.agent_id}&limit=10`);
      if (!res.ok) throw new Error("Failed to fetch decisions");
      return res.json();
    },
    enabled: !!run && run.decisions_created > 0,
  });

  if (runLoading || !run) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-32 bg-[var(--skeleton)]" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64 bg-[var(--skeleton)]" />
          <Skeleton className="h-4 w-48 bg-[var(--skeleton)]" />
        </div>
        <div className="flex gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-36 bg-[var(--skeleton)] rounded-lg" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-28 bg-[var(--skeleton)] rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-96 bg-[var(--skeleton)] rounded-xl" />
        </div>
      </div>
    );
  }

  const steps: Step[] = safeParse<Step[]>(run.steps) || [];
  const agentName = agent?.name || run.agent_id;
  const agentModel = agent?.model || "claude-sonnet-4.5";
  const decisions = decisionsResp?.decisions || [];

  return (
    <div className="space-y-6">
      <RunHeader run={run} agentName={agentName} />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Main content: Timeline */}
        <div className="space-y-6">
          <ExecutionTimeline steps={steps} />

          {/* Decisions created */}
          {run.decisions_created > 0 && decisions.length > 0 && (
            <Card className="bg-[var(--card-bg)] border-[var(--card-border)]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">
                  Decisions Created ({run.decisions_created})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {decisions.slice(0, run.decisions_created).map((d) => (
                    <div key={d.id} className="flex items-center justify-between bg-[var(--surface)] rounded-lg px-3 py-2.5">
                      <div className="flex items-center gap-2 min-w-0">
                        <Badge variant="outline" className={cn("text-[10px] border-transparent capitalize shrink-0", severityColors[d.severity])}>
                          {d.severity}
                        </Badge>
                        <span className="text-xs text-[var(--text-secondary)] truncate">{d.title}</span>
                      </div>
                      <Badge variant="outline" className="text-[10px] border-[var(--border)] text-[var(--text-muted)] capitalize shrink-0 ml-2">
                        {d.status.replace("_", " ")}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Error display */}
          {run.status === "failed" && run.error && (
            <Card className="bg-[var(--card-bg)] border-rose-500/30">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <CardTitle className="text-sm font-medium text-rose-400">Execution Error</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="text-xs text-rose-300 bg-rose-500/5 rounded-lg p-3 overflow-x-auto font-mono whitespace-pre-wrap">
                  {run.error}
                </pre>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar: Cost Breakdown */}
        <div className="space-y-4">
          <CostBreakdown
            totalCost={run.cost_usd || 0}
            tokensUsed={run.tokens_used || 0}
            model={agentModel}
            decisionsCreated={run.decisions_created || 0}
            steps={steps}
          />
        </div>
      </div>
    </div>
  );
}
