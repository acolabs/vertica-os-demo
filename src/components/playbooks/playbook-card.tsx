"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  Headphones,
  Shield,
  Activity,
  Rocket,
  Clock,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface Playbook {
  id: string;
  name: string;
  type: string;
  description: string;
  integrations: string[];
  expectedRoi: string;
  deploymentTime: string;
  kpis: string[];
  status: string;
  deployedCount: number;
  // Detail fields
  howItWorks?: string[];
  deliverables?: string[];
  configurationSteps?: string[];
  roiMethodology?: string;
  roiExample?: {
    scenario: string;
    baseline: string;
    improvement: string;
    dollarImpact: string;
    calculation: string;
  };
  dataRequirements?: string[];
  rolloutPhases?: { phase: string; duration: string; description: string }[];
  faq?: { q: string; a: string }[];
}

const TYPE_ICONS: Record<string, LucideIcon> = {
  revenue_cadence: TrendingUp,
  support_deflection: Headphones,
  nrr: Shield,
  pipeline: Activity,
};

interface PlaybookCardProps {
  playbook: Playbook;
  onDeploy: (playbook: Playbook) => void;
  onViewDetails: (playbook: Playbook) => void;
}

export function PlaybookCard({ playbook, onDeploy, onViewDetails }: PlaybookCardProps) {
  const Icon = TYPE_ICONS[playbook.type] ?? Activity;
  const isDeployed = playbook.status === "deployed";

  return (
    <Card
      className={cn(
        "glass-card shadow-premium card-hover-lift flex flex-col border-0"
      )}
      style={{
        backgroundColor: "var(--card-bg)",
        borderColor: "var(--card-border)",
      }}
    >
      <CardHeader className="pb-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "var(--primary-10)" }}
            >
              <Icon className="w-5 h-5" style={{ color: "var(--primary)" }} />
            </div>
            <div className="min-w-0">
              <h3
                className="text-sm font-semibold leading-tight"
                style={{ color: "var(--text-primary)" }}
              >
                {playbook.name}
              </h3>
            </div>
          </div>
          <Badge
            className={cn(
              "text-[10px] px-2 py-0.5 flex-shrink-0",
              isDeployed
                ? "bg-[var(--success-10)] text-[var(--success)] border-[var(--success)]/20"
                : "bg-[var(--warning-10)] text-[var(--warning)] border-[var(--warning)]/20"
            )}
          >
            {isDeployed
              ? `Deployed to ${playbook.deployedCount} org${playbook.deployedCount !== 1 ? "s" : ""}`
              : "In development"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4 pt-0">
        <p
          className="text-xs leading-relaxed line-clamp-3"
          style={{ color: "var(--text-secondary)" }}
        >
          {playbook.description}
        </p>

        {/* Integrations */}
        <div className="space-y-1.5">
          <span
            className="text-[10px] font-medium uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            Required Integrations
          </span>
          <div className="flex flex-wrap gap-1.5">
            {playbook.integrations.map((integration) => (
              <span
                key={integration}
                className="text-[10px] px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: "var(--surface)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--card-border)",
                }}
              >
                {integration}
              </span>
            ))}
          </div>
        </div>

        {/* ROI + Deployment */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" style={{ color: "var(--primary)" }} />
            <span
              className="text-xs font-semibold"
              style={{ color: "var(--primary)" }}
            >
              {playbook.expectedRoi} ROI
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock
              className="w-3.5 h-3.5"
              style={{ color: "var(--text-muted)" }}
            />
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              {playbook.deploymentTime}
            </span>
          </div>
        </div>

        {/* KPIs */}
        <div className="space-y-1.5">
          <span
            className="text-[10px] font-medium uppercase tracking-wider"
            style={{ color: "var(--text-muted)" }}
          >
            KPIs Impacted
          </span>
          <div className="flex flex-wrap gap-1.5">
            {playbook.kpis.map((kpi) => (
              <span
                key={kpi}
                className="text-[10px] px-2 py-0.5 rounded-md font-medium"
                style={{
                  backgroundColor: "var(--primary-10)",
                  color: "var(--primary)",
                }}
              >
                {kpi}
              </span>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            onClick={() => onViewDetails(playbook)}
            className="flex-1 border-[var(--card-border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            size="sm"
          >
            View Details
          </Button>
          <Button
            onClick={() => onDeploy(playbook)}
            className="flex-1 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-sm"
            size="sm"
          >
            <Rocket className="w-4 h-4 mr-1.5" />
            Deploy
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
