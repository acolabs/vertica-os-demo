"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EvidenceItem {
  source: string;
  type: string;
  detail: string;
  [key: string]: unknown;
}

interface EvidencePanelProps {
  evidence: EvidenceItem[];
}

const sourceConfig: Record<string, { color: string; border: string }> = {
  Salesforce: { color: "text-[var(--primary)]", border: "border-l-[var(--primary)]" },
  salesforce: { color: "text-[var(--primary)]", border: "border-l-[var(--primary)]" },
  Zendesk: { color: "text-amber-400", border: "border-l-amber-500" },
  zendesk: { color: "text-amber-400", border: "border-l-amber-500" },
  "Product Analytics": {
    color: "text-purple-400",
    border: "border-l-purple-500",
  },
  product_analytics: {
    color: "text-purple-400",
    border: "border-l-purple-500",
  },
  Billing: { color: "text-emerald-400", border: "border-l-emerald-500" },
  billing: { color: "text-emerald-400", border: "border-l-emerald-500" },
  Intercom: { color: "text-sky-400", border: "border-l-sky-500" },
  intercom: { color: "text-sky-400", border: "border-l-sky-500" },
  Stripe: { color: "text-indigo-400", border: "border-l-indigo-500" },
  stripe: { color: "text-indigo-400", border: "border-l-indigo-500" },
};

function getSourceConfig(source: string) {
  return (
    sourceConfig[source] || {
      color: "text-[var(--text-secondary)]",
      border: "border-l-zinc-500",
    }
  );
}

export function EvidencePanel({ evidence }: EvidencePanelProps) {
  if (!evidence || evidence.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-[var(--text-muted)]">
        No evidence data available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {evidence.map((item, index) => {
        const config = getSourceConfig(item.source);
        return (
          <div
            key={index}
            className={cn(
              "border-l-2 bg-[var(--surface)] rounded-r-lg p-3",
              config.border
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <Badge
                variant="outline"
                className={cn("text-[10px] border-[var(--card-border)]", config.color)}
              >
                {item.source}
              </Badge>
              {item.type && (
                <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
                  {item.type}
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {item.detail}
            </p>
          </div>
        );
      })}
    </div>
  );
}
