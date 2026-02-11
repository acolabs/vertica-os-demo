"use client";

import React, { useEffect, useState } from "react";
import { FlaskConical, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { DemoTooltip } from "@/components/demo-tooltip";
import { useOrg } from "@/lib/hooks/use-org";
import { EvalScorecard, type ScorecardData } from "@/components/evaluations/eval-scorecard";
import { EvalResultsTable, type EvalHistoryRow } from "@/components/evaluations/eval-results-table";
import { BeforeAfterChart, type BeforeAfterRow } from "@/components/evaluations/before-after-chart";

interface EvalResponse {
  scorecards: ScorecardData[];
  beforeAfter: BeforeAfterRow[];
  history: EvalHistoryRow[];
}

export default function EvaluationsPage() {
  const { orgId } = useOrg();
  const [data, setData] = useState<EvalResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/evaluations?org_id=${orgId}`)
      .then((r) => r.json())
      .then((d: EvalResponse) => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [orgId]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 bg-[var(--skeleton)]" />
          <Skeleton className="h-4 w-96 mt-2 bg-[var(--skeleton)]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-72 bg-[var(--skeleton)] rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 bg-[var(--skeleton)] rounded-xl" />
        <Skeleton className="h-64 bg-[var(--skeleton)] rounded-xl" />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--primary-10)] flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Evaluations &amp; Replay
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Validate agent performance on historical data before production
              deployment
            </p>
          </div>
        </div>
      </div>

      {/* Section 1: Evaluation Scorecards */}
      <div>
        <DemoTooltip
          content="Run agents on historical data to validate accuracy before production. This is how we prove ROI before a single dollar is spent."
          side="right"
        >
          <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Evaluation Scorecards
          </h2>
        </DemoTooltip>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-3">
          {data.scorecards.map((sc) => (
            <EvalScorecard key={sc.id} data={sc} />
          ))}
        </div>
      </div>

      {/* Section 2: Before vs After */}
      <div>
        <DemoTooltip
          content="Before/after comparison using actual historical data. These aren't projections — they're validated results from replay runs."
          side="right"
        >
          <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-3">
            Before vs After
          </h2>
        </DemoTooltip>
        <BeforeAfterChart data={data.beforeAfter} />
      </div>

      {/* Section 3: Evaluation History */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-[var(--text-muted)]" />
          <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Evaluation History
          </h2>
        </div>
        <EvalResultsTable rows={data.history} />
      </div>
    </div>
  );
}
