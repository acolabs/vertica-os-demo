import { NextRequest, NextResponse } from "next/server";

export interface Deal {
  id: string;
  company: string;
  sector: string;
  stage: "Sourcing" | "Screening" | "Deep Dive" | "Diligence" | "IC Decision" | "Closed";
  arr: number;
  arrDisplay: string;
  yoyGrowth: number;
  nrr: number;
  grossMargin: number;
  headcount: number;
  founded: number;
  checkSize: number;
  checkSizeDisplay: string;
  daysInStage: number;
  assignedTo: string;
  assignedInitial: string;
  thesisFit: number;
  investmentThesis: string;
  ev: number;
  evDisplay: string;
  ownershipPercent: number;
  projectedMoic: number;
  projectedIrr: number;
  redFlags: string[];
  diligenceChecklist: { item: string; done: boolean }[];
  stageHistory: { stage: string; enteredDate: string; daysSpent: number }[];
}

const deals: Deal[] = [
  {
    id: "deal-001",
    company: "DSN Software",
    sector: "Dental SaaS",
    stage: "Closed",
    arr: 15_000_000,
    arrDisplay: "$15M",
    yoyGrowth: 32,
    nrr: 118,
    grossMargin: 82,
    headcount: 95,
    founded: 2016,
    checkSize: 45_000_000,
    checkSizeDisplay: "$45M",
    daysInStage: 0,
    assignedTo: "Marcus Webb",
    assignedInitial: "MW",
    thesisFit: 94,
    investmentThesis:
      "Market-leading dental practice management SaaS with deep EHR integration, strong NRR, and clear path to $30M ARR through adjacent specialty verticals. Defensive moat via switching costs and regulatory compliance workflows.",
    ev: 150_000_000,
    evDisplay: "$150M",
    ownershipPercent: 72,
    projectedMoic: 3.2,
    projectedIrr: 28,
    redFlags: [],
    diligenceChecklist: [
      { item: "Financial audit (Q&E)", done: true },
      { item: "Customer cohort analysis", done: true },
      { item: "Technology due diligence", done: true },
      { item: "Management references", done: true },
      { item: "Legal & IP review", done: true },
      { item: "Insurance & compliance", done: true },
      { item: "Environmental assessment", done: true },
    ],
    stageHistory: [
      { stage: "Sourcing", enteredDate: "2024-01-15", daysSpent: 14 },
      { stage: "Screening", enteredDate: "2024-01-29", daysSpent: 21 },
      { stage: "Deep Dive", enteredDate: "2024-02-19", daysSpent: 35 },
      { stage: "Diligence", enteredDate: "2024-03-25", daysSpent: 42 },
      { stage: "IC Decision", enteredDate: "2024-05-06", daysSpent: 10 },
      { stage: "Closed", enteredDate: "2024-05-16", daysSpent: 0 },
    ],
  },
  {
    id: "deal-002",
    company: "Campspot",
    sector: "Campground SaaS",
    stage: "Closed",
    arr: 12_000_000,
    arrDisplay: "$12M",
    yoyGrowth: 45,
    nrr: 122,
    grossMargin: 78,
    headcount: 68,
    founded: 2015,
    checkSize: 35_000_000,
    checkSizeDisplay: "$35M",
    daysInStage: 0,
    assignedTo: "Sarah Chen",
    assignedInitial: "SC",
    thesisFit: 91,
    investmentThesis:
      "Dominant campground reservation and management platform with 2-sided network effects. Booking marketplace creates organic demand gen for park operator SaaS. Strong unit economics with $2K+ ACV and <3% logo churn.",
    ev: 108_000_000,
    evDisplay: "$108M",
    ownershipPercent: 68,
    projectedMoic: 3.5,
    projectedIrr: 31,
    redFlags: [],
    diligenceChecklist: [
      { item: "Financial audit (Q&E)", done: true },
      { item: "Customer cohort analysis", done: true },
      { item: "Technology due diligence", done: true },
      { item: "Management references", done: true },
      { item: "Legal & IP review", done: true },
      { item: "Market sizing validation", done: true },
    ],
    stageHistory: [
      { stage: "Sourcing", enteredDate: "2023-09-01", daysSpent: 10 },
      { stage: "Screening", enteredDate: "2023-09-11", daysSpent: 18 },
      { stage: "Deep Dive", enteredDate: "2023-09-29", daysSpent: 28 },
      { stage: "Diligence", enteredDate: "2023-10-27", daysSpent: 38 },
      { stage: "IC Decision", enteredDate: "2023-12-04", daysSpent: 7 },
      { stage: "Closed", enteredDate: "2023-12-11", daysSpent: 0 },
    ],
  },
  {
    id: "deal-003",
    company: "Condo Control",
    sector: "HOA SaaS",
    stage: "Closed",
    arr: 8_000_000,
    arrDisplay: "$8M",
    yoyGrowth: 28,
    nrr: 112,
    grossMargin: 80,
    headcount: 52,
    founded: 2012,
    checkSize: 22_000_000,
    checkSizeDisplay: "$22M",
    daysInStage: 0,
    assignedTo: "James Porter",
    assignedInitial: "JP",
    thesisFit: 87,
    investmentThesis:
      "Leading HOA and condo management platform in North America with deep feature set including payments, communications, and amenity booking. Sticky customer base with 95%+ retention and expansion via payment processing attach rate.",
    ev: 72_000_000,
    evDisplay: "$72M",
    ownershipPercent: 65,
    projectedMoic: 3.0,
    projectedIrr: 26,
    redFlags: [],
    diligenceChecklist: [
      { item: "Financial audit (Q&E)", done: true },
      { item: "Customer cohort analysis", done: true },
      { item: "Technology due diligence", done: true },
      { item: "Management references", done: true },
      { item: "Legal & IP review", done: true },
      { item: "Regulatory compliance review", done: true },
    ],
    stageHistory: [
      { stage: "Sourcing", enteredDate: "2024-03-10", daysSpent: 12 },
      { stage: "Screening", enteredDate: "2024-03-22", daysSpent: 20 },
      { stage: "Deep Dive", enteredDate: "2024-04-11", daysSpent: 30 },
      { stage: "Diligence", enteredDate: "2024-05-11", daysSpent: 45 },
      { stage: "IC Decision", enteredDate: "2024-06-25", daysSpent: 8 },
      { stage: "Closed", enteredDate: "2024-07-03", daysSpent: 0 },
    ],
  },
  {
    id: "deal-004",
    company: "PropStack",
    sector: "Property Mgmt SaaS",
    stage: "IC Decision",
    arr: 18_000_000,
    arrDisplay: "$18M",
    yoyGrowth: 52,
    nrr: 125,
    grossMargin: 84,
    headcount: 110,
    founded: 2018,
    checkSize: 55_000_000,
    checkSizeDisplay: "$55M",
    daysInStage: 6,
    assignedTo: "Marcus Webb",
    assignedInitial: "MW",
    thesisFit: 92,
    investmentThesis:
      "Next-gen property management platform disrupting legacy incumbents (Yardi, RealPage) with modern UX, API-first architecture, and AI-powered tenant screening. Rapid mid-market penetration with 52% YoY growth and best-in-class NRR.",
    ev: 198_000_000,
    evDisplay: "$198M",
    ownershipPercent: 70,
    projectedMoic: 3.8,
    projectedIrr: 34,
    redFlags: ["Key-person dependency on CTO", "Pending lease accounting regulation changes"],
    diligenceChecklist: [
      { item: "Financial audit (Q&E)", done: true },
      { item: "Customer cohort analysis", done: true },
      { item: "Technology due diligence", done: true },
      { item: "Management references", done: true },
      { item: "Legal & IP review", done: true },
      { item: "IC memo draft", done: false },
      { item: "Final terms negotiation", done: false },
    ],
    stageHistory: [
      { stage: "Sourcing", enteredDate: "2024-11-01", daysSpent: 8 },
      { stage: "Screening", enteredDate: "2024-11-09", daysSpent: 15 },
      { stage: "Deep Dive", enteredDate: "2024-11-24", daysSpent: 25 },
      { stage: "Diligence", enteredDate: "2024-12-19", daysSpent: 40 },
      { stage: "IC Decision", enteredDate: "2025-01-28", daysSpent: 6 },
    ],
  },
  {
    id: "deal-005",
    company: "VetOS",
    sector: "Veterinary SaaS",
    stage: "Diligence",
    arr: 6_000_000,
    arrDisplay: "$6M",
    yoyGrowth: 85,
    nrr: 130,
    grossMargin: 76,
    headcount: 42,
    founded: 2020,
    checkSize: 18_000_000,
    checkSizeDisplay: "$18M",
    daysInStage: 22,
    assignedTo: "Sarah Chen",
    assignedInitial: "SC",
    thesisFit: 88,
    investmentThesis:
      "Fast-growing veterinary practice management platform with cloud-native architecture and integrated telehealth. Riding secular tailwinds of pet humanization and vet consolidation. 85% YoY growth with strong cohort economics.",
    ev: 60_000_000,
    evDisplay: "$60M",
    ownershipPercent: 75,
    projectedMoic: 4.2,
    projectedIrr: 38,
    redFlags: ["Early stage — limited operating history", "High customer concentration (top 10 = 35% ARR)"],
    diligenceChecklist: [
      { item: "Financial audit (Q&E)", done: true },
      { item: "Customer cohort analysis", done: true },
      { item: "Technology due diligence", done: false },
      { item: "Management references", done: true },
      { item: "Legal & IP review", done: false },
      { item: "Competitive landscape deep dive", done: true },
      { item: "Regulatory compliance (USDA/DEA)", done: false },
      { item: "Integration partner diligence", done: false },
    ],
    stageHistory: [
      { stage: "Sourcing", enteredDate: "2024-10-15", daysSpent: 7 },
      { stage: "Screening", enteredDate: "2024-10-22", daysSpent: 18 },
      { stage: "Deep Dive", enteredDate: "2024-11-09", daysSpent: 30 },
      { stage: "Diligence", enteredDate: "2024-12-09", daysSpent: 22 },
    ],
  },
  {
    id: "deal-006",
    company: "ClinicSync",
    sector: "Healthcare Ops SaaS",
    stage: "Diligence",
    arr: 11_000_000,
    arrDisplay: "$11M",
    yoyGrowth: 38,
    nrr: 115,
    grossMargin: 79,
    headcount: 72,
    founded: 2017,
    checkSize: 32_000_000,
    checkSizeDisplay: "$32M",
    daysInStage: 15,
    assignedTo: "James Porter",
    assignedInitial: "JP",
    thesisFit: 82,
    investmentThesis:
      "Multi-location clinic operations platform unifying scheduling, billing, and patient engagement. Strong foothold in specialty care (dermatology, orthopedics) with playbook to expand into primary care. Defensible via deep EHR integrations.",
    ev: 99_000_000,
    evDisplay: "$99M",
    ownershipPercent: 68,
    projectedMoic: 3.1,
    projectedIrr: 27,
    redFlags: ["HIPAA compliance audit pending", "CTO departure 6 months ago — new CTO ramping"],
    diligenceChecklist: [
      { item: "Financial audit (Q&E)", done: true },
      { item: "Customer cohort analysis", done: true },
      { item: "Technology due diligence", done: false },
      { item: "Management references", done: false },
      { item: "Legal & IP review", done: true },
      { item: "HIPAA compliance audit", done: false },
    ],
    stageHistory: [
      { stage: "Sourcing", enteredDate: "2024-09-20", daysSpent: 11 },
      { stage: "Screening", enteredDate: "2024-10-01", daysSpent: 22 },
      { stage: "Deep Dive", enteredDate: "2024-10-23", daysSpent: 32 },
      { stage: "Diligence", enteredDate: "2024-11-24", daysSpent: 15 },
    ],
  },
  {
    id: "deal-007",
    company: "GovFlow",
    sector: "GovTech SaaS",
    stage: "Deep Dive",
    arr: 9_000_000,
    arrDisplay: "$9M",
    yoyGrowth: 42,
    nrr: 108,
    grossMargin: 81,
    headcount: 58,
    founded: 2019,
    checkSize: 25_000_000,
    checkSizeDisplay: "$25M",
    daysInStage: 18,
    assignedTo: "Sarah Chen",
    assignedInitial: "SC",
    thesisFit: 76,
    investmentThesis:
      "Cloud-based government permitting and licensing platform replacing paper-based workflows. Long sales cycles offset by extremely high retention (98%+) and multi-year contracts. Adjacent expansion into inspections and code enforcement.",
    ev: 81_000_000,
    evDisplay: "$81M",
    ownershipPercent: 70,
    projectedMoic: 3.0,
    projectedIrr: 25,
    redFlags: ["Long sales cycles (9-12 months)", "Government budget dependency", "FedRAMP certification in progress"],
    diligenceChecklist: [
      { item: "Financial audit (Q&E)", done: false },
      { item: "Customer cohort analysis", done: true },
      { item: "Technology due diligence", done: false },
      { item: "Management references", done: false },
      { item: "Government contract review", done: false },
      { item: "Security & FedRAMP assessment", done: false },
    ],
    stageHistory: [
      { stage: "Sourcing", enteredDate: "2024-11-15", daysSpent: 10 },
      { stage: "Screening", enteredDate: "2024-11-25", daysSpent: 16 },
      { stage: "Deep Dive", enteredDate: "2024-12-11", daysSpent: 18 },
    ],
  },
  {
    id: "deal-008",
    company: "FleetPulse",
    sector: "Fleet Mgmt IoT",
    stage: "Screening",
    arr: 4_000_000,
    arrDisplay: "$4M",
    yoyGrowth: 95,
    nrr: 135,
    grossMargin: 68,
    headcount: 35,
    founded: 2021,
    checkSize: 12_000_000,
    checkSizeDisplay: "$12M",
    daysInStage: 11,
    assignedTo: "Marcus Webb",
    assignedInitial: "MW",
    thesisFit: 71,
    investmentThesis:
      "IoT-enabled fleet management platform combining telematics, route optimization, and predictive maintenance. Hardware-assisted SaaS model creates high switching costs. Explosive growth but earlier stage with margin expansion potential.",
    ev: 44_000_000,
    evDisplay: "$44M",
    ownershipPercent: 72,
    projectedMoic: 4.5,
    projectedIrr: 42,
    redFlags: ["Hardware margin drag on gross margin", "Supply chain risk for IoT devices", "Pre-profitability"],
    diligenceChecklist: [
      { item: "Initial financial review", done: true },
      { item: "Market sizing", done: true },
      { item: "Competitive landscape", done: false },
      { item: "Management meeting", done: false },
      { item: "Reference checks (initial)", done: false },
    ],
    stageHistory: [
      { stage: "Sourcing", enteredDate: "2024-12-20", daysSpent: 9 },
      { stage: "Screening", enteredDate: "2024-12-29", daysSpent: 11 },
    ],
  },
  {
    id: "deal-009",
    company: "MarinaHub",
    sector: "Marina Mgmt SaaS",
    stage: "Sourcing",
    arr: 3_000_000,
    arrDisplay: "$3M",
    yoyGrowth: 60,
    nrr: 110,
    grossMargin: 83,
    headcount: 22,
    founded: 2020,
    checkSize: 8_000_000,
    checkSizeDisplay: "$8M",
    daysInStage: 5,
    assignedTo: "James Porter",
    assignedInitial: "JP",
    thesisFit: 68,
    investmentThesis:
      "Niche marina management SaaS with slip booking, payment processing, and facility management. Fragmented market with no dominant player. Thesis depends on ability to consolidate market share and expand ARPU via payments.",
    ev: 27_000_000,
    evDisplay: "$27M",
    ownershipPercent: 78,
    projectedMoic: 3.8,
    projectedIrr: 35,
    redFlags: ["Small TAM — $2B addressable market", "Seasonal revenue patterns", "Limited management depth"],
    diligenceChecklist: [
      { item: "Initial outreach", done: true },
      { item: "CIM review", done: false },
      { item: "Preliminary financials review", done: false },
      { item: "Market sizing", done: false },
      { item: "Thesis fit assessment", done: false },
    ],
    stageHistory: [
      { stage: "Sourcing", enteredDate: "2025-01-03", daysSpent: 5 },
    ],
  },
  {
    id: "deal-010",
    company: "LogiTrack",
    sector: "Logistics SaaS",
    stage: "Screening",
    arr: 7_000_000,
    arrDisplay: "$7M",
    yoyGrowth: 55,
    nrr: 119,
    grossMargin: 77,
    headcount: 48,
    founded: 2019,
    checkSize: 20_000_000,
    checkSizeDisplay: "$20M",
    daysInStage: 8,
    assignedTo: "Sarah Chen",
    assignedInitial: "SC",
    thesisFit: 79,
    investmentThesis:
      "Last-mile logistics orchestration platform for mid-market retailers and 3PLs. Strong product-market fit evidenced by 55% organic growth and 119% NRR. Opportunity to become the operating system for mid-market fulfillment.",
    ev: 63_000_000,
    evDisplay: "$63M",
    ownershipPercent: 70,
    projectedMoic: 3.4,
    projectedIrr: 30,
    redFlags: ["Competitive market with well-funded players", "Key integration dependency on Shopify"],
    diligenceChecklist: [
      { item: "Initial financial review", done: true },
      { item: "Market sizing", done: true },
      { item: "Competitive landscape", done: true },
      { item: "Management meeting", done: false },
      { item: "Reference checks (initial)", done: false },
    ],
    stageHistory: [
      { stage: "Sourcing", enteredDate: "2024-12-10", daysSpent: 12 },
      { stage: "Screening", enteredDate: "2024-12-22", daysSpent: 8 },
    ],
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const _orgId = searchParams.get("org_id");

  const stages = [
    "Sourcing",
    "Screening",
    "Deep Dive",
    "Diligence",
    "IC Decision",
    "Closed",
  ] as const;

  const pipeline = stages.map((stage) => {
    const stageDeals = deals.filter((d) => d.stage === stage);
    const totalValue = stageDeals.reduce((sum, d) => sum + d.checkSize, 0);
    return {
      stage,
      count: stageDeals.length,
      totalValue,
      totalValueDisplay:
        totalValue >= 1_000_000
          ? `$${(totalValue / 1_000_000).toFixed(0)}M`
          : `$${(totalValue / 1_000).toFixed(0)}K`,
      deals: stageDeals,
    };
  });

  const summary = {
    totalDeals: deals.length,
    totalPipelineValue: deals.reduce((sum, d) => sum + d.checkSize, 0),
    activeDeals: deals.filter((d) => d.stage !== "Closed").length,
    avgThesisFit: Math.round(
      deals.reduce((sum, d) => sum + d.thesisFit, 0) / deals.length
    ),
    avgDaysToClose:
      Math.round(
        deals
          .filter((d) => d.stage === "Closed")
          .reduce(
            (sum, d) =>
              sum + d.stageHistory.reduce((s, h) => s + h.daysSpent, 0),
            0
          ) / deals.filter((d) => d.stage === "Closed").length
      ) || 0,
  };

  return NextResponse.json({ pipeline, summary, deals });
}
