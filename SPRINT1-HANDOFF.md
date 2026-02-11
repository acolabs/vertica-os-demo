# Sprint 1 Handoff — Theme System, Branding & Light/Dark Toggle

## What Was Done

Complete implementation of the theme system, rebranding, and light/dark toggle for the GenCap Agent OS demo.

## Changes Summary

### 1. `next-themes` Installed
- Added `next-themes` package for theme management
- Configured with `attribute="class"`, `defaultTheme="light"`, `enableSystem={false}`

### 2. CSS Variable Theme System (`src/app/globals.css`)
- Defined 50+ CSS custom properties for both light and dark themes
- Light theme (`:root`): white backgrounds, dark text, red (#E63029) accents
- Dark theme (`.dark`): dark backgrounds, light text, red (#E63029) accents
- Updated shadcn CSS variable mappings (`--primary`, `--card`, `--border`, etc.)
- Chart colors updated from blue to red (#E63029) as primary
- All sidebar variables updated to use red primary

### 3. ThemeProvider in Providers (`src/lib/providers.tsx`)
- Wrapped entire app in `<ThemeProvider>` from `next-themes`
- Configuration: `attribute="class" defaultTheme="light" enableSystem={false}`

### 4. Root Layout Updated (`src/app/layout.tsx`)
- Removed hardcoded `className="dark"` from `<html>` tag
- Added `suppressHydrationWarning` to `<html>` tag
- Removed hardcoded `bg-[#0a0a0f] text-white` from body
- Updated metadata: title → "GENCAP OS — AI Agent Platform", description → "Enterprise AI agent governance and operations platform"

### 5. Theme Toggle in Top Bar (`src/components/layout/top-bar.tsx`)
- Added Sun/Moon toggle button next to notification bell
- Uses `useTheme()` from `next-themes`
- Sun icon shown in dark mode (click to go light), Moon icon in light mode (click to go dark)
- Hover states use CSS variables for theme consistency

### 6. Full Rebrand (`src/components/layout/nav.tsx`)
- "AGENT OS" → "GENCAP OS"
- "powered by Arc Agency" → "powered by Adapt Agents"
- Footer: "GenCap Agent OS v1.0" → "GENCAP OS v1.0"
- Shield icon retained but now uses `var(--primary)` (red)
- Nav active color changed from blue-500 to `var(--nav-text-active)` / `var(--nav-active-bg)`

### 7. ALL Components Converted to CSS Variables

**Every single `.tsx` file** in `src/components/` (excluding `ui/`) and `src/app/` pages was updated. Key patterns replaced:

| Old Pattern | New Pattern |
|-------------|-------------|
| `bg-[#111118]` | `bg-[var(--card-bg)]` |
| `bg-[#0a0a0f]` | `bg-[var(--surface)]` or `bg-[var(--background)]` |
| `border-[#1a1a24]` | `border-[var(--card-border)]` |
| `border-[#2a2a34]` | `border-[var(--border)]` |
| `text-white` | `text-[var(--text-primary)]` |
| `text-zinc-400` | `text-[var(--text-secondary)]` |
| `text-zinc-500` | `text-[var(--text-muted)]` |
| `text-zinc-600` | `text-[var(--text-muted)]` |
| `text-blue-400` / `text-blue-500` | `text-[var(--primary)]` |
| `bg-blue-500/10` | `bg-[var(--primary-10)]` |
| `bg-blue-600` / `hover:bg-blue-700` | `bg-[var(--primary)]` / `hover:bg-[var(--primary-hover)]` |
| `hover:bg-white/5` | `hover:bg-[var(--card-hover)]` |
| `hover:text-white` | `hover:text-[var(--text-primary)]` |
| `bg-zinc-800` | `bg-[var(--surface)]` |
| `bg-zinc-900/50` | `bg-[var(--surface)]` |
| `bg-[#111118]` (skeletons) | `bg-[var(--skeleton)]` |

**Semantic colors preserved as-is:**
- Emerald (success/NRR) ✓
- Rose (danger/critical) ✓
- Amber (warning/pipeline) ✓
- Purple (board pack/agent types) ✓

### 8. Chart Colors Updated
- `cost-trend-chart.tsx`: Blue gradient → Red (#E63029) gradient
- `runs-chart.tsx`: Blue bars → Red (#E63029) bars
- `decisions-pie.tsx`: auto_resolved color → Red (#E63029)
- `operator-hours-chart.tsx`: Blue bars → Red (#E63029) bars
- All chart tooltips: Updated to use `var(--card-bg)`, `var(--card-border)`, `var(--text-primary)`
- All chart grids: Updated to use `var(--chart-grid)`
- All chart axis text: Updated to use `var(--chart-text)`

## Files Modified (Complete List)

### Core Infrastructure (4 files)
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/lib/providers.tsx`
- `package.json` (next-themes added)

### Layout (3 files)
- `src/components/layout/nav.tsx`
- `src/components/layout/top-bar.tsx`
- `src/components/layout/org-selector.tsx`

### Pages (9 files)
- `src/app/page.tsx`
- `src/app/decisions/page.tsx`
- `src/app/agents/page.tsx`
- `src/app/agents/[id]/page.tsx`
- `src/app/runs/[id]/page.tsx`
- `src/app/analytics/page.tsx`
- `src/app/audit/page.tsx`
- `src/app/integrations/page.tsx`
- `src/app/policies/page.tsx`

### Dashboard Components (5 files)
- `src/components/dashboard/kpi-card.tsx`
- `src/components/dashboard/decision-summary-bar.tsx`
- `src/components/dashboard/agent-mini-card.tsx`
- `src/components/dashboard/activity-feed.tsx`
- `src/components/dashboard/kpi-trend-chart.tsx`

### Agent Components (3 files)
- `src/components/agents/agent-card.tsx`
- `src/components/agents/agent-performance-table.tsx`
- `src/components/agents/fleet-health-banner.tsx`

### Agent Detail Components (9 files)
- `src/components/agent-detail/agent-header.tsx`
- `src/components/agent-detail/agent-stats.tsx`
- `src/components/agent-detail/agent-config.tsx`
- `src/components/agent-detail/agent-memory.tsx`
- `src/components/agent-detail/runs-chart.tsx`
- `src/components/agent-detail/runs-table.tsx`
- `src/components/agent-detail/decisions-pie.tsx`
- `src/components/agent-detail/decisions-table.tsx`
- `src/components/agent-detail/cost-trend-chart.tsx`

### Inbox Components (4 files)
- `src/components/inbox/decision-table.tsx`
- `src/components/inbox/decision-drawer.tsx`
- `src/components/inbox/evidence-panel.tsx`
- `src/components/inbox/action-preview-panel.tsx`

### Analytics Components (5 files)
- `src/components/analytics/big-number-card.tsx`
- `src/components/analytics/agent-efficiency-table.tsx`
- `src/components/analytics/revenue-impact-chart.tsx`
- `src/components/analytics/support-metrics-chart.tsx`
- `src/components/analytics/operator-hours-chart.tsx`

### Audit Components (3 files)
- `src/components/audit/audit-entry.tsx`
- `src/components/audit/audit-timeline.tsx`
- `src/components/audit/hash-chain-banner.tsx`

### Integration Components (3 files)
- `src/components/integrations/integration-card.tsx`
- `src/components/integrations/integration-status-banner.tsx`
- `src/components/integrations/available-integrations.tsx`

### Run Components (4 files)
- `src/components/runs/run-header.tsx`
- `src/components/runs/execution-timeline.tsx`
- `src/components/runs/timeline-step.tsx`
- `src/components/runs/cost-breakdown.tsx`

**Total: 52 files modified**

## NOT Modified (as instructed)
- `src/app/api/` — All 16 API routes untouched
- `scripts/seed.ts` — Seed script untouched
- `src/components/ui/` — 16 shadcn/ui components untouched (they use Tailwind dark: variants which work automatically with next-themes class strategy)
- `src/lib/db.ts`, `src/lib/schema.ts`, `src/lib/api-init.ts`, `src/lib/utils.ts` — Untouched
- `src/lib/hooks/use-org.tsx` — Untouched

## Verification Results

- ✅ `npm run build` — **zero errors**, all 25 routes compiled
- ✅ Light theme is the default — white backgrounds, red accents, dark text
- ✅ Dark theme available via toggle — dark backgrounds, red accents, light text
- ✅ Theme persists via next-themes localStorage
- ✅ Nav reads "GENCAP OS" / "powered by Adapt Agents" / "GENCAP OS v1.0"
- ✅ Primary brand color is RED (#E63029) throughout
- ✅ No blue accent colors remain (all replaced with red/primary variables)
- ✅ shadcn/ui components work in both themes (use Tailwind dark: prefix + CSS variables)
- ✅ No hydration errors (suppressHydrationWarning on html tag)

## Theme Architecture

```
next-themes (attribute="class", defaultTheme="light")
  └── .dark class toggled on <html>
       └── CSS variables in globals.css respond
            └── All components use var(--xxx) references
                 └── shadcn/ui uses Tailwind dark: prefix (automatic)
```

## What Sprint 2 Needs to Know

1. **Theme toggle** is in `top-bar.tsx` using `useTheme()` from `next-themes`
2. **All colors** go through CSS variables — never hardcode hex values in components
3. **Primary color** is `var(--primary)` = `#E63029` (red) in both themes
4. **Chart colors** use hex values directly in Recharts (CSS variables don't work in SVG attributes) — use `#E63029` for primary chart color
5. **Semantic colors** (emerald, rose, amber, purple) are kept as Tailwind classes since they're contextual, not brand-specific
6. **shadcn/ui components** in `src/components/ui/` were NOT modified — they inherit theme via Tailwind's dark: variant which works automatically with the class-based strategy
