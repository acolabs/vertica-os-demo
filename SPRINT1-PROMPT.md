# Sprint 1: Theme System, Branding & Light/Dark Toggle

## Context
You are polishing a GenCap Agent OS demo at `/Users/taliashapiro/repos/talia-made/gencap-demo`. It's a Next.js 16 app with 9 pages, 39 custom components, 16 shadcn/ui components. Currently dark-only with blue accents. Needs to become "GENCAP OS powered by Adapt Agents" with red (#E63029) brand color and a light/dark theme toggle.

## CRITICAL CONSTRAINTS
- DO NOT modify any API routes (`src/app/api/`)
- DO NOT modify the seed script or database
- DO NOT change component LOGIC or data fetching — only styling/theming
- DO NOT remove any existing functionality
- The `src/components/ui/` shadcn components already support dark mode via CSS variables — leverage this
- Install `next-themes` for theme management

## Tasks

### 1. Install next-themes
```bash
npm install next-themes
```

### 2. Create CSS Variable Theme System

Update `src/app/globals.css` to use CSS custom properties. Define two theme sets:

**Light Theme (`:root` — DEFAULT):**
```css
:root {
  --background: #FFFFFF;
  --surface: #F5F5F5;
  --surface-elevated: #FFFFFF;
  --border: #E5E5E5;
  --border-subtle: #F0F0F0;
  --text-primary: #111111;
  --text-secondary: #555555;
  --text-muted: #888888;
  --primary: #E63029;
  --primary-hover: #CC1F1A;
  --primary-foreground: #FFFFFF;
  --primary-10: rgba(230, 48, 41, 0.1);
  --primary-20: rgba(230, 48, 41, 0.2);
  --success: #059669;
  --success-10: rgba(5, 150, 105, 0.1);
  --warning: #D97706;
  --warning-10: rgba(217, 119, 6, 0.1);
  --danger: #DC2626;
  --danger-10: rgba(220, 38, 38, 0.1);
  --info: #2563EB;
  --info-10: rgba(37, 99, 235, 0.1);
  --nav-bg: #FFFFFF;
  --nav-border: #E5E5E5;
  --nav-text: #555555;
  --nav-text-active: #E63029;
  --nav-active-bg: rgba(230, 48, 41, 0.08);
  --topbar-bg: #FAFAFA;
  --topbar-border: #E5E5E5;
  --card-bg: #FFFFFF;
  --card-border: #E5E5E5;
  --card-hover: #FAFAFA;
  --input-bg: #FFFFFF;
  --input-border: #D4D4D8;
  --badge-muted-bg: #F4F4F5;
  --badge-muted-text: #71717A;
  --chart-grid: #E5E5E5;
  --chart-text: #71717A;
  --skeleton: #E5E5E5;
}

.dark {
  --background: #0A0A0F;
  --surface: #111118;
  --surface-elevated: #1A1A24;
  --border: #2A2A34;
  --border-subtle: #1F1F2A;
  --text-primary: #FFFFFF;
  --text-secondary: #A1A1AA;
  --text-muted: #71717A;
  --primary: #E63029;
  --primary-hover: #F04040;
  --primary-foreground: #FFFFFF;
  --primary-10: rgba(230, 48, 41, 0.15);
  --primary-20: rgba(230, 48, 41, 0.25);
  --success: #059669;
  --success-10: rgba(5, 150, 105, 0.15);
  --warning: #D97706;
  --warning-10: rgba(217, 119, 6, 0.15);
  --danger: #DC2626;
  --danger-10: rgba(220, 38, 38, 0.15);
  --info: #3B82F6;
  --info-10: rgba(59, 130, 246, 0.15);
  --nav-bg: #111118;
  --nav-border: #1A1A24;
  --nav-text: #A1A1AA;
  --nav-text-active: #E63029;
  --nav-active-bg: rgba(230, 48, 41, 0.15);
  --topbar-bg: #0A0A0F;
  --topbar-border: #1A1A24;
  --card-bg: #111118;
  --card-border: #1A1A24;
  --card-hover: #1A1A24;
  --input-bg: #111118;
  --input-border: #2A2A34;
  --badge-muted-bg: #1A1A24;
  --badge-muted-text: #A1A1AA;
  --chart-grid: #2A2A34;
  --chart-text: #71717A;
  --skeleton: #1A1A24;
}
```

Keep existing Tailwind base styles but update body to use variables:
```css
body {
  background-color: var(--background);
  color: var(--text-primary);
}
```

### 3. Update Providers with ThemeProvider

Update `src/lib/providers.tsx`:
```tsx
import { ThemeProvider } from 'next-themes';
// Wrap children in ThemeProvider with attribute="class" defaultTheme="light" enableSystem={false}
```

Update `src/app/layout.tsx`:
- Remove hardcoded `className="dark"` from the `<html>` tag
- Add `suppressHydrationWarning` to `<html>`
- Remove hardcoded `bg-zinc-950 text-white` from body — use CSS variables instead

### 4. Add Theme Toggle to Top Bar

Update `src/components/layout/top-bar.tsx`:
- Add a Sun/Moon toggle button next to the notification bell
- Use `useTheme()` from next-themes
- Sun icon for light mode, Moon icon for dark mode
- Smooth transition between themes

### 5. Rebrand All Identity References

**Nav (`src/components/layout/nav.tsx`):**
- "AGENT OS" → "GENCAP OS"
- "powered by Arc Agency" → "powered by Adapt Agents"
- Footer: "GenCap Agent OS v1.0" → "GENCAP OS v1.0"
- Replace Shield icon in logo with a more distinctive icon (or keep Shield but make it red)
- Change nav active color from `blue-500/blue-400` to use `var(--primary)` / `var(--nav-text-active)`

**Layout (`src/app/layout.tsx`):**
- Page title: "GENCAP OS — AI Agent Platform"
- Description: "Enterprise AI agent governance and operations platform"

### 6. Convert ALL Components to CSS Variables

This is the big task. Go through EVERY file in `src/components/` (excluding `ui/` and `mc-reference/`) and `src/app/` pages, replacing hardcoded colors with CSS variables.

**Search and replace patterns:**

Nav/Layout:
- `bg-[#111118]` → `bg-[var(--nav-bg)]`
- `bg-[#0a0a0f]` → `bg-[var(--background)]`
- `border-[#1a1a24]` → `border-[var(--border)]`
- `border-[#2a2a34]` → `border-[var(--border)]`
- `text-white` → `text-[var(--text-primary)]`
- `text-zinc-400` → `text-[var(--text-secondary)]`
- `text-zinc-500` → `text-[var(--text-muted)]`
- `text-zinc-600` → `text-[var(--text-muted)]`

Cards:
- `bg-zinc-900/50` → `bg-[var(--card-bg)]`
- `bg-zinc-900` → `bg-[var(--card-bg)]`
- `border-zinc-800` → `border-[var(--card-border)]`
- `bg-[#0a0a0f]` (stat boxes inside cards) → `bg-[var(--surface)]`

Accent colors (IMPORTANT — change blue to red/primary):
- `text-blue-400` → `text-[var(--primary)]`
- `text-blue-500` → `text-[var(--primary)]`
- `bg-blue-500/10` → `bg-[var(--primary-10)]`
- `bg-blue-500` → `bg-[var(--primary)]`
- `border-blue-500` → `border-[var(--primary)]`

Keep semantic colors as-is:
- `text-emerald-400/500` → keep (success color)
- `text-rose-400/500` → keep (danger color)  
- `text-amber-400/500` → keep (warning color)
- `text-purple-400/500` → keep (agent type color)

Chart colors in Recharts:
- Replace any blue chart colors with red/primary where it represents the main metric
- Keep emerald for positive trends, rose for negative

Hover states:
- `hover:bg-white/5` → `hover:bg-[var(--card-hover)]`
- `hover:text-white` → `hover:text-[var(--text-primary)]`
- `hover:bg-zinc-800` → `hover:bg-[var(--card-hover)]`
- `hover:border-[#2a2a34]` → `hover:border-[var(--border)]`

### 7. Update Favicon and Meta

Create or update the favicon to use the GenCap red color. Update `src/app/layout.tsx` metadata.

### 8. Ensure shadcn/ui Components Work in Both Themes

The shadcn components in `src/components/ui/` use Tailwind's dark: prefix. Since we're using `next-themes` with `attribute="class"`, the `.dark` class on `<html>` will automatically activate dark: variants. The CSS variables we defined will also be picked up. Test that all shadcn components (especially Select, Sheet, Dialog, Badge, Table) look correct in both themes.

If any shadcn component has hardcoded dark colors, update them to use the CSS variables or ensure they have proper dark: variants.

## File Modification List (ALL files that need changes)

**Must modify:**
- `src/app/globals.css` — CSS variables
- `src/app/layout.tsx` — remove dark class, add ThemeProvider, update meta
- `src/lib/providers.tsx` — add ThemeProvider
- `src/components/layout/nav.tsx` — rebrand + theme vars
- `src/components/layout/top-bar.tsx` — theme toggle + theme vars
- `src/components/layout/org-selector.tsx` — theme vars

**All page files:**
- `src/app/page.tsx`
- `src/app/decisions/page.tsx`
- `src/app/agents/page.tsx`
- `src/app/agents/[id]/page.tsx`
- `src/app/runs/[id]/page.tsx`
- `src/app/analytics/page.tsx`
- `src/app/audit/page.tsx`
- `src/app/integrations/page.tsx`
- `src/app/policies/page.tsx`

**All custom component files (39 files in src/components/ excluding ui/ and mc-reference/):**
Every single `.tsx` file needs color updates.

## Verification
1. `npm run build` passes with zero errors
2. Light theme loads by default — white backgrounds, red accents, dark text
3. Dark theme toggle works — dark backgrounds, red accents, light text
4. Theme persists across page navigation
5. All 9 pages look correct in BOTH themes
6. Nav says "GENCAP OS" and "powered by Adapt Agents"
7. No blue accent colors remain (all replaced with red/primary)
8. Charts render correctly in both themes
9. shadcn components (Select, Sheet, Dialog, Table, Badge) look correct in both themes
10. No hydration errors

## HANDOFF
Write `SPRINT1-HANDOFF.md` documenting everything changed.
