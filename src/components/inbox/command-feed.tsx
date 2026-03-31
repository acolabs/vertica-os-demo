"use client";

import React, { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EvidencePanel } from "./evidence-panel";
import {
  RecommendedActionsPanel,
  ActionPreviewPanel,
} from "./action-preview-panel";
import { DecisionDrawer } from "./decision-drawer";
import { DemoTooltip } from "@/components/demo-tooltip";
import {
  Inbox,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  Brain,
  MousePointerClick,
} from "lucide-react";
import { cn, formatCurrency, timeAgo, formatPercent } from "@/lib/utils";
import { useOrg } from "@/lib/hooks/use-org";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// ─── Types ──────────────────────────────────────────────────────────────────

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

// ─── Constants ──────────────────────────────────────────────────────────────

const severityColors: Record<string, string> = {
  critical: "bg-rose-500/15 text-rose-400 border-rose-500/20",
  high: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  medium:
    "bg-[var(--primary-10)] text-[var(--primary)] border-[var(--primary)]/20",
  low: "bg-zinc-500/15 text-[var(--text-secondary)] border-zinc-500/20",
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-400",
  approved: "bg-emerald-500/15 text-emerald-400",
  rejected: "bg-rose-500/15 text-rose-400",
  escalated: "bg-purple-500/15 text-purple-400",
  auto_resolved: "bg-[var(--primary-10)] text-[var(--primary)]",
};

const severityOrder: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

const severityStripeColor: Record<string, string> = {
  critical: "bg-rose-500",
  high: "bg-amber-500",
  medium: "bg-[var(--primary)]",
  low: "bg-zinc-500",
};

const severityGlowColor: Record<string, string> = {
  critical: "shadow-[inset_3px_0_8px_-2px_rgba(244,63,94,0.4)]",
  high: "shadow-[inset_3px_0_8px_-2px_rgba(245,158,11,0.3)]",
  medium: "shadow-[inset_3px_0_8px_-2px_rgba(45,179,74,0.3)]",
  low: "shadow-[inset_3px_0_8px_-2px_rgba(113,113,122,0.2)]",
};

// ─── Helpers ────────────────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseJSON(str: string | null | undefined): any[] {
  if (!str) return [];
  try {
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed)) return parsed;
    if (typeof parsed === "object" && parsed !== null) {
      for (const key of Object.keys(parsed)) {
        if (Array.isArray(parsed[key])) return parsed[key];
      }
      return [parsed];
    }
    return [parsed];
  } catch {
    return [];
  }
}

// ─── Severity Heatmap Bar ───────────────────────────────────────────────────

function SeverityHeatmapBar({ decisions }: { decisions: Decision[] }) {
  const distribution = useMemo(() => {
    const counts = { critical: 0, high: 0, medium: 0, low: 0 };
    decisions.forEach((d) => {
      if (d.severity in counts) {
        counts[d.severity as keyof typeof counts]++;
      }
    });
    const total = decisions.length || 1;
    return {
      critical: (counts.critical / total) * 100,
      high: (counts.high / total) * 100,
      medium: (counts.medium / total) * 100,
      low: (counts.low / total) * 100,
    };
  }, [decisions]);

  return (
    <div className="w-full h-1 rounded-full overflow-hidden flex">
      {distribution.critical > 0 && (
        <div
          className="h-full bg-rose-500 transition-all duration-500"
          style={{ width: `${distribution.critical}%` }}
        />
      )}
      {distribution.high > 0 && (
        <div
          className="h-full bg-amber-500 transition-all duration-500"
          style={{ width: `${distribution.high}%` }}
        />
      )}
      {distribution.medium > 0 && (
        <div
          className="h-full bg-[var(--primary)] transition-all duration-500"
          style={{ width: `${distribution.medium}%` }}
        />
      )}
      {distribution.low > 0 && (
        <div
          className="h-full bg-zinc-500 transition-all duration-500"
          style={{ width: `${distribution.low}%` }}
        />
      )}
    </div>
  );
}

// ─── Decision Card ──────────────────────────────────────────────────────────

function DecisionCard({
  decision,
  isSelected,
  agentName,
  onClick,
}: {
  decision: Decision;
  isSelected: boolean;
  agentName: string;
  onClick: () => void;
}) {
  const isCritical = decision.severity === "critical";

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left relative rounded-lg border transition-all duration-200 group",
        "bg-[var(--card-bg)] hover:bg-[var(--card-hover)]",
        isSelected
          ? cn(
              "border-[var(--primary)]/40",
              severityGlowColor[decision.severity]
            )
          : "border-[var(--card-border)]",
        isCritical && !isSelected && "critical-pulse-border"
      )}
    >
      {/* Severity stripe */}
      <div
        className={cn(
          "absolute left-0 top-0 bottom-0 w-[3px] rounded-l-lg",
          severityStripeColor[decision.severity]
        )}
      />

      <div className="pl-4 pr-3 py-3">
        {/* Row 1: Account + Impact */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <span className="text-sm font-semibold text-[var(--text-primary)] truncate">
            {decision.account_name}
          </span>
          <span
            className={cn(
              "text-sm font-bold flex-shrink-0",
              decision.severity === "critical"
                ? "text-rose-400"
                : "text-[var(--text-primary)]"
            )}
          >
            {formatCurrency(decision.impact_dollars || 0)}
          </span>
        </div>

        {/* Row 2: Title */}
        <p className="text-xs text-[var(--text-muted)] truncate mb-2 pr-4">
          {decision.title}
        </p>

        {/* Row 3: Agent pill + Confidence bar + Time */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-[var(--surface-elevated)] text-[var(--text-secondary)] flex-shrink-0">
            {agentName}
          </span>

          {/* Confidence mini-bar */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-8 h-1 bg-[var(--surface)] rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full",
                  (decision.confidence || 0) >= 0.8
                    ? "bg-emerald-500"
                    : (decision.confidence || 0) >= 0.6
                    ? "bg-amber-500"
                    : "bg-rose-500"
                )}
                style={{ width: `${(decision.confidence || 0) * 100}%` }}
              />
            </div>
            <span className="text-[10px] text-[var(--text-muted)]">
              {Math.round((decision.confidence || 0) * 100)}%
            </span>
          </div>

          <span className="text-[10px] text-[var(--text-muted)] ml-auto flex-shrink-0">
            {timeAgo(decision.created_at)}
          </span>
        </div>
      </div>
    </button>
  );
}

// ─── Detail Panel ───────────────────────────────────────────────────────────

function DetailPanel({
  decision,
  agentName,
  onAction,
}: {
  decision: Decision;
  agentName: string;
  onAction?: () => void;
}) {
  const queryClient = useQueryClient();
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/decisions/${id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved_by: "operator@verticacp.com" }),
      });
      if (!res.ok) throw new Error("Failed to approve");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decisions"] });
      toast.success("Decision approved — audit entry created", {
        description: "Actions will be executed in connected systems.",
      });
      setActionMessage({
        type: "success",
        text: "Decision approved successfully",
      });
      onAction?.();
    },
    onError: () => {
      toast.error("Failed to approve decision");
      setActionMessage({
        type: "error",
        text: "Failed to approve decision",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/decisions/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rejected_by: "operator@verticacp.com",
          reason: "Operator rejected via inbox",
        }),
      });
      if (!res.ok) throw new Error("Failed to reject");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decisions"] });
      toast.info("Decision rejected", {
        description:
          "Agent will be notified and may generate alternative recommendations.",
      });
      setActionMessage({ type: "success", text: "Decision rejected" });
      onAction?.();
    },
    onError: () => {
      toast.error("Failed to reject decision");
      setActionMessage({
        type: "error",
        text: "Failed to reject decision",
      });
    },
  });

  const evidence = parseJSON(decision.evidence);
  const actions = parseJSON(decision.recommended_action);
  const previews = parseJSON(decision.action_preview);
  const isPending = decision.status === "pending";

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 pt-5 pb-4 border-b border-[var(--card-border)]/50">
        <div className="flex items-center gap-2 mb-2.5">
          <Badge
            variant="outline"
            className={cn("text-[10px] border", severityColors[decision.severity])}
          >
            {decision.severity.toUpperCase()}
          </Badge>
          <Badge
            variant="outline"
            className={cn("text-[10px]", statusColors[decision.status])}
          >
            {decision.status}
          </Badge>
        </div>
        <h2 className="text-base font-semibold text-[var(--text-primary)] leading-snug mb-1">
          {decision.title}
        </h2>
        <p className="text-xs text-[var(--text-muted)]">
          {decision.account_name} • {agentName} •{" "}
          {timeAgo(decision.created_at)}
        </p>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="bg-[var(--card-bg)] rounded-lg p-2.5 border border-[var(--card-border)]/50">
            <div className="flex items-center gap-1.5 mb-1">
              <DollarSign className="w-3 h-3 text-[var(--text-muted)]" />
              <span className="text-[10px] text-[var(--text-muted)]">
                Impact
              </span>
            </div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {formatCurrency(decision.impact_dollars || 0)}
            </p>
          </div>
          <div className="bg-[var(--card-bg)] rounded-lg p-2.5 border border-[var(--card-border)]/50">
            <div className="flex items-center gap-1.5 mb-1">
              <Brain className="w-3 h-3 text-[var(--text-muted)]" />
              <span className="text-[10px] text-[var(--text-muted)]">
                Confidence
              </span>
            </div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {formatPercent((decision.confidence || 0) * 100)}
            </p>
          </div>
          <div className="bg-[var(--card-bg)] rounded-lg p-2.5 border border-[var(--card-border)]/50">
            <div className="flex items-center gap-1.5 mb-1">
              <Clock className="w-3 h-3 text-[var(--text-muted)]" />
              <span className="text-[10px] text-[var(--text-muted)]">Due</span>
            </div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">
              {decision.due_date ? timeAgo(decision.due_date) : "—"}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs content - scrollable */}
      <ScrollArea className="flex-1">
        <div className="px-6 py-4">
          <Tabs defaultValue="evidence">
            <TabsList className="bg-[var(--card-bg)] mb-4 w-full">
              <TabsTrigger value="evidence" className="flex-1 text-xs">
                Evidence ({evidence.length})
              </TabsTrigger>
              <TabsTrigger value="actions" className="flex-1 text-xs">
                Actions ({actions.length})
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex-1 text-xs">
                Preview ({previews.length})
              </TabsTrigger>
              <TabsTrigger value="summary" className="flex-1 text-xs">
                Summary
              </TabsTrigger>
            </TabsList>

            <TabsContent value="evidence">
              <DemoTooltip
                content="Evidence sourced from the decisions table evidence JSON column via /api/decisions/{id}. Contains structured signals from CRM (Salesforce/HubSpot), support (Zendesk), and billing systems, each with source system reference IDs."
                side="right"
              >
                <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Evidence
                </h4>
              </DemoTooltip>
              <EvidencePanel evidence={evidence} />
            </TabsContent>

            <TabsContent value="actions">
              <DemoTooltip
                content="Recommended action sourced from the decisions table recommended_action column. Generated by the originating agent based on evidence analysis. Actions are validated against active policies before surfacing for review."
                side="right"
              >
                <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Recommended Actions
                </h4>
              </DemoTooltip>
              <RecommendedActionsPanel actions={actions} />
            </TabsContent>

            <TabsContent value="preview">
              <DemoTooltip
                content="Action preview sourced from the decisions table action_preview column via /api/decisions/{id}. Shows the exact field-level changes that will be applied to connected systems (CRM updates, ticket responses, billing adjustments) upon approval."
                side="right"
              >
                <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">
                  Action Preview
                </h4>
              </DemoTooltip>
              <ActionPreviewPanel previews={previews} />
            </TabsContent>

            <TabsContent value="summary">
              <div className="space-y-4">
                <div className="bg-[var(--surface)] rounded-lg p-4 border border-[var(--card-border)]/50">
                  <h4 className="text-xs font-medium text-[var(--text-secondary)] mb-2 uppercase tracking-wider">
                    Summary
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {decision.summary}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[var(--surface)] rounded-lg p-3 border border-[var(--card-border)]/50">
                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">
                      Account
                    </p>
                    <p className="text-sm text-[var(--text-primary)] font-medium">
                      {decision.account_name}
                    </p>
                    {decision.account_arr > 0 && (
                      <p className="text-xs text-[var(--text-muted)]">
                        ARR: {formatCurrency(decision.account_arr)}
                      </p>
                    )}
                  </div>
                  <div className="bg-[var(--surface)] rounded-lg p-3 border border-[var(--card-border)]/50">
                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">
                      Type
                    </p>
                    <p className="text-sm text-[var(--text-primary)] font-medium capitalize">
                      {decision.type.replace(/_/g, " ")}
                    </p>
                  </div>
                  <div className="bg-[var(--surface)] rounded-lg p-3 border border-[var(--card-border)]/50">
                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">
                      Agent
                    </p>
                    <p className="text-sm text-[var(--text-primary)] font-medium">
                      {agentName}
                    </p>
                  </div>
                  <div className="bg-[var(--surface)] rounded-lg p-3 border border-[var(--card-border)]/50">
                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">
                      Confidence
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-[var(--surface)] rounded-full overflow-hidden">
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
                      <span className="text-xs text-[var(--text-primary)] font-medium">
                        {formatPercent((decision.confidence || 0) * 100)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>

      {/* Action message */}
      {actionMessage && (
        <div
          className={cn(
            "mx-6 mb-2 px-3 py-2 rounded-lg text-xs font-medium text-center",
            actionMessage.type === "success"
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-rose-500/15 text-rose-400"
          )}
        >
          {actionMessage.text}
        </div>
      )}

      {/* Action buttons */}
      {isPending && (
        <div className="border-t border-[var(--card-border)]/50 px-6 py-4">
          <div className="flex items-center gap-2">
            <Button
              onClick={() => approveMutation.mutate(decision.id)}
              disabled={approveMutation.isPending || rejectMutation.isPending}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              <CheckCircle className="w-4 h-4 mr-1.5" />
              {approveMutation.isPending ? "Approving..." : "Approve"}
            </Button>
            <Button
              onClick={() => rejectMutation.mutate(decision.id)}
              disabled={approveMutation.isPending || rejectMutation.isPending}
              variant="outline"
              className="flex-1 border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
            >
              <XCircle className="w-4 h-4 mr-1.5" />
              {rejectMutation.isPending ? "Rejecting..." : "Reject"}
            </Button>
            <Button
              onClick={() => {
                toast.warning("Escalated to VP of Customer Success", {
                  description: "Notification sent. SLA: 4 hour response.",
                });
                setActionMessage({
                  type: "success",
                  text: "Escalated — team notified",
                });
              }}
              disabled={approveMutation.isPending || rejectMutation.isPending}
              variant="outline"
              className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
            >
              <AlertTriangle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export function CommandFeed() {
  const { orgId } = useOrg();
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [agentFilter, setAgentFilter] = useState<string>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // Mobile drawer state
  const [drawerDecision, setDrawerDecision] = useState<Decision | null>(null);
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

  const sorted = useMemo(
    () =>
      [...decisions].sort((a, b) => {
        const sa = severityOrder[a.severity] ?? 99;
        const sb = severityOrder[b.severity] ?? 99;
        if (sa !== sb) return sa - sb;
        return b.created_at - a.created_at;
      }),
    [decisions]
  );

  const getAgentName = (agentId: string) => {
    const agent = agents?.find((a: Agent) => a.id === agentId);
    return agent?.name || agentId.split("_").slice(-1)[0];
  };

  const selectedDecision = sorted.find((d) => d.id === selectedId) || null;

  const handleCardClick = (decision: Decision) => {
    // On desktop: select card for right panel
    // On mobile: open drawer
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setDrawerDecision(decision);
      setDrawerOpen(true);
    } else {
      setSelectedId(decision.id);
    }
  };

  return (
    <div className="space-y-3">
      {/* Severity Heatmap Bar */}
      <SeverityHeatmapBar decisions={sorted} />

      {/* Filters row */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={severityFilter} onValueChange={setSeverityFilter}>
          <SelectTrigger className="w-[140px] bg-[var(--card-bg)] border-[var(--card-border)] text-sm h-9">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent className="bg-[var(--card-bg)] border-[var(--card-border)]">
            <SelectItem value="all">All Severity</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px] bg-[var(--card-bg)] border-[var(--card-border)] text-sm h-9">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-[var(--card-bg)] border-[var(--card-border)]">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>

        <Select value={agentFilter} onValueChange={setAgentFilter}>
          <SelectTrigger className="w-[160px] bg-[var(--card-bg)] border-[var(--card-border)] text-sm h-9">
            <SelectValue placeholder="Agent" />
          </SelectTrigger>
          <SelectContent className="bg-[var(--card-bg)] border-[var(--card-border)]">
            <SelectItem value="all">All Agents</SelectItem>
            {agents?.map((agent: Agent) => (
              <SelectItem key={agent.id} value={agent.id}>
                {agent.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto text-xs text-[var(--text-muted)]">
          {data?.total ?? 0} decisions
        </div>
      </div>

      {/* Split Pane Layout */}
      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton
              key={i}
              className="h-[76px] w-full bg-[var(--card-bg)] rounded-lg"
            />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-[var(--text-muted)]">
          <Inbox className="w-8 h-8 mb-3 text-[var(--text-muted)]" />
          <p className="text-sm font-medium">No decisions found</p>
          <p className="text-xs mt-1">
            Adjust your filters or wait for new agent findings
          </p>
        </div>
      ) : (
        <div className="flex gap-0 h-[calc(100vh-220px)] min-h-[500px]">
          {/* Left Panel: Card Feed */}
          <div className="w-full lg:w-[42%] flex-shrink-0 border border-[var(--card-border)] rounded-lg lg:rounded-r-none overflow-hidden bg-[var(--card-bg)]/30 glass-card">
            <ScrollArea className="h-full">
              <div className="p-2 space-y-1">
                {sorted.map((decision) => (
                  <DecisionCard
                    key={decision.id}
                    decision={decision}
                    isSelected={selectedId === decision.id}
                    agentName={getAgentName(decision.agent_id)}
                    onClick={() => handleCardClick(decision)}
                  />
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Right Panel: Detail Preview (hidden on mobile) */}
          <div className="hidden lg:flex lg:w-[58%] flex-col border border-[var(--card-border)] border-l-0 rounded-r-lg overflow-hidden bg-[var(--card-bg)]/20 glass-card">
            {selectedDecision ? (
              <DetailPanel
                key={selectedDecision.id}
                decision={selectedDecision}
                agentName={getAgentName(selectedDecision.agent_id)}
              />
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-[var(--text-muted)]">
                <MousePointerClick className="w-8 h-8 mb-3 opacity-40" />
                <p className="text-sm font-medium">
                  Select a decision to review
                </p>
                <p className="text-xs mt-1 opacity-60">
                  Click a card on the left to see full details
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile fallback drawer */}
      <DecisionDrawer
        decision={drawerDecision}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
