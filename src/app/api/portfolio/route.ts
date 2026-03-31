import { NextRequest, NextResponse } from "next/server";

export type CompanyStage = "Seed+" | "Series A" | "Series B";
export type HealthStatus = "GREEN" | "YELLOW" | "RED";
export type MetricStatus = "green" | "yellow" | "red";
export type Trend = "up" | "down" | "flat";
export type EscalationLevel = "L0" | "L1" | "L2" | "L3" | "L4";
export type AlertSeverity = "High" | "Medium" | "Low";
export type AlertStatus = "New" | "Acknowledged" | "Resolved";

export interface KpiMetric {
  label: string;
  value: number;
  displayValue: string;
  status: MetricStatus;
  trend: Trend;
  target: number;
  displayTarget: string;
}

export interface EscalationEntry {
  date: string;
  level: EscalationLevel;
  reason: string;
  resolved: boolean;
}

export interface AnomalyAlert {
  id: string;
  companyName: string;
  kpi: string;
  severity: AlertSeverity;
  timestamp: string;
  description: string;
  status: AlertStatus;
}

export interface PortfolioCompany {
  id: string;
  name: string;
  industry: string;
  stage: CompanyStage;
  healthStatus: HealthStatus;
  arr: number;
  arrGrowth: number;
  nrr: number;
  burnMultiple: number;
  cashRunway: number;
  ruleOf40: number;
  magicNumber: number;
  kpis: KpiMetric[];
  escalationLevel: EscalationLevel | null;
  escalationHistory: EscalationEntry[];
  daysSinceRefresh: number;
  lastBoardPackDate: string;
  operatingCadence: string;
  recommendedInterventions: string[];
}

// --- KPI Threshold Definitions ---

interface ThresholdDef {
  greenMin?: number;
  greenMax?: number;
  yellowMin?: number;
  yellowMax?: number;
  // For metrics where lower is better (burn multiple)
  invertedScale?: boolean;
}

type ThresholdMap = Record<string, Record<CompanyStage, ThresholdDef>>;

const thresholds: ThresholdMap = {
  arrGrowth: {
    "Seed+": { greenMin: 100, yellowMin: 50, yellowMax: 100 },
    "Series A": { greenMin: 80, yellowMin: 40, yellowMax: 80 },
    "Series B": { greenMin: 60, yellowMin: 30, yellowMax: 60 },
  },
  nrr: {
    "Seed+": { greenMin: 110, yellowMin: 100, yellowMax: 110 },
    "Series A": { greenMin: 115, yellowMin: 105, yellowMax: 115 },
    "Series B": { greenMin: 120, yellowMin: 110, yellowMax: 120 },
  },
  burnMultiple: {
    "Seed+": { greenMax: 1.5, yellowMin: 1.5, yellowMax: 2.5, invertedScale: true },
    "Series A": { greenMax: 1.0, yellowMin: 1.0, yellowMax: 2.0, invertedScale: true },
    "Series B": { greenMax: 0.75, yellowMin: 0.75, yellowMax: 1.5, invertedScale: true },
  },
  cashRunway: {
    "Seed+": { greenMin: 18, yellowMin: 12, yellowMax: 18 },
    "Series A": { greenMin: 18, yellowMin: 12, yellowMax: 18 },
    "Series B": { greenMin: 24, yellowMin: 18, yellowMax: 24 },
  },
  ruleOf40: {
    "Seed+": { greenMin: 50, yellowMin: 25, yellowMax: 50 },
    "Series A": { greenMin: 45, yellowMin: 25, yellowMax: 45 },
    "Series B": { greenMin: 50, yellowMin: 25, yellowMax: 50 },
  },
  magicNumber: {
    "Seed+": { greenMin: 0.85, yellowMin: 0.5, yellowMax: 0.85 },
    "Series A": { greenMin: 0.85, yellowMin: 0.5, yellowMax: 0.85 },
    "Series B": { greenMin: 1.0, yellowMin: 0.5, yellowMax: 1.0 },
  },
};

function getMetricStatus(
  metricKey: string,
  value: number,
  stage: CompanyStage
): MetricStatus {
  const t = thresholds[metricKey]?.[stage];
  if (!t) return "green";

  if (t.invertedScale) {
    if (value <= (t.greenMax ?? Infinity)) return "green";
    if (value >= (t.yellowMin ?? 0) && value <= (t.yellowMax ?? Infinity))
      return "yellow";
    return "red";
  }

  if (value >= (t.greenMin ?? -Infinity)) return "green";
  if (value >= (t.yellowMin ?? -Infinity) && value < (t.greenMin ?? Infinity))
    return "yellow";
  return "red";
}

function buildKpis(company: {
  arrGrowth: number;
  nrr: number;
  burnMultiple: number;
  cashRunway: number;
  ruleOf40: number;
  magicNumber: number;
  stage: CompanyStage;
  trends: Record<string, Trend>;
}): KpiMetric[] {
  const { stage, trends } = company;
  const stageThresholds = {
    arrGrowth: thresholds.arrGrowth[stage],
    nrr: thresholds.nrr[stage],
    burnMultiple: thresholds.burnMultiple[stage],
    cashRunway: thresholds.cashRunway[stage],
    ruleOf40: thresholds.ruleOf40[stage],
    magicNumber: thresholds.magicNumber[stage],
  };

  return [
    {
      label: "ARR Growth",
      value: company.arrGrowth,
      displayValue: `${company.arrGrowth}%`,
      status: getMetricStatus("arrGrowth", company.arrGrowth, stage),
      trend: trends.arrGrowth ?? "flat",
      target: stageThresholds.arrGrowth.greenMin ?? 0,
      displayTarget: `>${stageThresholds.arrGrowth.greenMin}%`,
    },
    {
      label: "NRR",
      value: company.nrr,
      displayValue: `${company.nrr}%`,
      status: getMetricStatus("nrr", company.nrr, stage),
      trend: trends.nrr ?? "flat",
      target: stageThresholds.nrr.greenMin ?? 0,
      displayTarget: `>${stageThresholds.nrr.greenMin}%`,
    },
    {
      label: "Burn Multiple",
      value: company.burnMultiple,
      displayValue: `${company.burnMultiple}x`,
      status: getMetricStatus("burnMultiple", company.burnMultiple, stage),
      trend: trends.burnMultiple ?? "flat",
      target: stageThresholds.burnMultiple.greenMax ?? 0,
      displayTarget: `<${stageThresholds.burnMultiple.greenMax}x`,
    },
    {
      label: "Cash Runway",
      value: company.cashRunway,
      displayValue: `${company.cashRunway}mo`,
      status: getMetricStatus("cashRunway", company.cashRunway, stage),
      trend: trends.cashRunway ?? "flat",
      target: stageThresholds.cashRunway.greenMin ?? 0,
      displayTarget: `>${stageThresholds.cashRunway.greenMin}mo`,
    },
    {
      label: "Rule of 40",
      value: company.ruleOf40,
      displayValue: `${company.ruleOf40}`,
      status: getMetricStatus("ruleOf40", company.ruleOf40, stage),
      trend: trends.ruleOf40 ?? "flat",
      target: stageThresholds.ruleOf40.greenMin ?? 0,
      displayTarget: `>${stageThresholds.ruleOf40.greenMin}`,
    },
    {
      label: "Magic Number",
      value: company.magicNumber,
      displayValue: `${company.magicNumber}`,
      status: getMetricStatus("magicNumber", company.magicNumber, stage),
      trend: trends.magicNumber ?? "flat",
      target: stageThresholds.magicNumber.greenMin ?? 0,
      displayTarget: `>${stageThresholds.magicNumber.greenMin}`,
    },
  ];
}

function determineHealthStatus(kpis: KpiMetric[]): HealthStatus {
  const redCount = kpis.filter((k) => k.status === "red").length;
  const yellowCount = kpis.filter((k) => k.status === "yellow").length;
  if (redCount >= 2) return "RED";
  if (redCount === 1 || yellowCount >= 2) return "YELLOW";
  return "GREEN";
}

// --- Mock Data ---

const mockCompanies: PortfolioCompany[] = (() => {
  const raw = [
    {
      id: "co_dsn",
      name: "DSN Software",
      industry: "Dental SaaS",
      stage: "Series A" as CompanyStage,
      arr: 15_000_000,
      arrGrowth: 72,
      nrr: 118,
      burnMultiple: 0.9,
      cashRunway: 22,
      ruleOf40: 52,
      magicNumber: 0.92,
      daysSinceRefresh: 2,
      lastBoardPackDate: "2026-01-15",
      operatingCadence: "Monthly board call, weekly exec sync, quarterly deep-dive",
      escalationLevel: null as EscalationLevel | null,
      escalationHistory: [] as EscalationEntry[],
      recommendedInterventions: [
        "Monitor burn multiple trend -- rising 0.1x/quarter",
        "Consider hiring VP Sales to accelerate pipeline",
      ],
      trends: {
        arrGrowth: "up" as Trend,
        nrr: "up" as Trend,
        burnMultiple: "up" as Trend,
        cashRunway: "flat" as Trend,
        ruleOf40: "up" as Trend,
        magicNumber: "up" as Trend,
      },
    },
    {
      id: "co_campspot",
      name: "Campspot",
      industry: "Campground SaaS",
      stage: "Series A" as CompanyStage,
      arr: 12_000_000,
      arrGrowth: 65,
      nrr: 112,
      burnMultiple: 1.3,
      cashRunway: 16,
      ruleOf40: 38,
      magicNumber: 0.71,
      daysSinceRefresh: 5,
      lastBoardPackDate: "2026-01-08",
      operatingCadence: "Monthly board call, bi-weekly ops review, quarterly board meeting",
      escalationLevel: "L1" as EscalationLevel,
      escalationHistory: [
        {
          date: "2026-01-20",
          level: "L1" as EscalationLevel,
          reason: "NRR declining 3 consecutive months",
          resolved: false,
        },
      ],
      recommendedInterventions: [
        "Deploy churn prediction agent to flag at-risk accounts",
        "Review pricing structure -- expansion revenue declining",
        "NRR task force: weekly cohort analysis",
      ],
      trends: {
        arrGrowth: "flat" as Trend,
        nrr: "down" as Trend,
        burnMultiple: "up" as Trend,
        cashRunway: "down" as Trend,
        ruleOf40: "down" as Trend,
        magicNumber: "flat" as Trend,
      },
    },
    {
      id: "co_condocontrol",
      name: "Condo Control",
      industry: "HOA SaaS",
      stage: "Seed+" as CompanyStage,
      arr: 8_000_000,
      arrGrowth: 95,
      nrr: 108,
      burnMultiple: 1.8,
      cashRunway: 14,
      ruleOf40: 42,
      magicNumber: 0.68,
      daysSinceRefresh: 1,
      lastBoardPackDate: "2026-01-22",
      operatingCadence: "Monthly founder sync, quarterly board meeting",
      escalationLevel: "L1" as EscalationLevel,
      escalationHistory: [
        {
          date: "2026-02-01",
          level: "L1" as EscalationLevel,
          reason: "Burn multiple exceeding 1.5x for 2 months",
          resolved: false,
        },
      ],
      recommendedInterventions: [
        "Reduce CAC by focusing on inbound vs. outbound",
        "Evaluate hiring plan -- 3 open headcount may not be needed this quarter",
        "Tighten expense review cadence to bi-weekly",
      ],
      trends: {
        arrGrowth: "up" as Trend,
        nrr: "flat" as Trend,
        burnMultiple: "up" as Trend,
        cashRunway: "down" as Trend,
        ruleOf40: "flat" as Trend,
        magicNumber: "up" as Trend,
      },
    },
    {
      id: "co_vetos",
      name: "VetOS",
      industry: "Veterinary SaaS",
      stage: "Seed+" as CompanyStage,
      arr: 6_000_000,
      arrGrowth: 120,
      nrr: 115,
      burnMultiple: 1.2,
      cashRunway: 20,
      ruleOf40: 62,
      magicNumber: 0.95,
      daysSinceRefresh: 3,
      lastBoardPackDate: "2026-01-18",
      operatingCadence: "Monthly founder sync, quarterly board meeting, annual strategy offsite",
      escalationLevel: null as EscalationLevel | null,
      escalationHistory: [],
      recommendedInterventions: [
        "Prepare Series A materials -- metrics support strong raise",
        "Explore adjacent verticals (equine, exotic pets)",
      ],
      trends: {
        arrGrowth: "up" as Trend,
        nrr: "up" as Trend,
        burnMultiple: "down" as Trend,
        cashRunway: "up" as Trend,
        ruleOf40: "up" as Trend,
        magicNumber: "up" as Trend,
      },
    },
    {
      id: "co_clinicsync",
      name: "ClinicSync",
      industry: "Clinic Ops",
      stage: "Series A" as CompanyStage,
      arr: 11_000_000,
      arrGrowth: 45,
      nrr: 106,
      burnMultiple: 2.1,
      cashRunway: 10,
      ruleOf40: 22,
      magicNumber: 0.42,
      daysSinceRefresh: 7,
      lastBoardPackDate: "2025-12-20",
      operatingCadence: "Weekly exec sync, monthly board call, quarterly deep-dive",
      escalationLevel: "L3" as EscalationLevel,
      escalationHistory: [
        {
          date: "2025-12-01",
          level: "L1" as EscalationLevel,
          reason: "ARR growth dropping below 50%",
          resolved: false,
        },
        {
          date: "2025-12-15",
          level: "L2" as EscalationLevel,
          reason: "Burn multiple exceeded 2.0x",
          resolved: false,
        },
        {
          date: "2026-01-10",
          level: "L3" as EscalationLevel,
          reason: "Cash runway dropped below 12 months, Rule of 40 < 25",
          resolved: false,
        },
      ],
      recommendedInterventions: [
        "URGENT: Initiate bridge financing evaluation",
        "Implement immediate hiring freeze",
        "Deploy expense reduction playbook -- target 30% opex cut",
        "Weekly cash flow monitoring with CFO",
        "Evaluate strategic alternatives if no improvement in 60 days",
      ],
      trends: {
        arrGrowth: "down" as Trend,
        nrr: "down" as Trend,
        burnMultiple: "up" as Trend,
        cashRunway: "down" as Trend,
        ruleOf40: "down" as Trend,
        magicNumber: "down" as Trend,
      },
    },
  ];

  return raw.map((c) => {
    const kpis = buildKpis(c);
    const healthStatus = determineHealthStatus(kpis);
    return { ...c, kpis, healthStatus, trends: undefined } as unknown as PortfolioCompany;
  });
})();

const mockAlerts: AnomalyAlert[] = [
  {
    id: "alert_1",
    companyName: "ClinicSync",
    kpi: "Cash Runway",
    severity: "High",
    timestamp: "2026-02-10T14:30:00Z",
    description:
      "Cash runway dropped to 10 months, below the 12-month critical threshold for Series A companies. Immediate action required.",
    status: "New",
  },
  {
    id: "alert_2",
    companyName: "ClinicSync",
    kpi: "Burn Multiple",
    severity: "High",
    timestamp: "2026-02-09T09:15:00Z",
    description:
      "Burn multiple at 2.1x, exceeding the 2.0x red threshold. Net burn accelerating despite flat revenue growth.",
    status: "Acknowledged",
  },
  {
    id: "alert_3",
    companyName: "Campspot",
    kpi: "NRR",
    severity: "Medium",
    timestamp: "2026-02-08T11:00:00Z",
    description:
      "NRR declining for 3 consecutive months. Current 112% approaching yellow threshold of 115% for Series A.",
    status: "New",
  },
  {
    id: "alert_4",
    companyName: "Condo Control",
    kpi: "Burn Multiple",
    severity: "Medium",
    timestamp: "2026-02-07T16:45:00Z",
    description:
      "Burn multiple at 1.8x, in yellow zone for Seed+ companies. Trending upward from 1.5x last quarter.",
    status: "Acknowledged",
  },
  {
    id: "alert_5",
    companyName: "ClinicSync",
    kpi: "Magic Number",
    severity: "High",
    timestamp: "2026-02-06T08:20:00Z",
    description:
      "Magic number fell to 0.42, well below 0.5 red threshold. Sales efficiency has deteriorated significantly.",
    status: "New",
  },
  {
    id: "alert_6",
    companyName: "DSN Software",
    kpi: "Burn Multiple",
    severity: "Low",
    timestamp: "2026-02-05T13:10:00Z",
    description:
      "Burn multiple trending upward: 0.7x to 0.9x over 2 quarters. Still green but worth monitoring.",
    status: "Resolved",
  },
];

export async function GET(_request: NextRequest) {
  const totalArr = mockCompanies.reduce((s, c) => s + c.arr, 0);
  const avgNrr =
    mockCompanies.reduce((s, c) => s + c.nrr, 0) / mockCompanies.length;

  const greenCount = mockCompanies.filter(
    (c) => c.healthStatus === "GREEN"
  ).length;
  const yellowCount = mockCompanies.filter(
    (c) => c.healthStatus === "YELLOW"
  ).length;
  const redCount = mockCompanies.filter(
    (c) => c.healthStatus === "RED"
  ).length;

  // Value at risk = ARR of yellow + red companies
  const valueAtRisk = mockCompanies
    .filter((c) => c.healthStatus !== "GREEN")
    .reduce((s, c) => s + c.arr, 0);

  return NextResponse.json({
    summary: {
      totalCompanies: mockCompanies.length,
      greenCount,
      yellowCount,
      redCount,
      totalArr,
      avgNrr: Math.round(avgNrr * 10) / 10,
      valueAtRisk,
    },
    companies: mockCompanies,
    alerts: mockAlerts,
  });
}
