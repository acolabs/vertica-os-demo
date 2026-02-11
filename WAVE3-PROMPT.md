# Wave 3: Agent Detail + Run Trace Pages

## Context
You are building the deep-dive pages for a GenCap Agent OS demo — a PE-grade agent platform. Waves 1-2 are complete: Next.js 16 app at `/Users/taliashapiro/repos/talia-made/gencap-demo` with SQLite DB, 15 API routes, seed data, and 6 pages already built (Dashboard, Decision Inbox, Agents Fleet, Analytics, Audit, Integrations).

## CRITICAL: Read These First
1. `WAVE1-HANDOFF.md` — foundation, API routes, data model
2. `MC-COMPONENTS-README.md` — MC reference components available
3. Look at existing pages for pattern consistency: `src/app/agents/page.tsx`, `src/app/analytics/page.tsx`

## Your Mission
Build 2 deep-dive pages: Agent Detail (/agents/[id]) and Run Detail (/runs/[id]). These are the "depth" screens — when Philip clicks into an agent or a run trace, he sees impressive operational detail.

## CONSTRAINTS
- DO NOT modify any existing pages or API routes
- DO NOT modify layout, nav, lib files, or components in other directories
- Use existing shadcn/ui from `src/components/ui/`
- Use `useOrg()` hook from `src/lib/hooks/use-org.tsx` for org context
- Use React Query for data fetching
- Match the visual style of existing pages (dark theme, zinc backgrounds, colored accents)
- Recharts for any charts (already installed)

---

## Page 1: Agent Detail (/agents/[id]) — `src/app/agents/[id]/page.tsx`

When a user clicks an agent card on the Fleet page, they land here.

**Data sources:**
- `GET /api/agents/[id]` — full agent details
- `GET /api/runs?org_id=X&agent_id=[id]` — runs for this agent
- `GET /api/decisions?org_id=X&agent_id=[id]` — decisions by this agent
- `GET /api/kpi?org_id=X&days=90` — for agent-specific charts

**Layout:**

### Header
- Back button (← Back to Fleet) linking to /agents
- Agent name (large, bold) + type badge (NRR/Support/Board Pack) + status indicator (green dot "Active")
- Model name in smaller text (e.g., "claude-sonnet-4.5")
- "Deployed 90 days ago" or similar from created_at

### Stats Row (5 cards in a row)
- Total Runs: number with icon
- Success Rate: percentage (color: emerald >90%, amber >75%)
- Avg Duration: formatted time
- Total Cost: formatted currency
- Value Created: formatted currency (big emerald number)

### Tabs (use shadcn Tabs component)

**Tab 1: Overview (default)**
Two columns (lg:grid-cols-2):

Left column:
- **Runs Over Time chart** — Recharts BarChart, daily run counts for last 30 days, blue bars
- Below: "Avg [X] runs/day"

Right column:
- **Decision Outcomes chart** — Recharts PieChart showing decisions by status (pending=amber, approved=emerald, rejected=rose, auto_resolved=blue)
- Below: "Acceptance rate: X%"

Full-width below:
- **Cost Trend chart** — Recharts AreaChart showing cumulative cost over 30 days, with light blue fill

**Tab 2: Runs**
Sortable table of all runs for this agent:
- Columns: Status (badge), Trigger (scheduled/manual/event), Started (formatted datetime), Duration, Tools Used (count), Tokens, Cost, Decisions Created
- Status colors: completed=emerald, running=blue, failed=rose
- Click row → navigates to /runs/[id]
- Sort by started_at descending by default

**Tab 3: Decisions**
Filtered view of decisions made by this agent:
- Same table format as the Decision Inbox page but pre-filtered to this agent
- Columns: Severity, Account, Title, Impact ($), Confidence, Status, Created
- Click → could open a dialog with decision details (or link to /decisions page)

**Tab 4: Configuration (read-only)**
Display the agent's config JSON in a readable format:
- **Capabilities section:** List each capability as a badge (e.g., "salesforce_read", "zendesk_write")
- **Thresholds section:** Key-value display of threshold settings
- **Schedule section:** When the agent runs
- **Model section:** Model name, any parameters
- Use a clean card-based layout, not raw JSON dump

**Tab 5: Memory**
Simulated agent memory/learnings display:
- Title: "Agent Knowledge Base"
- List of "learned patterns" as cards. Generate 5-8 hardcoded entries based on agent type:

For NRR Agent:
- "Accounts with >25% usage decline and open P1 tickets have 78% churn probability"
- "Champion departures are the strongest single predictor of churn (3.2x risk multiplier)"
- "Renewal offers with 10-15% discount range have 67% acceptance rate"
- "Accounts in the Manufacturing vertical show seasonal Q4 usage dips that normalize by Q2"
- "Multi-threaded relationships (3+ stakeholders) reduce churn risk by 45%"

For Support Agent:
- "Password reset tickets can be safely auto-resolved with 99.2% accuracy"
- "Billing inquiry resolution time improved 52% with account context pre-loading"
- "P1 tickets mentioning 'data loss' should always escalate regardless of confidence score"
- "API rate limiting complaints correlate with accounts approaching plan limits"
- "Average first-response time target: 4 minutes for P1, 15 minutes for P2"

For Board Pack Agent:
- "Pipeline coverage below 3x signals revenue risk in next quarter"
- "Support ticket volume spikes >30% week-over-week correlate with NPS drops"
- "Gross margin compression >2% month-over-month warrants board attention"
- "Q4 and Q1 show natural churn seasonality — adjust baselines accordingly"
- "Cross-referencing CRM and product analytics catches 23% more anomalies than either alone"

Display each as a card with:
- Light bulb icon
- Pattern text
- "Confidence: 94%" (random 85-98%)
- "Learned from: 47 observations" (random 20-100)
- "Last updated: X days ago"

---

## Page 2: Run Detail (/runs/[id]) — `src/app/runs/[id]/page.tsx`

When a user clicks a run row on the Agent Detail page, they see the full execution trace.

**Data source:** `GET /api/runs/[id]` — returns run with full steps JSON

**Layout:**

### Header
- Back button (← Back to Agent) linking to /agents/[agent_id]
- "Run [short-id]" as title
- Status badge, agent name, trigger type badge
- Row of stats: Duration, Tokens Used, Cost, Decisions Created

### Execution Timeline (the wow feature)
Vertical timeline with a connector line on the left side.

Each step is a card connected by the timeline:

**Step type styling:**
- `plan` — Brain icon, blue-500 accent, "Planning" label
- `tool_call` — Wrench icon, purple-500 accent, system name label (e.g., "Salesforce")
- `analysis` — Sparkles icon, amber-500 accent, "Analysis" label
- `decision` — AlertCircle icon, rose-500 accent, "Decision" label
- `output` — CheckCircle icon, emerald-500 accent, "Output" label

**Each step card shows:**
- Left: Colored icon on the timeline connector line
- Top: Step number + type label + duration (e.g., "Step 3 · Tool Call · 2.1s")
- Title: Step title (bold)
- Detail: Step detail text (can be long, show first 2 lines with "Show more" expand)
- If tool_call: Show system badge (Salesforce, Zendesk, etc.)
- Tokens used (if >0): Small badge "3,200 tokens"

**Timeline connector:**
- Thin vertical line (2px, zinc-700) connecting each step
- Colored dot at each step's position matching the step type color
- Small duration indicator between steps showing elapsed time

### Cost Breakdown Sidebar (right side on lg screens, below on mobile)
Card showing:
- Total cost: formatted
- Token breakdown: input vs output
- Per-step cost approximation (tokens * model rate)
- Model used
- "Cost per decision: $X.XX" (total cost / decisions_created)

### Result Section (below timeline)
If the run created decisions:
- "Decisions Created" card listing decision titles with severity badges
- Each links to the decision (or shows key info inline)

If the run failed:
- Error display in a red-bordered card with error text

---

## Component Organization

Create these files:
```
src/app/agents/[id]/page.tsx
src/app/runs/[id]/page.tsx
src/components/agent-detail/
  agent-header.tsx
  agent-stats.tsx
  runs-chart.tsx
  decisions-pie.tsx
  cost-trend-chart.tsx
  runs-table.tsx
  decisions-table.tsx
  agent-config.tsx
  agent-memory.tsx
src/components/runs/
  execution-timeline.tsx
  timeline-step.tsx
  cost-breakdown.tsx
  run-header.tsx
```

## IMPORTANT: Handling the steps/evidence JSON
The database stores `steps`, `evidence`, `recommended_action`, `action_preview`, `config`, `tools_used` as JSON strings. You MUST parse them with `JSON.parse()` before rendering. Always wrap in try/catch and handle null/undefined gracefully. The API routes already return these as parsed JSON objects, so when fetching via the API you should get objects directly. But verify — if they come as strings, parse them.

## Verification
1. `npm run build` passes with zero errors
2. Agent Detail page shows all 5 tabs with real data
3. Clicking from /agents to /agents/[id] works
4. Run Detail page shows full execution timeline
5. Timeline steps are visually distinct by type (color-coded)
6. Back navigation works
7. Memory tab shows realistic learned patterns
8. No hydration errors

## HANDOFF
Write `WAVE3-HANDOFF.md` documenting what was built, components created, any deviations.
