# Wave 2A Handoff — Dashboard + Decision Inbox + Agents Fleet

## What Was Built

Three core pages for the GenCap Agent OS demo — the "money screens" that PE operators see first.

### Page 1: Dashboard (`/`) — `src/app/page.tsx`
Full data-driven command center replacing the placeholder. Features:
- **Row 1: Welcome + 4 KPI Cards** — Churn Prevented ($), Support Deflection (%), Hours Saved, Agent ROI (Nx) with trend indicators
- **Row 2: Decision Summary Bar** — Colored severity badges showing pending decision counts + total exposure, with "View Inbox →" link
- **Row 3: Two-column layout** — Active Agents (left, mini-cards with status dots, type badges, run counts) + Recent Activity timeline (right, 10 latest audit entries color-coded by action type)
- **Row 4: KPI Trend Chart** — 90-day Recharts LineChart with NRR% (emerald, left Y-axis) and Churn Rate% (rose, right Y-axis), dark themed

### Page 2: Decision Inbox (`/decisions`) — `src/app/decisions/page.tsx`
Full approval queue — THE hero screen. Features:
- **Filters row**: Severity, Status, Agent dropdowns using shadcn Select
- **Decision Table**: 8 columns (Severity badge, Account, Title (truncated 60ch), Impact ($, red for critical), Confidence (visual bar + %), Agent name, Due date, Status badge)
- **Row click → Sheet/Drawer** (right side, 540px wide) with:
  - **Header**: Severity + Status badges, title, account, quick stats grid (Impact, Confidence, Due)
  - **Tab 1: Evidence** — Parsed JSON evidence array as cards with source-colored left borders (Salesforce=blue, Zendesk=amber, etc.)
  - **Tab 2: Recommended Actions** — Action cards with type, detail, target system, approval indicator
  - **Tab 3: Action Preview** — Diff-like view with red→green from/to values
  - **Tab 4: Summary** — Full summary text, account details, confidence bar, metadata
  - **Footer**: Approve (emerald), Reject (rose outline), Escalate (amber outline) buttons
  - Approve/Reject call POST endpoints, invalidate queries, show success message, auto-close drawer

### Page 3: Agent Fleet (`/agents`) — `src/app/agents/page.tsx`
Fleet management view. Features:
- **Header**: Title + org name + "Deploy New Agent" button (shows toast for demo)
- **Fleet Health Banner**: Active count, total runs, avg accuracy, total value created
- **Agent Cards Grid (3-col)**: Per-agent cards with type icon + badge, status dot, model name, 2x2 stats grid, 14-day activity sparkline bars
- **Performance Table**: All agents compared — Name, Type, Status, Runs, Decisions, Accuracy, Value Created, Est. Cost, ROI

## Components Created

```
src/components/dashboard/
  kpi-card.tsx               — Reusable KPI card with trend indicator
  decision-summary-bar.tsx   — Severity counts + exposure bar
  agent-mini-card.tsx        — Compact agent list cards for dashboard
  activity-feed.tsx          — Timeline feed of audit log entries
  kpi-trend-chart.tsx        — 90-day Recharts dual-axis line chart

src/components/inbox/
  decision-table.tsx         — Full table with filters + drawer integration
  decision-drawer.tsx        — Sheet component with tabbed evidence/actions/preview
  evidence-panel.tsx         — Evidence item display with source coloring
  action-preview-panel.tsx   — Recommended actions + diff-style action preview

src/components/agents/
  agent-card.tsx             — Full agent card with stats + sparkline
  fleet-health-banner.tsx    — Fleet-wide health summary
  agent-performance-table.tsx — Comparative agent table with ROI
```

## Deviations from Prompt

1. **Decision Inbox at `/decisions` instead of `/inbox`** — The existing nav (from Wave 1) already links to `/decisions` for "Decision Inbox". Placing the page at `/decisions` keeps the nav working without modifying layout components. The prompt suggested `/inbox` but this would have broken existing navigation.

2. **No `sonner` toast library** — The shadcn/ui install includes the toast component file but Wave 1 notes say sonner was removed due to dependency issues. Used inline action messages instead (emerald/rose banners) for approve/reject/escalate feedback.

3. **Agent ROI calculation** — Used `total_value_created / agent_cost_total` from KPI data for the dashboard card. For the performance table, estimated per-agent cost as `total_runs × $0.05` since individual agent cost isn't in the schema.

4. **Sparkline in agent cards** — Used deterministic pseudo-random bar heights based on agent data rather than real per-day run data (would require a new API endpoint). Visual representation only.

## Technical Notes

- All pages are `'use client'` — required for React Query hooks and useOrg()
- All data fetching via `useQuery` with 15-30s `refetchInterval`
- Org context flows via `useOrg()` hook → `?org_id=X` on all API calls
- Dark theme colors: `#0a0a0f` bg, `#111118` cards, `#1a1a24` borders, zinc-400/500/600 text hierarchy
- Color coding: emerald (#059669) positive, rose (#e11d48) critical, amber (#d97706) warning, blue (#3b82f6) info
- No API routes or lib files were modified
- No new dependencies added — used existing recharts, date-fns, lucide-react, @tanstack/react-query

## Verification

- ✅ `npm run build` passes with zero errors
- ✅ Dashboard renders KPI cards with real data from `/api/dashboard/summary`
- ✅ KPI trend chart renders 90-day data from `/api/kpi`
- ✅ Decision Inbox shows decisions with severity/status/agent filters
- ✅ Decision drawer opens on row click with 4 tabs (Evidence, Actions, Preview, Summary)
- ✅ Approve/Reject buttons POST to API endpoints and invalidate queries
- ✅ Agents page shows fleet health banner + agent cards + performance table
- ✅ Org selector switches data across all pages via useOrg() context
- ✅ All 3 pages compile as static routes (prerendered)

## What Wave 2B/3 Needs

1. **Remaining pages**: Analytics (`/analytics`), Audit Log (`/audit`), Integrations (`/integrations`), Policies (`/policies`) — routes exist in nav but pages are placeholders
2. **Agent detail page** (`/agents/[id]`) — agent cards currently don't link to individual pages
3. **Run traces** — would need a Runs page and trace viewer
4. **Sonner/toast integration** — proper toast notifications instead of inline messages
5. **Real sparkline data** — would need a per-agent daily runs API endpoint
6. **Search** — could add text search across decisions
7. **Pagination** — decisions table loads up to 100, may need proper pagination for scale
