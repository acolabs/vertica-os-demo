"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, Brain } from "lucide-react";

interface AgentMemoryProps {
  agentType: string;
}

interface MemoryEntry {
  pattern: string;
  confidence: number;
  observations: number;
  daysAgo: number;
}

const MEMORY_DATA: Record<string, string[]> = {
  nrr: [
    "Accounts with >25% usage decline and open P1 tickets have 78% churn probability",
    "Champion departures are the strongest single predictor of churn (3.2x risk multiplier)",
    "Renewal offers with 10-15% discount range have 67% acceptance rate",
    "Accounts in the Manufacturing vertical show seasonal Q4 usage dips that normalize by Q2",
    "Multi-threaded relationships (3+ stakeholders) reduce churn risk by 45%",
    "Accounts with NPS score drop >20 points in 30 days have 4x higher escalation rate",
    "Early engagement (60+ days before renewal) increases renewal rate by 31%",
  ],
  support: [
    "Password reset tickets can be safely auto-resolved with 99.2% accuracy",
    "Billing inquiry resolution time improved 52% with account context pre-loading",
    "P1 tickets mentioning 'data loss' should always escalate regardless of confidence score",
    "API rate limiting complaints correlate with accounts approaching plan limits",
    "Average first-response time target: 4 minutes for P1, 15 minutes for P2",
    "Tickets from enterprise accounts with >$500K ARR should auto-elevate priority",
    "Weekend support tickets have 23% higher resolution complexity",
  ],
  board_pack: [
    "Pipeline coverage below 3x signals revenue risk in next quarter",
    "Support ticket volume spikes >30% week-over-week correlate with NPS drops",
    "Gross margin compression >2% month-over-month warrants board attention",
    "Q4 and Q1 show natural churn seasonality — adjust baselines accordingly",
    "Cross-referencing CRM and product analytics catches 23% more anomalies than either alone",
    "Board members respond best to variance-from-plan framing over absolute numbers",
    "Including competitive win/loss data improves board engagement scores by 18%",
  ],
  pipeline: [
    "Deals stalled >21 days in Stage 3 have 67% lower close rate",
    "Multi-threading (3+ contacts) increases win rate by 2.4x in enterprise deals",
    "Competitive displacement deals take 1.8x longer but have 40% higher ACV",
    "POC completion within 14 days correlates with 89% close rate",
    "Q4 budget flush creates 2.3x pipeline velocity in last 3 weeks of quarter",
    "Champion-led deals close 34% faster than committee-driven evaluations",
  ],
};

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function AgentMemory({ agentType }: AgentMemoryProps) {
  const memories: MemoryEntry[] = useMemo(() => {
    const patterns = MEMORY_DATA[agentType] || MEMORY_DATA.nrr;
    return patterns.map((pattern, i) => ({
      pattern,
      confidence: Math.round(85 + seededRandom(i + 1) * 13),
      observations: Math.round(20 + seededRandom(i + 10) * 80),
      daysAgo: Math.round(1 + seededRandom(i + 20) * 14),
    }));
  }, [agentType]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Brain className="w-5 h-5 text-purple-400" />
        <h3 className="text-base font-semibold text-[var(--text-primary)]">Agent Knowledge Base</h3>
        <span className="text-xs text-[var(--text-muted)] ml-1">({memories.length} learned patterns)</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {memories.map((mem, i) => (
          <Card key={i} className="bg-[var(--card-bg)] border-[var(--card-border)] hover:border-[var(--border)] transition-colors py-4">
            <CardHeader className="pb-1 pt-0">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Lightbulb className="w-4 h-4 text-amber-400" />
                </div>
                <CardTitle className="text-sm font-medium text-[var(--text-primary)] leading-relaxed">
                  {mem.pattern}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0 pl-[3.25rem]">
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[11px] text-[var(--text-muted)]">Confidence: <span className="text-[var(--text-secondary)] font-medium">{mem.confidence}%</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                  <span className="text-[11px] text-[var(--text-muted)]">Learned from: <span className="text-[var(--text-secondary)] font-medium">{mem.observations} observations</span></span>
                </div>
                <span className="text-[11px] text-[var(--text-muted)]">Updated {mem.daysAgo}d ago</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
