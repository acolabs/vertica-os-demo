# MC Component Reference Library

This repo includes components copied from Mission Control (MC) to accelerate development.
DO NOT import from MC directly — these are local copies for reference and adaptation.

## Directory Structure

### `src/components/ui/` (32 files) — USE DIRECTLY
shadcn/ui components. These are the base building blocks. Import and use as-is:
- button, card, badge, dialog, dropdown-menu, input, label
- scroll-area, select, separator, skeleton, table, tabs
- textarea, tooltip, sheet, sonner (toasts)

### `src/components/mc-reference/` — ADAPT, DON'T COPY BLINDLY
These are MC components for reference. Adapt them to GenCap's data model.

#### `governance/` (4 files)
- `pending-approvals.tsx` — Queue of pending governance actions. ADAPT for Decision Inbox.
- `audit-timeline.tsx` — Hash-chained audit trail timeline. ADAPT for Audit page.
- `governance-stats.tsx` — Stats cards. ADAPT for Dashboard KPI cards.
- `capabilities-grid.tsx` — Capability registry grid. ADAPT for Policies page.

#### `agents/` (15 files)
- `agent-card.tsx` — Agent card component. ADAPT for Fleet Overview page.
- `fleet-health-banner.tsx` — Fleet health banner. ADAPT for Dashboard.
- `fleet-activity-feed.tsx` — Activity feed. ADAPT for Dashboard recent activity.
- `fleet-status-panel.tsx` — Status overview. ADAPT for Agent fleet.
- `session-trace.tsx` — Session trace view. ADAPT for Run Detail page.
- `loading-skeletons.tsx` — Loading states. REUSE patterns.
- `create-agent-wizard.tsx` — Agent creation wizard. Reference only.

#### `analytics/` (3 files)
- `burndown-chart.tsx` — Recharts burndown. ADAPT for KPI trends.
- `velocity-chart.tsx` — Recharts velocity. ADAPT for agent run rates.
- `project-breakdown.tsx` — Breakdown chart. ADAPT for analytics.

#### `observability/` (8 files)
- `system-health-bar.tsx` — System health indicator. ADAPT for Dashboard.
- `fleet-agent-status-panel.tsx` — Agent status overview. ADAPT for Agents page.
- `governance-center-panel.tsx` — Governance summary. ADAPT for Audit page.
- `governance-circuit-breaker-panel.tsx` — Circuit breaker status. ADAPT for Policies.
- `task-pipeline-panel.tsx` — Task pipeline view. Reference for run pipeline.
- `document-activity-panel.tsx` — Activity panel. ADAPT for activity feed.

#### `core-governance/` (4 files) — BACKEND REFERENCE
- `audit-ledger.ts` — SHA-256 hash-chained audit implementation. ADAPT for audit API.
- `action-service.ts` — Action propose/approve/reject flow. ADAPT for decision API.
- `types.ts` — Governance type definitions.
- `index.ts` — Exports.

#### `pages/` (7 files) — PAGE LAYOUT REFERENCE
Full page implementations from MC. Study the layout patterns, component composition,
and data fetching (React Query) patterns:
- `governance-page.tsx` — 4-panel governance layout
- `agents-page.tsx` — Fleet overview with tabs
- `traces-page.tsx` — Run traces with Recharts
- `analytics-page.tsx` — Analytics dashboard
- `observability-page.tsx` — System health panels
- `costs-page.tsx` — Cost tracking
- `mcp-page.tsx` — Integration management

#### `lib/` (2 files)
- `utils-reference.ts` — Utility functions (cn, etc.)
- `providers-reference.tsx` — React Query + provider setup

## Key Patterns to Reuse

1. **Card layouts**: MC uses `Card > CardHeader > CardTitle + CardContent` consistently
2. **Data fetching**: React Query `useQuery` with 15-30s refetchInterval
3. **Tables**: shadcn Table component with Badge status indicators
4. **Charts**: Recharts with ResponsiveContainer, dark theme colors
5. **Loading**: Skeleton components in same shape as real content
6. **Nav**: Fixed left nav (w-64) + scrollable main content (ml-64)
7. **Color coding**: emerald=good, amber=warning, rose=critical, blue=info
8. **Dark theme**: zinc-900/950 backgrounds, zinc-800 borders, white text hierarchy
