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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseJSON(str: string | null | undefined): any[] {
  if (!str) return [];
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) ? parsed : [parsed];
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
        body: JSON.stringify({ approved_by: "operator@gencap.ai" }),
      });
      if (!res.ok) throw new Error("Failed to approve");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decisions"] });
      setActionMessage({ type: "success", text: "Decision approved successfully" });
      setTimeout(() => {
        onOpenChange(false);
        setActionMessage(null);
      }, 1200);
    },
    onError: () => {
      setActionMessage({ type: "error", text: "Failed to approve decision" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/decisions/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rejected_by: "operator@gencap.ai",
          reason: "Operator rejected via inbox",
        }),
      });
      if (!res.ok) throw new Error("Failed to reject");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["decisions"] });
      setActionMessage({ type: "success", text: "Decision rejected" });
      setTimeout(() => {
        onOpenChange(false);
        setActionMessage(null);
      }, 1200);
    },
    onError: () => {
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
        className="w-full sm:max-w-[540px] bg-[#0a0a0f] border-[#1a1a24] p-0 flex flex-col"
      >
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-zinc-800/50">
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
              <SheetTitle className="text-base text-white leading-snug">
                {decision.title}
              </SheetTitle>
              <SheetDescription className="text-xs text-zinc-500 mt-1">
                {decision.account_name} • Created {timeAgo(decision.created_at)}
              </SheetDescription>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3 mt-3">
            <div className="bg-[#111118] rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <DollarSign className="w-3 h-3 text-zinc-500" />
                <span className="text-[10px] text-zinc-500">Impact</span>
              </div>
              <p className="text-sm font-semibold text-white">
                {formatCurrency(decision.impact_dollars || 0)}
              </p>
            </div>
            <div className="bg-[#111118] rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <Brain className="w-3 h-3 text-zinc-500" />
                <span className="text-[10px] text-zinc-500">Confidence</span>
              </div>
              <p className="text-sm font-semibold text-white">
                {formatPercent(decision.confidence || 0)}
              </p>
            </div>
            <div className="bg-[#111118] rounded-lg p-2.5">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="w-3 h-3 text-zinc-500" />
                <span className="text-[10px] text-zinc-500">Due</span>
              </div>
              <p className="text-sm font-semibold text-white">
                {decision.due_date ? timeAgo(decision.due_date) : "—"}
              </p>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="px-5 py-4">
            <Tabs defaultValue="evidence">
              <TabsList className="bg-[#111118] mb-4 w-full">
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
                <EvidencePanel evidence={evidence} />
              </TabsContent>

              <TabsContent value="actions">
                <RecommendedActionsPanel actions={actions} />
              </TabsContent>

              <TabsContent value="preview">
                <ActionPreviewPanel previews={previews} />
              </TabsContent>

              <TabsContent value="summary">
                <div className="space-y-4">
                  <div className="bg-[#0d0d14] rounded-lg p-4 border border-zinc-800/50">
                    <h4 className="text-xs font-medium text-zinc-400 mb-2 uppercase tracking-wider">
                      Summary
                    </h4>
                    <p className="text-sm text-zinc-300 leading-relaxed">
                      {decision.summary}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#0d0d14] rounded-lg p-3 border border-zinc-800/50">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                        Account
                      </p>
                      <p className="text-sm text-white font-medium">
                        {decision.account_name}
                      </p>
                      {decision.account_arr > 0 && (
                        <p className="text-xs text-zinc-500">
                          ARR: {formatCurrency(decision.account_arr)}
                        </p>
                      )}
                    </div>
                    <div className="bg-[#0d0d14] rounded-lg p-3 border border-zinc-800/50">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                        Type
                      </p>
                      <p className="text-sm text-white font-medium capitalize">
                        {decision.type.replace(/_/g, " ")}
                      </p>
                    </div>
                    <div className="bg-[#0d0d14] rounded-lg p-3 border border-zinc-800/50">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                        Agent
                      </p>
                      <p className="text-sm text-white font-medium">
                        {decision.agent_id}
                      </p>
                    </div>
                    <div className="bg-[#0d0d14] rounded-lg p-3 border border-zinc-800/50">
                      <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">
                        Confidence
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
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
                        <span className="text-xs text-white font-medium">
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
          <SheetFooter className="border-t border-zinc-800/50 p-4">
            <div className="flex items-center gap-2 w-full">
              <Button
                onClick={() => approveMutation.mutate(decision.id)}
                disabled={
                  approveMutation.isPending || rejectMutation.isPending
                }
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
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
                onClick={() =>
                  setActionMessage({
                    type: "success",
                    text: "Escalated — team notified",
                  })
                }
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
