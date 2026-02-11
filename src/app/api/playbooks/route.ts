import { NextResponse } from "next/server";

export async function GET() {
  const playbooks = [
    {
      id: "pb_revenue_cadence",
      name: "Revenue Cadence Agent",
      type: "revenue_cadence",
      description:
        "Automates daily/weekly operating cadence for sales leaders. Pipeline coverage gaps, stage aging, deal slippage, next-best actions per rep, coaching prompts.",
      integrations: ["Salesforce", "Outreach", "Gong"],
      expectedRoi: "12-18x",
      deploymentTime: "5-7 days",
      kpis: [
        "Pipeline coverage",
        "Stage conversion",
        "Cycle time",
        "Forecast accuracy",
      ],
      status: "deployed",
      deployedCount: 2,
    },
    {
      id: "pb_support_deflection",
      name: "Support Deflection Agent",
      type: "support_deflection",
      description:
        "Auto-triages support tickets, drafts responses, proposes resolution steps, identifies KB gaps. Shadow mode → suggest → gated auto-resolve.",
      integrations: ["Zendesk", "Intercom", "Confluence"],
      expectedRoi: "15-25x",
      deploymentTime: "3-5 days",
      kpis: ["Deflection rate", "AHT", "Cost/contact", "CSAT"],
      status: "deployed",
      deployedCount: 3,
    },
    {
      id: "pb_nrr",
      name: "Renewal & Expansion Agent",
      type: "nrr",
      description:
        "Monitors usage, tickets, billing, and CRM signals to flag churn risk and expansion opportunities. Drafts save plans and schedules exec outreach.",
      integrations: ["Stripe/Chargebee", "CRM", "Product Analytics"],
      expectedRoi: "20-30x",
      deploymentTime: "7-10 days",
      kpis: ["NRR", "Churn rate", "Expansion revenue", "Logo retention"],
      status: "deployed",
      deployedCount: 1,
    },
    {
      id: "pb_pipeline",
      name: "Pipeline Intelligence Agent",
      type: "pipeline",
      description:
        "Analyzes deal progression patterns across the portfolio. Identifies winning playbooks, common loss reasons, and rep performance drivers.",
      integrations: ["Salesforce", "Gong", "LinkedIn Sales Navigator"],
      expectedRoi: "8-15x",
      deploymentTime: "10-14 days",
      kpis: ["Win rate", "Deal velocity", "Forecast accuracy"],
      status: "development",
      deployedCount: 0,
    },
  ];

  return NextResponse.json(playbooks);
}
