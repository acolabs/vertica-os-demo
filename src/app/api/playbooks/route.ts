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
      howItWorks: [
        "Connects to CRM (Salesforce/HubSpot) and ingests pipeline data every 4 hours",
        "Analyzes deal progression, stage aging, coverage ratios, and rep activity patterns",
        "Cross-references with call intelligence (Gong) to assess deal quality and next-best-actions",
        "Generates daily operating cadence: rep briefings, manager coaching plans, and pipeline alerts",
        "Surfaces high-priority decisions to the Decision Inbox for human review",
        "Continuously learns from approval/rejection patterns to improve recommendations",
      ],
      deliverables: [
        "Daily pipeline coverage report with gap analysis",
        "Per-rep coaching recommendations with specific talk tracks",
        "Stage aging alerts with recommended interventions",
        "Weekly forecast accuracy analysis",
        "Monthly executive pipeline health summary",
      ],
      configurationSteps: [
        "Connect CRM via OAuth (Salesforce or HubSpot)",
        "Define pipeline stages and expected conversion rates",
        "Set coverage ratio targets (default: 3.5x)",
        "Configure alert thresholds for stage aging (default: 14 days)",
        "Select notification channels (Slack, email, Decision Inbox)",
        "Run 7-day shadow mode to calibrate recommendations",
      ],
      roiMethodology:
        "ROI is calculated by attributing pipeline improvements to agent-surfaced actions. We measure the delta in stage conversion rates, pipeline coverage, and forecast accuracy between agent-monitored cohorts and control groups. Conservative attribution: only count outcomes where the agent created a decision AND a human approved the recommended action AND the deal progressed within 14 days.",
      roiExample: {
        scenario:
          "10-rep team, $750K average quota, current 18% stage conversion",
        baseline:
          "$13.5M annual pipeline revenue at 18% conversion = $2.43M closed",
        improvement:
          "Agent improves conversion to 24% (+6 pts) through better coverage and coaching",
        dollarImpact:
          "$13.5M × 24% = $3.24M closed — $810K incremental revenue",
        calculation:
          "Agent cost: ~$100/day × 365 = $36,500/yr. ROI: $810K / $36.5K = 22.2x",
      },
      dataRequirements: [
        "CRM read access (pipeline, deals, contacts, activities)",
        "Call intelligence read access (Gong/Chorus — optional but recommended)",
        "Email/calendar read access (for activity tracking)",
        "Slack write access (for daily briefing delivery)",
      ],
      rolloutPhases: [
        {
          phase: "Shadow",
          duration: "Week 1",
          description:
            "Agent runs daily analysis but only writes to internal log. Team reviews accuracy.",
        },
        {
          phase: "Suggest",
          duration: "Weeks 2-3",
          description:
            "Agent surfaces recommendations in Decision Inbox. Humans approve all actions.",
        },
        {
          phase: "Gated Auto",
          duration: "Week 4+",
          description:
            "Low-risk actions (alerts, briefings) auto-execute. High-risk (deal changes) still require approval.",
        },
      ],
      faq: [
        {
          q: "How long until we see pipeline improvement?",
          a: "Coverage gap analysis is immediate (Day 1). Conversion rate improvements typically appear within 2-3 weeks as coaching recommendations take effect. Most teams see measurable forecast accuracy improvement by Day 30.",
        },
        {
          q: "What if our CRM data quality is poor?",
          a: "The agent flags data quality issues as it encounters them — missing close dates, stale deals, orphaned contacts. This actually improves CRM hygiene as a side effect. Shadow mode in Week 1 will surface the specific gaps.",
        },
        {
          q: "Does this replace our sales managers?",
          a: "No. It augments them. The agent handles data aggregation, pattern detection, and routine coaching alerts. Managers focus on strategic deals, relationship building, and the judgment calls that require human context.",
        },
      ],
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
      howItWorks: [
        "Monitors incoming support tickets in real-time from Zendesk/Intercom",
        "Auto-classifies each ticket by category, complexity, and urgency",
        "For routine inquiries: drafts resolution using knowledge base and historical patterns",
        "For complex issues: routes to specialist with pre-populated context and suggested response",
        "Identifies recurring ticket patterns and proposes new KB articles",
        "Tracks deflection rate, CSAT impact, and cost savings continuously",
      ],
      deliverables: [
        "Real-time ticket classification and priority routing",
        "Auto-drafted responses for routine categories",
        "Knowledge base gap reports with proposed articles",
        "Weekly deflection rate and cost savings dashboard",
        "CSAT impact analysis ensuring no quality degradation",
      ],
      configurationSteps: [
        "Connect support platform via API (Zendesk or Intercom)",
        "Import existing knowledge base articles",
        "Define auto-resolution categories (password resets, billing inquiries, status checks)",
        "Set confidence thresholds for auto-resolution (default: 0.85)",
        "Configure escalation rules and specialist routing",
        "Run 7-day shadow mode to validate classification accuracy",
      ],
      roiMethodology:
        "ROI is calculated from direct cost savings: (deflected tickets × average cost per ticket) + (AHT reduction × hourly agent cost × remaining tickets). We subtract agent operating cost and validate that CSAT remains stable or improves. Attribution: a ticket counts as 'deflected' only if auto-resolved with customer confirmation and no reopening within 48 hours.",
      roiExample: {
        scenario:
          "3,000 tickets/month, $24 avg cost/ticket, 14 min avg handle time",
        baseline: "Monthly support cost: 3,000 × $24 = $72,000",
        improvement:
          "Agent deflects 35% of tickets (1,050/mo) and reduces AHT by 30% on remaining",
        dollarImpact:
          "Deflection savings: 1,050 × $24 = $25,200/mo. AHT savings: 1,950 × $7.20 = $14,040/mo. Total: $39,240/mo = $470,880/yr",
        calculation:
          "Agent cost: ~$80/day × 365 = $29,200/yr. ROI: $470.9K / $29.2K = 16.1x",
      },
      dataRequirements: [
        "Support platform full access (read tickets, write responses, update status)",
        "Knowledge base read/write access",
        "Customer data read access (for personalized responses)",
        "Analytics/reporting access (for CSAT and deflection tracking)",
      ],
      rolloutPhases: [
        {
          phase: "Shadow",
          duration: "Week 1",
          description:
            "Agent classifies and drafts responses but doesn't send. Support team reviews accuracy.",
        },
        {
          phase: "Suggest",
          duration: "Weeks 2-3",
          description:
            "Agent drafts appear as suggestions. Agents review and send with one click.",
        },
        {
          phase: "Gated Auto",
          duration: "Week 4+",
          description:
            "Pre-approved categories auto-resolve. Complex issues still route to humans.",
        },
      ],
      faq: [
        {
          q: "Will this hurt our CSAT scores?",
          a: "No. The evaluation harness validates accuracy before production. In shadow mode, we measure what CSAT would have been if the agent had responded. We only enable auto-resolution for categories where accuracy exceeds 90% and projected CSAT is stable.",
        },
        {
          q: "What about complex multi-step issues?",
          a: "The agent escalates anything above the confidence threshold to a human specialist — with full context pre-loaded. Complex issues actually get handled faster because the specialist receives a structured brief instead of starting from scratch.",
        },
        {
          q: "How does it handle product updates or new features?",
          a: "The agent monitors KB articles and ticket patterns after product updates. It flags new ticket categories and proposes KB articles for review. The knowledge base stays current because gaps surface automatically.",
        },
      ],
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
      howItWorks: [
        "Cross-references CRM renewal dates with product usage analytics every 4 hours",
        "Builds multi-signal churn risk score (0-100) per account combining usage, support, billing, and engagement data",
        "Identifies expansion signals: feature adoption patterns, seat utilization, usage growth trends",
        "Generates proactive save plans for high-risk accounts with specific playbooks",
        "Drafts executive outreach emails and schedules stakeholder meetings",
        "Tracks renewal rate, expansion revenue, and save rate for attribution",
      ],
      deliverables: [
        "Real-time churn risk dashboard with account-level scores",
        "Proactive save plans for high-risk renewals",
        "Expansion opportunity pipeline with confidence scores",
        "Executive outreach drafts for at-risk accounts",
        "Monthly NRR attribution report",
      ],
      configurationSteps: [
        "Connect CRM (renewal dates, contract values, contacts)",
        "Connect product analytics (usage data, feature adoption)",
        "Connect billing system (payment history, invoice status)",
        "Define risk score thresholds (default: >65 = high risk)",
        "Configure save play templates (discount, exec outreach, success plan)",
        "Set expansion criteria (usage >80%, seat utilization >90%)",
      ],
      roiMethodology:
        "ROI is calculated from prevented churn and accelerated expansion. Churn prevented: sum of ARR for accounts that were flagged at-risk, received agent-recommended intervention, and subsequently renewed. Expansion: ARR from upsells where the agent identified the opportunity. We apply 50% attribution discount to account for interventions that would have happened anyway.",
      roiExample: {
        scenario:
          "200 accounts, $15M total ARR, 8% annual churn rate, 2% expansion rate",
        baseline:
          "Annual churn loss: $15M × 8% = $1.2M. Expansion: $15M × 2% = $300K. NRR: 94%",
        improvement:
          "Agent reduces churn to 5% (-3 pts) and increases expansion to 5% (+3 pts)",
        dollarImpact:
          "Churn prevented: $15M × 3% = $450K. Additional expansion: $15M × 3% = $450K. Total: $900K/yr",
        calculation:
          "Agent cost: ~$120/day × 365 = $43,800/yr. ROI: $900K / $43.8K = 20.5x",
      },
      dataRequirements: [
        "CRM full read access (renewals, contracts, contacts, activities)",
        "Product analytics read access (usage metrics, feature adoption)",
        "Billing system read access (invoices, payment history, credit notes)",
        "Support platform read access (ticket history, CSAT by account)",
        "Email draft access (for outreach — human sends)",
      ],
      rolloutPhases: [
        {
          phase: "Shadow",
          duration: "Weeks 1-2",
          description:
            "Agent scores all accounts and generates risk assessments. CS team validates accuracy against known churn cases.",
        },
        {
          phase: "Suggest",
          duration: "Weeks 3-4",
          description:
            "Save plans and expansion opportunities surface in Decision Inbox. CS team approves interventions.",
        },
        {
          phase: "Gated Auto",
          duration: "Month 2+",
          description:
            "Low-risk actions (internal alerts, CRM field updates) auto-execute. Outreach and discounts require approval.",
        },
      ],
      faq: [
        {
          q: "How early can it detect churn risk?",
          a: "Typically 60-90 days before renewal. The multi-signal approach catches patterns that single-metric monitoring misses — like usage declining while support tickets increase and executive engagement drops.",
        },
        {
          q: "What's the false positive rate for churn predictions?",
          a: "In backtesting, we typically see 15-20% false positive rate (accounts flagged as at-risk that would have renewed anyway). We'd rather over-flag than miss a churning account. The evaluation harness benchmarks this before production.",
        },
        {
          q: "Does this work for monthly contracts?",
          a: "Yes, but the value is highest for annual contracts where each save has meaningful ARR impact. For monthly, the agent focuses more on expansion signals and usage engagement patterns.",
        },
      ],
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
      howItWorks: [
        "Analyzes deal progression patterns across the entire portfolio company pipeline",
        "Identifies winning playbooks by correlating deal attributes with close rates",
        "Detects common loss reasons and competitive patterns from CRM data and call recordings",
        "Benchmarks rep performance against top-performer patterns",
        "Generates weekly pipeline intelligence briefs for sales leadership",
        "Surfaces anomalies: deals progressing unusually fast or slow",
      ],
      deliverables: [
        "Weekly pipeline intelligence brief with pattern analysis",
        "Winning playbook identification (what top reps do differently)",
        "Loss reason analysis with competitive intelligence",
        "Rep performance benchmarking and development recommendations",
        "Deal anomaly alerts (stuck deals, accelerating deals)",
      ],
      configurationSteps: [
        "Connect CRM (full pipeline history, at least 12 months preferred)",
        "Connect call intelligence platform (Gong/Chorus)",
        "Connect LinkedIn Sales Navigator (optional)",
        "Define deal stages and expected timelines",
        "Set win rate targets by segment and deal size",
        "Run initial pattern analysis on historical data (1-2 week setup)",
      ],
      roiMethodology:
        "ROI is calculated from win rate improvement and cycle time reduction. We compare cohorts where reps acted on agent insights vs. control deals. Win rate improvement is attributed to pattern-matched recommendations. Cycle time reduction is measured from stage progression acceleration after agent alerts.",
      roiExample: {
        scenario:
          "50-rep org, 200 deals/quarter, $85K avg deal size, 22% win rate, 45-day cycle",
        baseline: "Quarterly revenue: 200 × 22% × $85K = $3.74M",
        improvement:
          "Agent improves win rate to 27% (+5 pts) and reduces cycle time to 38 days",
        dollarImpact:
          "Revenue uplift: 200 × 27% × $85K = $4.59M — $850K incremental per quarter = $3.4M/yr",
        calculation:
          "Agent cost: ~$90/day × 365 = $32,850/yr. ROI: $3.4M / $32.9K = 103x (note: higher variance, typically 8-15x conservatively)",
      },
      dataRequirements: [
        "CRM full read access (12+ months pipeline history preferred)",
        "Call intelligence read access (transcripts, scores, talk patterns)",
        "Email activity data (engagement metrics)",
        "LinkedIn Sales Navigator access (optional, for social selling insights)",
      ],
      rolloutPhases: [
        {
          phase: "Analysis",
          duration: "Weeks 1-2",
          description:
            "Initial pattern analysis on historical pipeline data. Identify top-performer playbooks and loss patterns.",
        },
        {
          phase: "Suggest",
          duration: "Weeks 3-6",
          description:
            "Weekly intelligence briefs delivered. Deal-specific recommendations surface in inbox.",
        },
        {
          phase: "Gated Auto",
          duration: "Month 2+",
          description:
            "Automated deal scoring and rep briefings. Strategic recommendations still human-reviewed.",
        },
      ],
      faq: [
        {
          q: "How much historical data do you need?",
          a: "Minimum 6 months of CRM pipeline data for basic pattern analysis. 12+ months is ideal for seasonal patterns and statistically significant win rate analysis. The more data, the better the playbook identification.",
        },
        {
          q: "What if we have multiple sales motions (inbound vs outbound)?",
          a: "The agent segments analysis by motion, deal source, and segment automatically. Patterns are identified within each cohort, not across the entire pipeline. This prevents false comparisons between fundamentally different deal types.",
        },
        {
          q: "Is this useful for small sales teams?",
          a: "Teams under 10 reps will see value primarily from deal alerts and pipeline hygiene. The pattern analysis and benchmarking becomes most powerful at 20+ reps where statistical patterns emerge. We recommend starting with the Revenue Cadence Agent for smaller teams.",
        },
      ],
    },
  ];

  return NextResponse.json(playbooks);
}
