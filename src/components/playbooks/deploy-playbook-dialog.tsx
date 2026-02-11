"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Rocket, Building2 } from "lucide-react";

interface Playbook {
  id: string;
  name: string;
  type: string;
}

interface DeployPlaybookDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  playbook: Playbook | null;
}

const ORGS = [
  { id: "org_dsn", name: "DSN Software" },
  { id: "org_campspot", name: "Campspot" },
  { id: "org_condocontrol", name: "Condo Control" },
];

const MODES = [
  {
    id: "shadow",
    label: "Shadow Mode",
    description: "Agent observes and logs recommendations without taking action",
  },
  {
    id: "suggestion",
    label: "Suggestion Mode",
    description: "Agent suggests actions that require human approval",
  },
  {
    id: "gated",
    label: "Gated Autonomy",
    description: "Agent acts autonomously within defined policy guardrails",
  },
];

export function DeployPlaybookDialog({
  open,
  onOpenChange,
  playbook,
}: DeployPlaybookDialogProps) {
  const [selectedOrg, setSelectedOrg] = useState("");
  const [selectedMode, setSelectedMode] = useState("shadow");

  const handleDeploy = () => {
    const org = ORGS.find((o) => o.id === selectedOrg);
    if (!org || !playbook) return;

    const modeLabel = MODES.find((m) => m.id === selectedMode)?.label ?? selectedMode;
    toast.success(`Agent deployed to ${org.name} in ${modeLabel.toLowerCase()}`);
    onOpenChange(false);
    setSelectedOrg("");
    setSelectedMode("shadow");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md"
        style={{
          backgroundColor: "var(--surface-elevated)",
          borderColor: "var(--card-border)",
        }}
      >
        <DialogHeader>
          <DialogTitle
            className="flex items-center gap-2"
            style={{ color: "var(--text-primary)" }}
          >
            <Rocket className="w-5 h-5" style={{ color: "var(--primary)" }} />
            Deploy Playbook
          </DialogTitle>
          <DialogDescription style={{ color: "var(--text-secondary)" }}>
            Deploy{" "}
            <span className="font-medium" style={{ color: "var(--primary)" }}>
              {playbook?.name}
            </span>{" "}
            to a portfolio company
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Org selector */}
          <div className="space-y-2">
            <label
              className="text-sm font-medium flex items-center gap-1.5"
              style={{ color: "var(--text-primary)" }}
            >
              <Building2 className="w-3.5 h-3.5" style={{ color: "var(--text-muted)" }} />
              Portfolio Company
            </label>
            <Select value={selectedOrg} onValueChange={setSelectedOrg}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select organization..." />
              </SelectTrigger>
              <SelectContent>
                {ORGS.map((org) => (
                  <SelectItem key={org.id} value={org.id}>
                    {org.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Configuration mode */}
          <div className="space-y-2">
            <label
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Configuration
            </label>
            <div className="space-y-2">
              {MODES.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setSelectedMode(mode.id)}
                  className="w-full rounded-lg border p-3 text-left transition-all"
                  style={{
                    backgroundColor:
                      selectedMode === mode.id
                        ? "var(--primary-10)"
                        : "var(--surface)",
                    borderColor:
                      selectedMode === mode.id
                        ? "var(--primary)"
                        : "var(--card-border)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center"
                      style={{
                        borderColor:
                          selectedMode === mode.id
                            ? "var(--primary)"
                            : "var(--text-muted)",
                      }}
                    >
                      {selectedMode === mode.id && (
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: "var(--primary)" }}
                        />
                      )}
                    </div>
                    <span
                      className="text-sm font-medium"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {mode.label}
                    </span>
                  </div>
                  <p
                    className="text-xs mt-1 ml-5.5"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {mode.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-sm"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeploy}
            disabled={!selectedOrg}
            className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm"
          >
            <Rocket className="w-4 h-4 mr-1.5" />
            Deploy Agent
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
