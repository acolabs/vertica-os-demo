"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { EvidencePanel } from "./evidence-panel";
import {
  RecommendedActionsPanel,
  ActionPreviewPanel,
} from "./action-preview-panel";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  DollarSign,
  Brain,
} from "lucide-react";
import { cn, formatCurrency, timeAgo, formatPercent } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DemoTooltip } from "@/components/demo-tooltip";

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

interface DecisionDrawerProps {
  decision: Decision | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const severityColors: Record<string, string> = {
  critical: "bg-rose-500/15 text-rose-400 border-rose-500/20",
  high: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  medium: "bg-[var(--primary-10)] text-[var(--primary)] border-[var(--primary)]/20",
  low: "bg-zinc-500/15 text-[var(--text-secondary)] border-zinc-500/20",
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-400",
  approved: "bg-emerald-500/15 text-emerald-400",
  rejected: "bg-rose-500/15 text-rose-400",
  escalated: "bg-purple-500/15 text-purple-400",
  auto_resolved: "bg-[var(--primary-10)] text-[var(--primary)]",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseJSON(str: string | null | undefined): any[] {
  if (!str) return [];
  try {
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed)) return parsed;
    // Handle wrapped arrays like { actions: [...] } or { changes: [...] }
    if (typeof parsed === 'object' && parsed !== null) {
      // Look for the first array property
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

export function DecisionDrawer({
  decision,
  open,
  onOpenChange,
}: DecisionDrawerProps) {
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
      setActionMessage({ type: "success", text: "Decision approved successfully" });
      setTimeout(() => {
        onOpenChange(false);
        setActionMessage(null);
      }, 1200);
    },
    onError: () => {
      toast.error("Failed to approve decision");
      setActionMessage({ type: "error", text: "Failed to approve decision" });
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
        description: "Agent will be notified and may generate alternative recommendations.",
      });
      setActionMessage({ type: "success", text: "Decision rejected" });
      setTimeout(() => {
        onOpenChange(false);
        setActionMessage(null);
      }, 1200);
    },
    onError: () => {
      toast.error("Failed to reject decision");
      setActionMessage({ type: "error", text: "Failed to reject decision" });
    },
  });

  if (!decision) return null;

  const evidence = parseJSON(decision.evidence);
  const actions = parseJSON(decision.recommended_action);
  const previews = parseJSON(decision.action_preview);
  const isPending = decision.status === "pending";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[540px] bg-[var(--surface)] border-[var(--card-border)] p-0 flex flex-col glass"
      >
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-[var(--card-border)]/50">
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px] border",
                    severityColors[decision.severity]
                  )}
                >
                  {decision.severity.toUpperCase()}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-[10px]",
                    statusColors[decision.status]
                  )}
                >
                  {decision.status}
                </Badge>
              </div>
              <SheetTitle className="text-base text-[var(--text-primary)] leading-snug">
                {decision.title}
              </SheetTitle>
              <SheetDescription className="text-xs text-[var(--text-muted)] mt-1">
                {decision.account_name} • Created {timeAgo(decision.created_at)}
              </SheetDescription>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mt-3">
            <div className="bg-[var(--card-bg)] rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <DollarSign className="w-3 h-3 text-[var(--text-muted)]" />
                <span className="text-[10px] text-[var(--text-muted)]">Impact</span>
              </div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {formatCurrency(decision.impact_dollars || 0)}
              </p>
            </div>
            <div className="bg-[var(--card-bg)] rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <Brain className="w-3 h-3 text-[var(--text-muted)]" />
                <span className="text-[10px] text-[var(--text-muted)]">Confidence</span>
              </div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {formatPercent(decision.confidence || 0)}
              </p>
            </div>
            <div className="bg-[var(--card-bg)] rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="w-3 h-3 text-[var(--text-muted)]" />
                <span className="text-[10px] text-[var(--text-muted)]">Due</span>
              </div>
              <p className="text-sm font-semibold text-[var(--text-primary)]">
                {decision.due_date ? timeAgo(decision.due_date) : "—"}
              </p>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="px-5 py-4">
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
                <DemoTooltip content="Evidence sourced from the decisions table evidence JSON column via /api/decisions/{id}. Contains structured signals from CRM (Salesforce/HubSpot), support (Zendesk), and billing systems, each with source system reference IDs." side="right">
                  <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">Evidence</h4>
                </DemoTooltip>
                <EvidencePanel evidence={evidence} />
              </TabsContent>

              <TabsContent value="actions">
                <DemoTooltip content="Recommended action sourced from the decisions table recommended_action column. Generated by the originating agent based on evidence analysis. Actions are validated against active policies before surfacing for review." side="right">
                  <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">Recommended Actions</h4>
                </DemoTooltip>
                <RecommendedActionsPanel actions={actions} />
              </TabsContent>

              <TabsContent value="preview">
                <DemoTooltip content="Action preview sourced from the decisions table action_preview column via /api/decisions/{id}. Shows the exact field-level changes that will be applied to connected systems (CRM updates, ticket responses, billing adjustments) upon approval." side="right">
                  <h4 className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2">Action Preview</h4>
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
                        {decision.agent_id}
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
              "mx-5 mb-2 px-3 py-2 rounded-lg text-xs font-medium text-center",
              actionMessage.type === "success"
                ? "bg-emerald-500/15 text-emerald-400"
                : "bg-rose-500/15 text-rose-400"
            )}
          >
            {actionMessage.text}
          </div>
        )}

        {isPending && (
          <SheetFooter className="border-t border-[var(--card-border)]/50 p-4">
            <div className="flex items-center gap-2 w-full">
              <Button
                onClick={() => approveMutation.mutate(decision.id)}
                disabled={
                  approveMutation.isPending || rejectMutation.isPending
                }
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-[var(--text-primary)]"
              >
                <CheckCircle className="w-4 h-4 mr-1.5" />
                {approveMutation.isPending ? "Approving..." : "Approve"}
              </Button>
              <Button
                onClick={() => rejectMutation.mutate(decision.id)}
                disabled={
                  approveMutation.isPending || rejectMutation.isPending
                }
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
                disabled={
                  approveMutation.isPending || rejectMutation.isPending
                }
                variant="outline"
                className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
              >
                <AlertTriangle className="w-4 h-4" />
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
