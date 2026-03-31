"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/page-header";
import { ToastWrapper } from "@/components/toast-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { CompanyTabs } from "@/components/value-creation/company-tabs";
import { PhaseTimeline } from "@/components/value-creation/phase-timeline";
import { KpiImpactTracker } from "@/components/value-creation/kpi-impact-tracker";
import { ActiveInterventions } from "@/components/value-creation/active-interventions";
import { OperatingCadence } from "@/components/value-creation/operating-cadence";

interface Milestone {
  id: string;
  name: string;
  owner: string;
  status: "complete" | "in-progress" | "not-started";
  dueDay: number;
}

interface Phase {
  id: string;
  name: string;
  label: string;
  dayRange: [number, number];
  accent: string;
  progress: number;
  milestones: Milestone[];
  gate: string;
  gateStatus: "passed" | "in-progress" | "locked";
}

interface KpiMetric {
  metric: string;
  baseline: string;
  current: string;
  target: string;
  status: "on-track" | "at-risk" | "behind";
}

interface Intervention {
  id: string;
  name: string;
  type: string;
  owner: string;
  startDate: string;
  targetDate: string;
  progress: number;
  impactProjection: number;
  status: "active" | "paused" | "complete";
}

interface CadenceItem {
  day: string;
  dayLabel: string;
  meeting: string;
  duration: string;
  time: string;
  attendees: string[];
}

interface CompanyPlan {
  companyId: string;
  companyName: string;
  status: "on-track" | "at-risk" | "behind";
  currentDay: number;
  phases: Phase[];
  kpis: KpiMetric[];
  interventions: Intervention[];
  cadence: CadenceItem[];
}

interface ValueCreationData {
  companies: Array<{
    companyId: string;
    companyName: string;
    status: "on-track" | "at-risk" | "behind";
    currentDay: number;
  }>;
  plans: CompanyPlan[];
}

export default function ValueCreationPage() {
  const [activeCompanyId, setActiveCompanyId] = useState("org_dsn");

  const { data, isLoading } = useQuery({
    queryKey: ["value-creation"],
    queryFn: () =>
      fetch("/api/value-creation").then((r) => r.json()) as Promise<ValueCreationData>,
  });

  const activePlan = data?.plans?.find((p) => p.companyId === activeCompanyId);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 bg-[var(--skeleton)] rounded-xl" />
        <div className="flex gap-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-48 bg-[var(--skeleton)] rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-12 bg-[var(--skeleton)] rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 bg-[var(--skeleton)] rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-48 bg-[var(--skeleton)] rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-72 bg-[var(--skeleton)] rounded-xl" />
          <Skeleton className="h-72 bg-[var(--skeleton)] rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data || !activePlan) return null;

  return (
    <div className="space-y-6">
      <ToastWrapper />

      <PageHeader
        title="Value Creation Hub"
        description="The 30/60/90 day operating playbook for each portfolio company. Track milestones, measure KPI impact, and drive interventions to accelerate value creation."
        features={[
          "30/60/90 day phased plans with gated progression",
          "Real-time milestone tracking with owner accountability",
          "Before vs. After KPI impact measurement",
          "Active intervention tracking with projected dollar impact",
          "Operating cadence calendar for execution rhythm",
        ]}
      />

      {/* Company Tabs */}
      <CompanyTabs
        companies={data.companies}
        activeCompanyId={activeCompanyId}
        onSelect={setActiveCompanyId}
      />

      {/* 30/60/90 Timeline — the visual centerpiece */}
      <PhaseTimeline
        phases={activePlan.phases}
        currentDay={activePlan.currentDay}
      />

      {/* KPI Impact Tracker */}
      <KpiImpactTracker
        kpis={activePlan.kpis}
        currentDay={activePlan.currentDay}
      />

      {/* Active Interventions + Operating Cadence */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ActiveInterventions interventions={activePlan.interventions} />
        <OperatingCadence cadence={activePlan.cadence} />
      </div>
    </div>
  );
}
