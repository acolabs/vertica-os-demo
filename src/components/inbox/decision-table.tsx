"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Inbox } from "lucide-react";
import { cn, formatCurrency, timeAgo } from "@/lib/utils";
import { useOrg } from "@/lib/hooks/use-org";
import { useQuery } from "@tanstack/react-query";
import { DecisionDrawer } from "./decision-drawer";
import { Skeleton } from "@/components/ui/skeleton";

interface Decision {
  id: string;
  org_id: string;
  agent_id: string;
  type: string;
  severity: string;
  status: string;
  title: string;
  summary: string;
  impact_dollars: number;
  confidence: number;
  evidence: string;
  recommended_action: string;
  action_preview: string;
  account_name: string;
  account_arr: number;
  created_at: number;
  due_date: number;
  approved_by?: string;
  approved_at?: number;
}

interface Agent {
  id: string;
  name: string;
}

const severityColors: Record<string, string> = {
  critical: "bg-rose-500/15 text-rose-400 border-rose-500/20",
  high: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  medium: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  low: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20",
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-400",
  approved: "bg-emerald-500/15 text-emerald-400",
  rejected: "bg-rose-500/15 text-rose-400",
  escalated: "bg-purple-500/15 text-purple-400",
  auto_resolved: "bg-blue-500/15 text-blue-400",
};

const severityOrder: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export function DecisionTable() {
  const { orgId } = useOrg();
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [agentFilter, setAgentFilter] = useState<string>("all");
  const [selectedDecision, setSelectedDecision] = useState<Decision | null>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  const buildUrl = () => {
    const params = new URLSearchParams({ org_id: orgId });
    if (severityFilter !== "all") params.set("severity", severityFilter);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (agentFilter !== "all") params.set("agent_id", agentFilter);
    params.set("limit", "100");
    return `/api/decisions?${params.toString()}`;
  };

  const { data, isLoading } = useQuery({
    queryKey: ["decisions", orgId, severityFilter, statusFilter, agentFilter],
    queryFn: async () => {
      const res = await fetch(buildUrl());
      if (!res.ok) throw new Error("Failed to fetch decisions");
      return res.json() as Promise<{ decisions: Decision[]; total: number }>;
    },
    refetchInterval: 15_000,
  });

  const { data: agents } = useQuery({
    queryKey: ["agents", orgId],
    queryFn: async () => {
      const res = await fetch(`/api/agents?org_id=${orgId}`);
      if (!res.ok) throw new Error("Failed to fetch agents");
      return res.json() as Promise<Agent[]>;
    },
  });

  const decisions = data?.decisions || [];
  // Sort: critical first, then by severity, then by created_at desc
  const sorted = [...decisions].sort((a, b) => {
    const sa = severityOrder[a.severity] ?? 99;
    const sb = severityOrder[b.severity] ?? 99;
    if (sa !== sb) return sa - sb;
    return b.created_at - a.created_at;
  });

  const getAgentName = (agentId: string) => {
    const agent = agents?.find((a: Agent) => a.id === agentId);
    return agent?.name || agentId.split("_").slice(-1)[0];
  };

  const handleRowClick = (decision: Decision) => {
    setSelectedDecision(decision);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-[140px] bg-[#111118] border-[#1a1a24] text-sm h-9">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent className="bg-[#111118] border-[#1a1a24]">
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] bg-[#111118] border-[#1a1a24] text-sm h-9">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-[#111118] border-[#1a1a24]">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Select value={agentFilter} onValueChange={setAgentFilter}>
          <SelectTrigger className="w-[160px] bg-[#111118] border-[#1a1a24] text-sm h-9">
            <SelectValue placeholder="Agent" />
          </SelectTrigger>
          <SelectContent className="bg-[#111118] border-[#1a1a24]">
            <SelectItem value="all">All Agents</SelectItem>
            {agents?.map((agent: Agent) => (
              <SelectItem key={agent.id} value={agent.id}>
                {agent.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto text-xs text-zinc-500">
          {data?.total ?? 0} total decisions
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-12 w-full bg-[#111118] rounded-lg"
            />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-500">
          <Inbox className="w-8 h-8 mb-3 text-zinc-600" />
          <p className="text-sm font-medium">No decisions found</p>
          <p className="text-xs mt-1">Adjust your filters or wait for new agent findings</p>
        </div>
      ) : (
        <div className="border border-[#1a1a24] rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-[#1a1a24] hover:bg-transparent">
                <TableHead className="text-zinc-500 text-xs w-[90px]">
                  Severity
                </TableHead>
                <TableHead className="text-zinc-500 text-xs">
                  Account
                </TableHead>
                <TableHead className="text-zinc-500 text-xs">
                  Title
                </TableHead>
                <TableHead className="text-zinc-500 text-xs w-[100px]">
                  Impact
                </TableHead>
                <TableHead className="text-zinc-500 text-xs w-[90px]">
                  Confidence
                </TableHead>
                <TableHead className="text-zinc-500 text-xs w-[100px]">
                  Agent
                </TableHead>
                <TableHead className="text-zinc-500 text-xs w-[90px]">
                  Due
                </TableHead>
                <TableHead className="text-zinc-500 text-xs w-[80px]">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((decision) => (
                <TableRow
                  key={decision.id}
                  className="border-[#1a1a24] cursor-pointer hover:bg-white/[0.03] transition-colors"
                  onClick={() => handleRowClick(decision)}
                >
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] border",
                        severityColors[decision.severity]
                      )}
                    >
                      {decision.severity}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium text-white text-sm">
                    {decision.account_name}
                  </TableCell>
                  <TableCell className="text-sm text-zinc-300 max-w-[250px]">
                    <span className="truncate block">
                      {decision.title.length > 60
                        ? decision.title.slice(0, 60) + "…"
                        : decision.title}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        decision.severity === "critical"
                          ? "text-rose-400"
                          : "text-white"
                      )}
                    >
                      {formatCurrency(decision.impact_dollars || 0)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            (decision.confidence || 0) >= 0.8
                              ? "bg-emerald-500"
                              : (decision.confidence || 0) >= 0.6
                              ? "bg-amber-500"
                              : "bg-rose-500"
                          )}
                          style={{
                            width: `${(decision.confidence || 0) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-zinc-400">
                        {Math.round((decision.confidence || 0) * 100)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-zinc-400">
                    {getAgentName(decision.agent_id)}
                  </TableCell>
                  <TableCell className="text-xs text-zinc-500">
                    {decision.due_date
                      ? timeAgo(decision.due_date)
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] border-transparent",
                        statusColors[decision.status]
                      )}
                    >
                      {decision.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <DecisionDrawer
        decision={selectedDecision}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
