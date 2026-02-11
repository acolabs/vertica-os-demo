"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap, Target } from "lucide-react";

interface RecommendedAction {
  type: string;
  detail: string;
  target_system?: string;
  requires_approval?: boolean;
  [key: string]: unknown;
}

interface ActionPreview {
  system: string;
  field?: string;
  from?: string;
  to?: string;
  action?: string;
  [key: string]: unknown;
}

interface RecommendedActionsPanelProps {
  actions: RecommendedAction[];
}

interface ActionPreviewPanelProps {
  previews: ActionPreview[];
}

export function RecommendedActionsPanel({ actions }: RecommendedActionsPanelProps) {
  if (!actions || actions.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-[var(--text-muted)]">
        No recommended actions
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {actions.map((action, index) => (
        <div
          key={index}
          className="bg-[var(--surface)] rounded-lg p-3 border border-[var(--card-border)]/50"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-medium text-[var(--text-primary)] capitalize">
                {action.type?.replace(/_/g, " ")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {action.target_system && (
                <Badge
                  variant="outline"
                  className="text-[10px] border-[var(--card-border)] text-[var(--text-secondary)]"
                >
                  <Target className="w-2.5 h-2.5 mr-1" />
                  {action.target_system}
                </Badge>
              )}
              {action.requires_approval && (
                <Badge
                  variant="outline"
                  className="text-[10px] border-amber-500/30 text-amber-400"
                >
                  Requires Approval
                </Badge>
              )}
            </div>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {action.detail}
          </p>
        </div>
      ))}
    </div>
  );
}

export function ActionPreviewPanel({ previews }: ActionPreviewPanelProps) {
  if (!previews || previews.length === 0) {
    return (
      <div className="flex items-center justify-center py-8 text-sm text-[var(--text-muted)]">
        No action preview available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {previews.map((preview, index) => (
        <div
          key={index}
          className="bg-[var(--surface)] rounded-lg p-3 border border-[var(--card-border)]/50"
        >
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className="text-[10px] border-[var(--card-border)] text-[var(--primary)]"
            >
              {preview.system}
            </Badge>
            {preview.field && (
              <span className="text-[10px] text-[var(--text-muted)] font-mono">
                {preview.field}
              </span>
            )}
          </div>
          {preview.from !== undefined && preview.to !== undefined ? (
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="bg-rose-500/10 text-rose-400 px-2 py-0.5 rounded">
                {String(preview.from)}
              </span>
              <ArrowRight className="w-3 h-3 text-[var(--text-muted)] flex-shrink-0" />
              <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">
                {String(preview.to)}
              </span>
            </div>
          ) : preview.action ? (
            <p className="text-xs text-[var(--text-secondary)]">{preview.action}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
