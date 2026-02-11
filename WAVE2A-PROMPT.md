# Wave 2A: Dashboard + Decision Inbox + Agents Pages

## Context
You are building pages for a GenCap Agent OS demo — a PE-grade agent platform. The foundation (Wave 1) is complete: Next.js 16 app at `/Users/taliashapiro/repos/talia-made/gencap-demo` with SQLite DB, 15 API routes, and seed data (50 decisions, 564 runs, 7 agents, 90 days KPI).

## CRITICAL: Read These First
1. `WAVE1-HANDOFF.md` — what's been built, API routes, data model
2. `MC-COMPONENTS-README.md` — MC reference components available to you
3. `src/components/mc-reference/` — ADAPT these MC components, don't rebuild from scratch

## Your Mission
Build 3 pages: Dashboard (/), Decision Inbox (/inbox), and Agents Fleet (/agents). These are the "money screens" — what the PE operator sees first.

## CONSTRAINTS
- DO NOT modify any existing API routes — they work, don't break them
- DO NOT modify `src/lib/db.ts`, `schema.ts`, or the seed script
- DO NOT add new dependencies unless absolutely necessary (recharts, date-fns, lucide-react already installed)
- Use the shadcn/ui components from `src/components/ui/` — they're already installed
- Study `src/components/mc-reference/` for patterns — adapt, don't blindly copy
- All data fetching via React Query `useQuery` with appropriate refetchInterval
- The org selector in the top bar already works — use the `useOrg()` hook from `src/lib/hooks/use-org.tsx` to get the current org_id and pass it to API calls
- Color coding: emerald (#059669) = positive, rose (#e11d48) = critical, amber (#d97706) = warning, blue (#3b82f6) = info
- Everything must be 'use client' since we use React Query and hooks

## Page 1: Dashboard (/) — `src/app/page.tsx`

Replace the existing placeholder with a full dashboard.

**Data source:** `GET /api/dashboard/summary?org_id=X`

**Layout (top to bottom):**

### Row 1: Welcome + KPI Cards
- Heading: "Agent OS — Command Center" with current org name
- 4 KPI cards in a grid:
  1. "Churn Prevented" — big green dollar number (e.g., "$847,000"), subtitle "This quarter"
  2. "Support Deflection" — percentage with trend arrow (e.g., "42%"), subtitle "Auto-resolved"  
  3. "Hours Saved" — number (e.g., "127"), subtitle "Operator hours this month"
  4. "Agent ROI" — multiplier (e.g., "8.3x"), subtitle "Return on agent investment"
- Calculate ROI as: total_value_created / agent_cost_total from KPI data

### Row 2: Decision Summary Bar
- Full-width card showing decision counts by severity
- "7 Critical | 12 High | 25 Medium — $X.XM total exposure"
- Use colored badges for each severity
- "View Inbox →" link on the right

### Row 3: Two columns (lg:grid-cols-2)
**Left: Active Agents**
- Cards for each agent showing: name, type badge, status dot, total runs, accuracy rate
- Use agent type icons: Shield for NRR, Headphones for Support, FileText for Board Pack
- Click → `/agents` (link)

**Right: Recent Activity**  
- Timeline list of last 10 audit log entries
- Each: icon + "Agent created decision: Acme Corp renewal risk" + timestamp
- Color-code by action type

### Row 4: KPI Trend Chart
- Full-width Recharts LineChart showing 90-day NRR% and churn rate trends
- Two Y axes: NRR% on left, Churn% on right
- Clear inflection point visible at day 30 (agent deployment)
- Dark theme: grid #27272a, text #a1a1aa, lines emerald/rose
- Use `GET /api/kpi?org_id=X&days=90`

**Reference:** Study `mc-reference/pages/observability-page.tsx` for card layout patterns, `mc-reference/observability/system-health-bar.tsx` for health indicators, `mc-reference/analytics/velocity-chart.tsx` for Recharts patterns.

---

## Page 2: Decision Inbox (/inbox) — `src/app/inbox/page.tsx`

This is THE money screen. Create it at `src/app/inbox/page.tsx`.

**Data source:** `GET /api/decisions?org_id=X&severity=X&status=X`

**Layout:**

### Header
- Title: "Decision Inbox" with Inbox icon
- Subtitle: "Agent findings requiring your review"
- Filters row: Severity dropdown (All/Critical/High/Medium/Low), Status dropdown (All/Pending/Approved/Rejected), Agent dropdown (All/agent names)

### Decision Table
Use shadcn Table component. Columns:
1. **Severity** — colored badge (rose=critical, amber=high, blue=medium, zinc=low)
2. **Account** — account_name in bold
3. **Title** — decision title (truncated to 60 chars)
4. **Impact** — formatCurrency(impact_dollars), bold red for critical
5. **Confidence** — percentage with visual bar or badge
6. **Agent** — agent name
7. **Due** — timeAgo(due_date) or formatted date
8. **Status** — status badge (pending=amber, approved=emerald, rejected=rose)

### Row click → opens a Sheet/Drawer (right side, 45% width)
Use the shadcn `Sheet` component with `side="right"`.

**Drawer content (tabs):**

**Tab 1: Evidence**
Parse the JSON evidence array. Display each evidence item as a card:
- Source badge (Salesforce, Zendesk, Product Analytics, Billing)
- Type label
- Detail text
- Visual distinction between sources (different border colors)

**Tab 2: Recommended Actions**
Parse recommended_action JSON. Display each action as:
- Action type with icon
- Detail description  
- Target system badge
- "Requires approval" indicator if applicable

**Tab 3: Action Preview**
Parse action_preview JSON. Display as a diff-like view:
- Each change: system, field, from → to (with red/green highlighting)
- Or: system + action description for creates

**Tab 4: Summary**
- Full summary text
- Account details (name, ARR)
- Agent that created it
- Created timestamp
- Confidence score with explanation

**Drawer footer:**
- "Approve" button (emerald, calls POST /api/decisions/[id]/approve)
- "Reject" button (rose outline, calls POST /api/decisions/[id]/reject)
- "Escalate" button (amber outline, for demo just shows a toast)
- After approve/reject: invalidate query, close drawer, show success toast

**Reference:** Study `mc-reference/governance/pending-approvals.tsx` for approval queue pattern, `mc-reference/governance/audit-timeline.tsx` for timeline display.

---

## Page 3: Agents Fleet (/agents) — `src/app/agents/page.tsx`

Create at `src/app/agents/page.tsx`.

**Data source:** `GET /api/agents?org_id=X`

**Layout:**

### Header
- Title: "Agent Fleet" with Bot icon
- Subtitle: "Deployed agents for [current org name]"
- "Deploy New Agent" button (for demo, shows a toast "Coming soon — contact your administrator")

### Fleet Health Banner
Full-width card at top:
- "[N] agents active | [total runs] runs today | [success rate]% success | $[daily cost] spent today"
- Green indicator if all healthy

### Agent Cards (grid, lg:grid-cols-3)
For each agent, a card showing:
- **Header:** Agent name + type badge (NRR/Support/Board Pack) + status dot (green=active)
- **Model:** Small text showing model name
- **Stats grid (2x2):**
  - Total Runs: number
  - Decisions: number
  - Accuracy: percentage
  - Value Created: formatted currency
- **Activity sparkline:** A small bar chart showing runs per day for last 14 days (can be simplified to a visual indicator)
- **Footer:** "View Details →" link to `/agents/[id]`

### Agent Performance Table (below cards)
Full-width table comparing all agents:
- Columns: Agent, Type, Status, Runs, Decisions, Accuracy, Value Created, Cost, ROI
- Sort by Value Created descending by default

**Reference:** Study `mc-reference/agents/agent-card.tsx` for card layout, `mc-reference/agents/fleet-health-banner.tsx` for health banner, `mc-reference/agents/fleet-status-panel.tsx` for status display.

---

## Component Organization

Create these files:
```
src/app/page.tsx                    (Dashboard — replace existing)
src/app/inbox/page.tsx              (Decision Inbox — new)
src/app/agents/page.tsx             (Agents Fleet — new)
src/components/dashboard/
  kpi-card.tsx
  decision-summary-bar.tsx
  agent-mini-card.tsx
  activity-feed.tsx
  kpi-trend-chart.tsx
src/components/inbox/
  decision-table.tsx
  decision-drawer.tsx
  evidence-panel.tsx
  action-preview-panel.tsx
src/components/agents/
  agent-card.tsx
  fleet-health-banner.tsx
  agent-performance-table.tsx
```

## Verification
1. `npm run build` passes with zero errors
2. Dashboard shows KPI cards with real data from API
3. Decision Inbox shows 50 decisions, sortable, filterable
4. Clicking a decision opens drawer with evidence, actions, preview
5. Approve/Reject buttons work (update DB, show toast)
6. Agents page shows all agents for current org
7. Org selector switches data across all pages
8. All pages render without hydration errors

## HANDOFF
Write `WAVE2A-HANDOFF.md` documenting what was built, components created, any deviations.
