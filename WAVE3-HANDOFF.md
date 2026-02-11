# Wave 3 Handoff — Agent Detail + Run Trace Pages

## What Was Built

Two deep-dive pages with 12 new component files — the "depth" screens for when Philip clicks into an agent or a run trace.

### Page 1: Agent Detail (`/agents/[id]`)
Full agent deep-dive with 5 tabs:

- **Header:** Back to Fleet link, agent name + type badge + status indicator, model name, deployment age
- **Stats Row:** 5 cards — Total Runs, Success Rate (color-coded by threshold), Avg Duration, Total Cost, Value Created (emerald)
- **Tab: Overview** — Runs Over Time (BarChart, 30 days), Decision Outcomes (PieChart by status), Cumulative Cost (AreaChart with gradient fill)
- **Tab: Runs** — Sortable table of all agent runs with status/trigger badges, click-to-navigate to `/runs/[id]`
- **Tab: Decisions** — Filtered decisions table matching Decision Inbox style
- **Tab: Configuration** — Card-based display of capabilities (badges), thresholds (key-value), schedule, model info. Parses JSON config gracefully.
- **Tab: Memory** — "Agent Knowledge Base" with learned-pattern cards per agent type (NRR, Support, Board Pack, Pipeline). Each card: lightbulb icon, pattern text, confidence %, observation count, last updated.

### Page 2: Run Detail (`/runs/[id]`)
Full execution trace with the timeline as the wow feature:

- **Header:** Back to Agent link, run short-ID, status/trigger badges, stat chips (Duration, Tokens, Cost, Decisions)
- **Execution Timeline:** Vertical timeline with color-coded steps:
  - `plan` → Blue, Brain icon
  - `tool_call` → Purple, Wrench icon
  - `analysis` → Amber, Sparkles icon
  - `decision` → Rose, AlertCircle icon, ring glow
  - `output` → Emerald, CheckCircle icon, ring glow
  - Each step card: type icon + label, duration, title (bold), expandable detail text, system badge for tool calls, token count badge
  - Timeline connector: colored dots, 2px zinc line, elapsed time indicators between steps
- **Cost Breakdown Sidebar:** Total cost, input/output token split with cost estimates, per-step cost approximation, model info, cost-per-decision metric
- **Decisions Created:** Card listing decisions with severity badges (shown when run created decisions)
- **Error Display:** Rose-bordered card with pre-formatted error text (shown for failed runs)

## Files Created

```
src/app/agents/[id]/page.tsx          — Agent Detail page (5 tabs)
src/app/runs/[id]/page.tsx            — Run Detail page (timeline + sidebar)
src/components/agent-detail/
  agent-header.tsx                     — Back link + agent identity
  agent-stats.tsx                      — 5-card stats row
  runs-chart.tsx                       — Recharts BarChart (30-day runs)
  decisions-pie.tsx                    — Recharts PieChart (decision outcomes)
  cost-trend-chart.tsx                 — Recharts AreaChart (cumulative cost)
  runs-table.tsx                       — Sortable runs table
  decisions-table.tsx                  — Filtered decisions table
  agent-config.tsx                     — Config cards (capabilities/thresholds/schedule/model)
  agent-memory.tsx                     — Learned patterns cards
src/components/runs/
  run-header.tsx                       — Back link + run identity + stat chips
  execution-timeline.tsx               — Timeline container
  timeline-step.tsx                    — Individual timeline step card
  cost-breakdown.tsx                   — Cost sidebar
```

## Key Patterns Used
- `useOrg()` for org context on API calls
- `useQuery` from React Query for all data fetching
- `safeParse()` helper wraps JSON.parse in try/catch for steps/config/tools_used
- All API calls use existing routes from Wave 1 (no new API routes needed)
- Dark theme: `bg-[#111118]` cards, `border-[#1a1a24]` borders, `bg-[#0a0a0f]` inner elements
- shadcn/ui: Card, Badge, Tabs, Table, Skeleton, Button
- Recharts: BarChart, PieChart, AreaChart with consistent dark-theme tooltips
- Lucide icons throughout with color-coded accent backgrounds

## No Existing Files Modified
Zero modifications to any existing files — all new files only.

## Deviations from Spec
- Added `pipeline` agent type to memory data (the seed data includes pipeline agents)
- Timeline elapsed-time indicators show duration of previous step rather than wall-clock gap (the step data doesn't include absolute timestamps, only durations)
- Added ring glow on decision and output step dots for extra visual impact
- Memory data includes 7 entries per type (spec said 5-8, went with 7 for each)

## Verification
- ✅ `npm run build` — zero errors, all routes compiled
- ✅ `/agents/[id]` — dynamic route with all 5 tabs
- ✅ `/runs/[id]` — dynamic route with timeline + sidebar
- ✅ Navigation: `/agents` → `/agents/[id]` → `/runs/[id]` → back
- ✅ All JSON fields parsed safely with try/catch
- ✅ No hydration errors (all components are "use client")
- ✅ Responsive layout (mobile stacks, lg side-by-side)
