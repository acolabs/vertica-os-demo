# Wave 2B: Analytics + Audit + Integrations Pages

## Context
You are building pages for a GenCap Agent OS demo — a PE-grade agent platform. The foundation (Wave 1) is complete: Next.js 16 app at `/Users/taliashapiro/repos/talia-made/gencap-demo` with SQLite DB, 15 API routes, and seed data.

**IMPORTANT:** Another agent (Wave 2A) is simultaneously building Dashboard, Decision Inbox, and Agents pages. DO NOT touch those files:
- `src/app/page.tsx`
- `src/app/inbox/` (anything in this directory)
- `src/app/agents/` (anything in this directory)
- `src/components/dashboard/` (anything)
- `src/components/inbox/` (anything)
- `src/components/agents/` (anything)

## CRITICAL: Read These First
1. `WAVE1-HANDOFF.md` — what's been built, API routes, data model
2. `MC-COMPONENTS-README.md` — MC reference components available
3. `src/components/mc-reference/` — ADAPT these, don't rebuild

## Your Mission
Build 3 pages: Analytics (/analytics), Audit Log (/audit), and Integrations (/integrations).

## CONSTRAINTS
- DO NOT modify existing API routes or any files listed above
- DO NOT add new dependencies (recharts, date-fns, lucide-react already installed)
- Use shadcn/ui from `src/components/ui/`
- Use `useOrg()` hook for current org_id
- All pages are 'use client'
- Color scheme: emerald=positive, rose=critical, amber=warning, blue=info
- Dark theme: zinc-900/950 backgrounds, zinc-800 borders

---

## Page 1: Analytics (/analytics) — `src/app/analytics/page.tsx`

**Purpose:** Prove agent ROI with undeniable charts. This is what PE operators show their boards.

**Data sources:**
- `GET /api/analytics?org_id=X` — aggregated metrics
- `GET /api/kpi?org_id=X&days=90` — daily snapshots for charts

**Layout:**

### Header
- Title: "Analytics" with BarChart3 icon
- Subtitle: "Agent performance and business impact"
- Date range text: "Last 90 days" (static for demo)

### Row 1: Big Impact Numbers (4 cards)
- **Total Value Created** — Sum of all agents' value_created. Big emerald number. e.g., "$1,081,000"
- **Total Agent Cost** — Sum from KPI snapshots. Smaller number. e.g., "$1,847"
- **ROI Multiple** — Value / Cost. Big bold. e.g., "585x"
- **Decisions Made** — Total decisions count. e.g., "50"

### Row 2: Revenue Impact (full-width card)
Title: "Revenue Impact — Churn Prevention"

**Chart 1: Churn Prevented by Month (Bar Chart)**
- Aggregate kpi_snapshots.churn_prevented_dollars by month
- Emerald bars
- X axis: months, Y axis: dollars

**Chart 2: NRR Trend (Line Chart)**  
- Plot kpi_snapshots.nrr_percent over 90 days
- Emerald line
- Show clear upward trend with annotation line at day 30 "Agent Deployed"
- Y axis: 100-115%

### Row 3: Operational Impact (two columns, lg:grid-cols-2)

**Left Card: Support Metrics**
- Title: "Support Efficiency"
- Chart: Dual-axis line chart
  - Left axis: Deflection Rate % (emerald, climbing from 0→42%)
  - Right axis: Cost per Ticket $ (rose, declining from $20→$12)
- Below chart: stat row — "Avg Handle Time: 17 min (↓39%)" and "CSAT: 4.6 (↑10%)"

**Right Card: Operator Productivity**
- Title: "Operator Hours Saved"
- Chart: Bar chart of weekly hours saved (aggregate daily into weekly buckets)
- Blue bars
- Below: "Board Pack Generation: 8 hours (↓79% from 38 hours)"

### Row 4: Agent Efficiency (full-width card)
Title: "Agent Performance Metrics"

Table with columns:
- Agent Name
- Type (badge)
- Total Runs
- Success Rate (with color: green >90%, amber >75%, red <75%)
- Avg Duration
- Total Cost
- Value Created
- ROI (value/cost)
- Decisions Created
- Acceptance Rate (approved / total decisions %)

**Reference:** Study `mc-reference/pages/analytics-page.tsx` and `mc-reference/pages/costs-page.tsx` for chart patterns, `mc-reference/pages/traces-page.tsx` for Recharts with dark theme.

---

## Page 2: Audit Log (/audit) — `src/app/audit/page.tsx`

**Purpose:** Compliance-grade, hash-chained audit trail. PE operators need this for board presentations.

**Data source:** `GET /api/audit?org_id=X&limit=50&offset=0`

**Layout:**

### Header
- Title: "Audit Log" with Shield icon  
- Subtitle: "Hash-chained, tamper-proof action trail"
- Right side: Export button group — "Export CSV" and "Export PDF" (for demo, show toast "Export started")

### Hash Chain Verification Banner
Full-width card:
- Left: Shield icon with green checkmark
- "Chain Integrity: Verified ✓ | 251 entries | Last verified: just now"
- Small text: "SHA-256 hash chain ensures no entries can be modified or deleted"
- Use emerald accent color

### Filters Row
- Date range: From/To date inputs
- Actor filter: dropdown (All / agent names / human names)
- Action type filter: dropdown (All / decision.created / decision.approved / decision.rejected / agent.run.completed / etc.)

### Audit Timeline
Scrollable list of audit entries (newest first).

Each entry renders as:
- **Left:** Small icon based on action type:
  - decision.created → Plus icon (blue)
  - decision.approved → Check icon (emerald)
  - decision.rejected → X icon (rose)
  - agent.run.completed → Play icon (emerald)
  - agent.run.failed → AlertCircle icon (rose)
  - integration.sync → RefreshCw icon (blue)
  - policy.updated → Settings icon (amber)
  - agent.config.updated → Settings icon (blue)
  
- **Main content:**
  - Action description: e.g., "Decision approved: Acme Corp renewal risk ($450,000)"
  - Actor: "sarah.johnson@smartsheet.com" or "nrr-agent-001"
  - Timestamp: formatted date/time

- **Right side:**
  - Hash preview: first 8 chars of hash in monospace, zinc-500 color
  - Expandable: click to show full hash + prev_hash + raw details JSON

- **Connector line** between entries (thin vertical line, zinc-700)

### Pagination
- "Load More" button at bottom (increment offset by 50)
- Or infinite scroll with intersection observer

**Reference:** Study `mc-reference/governance/audit-timeline.tsx` for timeline layout pattern, `mc-reference/core-governance/audit-ledger.ts` for hash chain logic.

---

## Page 3: Integrations (/integrations) — `src/app/integrations/page.tsx`

**Purpose:** Show connected systems — proves the platform plugs into real enterprise tools.

**Data source:** `GET /api/integrations?org_id=X`

**Layout:**

### Header
- Title: "Integrations" with Plug icon
- Subtitle: "Connected systems and data sources"
- "Add Integration" button (shows toast "Contact administrator to add new integrations")

### Integration Status Banner
Full-width card:
- "6 integrations connected | 5 healthy | 1 degraded | Last sync: 2 min ago"
- Overall health indicator (green if all >0.9, amber if any <0.9)

### Integration Cards (grid, lg:grid-cols-3, md:grid-cols-2)

Each card:
- **Icon area:** Large icon for the service
  - Salesforce: Database icon with blue accent
  - Zendesk: Headphones icon with green accent
  - Snowflake: Snowflake/Database icon with cyan accent
  - Slack: MessageSquare icon with purple accent
  - Jira: CheckSquare icon with blue accent
  - Google Slides: Presentation icon with yellow accent

- **Header:** Integration name + type badge (CRM, Support, Data Warehouse, etc.)

- **Status:** 
  - Green dot + "Connected" for status=connected, health>0.9
  - Amber dot + "Degraded" for health<0.9
  - Red dot + "Disconnected" for status=disconnected

- **Health bar:** Visual progress bar showing health_score (0-1)
  - Green for >0.9, Amber for 0.7-0.9, Red for <0.7

- **Last sync:** timeAgo(last_sync_at)

- **Footer stats:**
  - "Data points synced: 12,847" (generate a random realistic number based on type)
  - "Agents using: 2" (count agents with this integration in their config)

- **Click → expandable detail** (or dialog):
  - Full config display
  - Sync history (simulated: last 5 syncs with timestamps and status)
  - Agent bindings (which agents use this integration)
  - Permissions summary

### Available Integrations Section (below connected)
Title: "Available Integrations"
Grid of grayed-out cards for integrations not yet connected:
- HubSpot (CRM)
- Intercom (Support)
- BigQuery (Data Warehouse)
- Microsoft Teams (Communication)
- Asana (Project Mgmt)
- Tableau (BI/Reporting)
Each with: name, icon, type, "Connect" button (shows toast)

**Reference:** Study `mc-reference/pages/mcp-page.tsx` for integration management patterns.

---

## Component Organization

Create these files:
```
src/app/analytics/page.tsx
src/app/audit/page.tsx
src/app/integrations/page.tsx
src/components/analytics/
  big-number-card.tsx
  revenue-impact-chart.tsx
  support-metrics-chart.tsx
  operator-hours-chart.tsx
  agent-efficiency-table.tsx
src/components/audit/
  hash-chain-banner.tsx
  audit-timeline.tsx
  audit-entry.tsx
src/components/integrations/
  integration-card.tsx
  integration-status-banner.tsx
  available-integrations.tsx
```

## Verification
1. `npm run build` passes with zero errors
2. Analytics page shows all 4 sections with real Recharts charts
3. Charts show clear before/after deployment trend
4. Audit page shows hash-chained entries with expandable details
5. Integrations page shows 6 connected + 6 available
6. Org selector works across all 3 pages
7. No hydration errors

## HANDOFF
Write `WAVE2B-HANDOFF.md` documenting what was built, components created, any deviations.
