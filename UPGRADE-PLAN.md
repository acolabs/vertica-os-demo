# VERTICA OS — Premium Polish & Visual Upgrade Plan

## Brand Colors (from logo)
- **Vertica Green:** #2DB34A (primary — the chevron mark)
- **Vertica Green Hover:** #249A3E (darker for hover states)  
- **Vertica Green Light:** #34C854 (lighter accent)
- **Charcoal:** #58595B (dark gray text from "VERTICA")
- **Silver:** #A7A9AC (lighter gray from "CAPITAL PARTNERS")
- **Dark background (dark mode):** #0D1117 (GitHub-dark inspired, professional)

## Phase 1: Theme Overhaul (globals.css)
Replace ALL `#4A6CF7` (slate blue) references with Vertica green `#2DB34A`.
Update both light AND dark themes:
- `--primary: #2DB34A`
- `--primary-hover: #249A3E`
- `--primary-10: rgba(45, 179, 74, 0.1)` (light) / `rgba(45, 179, 74, 0.15)` (dark)
- `--primary-20: rgba(45, 179, 74, 0.2)` (light) / `rgba(45, 179, 74, 0.25)` (dark)
- `--ring: #2DB34A`
- `--nav-text-active: #2DB34A`
- `--nav-active-bg: rgba(45, 179, 74, 0.08)` (light) / `rgba(45, 179, 74, 0.15)` (dark)
- `--chart-1: #2DB34A`
- `--sidebar-primary: #2DB34A`
- `--sidebar-ring: #2DB34A`
- `--foreground` in light: keep #111111
- `--text-secondary` in light: #58595B (Vertica charcoal)

## Phase 2: Nav Upgrade
- Replace Shield icon in nav logo with a custom Vertica chevron (SVG inline — two stacked chevrons)
- Add subtle gradient accent line under "VERTICA OS" text
- Add status indicators: small green dot next to "powered by Adapt Agents" to show system online

## Phase 3: Agent Card Type Mapping Fix
In `src/components/agents/agent-card.tsx`, the `typeConfig` uses old types (`nrr`, `support`, `board_pack`, `pipeline`).
Update to new types:
- `revenue_cadence` → TrendingUp icon, green accent
- `support_deflection` → Headphones icon, blue accent  
- `nrr` → Shield icon, emerald accent
- `pipeline` → Activity icon, amber accent

## Phase 4: Functional "Wow" Visualizations (value-add, not eye candy)

### 4a: Portfolio Value Flow (Dashboard)
A Sankey-style or animated flow visualization showing:
- Agent actions → Decisions → Value Created
- Use CSS animations + SVG, no extra deps
- Shows the "pipeline" of agent → human → outcome

### 4b: Real-time Agent Pulse (Dashboard)  
Animated circular "pulse" indicators for each active agent showing:
- Heartbeat animation when running
- Activity frequency (pulse speed = recent activity rate)
- Color = status (green=active, amber=reviewing, red=alert)

### 4c: Hash Chain Integrity Visualization (Audit page)
Animated chain links showing the SHA-256 chain integrity:
- Each link = an audit entry
- Animated "verification sweep" that traverses the chain
- Glows green as each link verifies
- Much more impactful than the current static banner

### 4d: Decision Impact Heatmap (Decision Inbox)
A heatmap grid showing:
- X-axis: Time (weeks)  
- Y-axis: Severity/category
- Cell intensity: $ exposure
- Clickable cells to filter the decision table
- Shows patterns (e.g., "churn risk spikes in week 3 of quarter")

### 4e: KPI Trend with Gradient Fill + Deploy Marker
Upgrade existing KPI chart:
- Add gradient fill under the lines (green→transparent for NRR, red→transparent for churn)
- Add animated vertical line for "Agent Deployed" marker
- Add annotation callouts showing % improvement

## Phase 5: Micro-interactions & Polish
- Card hover: subtle lift + shadow transition
- Number animations: count-up on load for KPI values
- Skeleton shimmer: replace static skeletons with shimmer animation
- Toast notifications: slide-in from bottom-right with Vertica green accent
- Button hover: slight scale + shadow
- Page transitions: fade-in on route change

## Execution Order
1. Phase 1 (theme) — required first, everything depends on it
2. Phase 3 (agent card types) — quick fix, high impact
3. Phase 2 (nav) — visual identity
4. Phase 5 (micro-interactions) — polish layer
5. Phase 4 (wow visualizations) — biggest impact, most work

## Constraints
- No new npm dependencies (use CSS animations, SVG, existing recharts)
- Must build clean with 0 TS errors
- Both light AND dark themes must look great
- Professional/expensive feel — think Bloomberg Terminal meets Apple
