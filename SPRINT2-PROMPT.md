# Sprint 2: Demo Tooltips + Toast System + Full Interactivity

## Context
You are polishing a GenCap OS demo at `/Users/taliashapiro/repos/talia-made/gencap-demo`. It's a Next.js 16 app with 9 pages. Every section needs contextual tooltips explaining business impact, every button needs to produce visible feedback (toasts), and non-functional buttons need demo dialogs.

**IMPORTANT:** Another agent (Sprint 1) is simultaneously modifying the theme/colors of these same files. To AVOID conflicts:
- DO NOT change any color values, class names related to colors, or CSS
- DO NOT modify `globals.css`, `layout.tsx`, `providers.tsx`, `nav.tsx`, `org-selector.tsx`
- ONLY add tooltip wrappers, toast calls, dialog components, and new interactive behavior
- If you need to modify a component, ONLY add functionality — don't restyle

## Tasks

### 1. Install sonner (toast library)
```bash
npm install sonner
```

Add the Toaster component to `src/app/layout.tsx` — BUT since Sprint 1 is modifying layout.tsx, instead create a separate component:

Create `src/components/layout/toaster-provider.tsx`:
```tsx
'use client';
import { Toaster } from 'sonner';
export function ToasterProvider() {
  return <Toaster position="bottom-right" richColors closeButton />;
}
```

Then the Sprint 1 agent or a later merge will add it to layout. For now, add it to `src/lib/providers.tsx` as a sibling (not child) of the other providers — ONLY add the ToasterProvider import and render it alongside children. If providers.tsx is being modified by Sprint 1, create a wrapper instead.

Actually, the safest approach: Create `src/components/toast-wrapper.tsx` that you import in each PAGE file that needs toasts. This avoids any layout.tsx conflicts.

### 2. Create DemoTooltip Component

Create `src/components/demo-tooltip.tsx`:
```tsx
'use client';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface DemoTooltipProps {
  content: string;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export function DemoTooltip({ content, children, side = 'top' }: DemoTooltipProps) {
  return (
    <div className="flex items-center gap-2">
      {children}
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[var(--primary-10,rgba(230,48,41,0.1))] hover:bg-[var(--primary-20,rgba(230,48,41,0.2))] transition-colors">
              <Info className="w-3 h-3 text-[var(--primary,#E63029)]" />
            </button>
          </TooltipTrigger>
          <TooltipContent side={side} className="max-w-xs text-sm leading-relaxed">
            {content}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
```

### 3. Add Tooltips to EVERY Section on EVERY Page

For each page, wrap section headings with DemoTooltip. Here are the exact tooltips:

**Dashboard (`src/app/page.tsx`):**
- KPI Cards heading area: "Real-time metrics calculated from agent activity across all connected systems. Updated every 15 seconds."
- Churn Prevented card: "Dollar value of at-risk accounts successfully retained through agent-recommended save plays and proactive interventions."
- Support Deflection card: "Percentage of support tickets automatically resolved by AI agents without human intervention, maintaining or improving CSAT."
- Hours Saved card: "Cumulative operator and executive hours saved through automated board packs, support resolution, and risk analysis."
- Agent ROI card: "Total value created by agents divided by total agent operating cost. Accounts for all compute, API, and platform costs."
- Decision Summary: "Agents continuously monitor your customer base and flag findings requiring human review. Critical items have the highest dollar exposure."
- Active Agents: "Your deployed AI agent fleet. Each agent is specialized for a specific operational function with governed permissions."
- KPI Trend: "90-day trend showing business impact. The inflection point marks agent deployment — before and after is clearly visible."

**Decision Inbox (`src/app/decisions/page.tsx` or `src/components/inbox/decision-table.tsx`):**
- Page heading: "Every finding requires human approval before action. Agents recommend — humans decide."
- When drawer is open, add tooltips to:
  - Evidence tab: "Aggregated signals from multiple source systems. Each item links to the original record for verification."
  - Actions tab: "Agent-recommended actions with system-level specificity. All actions respect your governance policies."
  - Preview tab: "Field-level preview of exactly what will change in each connected system. The 'blast radius' of this decision."

**Agents (`src/app/agents/page.tsx`):**
- Fleet heading: "Your agent fleet operates 24/7, monitoring business systems and surfacing actionable intelligence."
- Health banner: "Aggregate health across all deployed agents. Green indicates all agents are operational with no errors."

**Agent Detail (`src/app/agents/[id]/page.tsx`):**
- Stats row: "Key performance indicators for this specific agent. Value Created represents direct dollar impact attributed to agent actions."
- Memory tab: "Agents learn patterns from historical data, improving accuracy over time. All learned patterns are explainable and auditable."
- Config tab: "Agent capabilities define what systems it can access and what actions it can take. Changes require governance approval."

**Analytics (`src/app/analytics/page.tsx`):**
- Big numbers: "Executive summary metrics for board reporting. All values are directly attributable to agent actions with full audit trail."
- Revenue Impact: "Churn prevention is the highest-ROI agent capability for PE-backed SaaS. Each dollar saved compounds at your revenue multiple."
- Support Metrics: "Support automation delivers immediate cost savings with measurable deflection rates and handle time reduction."
- Agent Efficiency: "Operational metrics showing agent reliability and cost-effectiveness. Acceptance rate indicates alignment with human judgment."

**Audit (`src/app/audit/page.tsx`):**
- Hash chain banner: "SHA-256 cryptographic hash chain ensures tamper-proof integrity. No entry can be modified or deleted without detection."
- Timeline: "Complete record of every agent action, human decision, and system event. Exportable for board presentations and compliance."

**Integrations (`src/app/integrations/page.tsx`):**
- Connected section: "Agents connect to your existing tools through governed, audited API channels. Permissions are granular — agents only access what policies allow."
- Available section: "Additional integrations available for deployment. Each connects through the same governed channel with full audit logging."

**Policies (`src/app/policies/page.tsx`):**
- Page heading: "Governance rules controlling agent behavior. From auto-approval for low-risk actions to two-person rules for high-stakes decisions."
- Enforcement stats: "Real-time compliance tracking. 100% policy compliance means no agent has ever taken an ungoverned action."

### 4. Wire Toast Notifications

Add toast feedback to every interactive element:

**Decision Inbox (in `src/components/inbox/decision-drawer.tsx`):**
- Approve button: `toast.success('Decision approved — audit entry created', { description: 'Actions will be executed in connected systems.' })`
- Reject button: `toast.info('Decision rejected', { description: 'Agent will be notified and may generate alternative recommendations.' })`
- Escalate button: `toast.warning('Escalated to VP of Customer Success', { description: 'Notification sent. SLA: 4 hour response.' })`

**Agents page (`src/app/agents/page.tsx`):**
- "Deploy New Agent" button: Show a Dialog with a list of 3 agent templates (NRR, Support, Board Pack). Each with a "Deploy" button that triggers: `toast.success('Agent deployment initiated', { description: 'Renewal Guardian will be active within 2 minutes.' })`

**Policies page (`src/app/policies/page.tsx`):**
- "Add Policy" button: `toast.info('Policy configuration panel', { description: 'Contact your administrator to add new governance policies.' })`

**Integrations page (`src/app/integrations/page.tsx`):**
- "Add Integration" button: `toast.info('Integration catalog', { description: 'Contact your administrator to connect new data sources.' })`
- "Connect" buttons on available integrations: `toast.success('Integration connection initiated', { description: 'OAuth flow would start here. Demo mode — no actual connection.' })`

**Audit page (`src/app/audit/page.tsx`):**
- "Export CSV": Generate a real CSV from the displayed audit data and trigger a download. Create the CSV string from the audit entries (timestamp, actor, action, resource_type, hash) and use a Blob + URL.createObjectURL + anchor click pattern.
- "Export PDF": `toast.info('PDF export generating...', { description: 'Board-ready audit report will download shortly.' })` (simulated)

**Top bar notification bell (`src/components/layout/top-bar.tsx`):**
- DO NOT modify top-bar.tsx (Sprint 1 is working on it). Instead, if there's a safe way to add notification functionality without conflicting, do it. Otherwise skip this one and note it in the handoff.

### 5. Make Budget Meter Dynamic

If you can safely modify the top-bar without conflicting with Sprint 1, make the budget meter pull from a new lightweight API call or calculate from the existing analytics data. Otherwise, skip and note in handoff.

### 6. Add Empty States

Create `src/components/empty-state.tsx`:
```tsx
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}
// A centered card with icon, title, description for when there's no data
```

Add empty states to key pages when data arrays are empty:
- Decision table: "No decisions found for the selected filters"
- Agent list: "No agents deployed for this organization"
- Audit timeline: "No audit entries found"
- Analytics: "Insufficient data for analytics. Deploy agents to start tracking."

## File Creation List
```
src/components/demo-tooltip.tsx          (new)
src/components/empty-state.tsx           (new)
src/components/layout/toaster-provider.tsx (new)
src/components/agents/deploy-dialog.tsx  (new — deploy agent template dialog)
```

## Files to Modify (ADD functionality only, don't restyle)
```
src/app/page.tsx                — add tooltips to section headings
src/app/decisions/page.tsx      — add tooltip to page heading
src/app/agents/page.tsx         — add tooltip, deploy dialog, toast
src/app/agents/[id]/page.tsx    — add tooltips to tabs
src/app/analytics/page.tsx      — add tooltips to sections
src/app/audit/page.tsx          — add tooltips, CSV export, toast
src/app/integrations/page.tsx   — add tooltips, connect toasts
src/app/policies/page.tsx       — add tooltip, add policy toast
src/components/inbox/decision-drawer.tsx  — add toasts to approve/reject/escalate
src/components/inbox/decision-table.tsx   — add tooltip, empty state
src/components/audit/audit-timeline.tsx   — add empty state
src/components/agents/fleet-health-banner.tsx — add tooltip
```

## Verification
1. `npm run build` passes with zero errors
2. Every section heading on every page has an info icon with tooltip
3. Hovering the info icon shows a contextual explanation
4. Approve/Reject/Escalate show toast notifications
5. Deploy Agent shows template dialog
6. Export CSV triggers a real file download
7. Empty states show when no data
8. No conflicts with Sprint 1's changes (no color/theme modifications)

## HANDOFF
Write `SPRINT2-HANDOFF.md` documenting everything added, any skipped items, and merge notes for Sprint 1.
