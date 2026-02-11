import { NextRequest, NextResponse } from "next/server";

function getDsnData() {
  return {
    scorecards: [
      {
        id: "eval-1",
        agent: "Revenue Cadence Agent",
        evalName: "Q4 2025 Replay",
        dataset: "Q4 2025 pipeline data (847 deals)",
        runDate: "Jan 15, 2026",
        accuracy: 91.2,
        precision: 91.8,
        recall: 97.2,
        truePositives: 423,
        falsePositives: 38,
        missed: 12,
        valueCaptured: 2100000,
        valueMissed: 312000,
        totalOpportunity: 2400000,
        status: "passed",
        statusLabel: "Passed",
        type: "revenue",
      },
      {
        id: "eval-2",
        agent: "Support Deflection Agent",
        evalName: "Last 90 Days Replay",
        dataset: "90-day ticket archive (3,241 tickets)",
        runDate: "Jan 22, 2026",
        accuracy: 87.4,
        precision: 96.6,
        recall: 82.1,
        truePositives: 1892,
        falsePositives: 67,
        missed: 412,
        valueCaptured: 48200,
        valueMissed: 0,
        totalOpportunity: 48200,
        status: "passed",
        statusLabel: "Passed",
        type: "support",
        csatImpact: "+0.2",
      },
      {
        id: "eval-3",
        agent: "NRR Agent",
        evalName: "Churn Prediction Backtest",
        dataset: "12-month renewal cohort (156 accounts)",
        runDate: "Jan 28, 2026",
        accuracy: 84.6,
        precision: 77.8,
        recall: 90.3,
        truePositives: 28,
        falsePositives: 8,
        missed: 3,
        valueCaptured: 890000,
        valueMissed: 142000,
        totalOpportunity: 1032000,
        status: "review",
        statusLabel: "Passed — review 3 missed",
        type: "nrr",
      },
    ],
    beforeAfter: [
      { metric: "Pipeline Coverage", before: 62, after: 84, unit: "%", lowerBetter: false },
      { metric: "Stage Conversion", before: 18, after: 26, unit: "%", lowerBetter: false },
      { metric: "Win Rate", before: 22, after: 31, unit: "%", lowerBetter: false },
      { metric: "Cycle Time", before: 45, after: 32, unit: " days", lowerBetter: true },
      { metric: "Deflection Rate", before: 12, after: 42, unit: "%", lowerBetter: false },
      { metric: "Avg Handle Time", before: 14, after: 8, unit: " min", lowerBetter: true },
      { metric: "Cost / Ticket", before: 24, after: 14, unit: "", prefix: "$", lowerBetter: true },
      { metric: "CSAT", before: 3.8, after: 4.3, unit: "", lowerBetter: false },
      { metric: "Churn Rate", before: 8.2, after: 5.1, unit: "%", lowerBetter: true },
      { metric: "NRR", before: 98, after: 106, unit: "%", lowerBetter: false },
    ],
    history: [
      { agent: "Revenue Cadence", dataset: "Q4 2025 Pipeline", date: "Jan 15, 2026", accuracy: 91.2, status: "passed", duration: "4m 23s" },
      { agent: "Support Deflection", dataset: "90-Day Tickets", date: "Jan 22, 2026", accuracy: 87.4, status: "passed", duration: "12m 08s" },
      { agent: "NRR Agent", dataset: "12-Mo Renewals", date: "Jan 28, 2026", accuracy: 84.6, status: "review", duration: "8m 45s" },
      { agent: "Revenue Cadence", dataset: "Q3 2025 Pipeline", date: "Dec 10, 2025", accuracy: 88.7, status: "passed", duration: "4m 11s" },
      { agent: "Support Deflection", dataset: "60-Day Tickets", date: "Dec 18, 2025", accuracy: 83.1, status: "failed", duration: "9m 22s" },
      { agent: "NRR Agent", dataset: "6-Mo Renewals", date: "Nov 30, 2025", accuracy: 79.2, status: "review", duration: "6m 17s" },
    ],
  };
}

function getCampspotData() {
  return {
    scorecards: [
      {
        id: "eval-cs-1",
        agent: "Booking Revenue Optimizer",
        evalName: "Q4 2025 Booking Replay",
        dataset: "Q4 booking data (1,245 bookings)",
        runDate: "Jan 18, 2026",
        accuracy: 88.7,
        precision: 90.1,
        recall: 94.3,
        truePositives: 1104,
        falsePositives: 121,
        missed: 67,
        valueCaptured: 345000,
        valueMissed: 67000,
        totalOpportunity: 412000,
        status: "passed",
        statusLabel: "Passed",
        type: "revenue",
      },
      {
        id: "eval-cs-2",
        agent: "Park Support Bot",
        evalName: "45-Day Ticket Replay",
        dataset: "45-day ticket archive (1,890 tickets)",
        runDate: "Jan 25, 2026",
        accuracy: 85.2,
        precision: 92.4,
        recall: 80.8,
        truePositives: 1210,
        falsePositives: 100,
        missed: 288,
        valueCaptured: 31400,
        valueMissed: 0,
        totalOpportunity: 31400,
        status: "passed",
        statusLabel: "Passed",
        type: "support",
        csatImpact: "+0.4",
      },
    ],
    beforeAfter: [
      { metric: "Booking Revenue", before: 2.1, after: 2.6, unit: "M", prefix: "$", lowerBetter: false },
      { metric: "Occupancy Rate", before: 68, after: 79, unit: "%", lowerBetter: false },
      { metric: "Direct Booking", before: 42, after: 58, unit: "%", lowerBetter: false },
      { metric: "Deflection Rate", before: 8, after: 34, unit: "%", lowerBetter: false },
      { metric: "Resolution Time", before: 4.2, after: 1.8, unit: " hrs", lowerBetter: true },
      { metric: "CSAT", before: 4.0, after: 4.4, unit: "", lowerBetter: false },
      { metric: "Seasonal Yield", before: 0, after: 18, unit: "%", prefix: "+", lowerBetter: false },
      { metric: "Channel Cost", before: 12, after: 8, unit: "%", lowerBetter: true },
    ],
    history: [
      { agent: "Booking Revenue Optimizer", dataset: "Q4 2025 Bookings", date: "Jan 18, 2026", accuracy: 88.7, status: "passed", duration: "6m 12s" },
      { agent: "Park Support Bot", dataset: "45-Day Tickets", date: "Jan 25, 2026", accuracy: 85.2, status: "passed", duration: "8m 34s" },
      { agent: "Booking Revenue Optimizer", dataset: "Q3 2025 Bookings", date: "Dec 14, 2025", accuracy: 85.1, status: "passed", duration: "5m 48s" },
      { agent: "Park Support Bot", dataset: "30-Day Tickets", date: "Dec 22, 2025", accuracy: 81.6, status: "review", duration: "7m 19s" },
    ],
  };
}

function getCondoControlData() {
  return {
    scorecards: [
      {
        id: "eval-cc-1",
        agent: "Property Pipeline Scout",
        evalName: "Q4 2025 Property Replay",
        dataset: "Q4 property pipeline (89 properties)",
        runDate: "Jan 20, 2026",
        accuracy: 86.1,
        precision: 84.3,
        recall: 91.7,
        truePositives: 72,
        falsePositives: 13,
        missed: 7,
        valueCaptured: 156000,
        valueMissed: 47000,
        totalOpportunity: 203000,
        status: "passed",
        statusLabel: "Passed",
        type: "revenue",
      },
      {
        id: "eval-cc-2",
        agent: "Resident Support Agent",
        evalName: "30-Day Ticket Replay",
        dataset: "30-day ticket archive (567 tickets)",
        runDate: "Jan 26, 2026",
        accuracy: 79.8,
        precision: 88.2,
        recall: 74.5,
        truePositives: 398,
        falsePositives: 53,
        missed: 136,
        valueCaptured: 12800,
        valueMissed: 0,
        totalOpportunity: 12800,
        status: "review",
        statusLabel: "Passed — review 136 missed",
        type: "support",
        csatImpact: "+0.5",
      },
    ],
    beforeAfter: [
      { metric: "Pipeline Coverage", before: 55, after: 72, unit: "%", lowerBetter: false },
      { metric: "Win Rate", before: 19, after: 27, unit: "%", lowerBetter: false },
      { metric: "Lead Response", before: 6.2, after: 1.4, unit: " hrs", lowerBetter: true },
      { metric: "Deflection Rate", before: 5, after: 24, unit: "%", lowerBetter: false },
      { metric: "Resident Satisfaction", before: 3.6, after: 4.1, unit: "", lowerBetter: false },
      { metric: "Onboarding Time", before: 14, after: 4, unit: " days", lowerBetter: true },
      { metric: "Support Cost", before: 32, after: 22, unit: "/ticket", prefix: "$", lowerBetter: true },
      { metric: "Renewal Rate", before: 82, after: 89, unit: "%", lowerBetter: false },
    ],
    history: [
      { agent: "Property Pipeline Scout", dataset: "Q4 2025 Properties", date: "Jan 20, 2026", accuracy: 86.1, status: "passed", duration: "3m 07s" },
      { agent: "Resident Support Agent", dataset: "30-Day Tickets", date: "Jan 26, 2026", accuracy: 79.8, status: "review", duration: "5m 42s" },
      { agent: "Property Pipeline Scout", dataset: "Q3 2025 Properties", date: "Dec 28, 2025", accuracy: 82.4, status: "review", duration: "2m 55s" },
    ],
  };
}

function getOrgData(orgId: string) {
  switch (orgId) {
    case "org_campspot":
      return getCampspotData();
    case "org_condocontrol":
      return getCondoControlData();
    case "org_dsn":
    default:
      return getDsnData();
  }
}

export async function GET(request: NextRequest) {
  const orgId = request.nextUrl.searchParams.get("org_id") || "org_dsn";
  // When "all" is selected, default to DSN data (most comprehensive)
  const data = getOrgData(orgId === "all" ? "org_dsn" : orgId);
  return NextResponse.json(data);
}
