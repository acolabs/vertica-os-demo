"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Bot,
  Shield,
  Settings,
  Zap,
  Clock,
  Activity,
  ArrowRight,
} from "lucide-react";
import { cn, timeAgo } from "@/lib/utils";

interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: string;
  created_at: number;
}

interface ActivityFeedProps {
  entries: AuditEntry[];
}

const actionConfig: Record<
  string,
  { icon: typeof CheckCircle; color: string; label: string }
> = {
  "decision.created": {
    icon: AlertCircle,
    color: "text-[var(--primary)]",
    label: "created decision",
  },
  "decision.approved": {
    icon: CheckCircle,
    color: "text-emerald-400",
    label: "approved decision",
  },
  "decision.rejected": {
    icon: XCircle,
    color: "text-rose-400",
    label: "rejected decision",
  },
  "agent.run_completed": {
    icon: Zap,
    color: "text-purple-400",
    label: "completed run",
  },
  "agent.deployed": {
    icon: Bot,
    color: "text-[var(--primary)]",
    label: "deployed",
  },
  "agent.configured": {
    icon: Settings,
    color: "text-[var(--text-muted)]",
    label: "configured agent",
  },
  "policy.created": {
    icon: Shield,
    color: "text-amber-400",
    label: "created policy",
  },
  "integration.connected": {
    icon: Zap,
    color: "text-emerald-400",
    label: "connected integration",
  },
};

function getActionDisplay(action: string) {
  return (
    actionConfig[action] || {
      icon: Activity,
      color: "text-[var(--text-muted)]",
      label: action.replace(".", " "),
    }
  );
}

function parseDetails(details: string): string {
  try {
    const parsed = JSON.parse(details);
    if (parsed.title) return parsed.title;
    if (parsed.name) return parsed.name;
    if (parsed.agent_name) return parsed.agent_name;
    return "";
  } catch {
    return "";
  }
}

export function ActivityFeed({ entries }: ActivityFeedProps) {
  return (
    <Card className="bg-[var(--card-bg)] border-[var(--card-border)] glass-card shadow-premium">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[var(--text-muted)]" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Recent Activity</h3>
          </div>
          <Link
            href="/audit"
            className="inline-flex items-center gap-1 text-[11px] text-[var(--text-muted)] hover:text-[var(--primary)] transition-colors"
          >
            View Audit Log <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="pt-0 max-h-[280px] overflow-y-auto">
        <div className="space-y-0">
          {entries.map((entry, index) => {
            const display = getActionDisplay(entry.action);
            const Icon = display.icon;
            const detail = parseDetails(entry.details);

            return (
              <div
                key={entry.id}
                className="flex items-start gap-3 py-2.5 relative"
              >
                {index < entries.length - 1 && (
                  <div className="absolute left-[9px] top-8 bottom-0 w-px bg-[var(--border)]/60" />
                )}
                <div
                  className={cn(
                    "w-[18px] h-[18px] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                    display.color
                  )}
                >
                  <Icon className="w-[14px] h-[14px]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                    <span className="text-[var(--text-muted)]">{entry.actor}</span>{" "}
                    {display.label}
                    {detail && (
                      <>
                        :{" "}
                        <span className="text-[var(--text-primary)] font-medium">
                          {detail.length > 50
                            ? detail.slice(0, 50) + "…"
                            : detail}
                        </span>
                      </>
                    )}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                    {timeAgo(entry.created_at)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
