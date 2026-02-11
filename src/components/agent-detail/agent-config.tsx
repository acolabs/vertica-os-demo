"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Zap, Clock, Cpu } from "lucide-react";

interface AgentConfigProps {
  config: Record<string, unknown> | null;
  model: string;
}

function parseConfig(config: Record<string, unknown> | string | null): Record<string, unknown> {
  if (!config) return {};
  if (typeof config === "string") {
    try { return JSON.parse(config); } catch { return {}; }
  }
  return config;
}

export function AgentConfig({ config, model }: AgentConfigProps) {
  const parsed = parseConfig(config);
  const capabilities = (parsed.capabilities as string[]) || [];
  const thresholds = (parsed.thresholds as Record<string, unknown>) || {};
  const schedule = (parsed.schedule as string) || (parsed.cron as string) || null;
  const modelParams = (parsed.model_params as Record<string, unknown>) || {};

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Capabilities */}
      <Card className="bg-[#111118] border-[#1a1a24]">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <CardTitle className="text-sm font-medium text-zinc-300">Capabilities</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {capabilities.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {capabilities.map((cap) => (
                <Badge key={cap} variant="outline" className="text-xs border-[#2a2a34] text-zinc-300 bg-[#0a0a0f] font-mono">
                  {cap}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">No capabilities configured</p>
          )}
        </CardContent>
      </Card>

      {/* Thresholds */}
      <Card className="bg-[#111118] border-[#1a1a24]">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-blue-400" />
            <CardTitle className="text-sm font-medium text-zinc-300">Thresholds</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {Object.keys(thresholds).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(thresholds).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between bg-[#0a0a0f] rounded-lg px-3 py-2">
                  <span className="text-xs text-zinc-400 font-mono">{key.replace(/_/g, " ")}</span>
                  <span className="text-xs text-white font-semibold">{String(value)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-zinc-500">No thresholds configured</p>
          )}
        </CardContent>
      </Card>

      {/* Schedule */}
      <Card className="bg-[#111118] border-[#1a1a24]">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <CardTitle className="text-sm font-medium text-zinc-300">Schedule</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {schedule ? (
            <div className="bg-[#0a0a0f] rounded-lg px-3 py-2">
              <span className="text-xs text-white font-mono">{schedule}</span>
            </div>
          ) : (
            <p className="text-sm text-zinc-500">Event-driven (no fixed schedule)</p>
          )}
        </CardContent>
      </Card>

      {/* Model */}
      <Card className="bg-[#111118] border-[#1a1a24]">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-emerald-400" />
            <CardTitle className="text-sm font-medium text-zinc-300">Model</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-[#0a0a0f] rounded-lg px-3 py-2">
              <span className="text-xs text-zinc-400">Model</span>
              <span className="text-xs text-white font-mono font-semibold">{model}</span>
            </div>
            {Object.entries(modelParams).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between bg-[#0a0a0f] rounded-lg px-3 py-2">
                <span className="text-xs text-zinc-400">{key.replace(/_/g, " ")}</span>
                <span className="text-xs text-white font-semibold">{String(value)}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
