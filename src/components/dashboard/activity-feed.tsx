"use client";

import React from "react";
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
    color: "text-blue-400",
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
    color: "text-blue-400",
    label: "deployed",
  },
  "agent.configured": {
    icon: Settings,
    color: "text-zinc-400",
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
      color: "text-zinc-400",
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
    <Card className="bg-[#111118] border-[#1a1a24]">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-zinc-400" />
          <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
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
                  <div className="absolute left-[9px] top-8 bottom-0 w-px bg-zinc-800/60" />
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
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    <span className="text-zinc-500">{entry.actor}</span>{" "}
                    {display.label}
                    {detail && (
                      <>
                        :{" "}
                        <span className="text-white font-medium">
                          {detail.length > 50
                            ? detail.slice(0, 50) + "…"
                            : detail}
                        </span>
                      </>
                    )}
                  </p>
                  <p className="text-[11px] text-zinc-600 mt-0.5">
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
