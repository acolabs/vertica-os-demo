"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useOrg } from "@/lib/hooks/use-org";
import { PageHeader } from "@/components/layout/page-header";
import { ToastWrapper } from "@/components/toast-wrapper";
import { Skeleton } from "@/components/ui/skeleton";
import { HealthOverviewBar } from "@/components/portfolio/health-overview-bar";
import { CompanyHealthCard } from "@/components/portfolio/company-health-card";
import { CompanyDetailDrawer } from "@/components/portfolio/company-detail-drawer";
import { AnomalyAlerts } from "@/components/portfolio/anomaly-alerts";
import type {
  PortfolioCompany,
  AnomalyAlert,
} from "@/app/api/portfolio/route";

interface PortfolioSummary {
  totalCompanies: number;
  greenCount: number;
  yellowCount: number;
  redCount: number;
  totalArr: number;
  avgNrr: number;
  valueAtRisk: number;
}

interface PortfolioData {
  summary: PortfolioSummary;
  companies: PortfolioCompany[];
  alerts: AnomalyAlert[];
}

export default function PortfolioPage() {
  const { orgId } = useOrg();
  const [selectedCompany, setSelectedCompany] =
    useState<PortfolioCompany | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { data, isLoading } = useQuery<PortfolioData>({
    queryKey: ["portfolio", orgId],
    queryFn: () =>
      fetch(`/api/portfolio?org_id=${orgId}`).then((r) => r.json()),
    refetchInterval: 30_000,
  });

  const handleCardClick = (company: PortfolioCompany) => {
    setSelectedCompany(company);
    setDrawerOpen(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 bg-[var(--skeleton)] rounded-xl" />
        <Skeleton className="h-16 bg-[var(--skeleton)] rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-56 bg-[var(--skeleton)] rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-48 bg-[var(--skeleton)] rounded-xl" />
      </div>
    );
  }

  const companies = data?.companies ?? [];
  const alerts = data?.alerts ?? [];
  const summary = data?.summary;

  // Sort: RED first, then YELLOW, then GREEN
  const sortOrder = { RED: 0, YELLOW: 1, GREEN: 2 };
  const sorted = [...companies].sort(
    (a, b) => sortOrder[a.healthStatus] - sortOrder[b.healthStatus]
  );

  return (
    <div className="space-y-6">
      <ToastWrapper />

      <PageHeader
        title="Portfolio Pulse"
        description="Real-time health monitoring across all portfolio companies. Stage-aware KPI thresholds surface problems before they compound. Click any company card for deep-dive metrics, escalation history, and recommended interventions."
        features={[
          "Stage-aware KPI thresholds (Seed+, Series A, Series B) with automatic RED/YELLOW/GREEN classification",
          "Six P0 metrics per company: ARR Growth, NRR, Burn Multiple, Cash Runway, Rule of 40, Magic Number",
          "Anomaly detection with automatic escalation levels (L0-L4)",
          "Recommended interventions generated from operating playbooks",
          "Board pack tracking and operating cadence visibility",
        ]}
      />

      {/* Portfolio Overview Bar */}
      {summary && <HealthOverviewBar summary={summary} />}

      {/* Company Health Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sorted.map((company) => (
          <CompanyHealthCard
            key={company.id}
            company={company}
            onClick={() => handleCardClick(company)}
          />
        ))}
      </div>

      {/* Anomaly Alerts */}
      <AnomalyAlerts alerts={alerts} />

      {/* Company Detail Drawer */}
      <CompanyDetailDrawer
        company={selectedCompany}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </div>
  );
}
