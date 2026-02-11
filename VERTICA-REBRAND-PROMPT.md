# Vertica Capital Partners — Full Rebrand & Refinement

## Context
This is a Next.js 16 demo app (currently branded "GenCap OS") that needs to be fully rebranded for **Vertica Capital Partners** — a software-focused PE firm. The demo will be shown to Philip Vorobeychik, Managing Director at Vertica.

**Vertica Capital Partners profile:**
- Software-only PE investor (growth buyouts, recaps, growth capital)
- Targets $2M–$40M ARR companies, $10M–$100M equity checks
- Portfolio: DSN (dental software), Campspot (campground mgmt), Condo Control (HOA software), ARMS (public safety CAD), Rezdy (booking), Pathlock (security), ProLion, Checkfront, Regiondo
- Value creation playbook: inside sales best practices, recruiting, operator network
- GTM rigor + operating cadence is their DNA
- 75+ companies, $2B+ invested capital, 10+ years
- Based in implicit from portfolio: focus on vertical SaaS

## CRITICAL RULES
- Do NOT break the existing architecture or component structure
- Do NOT add new pages — the 9 existing pages are perfect
- Do NOT change the component library (shadcn/ui, recharts, etc.)
- KEEP `powered by Adapt Agents` — this is our technology branding
- All changes must be surgical find-and-replace + seed data overhaul
- After changes, `npm run build` must pass with zero errors

## 1. Branding Changes (all files)

### Text Replacements
| Find | Replace |
|------|---------|
| `GENCAP OS` | `VERTICA OS` |
| `GenCap OS` | `Vertica OS` |
| `GenCap Holdings` | `Vertica Capital Partners` |
| `Generative Capital` | `Vertica Capital Partners` |
| `gencap-demo` | `vertica-demo` (package.json name only) |
| `gencap.db` | `vertica.db` |
| `gencap_org_id` | `vertica_org_id` |
| `operator@gencap.ai` | `operator@verticacp.com` |
| `mike.chen@gencap.ai` | `philip.v@verticacp.com` |
| `GenCap Agent OS initialized` | `Vertica Agent OS initialized` |

### CSS Color Change (src/app/globals.css)
Change primary color from GenCap red to Vertica slate blue:
- `--primary: #E63029` → `--primary: #4A6CF7` (slate blue)
- `--primary-hover: #CC1F1A` → `--primary-hover: #3B5DE8`
- `--primary-10: rgba(230, 48, 41, 0.1)` → `--primary-10: rgba(74, 108, 247, 0.1)`
- `--primary-20: rgba(230, 48, 41, 0.2)` → `--primary-20: rgba(74, 108, 247, 0.2)`
- `--ring: #E63029` → `--ring: #4A6CF7`

Do this for BOTH light and dark theme sections.

### Layout Title (src/app/layout.tsx)
- `title: "GENCAP OS — AI Agent Platform"` → `title: "VERTICA OS — Portfolio Operator Platform"`
- `description: "Enterprise AI agent governance..."` → `description: "AI-powered portfolio operations and value creation platform"`

### Nav (src/components/layout/nav.tsx)
- `GENCAP OS` → `VERTICA OS`
- `GENCAP OS v1.0` → `VERTICA OS v1.0`

### Dashboard (src/app/page.tsx)
- `GENCAP OS — Command Center` → `VERTICA OS — Command Center`

### Decision Drawer (src/components/inbox/decision-drawer.tsx)
- `operator@gencap.ai` (2 occurrences) → `operator@verticacp.com`

### DB Path (src/lib/db.ts)
- `gencap.db` → `vertica.db`

### Org Hook (src/lib/hooks/use-org.tsx)
- `gencap_org_id` → `vertica_org_id`
- `DEFAULT_ORG_ID = "org_smartsheet"` → `DEFAULT_ORG_ID = "org_dsn"`

## 2. Seed Data Overhaul (scripts/seed.ts)

This is the biggest change. The seed data must reflect Vertica's REAL portfolio companies.

### Organizations
```typescript
const orgs = [
  { id: 'org_vertica', name: 'Vertica Capital Partners', type: 'holding', parent_id: null, industry: 'Private Equity', arr_millions: null, employee_count: 35, created_at: daysAgo(365) },
  { id: 'org_dsn', name: 'DSN Software', type: 'portfolio', parent_id: 'org_vertica', industry: 'Dental Practice Management', arr_millions: 15, employee_count: 150, created_at: daysAgo(365) },
  { id: 'org_campspot', name: 'Campspot', type: 'portfolio', parent_id: 'org_vertica', industry: 'Campground Management', arr_millions: 12, employee_count: 100, created_at: daysAgo(300) },
  { id: 'org_condocontrol', name: 'Condo Control', type: 'portfolio', parent_id: 'org_vertica', industry: 'HOA & Condo Management', arr_millions: 8, employee_count: 80, created_at: daysAgo(250) },
];
```

### DB filename in seed.ts
- `gencap.db` → `vertica.db`

### Agent Types
Update the CHECK constraint:
- `CHECK(type IN ('nrr','support','board_pack','pipeline'))` → `CHECK(type IN ('revenue_cadence','support_deflection','nrr','pipeline'))`

### Agents — completely rewrite
```typescript
const agents = [
  // DSN agents
  {
    id: 'agent_revenue_cadence', org_id: 'org_dsn', name: 'Revenue Cadence Agent', type: 'revenue_cadence' as const,
    status: 'active', description: 'Produces daily/weekly operating cadence for sales leaders: pipeline coverage gaps, stage aging, next-best actions per rep, and coaching prompts.',
    model: 'claude-sonnet-4.5', total_runs: 178, total_decisions: 84, total_value_created: 920000, accuracy_rate: 0.91,
    config: JSON.stringify({ capabilities: ["salesforce_read","hubspot_read","gong_read","outreach_write","slack_write"], thresholds: { coverage_gap: 3.0, stage_aging_days: 14 }, schedule: "daily_7am" }),
  },
  {
    id: 'agent_support_deflect', org_id: 'org_dsn', name: 'Support Autopilot', type: 'support_deflection' as const,
    status: 'active', description: 'Auto-triages and resolves common dental software support tickets, identifies KB gaps, and routes complex issues to specialists.',
    model: 'claude-sonnet-4.5', total_runs: 342, total_decisions: 205, total_value_created: 267000, accuracy_rate: 0.88,
    config: JSON.stringify({ capabilities: ["zendesk_read","zendesk_write","kb_read","kb_write"], auto_resolve_categories: ["password_reset","billing_inquiry","imaging_setup","edi_claim_status","scheduling_question"], escalation_threshold: 0.6 }),
  },
  {
    id: 'agent_nrr', org_id: 'org_dsn', name: 'Renewal & Expansion Guardian', type: 'nrr' as const,
    status: 'active', description: 'Monitors renewal pipeline, detects churn signals from usage + support + billing patterns, and generates save plays for at-risk dental practices.',
    model: 'claude-sonnet-4.5', total_runs: 134, total_decisions: 67, total_value_created: 780000, accuracy_rate: 0.90,
    config: JSON.stringify({ capabilities: ["salesforce_read","zendesk_read","analytics_read","jira_write","email_draft"], thresholds: { risk_score: 0.65, confidence_min: 0.7 }, schedule: "every_4_hours" }),
  },
  // Campspot agents
  {
    id: 'agent_camp_revenue', org_id: 'org_campspot', name: 'Booking Revenue Optimizer', type: 'revenue_cadence' as const,
    status: 'active', description: 'Analyzes booking patterns, seasonal trends, and campground utilization to optimize pricing and occupancy.',
    model: 'claude-sonnet-4.5', total_runs: 95, total_decisions: 38, total_value_created: 345000, accuracy_rate: 0.89,
    config: JSON.stringify({ capabilities: ["hubspot_read","analytics_read","stripe_read","slack_write"], schedule: "daily_8am" }),
  },
  {
    id: 'agent_camp_support', org_id: 'org_campspot', name: 'Park Support Bot', type: 'support_deflection' as const,
    status: 'active', description: 'Handles campground operator support inquiries — reservation issues, payment processing, site configuration.',
    model: 'claude-sonnet-4.5', total_runs: 167, total_decisions: 104, total_value_created: 95000, accuracy_rate: 0.85,
    config: JSON.stringify({ capabilities: ["intercom_read","intercom_write","kb_read"], auto_resolve_categories: ["reservation_lookup","payment_status","site_config","seasonal_pricing"], escalation_threshold: 0.65 }),
  },
  // Condo Control agents
  {
    id: 'agent_condo_pipeline', org_id: 'org_condocontrol', name: 'Property Pipeline Scout', type: 'pipeline' as const,
    status: 'active', description: 'Monitors HOA/condo management sales pipeline, identifies expansion opportunities across property management companies.',
    model: 'claude-sonnet-4.5', total_runs: 72, total_decisions: 25, total_value_created: 156000, accuracy_rate: 0.90,
    config: JSON.stringify({ capabilities: ["salesforce_read","analytics_read","slack_write"], schedule: "every_8_hours" }),
  },
  {
    id: 'agent_condo_support', org_id: 'org_condocontrol', name: 'Resident Support Agent', type: 'support_deflection' as const,
    status: 'deploying', description: 'Handles property management support tickets — access control, payment processing, maintenance requests.',
    model: 'claude-sonnet-4.5', total_runs: 28, total_decisions: 14, total_value_created: 38000, accuracy_rate: 0.83,
    config: JSON.stringify({ capabilities: ["zendesk_read","zendesk_write","kb_read"], auto_resolve_categories: ["access_control","payment_inquiry","maintenance_status"], escalation_threshold: 0.7 }),
  },
];
```

### Critical Decisions — rewrite for dental/vertical SaaS context
The 7 critical decisions should be for DSN's dental practice customers. Example hero decision:

```typescript
{
  id: 'dec_crit_1', org_id: 'org_dsn', agent_id: 'agent_nrr', type: 'renewal_risk', severity: 'critical', status: 'pending',
  title: 'Bright Smile Dental Group — Critical Renewal Risk',
  summary: 'Multi-signal risk detected: active chair utilization down 28% over 60 days, 3 open P1 support escalations for imaging integration failures, executive champion (COO Dr. Sarah Chen) departed 2 weeks ago. Renewal in 47 days. 12-location group practice.',
  impact_dollars: 186000, confidence: 0.92,
  account_name: 'Bright Smile Dental Group', account_arr: 186000,
  // ... (keep same evidence structure but with dental-relevant sources)
}
```

The other 6 critical decisions should reference dental practices, campground chains, and property management companies with REALISTIC scenarios:
- Dental: imaging integration failures, EDI claim submission errors, practice management migration
- Campground: seasonal booking system failures, payment gateway issues, channel distribution problems
- HOA: access control system outages, resident portal issues, payment processing failures

### Decision Account Names — replace ALL Smartsheet-enterprise accounts with vertical SaaS customers
HIGH severity accounts (12): Use dental practices, campground operators, HOA management companies:
- `TerraForm Solutions` → `Mountain View Dental Associates` (dental, $78K ARR)
- `CloudBridge Networks` → `Great Outdoors Campground Group` (campground, $65K ARR)
- `Zenith Manufacturing` → `Sunrise Property Management` (HOA, $52K ARR)
- etc. — all account names should be REALISTIC for dental/campground/HOA verticals

MEDIUM severity (25): Same approach — vertical SaaS customer names

SUCCESS stories (6): Same approach

### Integrations — adjust configs
- `smartsheet.my.salesforce.com` → `dsnsoftware.my.salesforce.com`
- `smartsheet` subdomain → `dsn-support`
- `smartsheet.us-west-2` → `dsn-analytics.us-east-1`
- `smartsheet-hq` → `dsn-team`
- `smartsheet.atlassian.net` → `dsn.atlassian.net`
- `agent-os@smartsheet.iam` → `agent-os@dsn.iam`

### Audit Log Actors
- `sarah.johnson@smartsheet.com` → `sarah.johnson@dsnsoftware.com`
- `mike.chen@gencap.ai` → `philip.v@verticacp.com`
- `lisa.park@smartsheet.com` → `lisa.park@dsnsoftware.com`

### Run Details
- `Smartsheet Zendesk instance` → `DSN Zendesk instance`
- All references to Smartsheet in run step details → DSN

### KPI Context
Keep the same KPI improvement story (NRR improving, support deflection rising) — the numbers tell a compelling story. Just change org references:
- `org_smartsheet` → `org_dsn` everywhere
- `kpi_ss_` prefix → `kpi_dsn_`

### Simple Run References
- All `org_smartsheet` → `org_dsn`
- Agent IDs: `agent_renewal` → `agent_nrr`, `agent_support` → `agent_support_deflect`, `agent_board` → keep or remove board agent

Actually, keep `agent_renewal` as `agent_nrr`, `agent_support` as `agent_support_deflect`. For the simple runs generator that creates runs over 90 days, update the agent_id references accordingly.

## 3. Validation

After ALL changes:
1. Delete `data/vertica.db` if it exists
2. Run `npm run seed` — must complete with no errors
3. Run `npm run build` — must complete with zero TypeScript errors
4. Grep for any remaining "gencap", "GenCap", "GENCAP", "Smartsheet", "smartsheet" references (excluding node_modules/.next) — must be ZERO

## 4. Files to Modify (complete list)
1. `package.json` — name field only
2. `src/app/globals.css` — primary colors (light + dark themes)
3. `src/app/layout.tsx` — title + description
4. `src/app/page.tsx` — dashboard title
5. `src/components/layout/nav.tsx` — brand name (2 places)
6. `src/components/inbox/decision-drawer.tsx` — email addresses (2 places)
7. `src/lib/db.ts` — database filename
8. `src/lib/hooks/use-org.tsx` — localStorage key + default org
9. `scripts/seed.ts` — MASSIVE overhaul (orgs, agents, decisions, accounts, integrations, audit actors, run details, KPI references)

## 5. Do NOT Modify
- Component structure or architecture
- shadcn/ui components
- API routes (they're dynamic, driven by seed data)
- CSS structure (only change color values)
- vercel.json
- Any WAVE*.md or PROMPT*.md files
