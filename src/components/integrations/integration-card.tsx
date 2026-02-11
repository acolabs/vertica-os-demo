"use client";

import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Database,
  Headphones,
  MessageSquare,
  CheckSquare,
  Presentation,
  Snowflake,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface IntegrationData {
  id: string;
  name: string;
  type: string;
  status: string;
  config: string | null;
  last_sync_at: number;
  health_score: number;
}

interface IntegrationCardProps {
  integration: IntegrationData;
}

const iconMap: Record<string, { icon: React.ElementType; color: string }> = {
  Salesforce: { icon: Database, color: "text-blue-400" },
  Zendesk: { icon: Headphones, color: "text-emerald-400" },
  Snowflake: { icon: Snowflake, color: "text-cyan-400" },
  Slack: { icon: MessageSquare, color: "text-purple-400" },
  Jira: { icon: CheckSquare, color: "text-blue-400" },
  "Google Slides": { icon: Presentation, color: "text-yellow-400" },
};

const typeLabels: Record<string, string> = {
  crm: "CRM",
  support: "Support",
  data_warehouse: "Data Warehouse",
  communication: "Communication",
  project_mgmt: "Project Mgmt",
  reporting: "Reporting",
};

const dataSynced: Record<string, number> = {
  Salesforce: 24847,
  Zendesk: 18293,
  Snowflake: 156420,
  Slack: 8734,
  Jira: 12456,
  "Google Slides": 347,
};

const agentsUsing: Record<string, number> = {
  Salesforce: 3,
  Zendesk: 2,
  Snowflake: 1,
  Slack: 2,
  Jira: 1,
  "Google Slides": 1,
};

function formatTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function IntegrationCard({ integration }: IntegrationCardProps) {
  const [expanded, setExpanded] = useState(false);
  const iconInfo = iconMap[integration.name] || { icon: Database, color: "text-zinc-400" };
  const Icon = iconInfo.icon;

  const isHealthy = integration.health_score >= 0.9;
  const isDegraded = integration.health_score >= 0.7 && integration.health_score < 0.9;

  const statusDotColor = isHealthy ? "bg-emerald-400" : isDegraded ? "bg-amber-400" : "bg-rose-400";
  const statusText = isHealthy ? "Connected" : isDegraded ? "Degraded" : "Disconnected";
  const statusTextColor = isHealthy ? "text-emerald-400" : isDegraded ? "text-amber-400" : "text-rose-400";

  const healthBarColor = isHealthy ? "bg-emerald-400" : isDegraded ? "bg-amber-400" : "bg-rose-400";

  const configData = integration.config ? safeParseJSON(integration.config) : null;

  return (
    <Card className="border-[#1a1a24] bg-[#111118] hover:border-zinc-700 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center")}>
              <Icon className={cn("w-5 h-5", iconInfo.color)} />
            </div>
            <div>
              <CardTitle className="text-white text-sm">{integration.name}</CardTitle>
              <Badge variant="secondary" className="text-[10px] mt-1 bg-zinc-800 text-zinc-400">
                {typeLabels[integration.type] || integration.type}
              </Badge>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Status */}
        <div className="flex items-center gap-2">
          <div className={cn("w-2 h-2 rounded-full", statusDotColor)} />
          <span className={cn("text-xs font-medium", statusTextColor)}>{statusText}</span>
        </div>

        {/* Health Bar */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-zinc-500">Health</span>
            <span className="text-xs text-zinc-400">{Math.round(integration.health_score * 100)}%</span>
          </div>
          <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full transition-all", healthBarColor)}
              style={{ width: `${integration.health_score * 100}%` }}
            />
          </div>
        </div>

        {/* Last sync */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-500">Last sync</span>
          <span className="text-zinc-400">{formatTimeAgo(integration.last_sync_at)}</span>
        </div>

        {/* Footer stats */}
        <div className="pt-2 border-t border-zinc-800 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">Data points synced</span>
            <span className="text-zinc-300">{(dataSynced[integration.name] || 0).toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-zinc-500">Agents using</span>
            <span className="text-zinc-300">{agentsUsing[integration.name] || 0}</span>
          </div>
        </div>

        {/* Expanded details */}
        {expanded && (
          <div className="pt-3 border-t border-zinc-800 space-y-3">
            {/* Config */}
            {configData && (
              <div>
                <p className="text-xs text-zinc-500 mb-1">Configuration</p>
                <pre className="text-xs font-mono text-zinc-400 bg-zinc-900/50 p-2 rounded overflow-x-auto whitespace-pre-wrap">
                  {JSON.stringify(configData, null, 2)}
                </pre>
              </div>
            )}

            {/* Simulated sync history */}
            <div>
              <p className="text-xs text-zinc-500 mb-2">Recent Syncs</p>
              <div className="space-y-1.5">
                {[5, 35, 65, 125, 245].map((minAgo, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400">{minAgo < 60 ? `${minAgo}m ago` : `${Math.round(minAgo / 60)}h ago`}</span>
                    <div className="flex items-center gap-1.5">
                      <div className={cn("w-1.5 h-1.5 rounded-full", i === 2 && isDegraded ? "bg-amber-400" : "bg-emerald-400")} />
                      <span className="text-zinc-500">{i === 2 && isDegraded ? "Partial" : "Success"}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Agent bindings */}
            <div>
              <p className="text-xs text-zinc-500 mb-1">Agent Bindings</p>
              <div className="flex flex-wrap gap-1">
                {getAgentBindings(integration.name).map((agent) => (
                  <Badge key={agent} variant="secondary" className="text-[10px] bg-zinc-800 text-zinc-400">
                    {agent}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getAgentBindings(name: string): string[] {
  const bindings: Record<string, string[]> = {
    Salesforce: ["Renewal Guardian", "Executive Lens", "Pipeline Scout"],
    Zendesk: ["Support Sentinel", "Renewal Guardian"],
    Snowflake: ["Executive Lens"],
    Slack: ["Executive Lens", "Support Sentinel"],
    Jira: ["Renewal Guardian"],
    "Google Slides": ["Executive Lens"],
  };
  return bindings[name] || [];
}

function safeParseJSON(str: string): Record<string, unknown> | null {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}
