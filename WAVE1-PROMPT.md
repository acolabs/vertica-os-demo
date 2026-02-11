# Wave 1: GenCap Agent OS — Foundation + Seed Data

## Your Mission
Build the complete foundation for a GenCap AI demo application: Next.js 16 app with dark-mode operator console, SQLite database, API routes, and realistic seed data. This is a PE-grade agent platform demo for a meeting with Generative Capital (private equity firm).

## Repo Location
`/Users/taliashapiro/repos/talia-made/gencap-demo`

## Tech Stack
- Next.js 16 (App Router)
- TypeScript (strict)
- Tailwind CSS 4
- shadcn/ui components
- better-sqlite3 (synchronous)
- React Query (@tanstack/react-query)
- Recharts (for later phases)
- Lucide React (icons)

## CRITICAL CONSTRAINTS
- DO NOT use any deprecated APIs or packages
- DO NOT import anything from Mission Control — this is a SEPARATE repo
- DO NOT use GPT-4o or GPT-4o-mini anywhere — use claude-sonnet-4.5 as default model in seed data
- DO NOT create stub implementations — every API route must return real data from SQLite
- DO NOT add authentication — this is a demo, open access
- Use `better-sqlite3` (synchronous), NOT async sqlite libraries
- All timestamps are Unix milliseconds (Date.now() style)

## Phase 1: Scaffold (do this first)

### 1.1 Initialize Project
```bash
cd /Users/taliashapiro/repos/talia-made/gencap-demo
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack
```
If the directory isn't empty, handle accordingly (create in temp and move, or init manually).

### 1.2 Install Dependencies
```bash
npm install better-sqlite3 @tanstack/react-query recharts lucide-react date-fns clsx tailwind-merge class-variance-authority
npm install -D @types/better-sqlite3
```

### 1.3 Install shadcn/ui
```bash
npx shadcn@latest init
# Choose: New York style, Slate base color, CSS variables
npx shadcn@latest add button card badge dialog dropdown-menu input label scroll-area select separator skeleton table tabs textarea tooltip sheet
```

### 1.4 Database Setup
Create `src/lib/db.ts`:
```typescript
import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'data', 'gencap.db');
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}
```

### 1.5 Schema
Create `src/lib/schema.ts` that exports an `initializeDatabase()` function. Creates these tables:

```sql
CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('holding','portfolio')),
  parent_id TEXT,
  logo_url TEXT,
  industry TEXT,
  arr_millions REAL,
  employee_count INTEGER,
  created_at INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS agents (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('nrr','support','board_pack','pipeline')),
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','paused','deploying')),
  description TEXT,
  model TEXT DEFAULT 'claude-sonnet-4.5',
  config TEXT, -- JSON string
  total_runs INTEGER DEFAULT 0,
  total_decisions INTEGER DEFAULT 0,
  total_value_created REAL DEFAULT 0,
  accuracy_rate REAL DEFAULT 0,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (org_id) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS decisions (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('renewal_risk','expansion','support_resolution','board_insight','anomaly')),
  severity TEXT NOT NULL CHECK(severity IN ('critical','high','medium','low')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending','approved','rejected','escalated','auto_resolved')),
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  impact_dollars REAL,
  confidence REAL,
  evidence TEXT, -- JSON string
  recommended_action TEXT, -- JSON string
  action_preview TEXT, -- JSON string
  approved_by TEXT,
  approved_at INTEGER,
  due_date INTEGER,
  account_name TEXT,
  account_arr REAL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (org_id) REFERENCES organizations(id),
  FOREIGN KEY (agent_id) REFERENCES agents(id)
);

CREATE TABLE IF NOT EXISTS runs (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  agent_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('completed','running','failed')),
  trigger_type TEXT NOT NULL CHECK(trigger_type IN ('scheduled','manual','event')),
  started_at INTEGER NOT NULL,
  completed_at INTEGER,
  duration_ms INTEGER,
  steps TEXT, -- JSON string: array of step objects
  tools_used TEXT, -- JSON string
  tokens_used INTEGER,
  cost_usd REAL,
  decisions_created INTEGER DEFAULT 0,
  error TEXT,
  FOREIGN KEY (org_id) REFERENCES organizations(id),
  FOREIGN KEY (agent_id) REFERENCES agents(id)
);

CREATE TABLE IF NOT EXISTS audit_log (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  prev_hash TEXT,
  hash TEXT NOT NULL,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  details TEXT, -- JSON string
  created_at INTEGER NOT NULL,
  FOREIGN KEY (org_id) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS integrations (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('crm','support','data_warehouse','communication','project_mgmt','reporting')),
  status TEXT NOT NULL DEFAULT 'connected' CHECK(status IN ('connected','disconnected','error')),
  config TEXT, -- JSON string
  last_sync_at INTEGER,
  health_score REAL DEFAULT 1.0,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (org_id) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS kpi_snapshots (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  date TEXT NOT NULL,
  nrr_percent REAL,
  churn_rate_percent REAL,
  churn_prevented_dollars REAL,
  expansion_revenue REAL,
  support_deflection_rate REAL,
  support_cost_per_ticket REAL,
  avg_handle_time_minutes REAL,
  csat_score REAL,
  operator_hours_saved REAL,
  board_pack_hours REAL,
  agent_cost_total REAL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (org_id) REFERENCES organizations(id)
);

CREATE TABLE IF NOT EXISTS policies (
  id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('approval_required','auto_approve','two_person','budget_limit')),
  scope TEXT,
  rules TEXT, -- JSON string
  enabled INTEGER DEFAULT 1,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (org_id) REFERENCES organizations(id)
);
```

Also create indexes on org_id for all tables, and on (org_id, severity, status) for decisions.

### 1.6 Layout + Nav
Create the app layout with:

**Color scheme (globals.css):**
- Background: #0a0a0f (near-black)
- Card backgrounds: #111118 with #1a1a24 borders
- Primary accent: #3b82f6 (blue-500) for nav active states
- Emerald: #059669 for positive metrics
- Rose: #e11d48 for critical/risk
- Amber: #d97706 for warnings
- Text: white/zinc hierarchy

**Left nav (fixed, 256px wide):**
```
AGENT OS (logo area with a Shield icon)
powered by Arc Agency

OVERVIEW
  Dashboard (LayoutDashboard icon)
  Decision Inbox (Inbox icon)

FLEET  
  Agents (Bot icon)

INTELLIGENCE
  Analytics (BarChart3 icon)
  Audit Log (Shield icon)

PLATFORM
  Integrations (Plug icon)
  Policies (Lock icon)
```

**Top bar (above main content):**
- Left: Portfolio org selector dropdown (shows current org name, dropdown to switch)
- Center: Environment badge ("Demo Environment")
- Right: Budget meter ("$47 / $500 today") + notification bell (static)

**Main content area:** `ml-64 flex-1 p-6`

Create `src/components/layout/nav.tsx`, `src/components/layout/top-bar.tsx`, `src/components/layout/org-selector.tsx`

For the org selector, use React Context:
- `src/lib/hooks/use-org.tsx` — OrgProvider with context, stores selected org_id in localStorage
- Default to the first portfolio company (Smartsheet)

### 1.7 Providers
Create `src/lib/providers.tsx` with QueryClientProvider + OrgProvider wrapping children.

### 1.8 Utility Functions
Create `src/lib/utils.ts`:
- `cn()` for class merging (clsx + tailwind-merge)
- `formatCurrency(amount)` — "$1,234" or "$1.2M" for large numbers
- `formatPercent(value)` — "42.3%"
- `formatDuration(ms)` — "2.3s" or "4m 12s"
- `timeAgo(timestamp)` — "5 min ago" using date-fns
- `generateId()` — crypto.randomUUID()
- `hashEntry(prev, data)` — SHA-256 for audit chain

### 1.9 Ensure `data/` directory
Create `data/` directory with a `.gitkeep`. Add `data/*.db` to `.gitignore`.

### 1.10 Create API initialization
Create `src/lib/api-init.ts` that calls `initializeDatabase()` and is imported by the first API route hit. Or create a middleware that ensures DB is initialized.

---

## Phase 2: Seed Data Engine

Create `scripts/seed.ts` — a TypeScript script that populates the database with realistic GenCap demo data.

Run with: `npx tsx scripts/seed.ts`

Add to package.json scripts: `"seed": "tsx scripts/seed.ts"`

### Organizations (4)
```
GenCap Holdings — holding company, parent
  ├── Smartsheet — portfolio, $500M ARR, 3000 employees, Productivity Software
  ├── Acme SaaS Corp — portfolio, $80M ARR, 450 employees, Marketing Automation
  └── DataFlow Inc — portfolio, $35M ARR, 200 employees, Data Integration
```

### Agents (3 for Smartsheet — this is the default demo view)

**Agent 1: Renewal Guardian (NRR Agent)**
- type: nrr
- model: claude-sonnet-4.5
- total_runs: 147
- total_decisions: 73
- total_value_created: 847000
- accuracy_rate: 0.91
- config: { capabilities: ["salesforce_read", "zendesk_read", "analytics_read", "jira_write", "email_draft"], thresholds: { risk_score: 0.65, confidence_min: 0.7 }, schedule: "every_4_hours" }

**Agent 2: Support Sentinel (Support Agent)**
- type: support
- model: claude-sonnet-4.5
- total_runs: 312
- total_decisions: 189
- total_value_created: 234000
- accuracy_rate: 0.87
- config: { capabilities: ["zendesk_read", "zendesk_write", "kb_read", "kb_write"], auto_resolve_categories: ["password_reset", "billing_inquiry", "status_check", "feature_question"], escalation_threshold: 0.6 }

**Agent 3: Executive Lens (Board Pack Agent)**
- type: board_pack
- model: claude-sonnet-4.5
- total_runs: 12
- total_decisions: 8
- total_value_created: 0
- accuracy_rate: 0.95
- config: { capabilities: ["snowflake_read", "salesforce_read", "looker_read", "slides_write", "slack_write"], schedule: "weekly_monday", output_format: "google_slides" }

Also create 2 agents for Acme SaaS Corp and 2 for DataFlow Inc (smaller scale numbers).

### Decisions (50+ for Smartsheet)

Create a mix. Use realistic company names as accounts. Here are the 7 critical ones (VERY detailed evidence):

**Critical Decision 1:**
- title: "Acme Corp — Critical Renewal Risk"
- account_name: "Acme Corp", account_arr: 450000
- impact_dollars: 450000
- confidence: 0.92
- severity: critical
- type: renewal_risk
- summary: "Multi-signal risk detected: usage down 34% over 60 days, 3 open P1 support escalations, executive champion (VP of Operations Sarah Chen) departed 2 weeks ago. Renewal in 47 days."
- evidence (JSON array):
  - { source: "Salesforce", type: "renewal_date", detail: "Renewal: March 28, 2026. Contract value: $450,000/yr. 3-year customer." }
  - { source: "Product Analytics", type: "usage_decline", detail: "DAU dropped from 847 to 558 (-34%) over last 60 days. Feature adoption for new Automation module: 12% (vs 45% benchmark)." }
  - { source: "Zendesk", type: "escalations", detail: "3 open P1 tickets: #48291 (data export failures, 12 days open), #48456 (API rate limiting, 8 days open), #48501 (SSO intermittent failures, 5 days open)" }
  - { source: "Salesforce", type: "champion_change", detail: "VP of Operations Sarah Chen (primary champion) left company on Jan 28. New VP Marcus Rivera has no prior relationship with us." }
  - { source: "Billing", type: "payment_history", detail: "Last 2 invoices paid late (7 days, 12 days). Previously always on time." }
- recommended_action: { actions: [
    { type: "exec_outreach", detail: "Schedule executive meeting with Marcus Rivera (new VP Ops) within 1 week. Draft email prepared.", system: "email", requires_approval: true },
    { type: "support_escalation", detail: "Escalate 3 P1 tickets to Engineering Lead. Create Jira epic ACME-CRITICAL.", system: "jira", requires_approval: true },
    { type: "renewal_offer", detail: "Prepare 12% renewal discount ($396K) with 2-year lock-in. Within authorized discount range.", system: "salesforce", requires_approval: true },
    { type: "success_plan", detail: "Assign dedicated CSM for daily check-ins. Schedule Automation module training for team.", system: "internal", requires_approval: false }
  ]}
- action_preview: { changes: [
    { system: "Salesforce", field: "Opportunity.Risk_Level__c", from: "Medium", to: "Critical" },
    { system: "Salesforce", field: "Opportunity.Next_Step__c", from: "Standard renewal", to: "Executive save play" },
    { system: "Jira", action: "Create epic ACME-CRITICAL with 3 sub-tasks for P1 tickets" },
    { system: "Email", action: "Draft outreach to Marcus Rivera (VP Ops) — awaiting approval" }
  ]}

Create 6 more critical decisions with similar detail for:
- GlobalTech Industries ($380K ARR, usage stagnant, competitor evaluation detected)
- Meridian Health ($320K ARR, CSAT dropped, 5 unresolved tickets)
- NovaPay Solutions ($290K ARR, key integration deprecated, migration stalled)
- Vertex Analytics ($275K ARR, budget cuts announced, 2 power users left)
- Pinnacle Retail ($250K ARR, seasonal usage drop + late payments)
- Atlas Logistics ($220K ARR, champion promoted out of department)

Create 12 high-severity decisions (less detail, $100K-200K range, mix of renewal_risk and expansion)
Create 25 medium-severity decisions (brief, $30K-80K range, mix of types)
Create 6 approved/completed decisions (to show in analytics as success stories)

### Runs (100+ for Smartsheet)

For each of the 7 critical decisions, create a detailed run with 5-8 steps:

**Example run steps (JSON array) for the Acme Corp decision:**
```json
[
  { "step": 1, "type": "plan", "title": "Analyzing renewal risk signals", "detail": "Initiating multi-source risk assessment for accounts with renewals in next 90 days.", "duration_ms": 1200, "tokens": 450 },
  { "step": 2, "type": "tool_call", "title": "Salesforce: Pull renewal pipeline", "detail": "GET /api/opportunities?renewal_date_gte=2026-02-11&renewal_date_lte=2026-05-11 → 47 accounts returned", "duration_ms": 3400, "tokens": 0, "system": "salesforce" },
  { "step": 3, "type": "tool_call", "title": "Product Analytics: Usage trends", "detail": "GET /api/usage/trends?accounts=47&period=60d → 12 accounts with >20% decline flagged", "duration_ms": 2800, "tokens": 0, "system": "analytics" },
  { "step": 4, "type": "tool_call", "title": "Zendesk: Support health", "detail": "GET /api/tickets?accounts=12&status=open&priority=p1,p2 → 23 open escalations across flagged accounts", "duration_ms": 2100, "tokens": 0, "system": "zendesk" },
  { "step": 5, "type": "analysis", "title": "Cross-referencing signals", "detail": "Correlating usage decline + support escalations + billing patterns + champion changes. Scoring risk 0-100 per account.", "duration_ms": 8500, "tokens": 3200 },
  { "step": 6, "type": "tool_call", "title": "Salesforce: Champion verification", "detail": "GET /api/contacts?role=champion&accounts=12 → 3 accounts with champion departures in last 30 days", "duration_ms": 1900, "tokens": 0, "system": "salesforce" },
  { "step": 7, "type": "decision", "title": "Risk assessment complete", "detail": "7 accounts flagged as Critical (score >85), 5 as High (score 65-84). Total exposure: $2.4M ARR. Generating save plans.", "duration_ms": 6200, "tokens": 4100 },
  { "step": 8, "type": "output", "title": "Save plans generated", "detail": "Created 7 critical decisions with recommended actions. Drafts ready for human review in Decision Inbox.", "duration_ms": 4500, "tokens": 2800 }
]
```

Also create 90+ simpler runs (3-4 steps each) for support autoresolution and board pack generation across the past 90 days. Distribute them realistically — more runs on weekdays, fewer on weekends.

### KPI Snapshots (90 days for Smartsheet)

Generate daily snapshots showing clear improvement trends:

**Before agent deployment (day 1-30):** Baseline
- NRR: 104-106% (fluctuating)
- Churn rate: 2.0-2.3%
- Support deflection: 0%
- Cost per ticket: $18-22
- AHT: 25-30 min
- CSAT: 4.1-4.3
- Operator hours saved: 0
- Board pack hours: 35-40

**Agent deployment inflection (day 30):** Clearly visible

**After deployment (day 31-90):** Clear improvement trajectory
- NRR: 106% → 112% (steady climb)
- Churn rate: 2.1% → 1.4% (steady decline)
- Support deflection: 0% → 42% (rapid ramp weeks 1-4, then steady)
- Cost per ticket: $20 → $12
- AHT: 28min → 17min
- CSAT: 4.2 → 4.6
- Operator hours saved: 0 → 32/week (ramp)
- Board pack hours: 38 → 8
- Agent cost: $0 → ~$15-25/day (steady after deployment)

Add some natural noise/variation — don't make it perfectly smooth.

### Audit Log (200+ entries)

Generate hash-chained entries. The FIRST entry has prev_hash = null, hash = SHA-256("genesis"). Each subsequent entry: hash = SHA-256(prev_hash + action + resource_id + timestamp).

Mix of:
- decision.created (by agent)
- decision.approved (by human: "sarah.johnson@smartsheet.com", "mike.chen@gencap.ai")
- decision.rejected (occasional)
- agent.run.completed
- agent.run.failed (rare — 2-3 entries)
- integration.sync.completed
- policy.updated
- agent.config.updated

Spread across the 90-day period.

### Integrations (6 for Smartsheet)
- Salesforce (CRM) — connected, health 0.98, last sync 5 min ago
- Zendesk (Support) — connected, health 1.0, last sync 2 min ago
- Snowflake (Data Warehouse) — connected, health 0.95, last sync 1 hour ago
- Slack (Communication) — connected, health 1.0, last sync 30 sec ago
- Jira (Project Mgmt) — connected, health 0.97, last sync 10 min ago
- Google Slides (Reporting) — connected, health 1.0, last sync 3 days ago

### Policies (5 for Smartsheet)
1. "Customer Communications" — approval_required, scope: all, rules: { requires: "manager_approval", applies_to: ["email_draft", "slack_message"] }
2. "Discount Authorization" — two_person, scope: nrr, rules: { threshold_percent: 15, requires: "vp_approval_above_threshold" }
3. "Support Auto-Resolution" — auto_approve, scope: support, rules: { categories: ["password_reset", "billing_inquiry", "status_check"], confidence_min: 0.85 }
4. "Daily Agent Budget" — budget_limit, scope: all, rules: { max_daily_usd: 50, alert_at_percent: 80 }
5. "Board Pack Review" — approval_required, scope: board_pack, rules: { requires: "cfo_review", review_window_hours: 24 }

---

## API Routes to Create

### GET /api/organizations
Returns all orgs. Used by org selector.

### GET /api/agents?org_id=X
Returns agents for the selected org.

### GET /api/agents/[id]
Returns single agent with full details.

### GET /api/decisions?org_id=X&severity=X&status=X&agent_id=X
Returns decisions with optional filters. Supports pagination (limit, offset).

### GET /api/decisions/[id]
Returns single decision with full evidence.

### POST /api/decisions/[id]/approve
Body: { approved_by: string }
Updates status to 'approved', sets approved_at, creates audit entry.

### POST /api/decisions/[id]/reject
Body: { rejected_by: string, reason: string }
Updates status to 'rejected', creates audit entry.

### GET /api/runs?org_id=X&agent_id=X
Returns runs with optional filters.

### GET /api/runs/[id]
Returns single run with full step details.

### GET /api/analytics?org_id=X
Returns computed analytics: totals, trends, charts data.

### GET /api/audit?org_id=X&limit=50&offset=0
Returns audit log entries (newest first).

### GET /api/integrations?org_id=X
Returns integrations for org.

### GET /api/kpi?org_id=X&days=90
Returns KPI snapshots for org.

### GET /api/policies?org_id=X
Returns policies for org.

### GET /api/dashboard/summary?org_id=X
Returns dashboard data: KPI latest, decision counts by severity, agent stats, recent activity.

---

## Verification Checklist (after completion)

1. `npm run build` succeeds with zero errors
2. `npm run seed` populates database (check: `sqlite3 data/gencap.db "SELECT COUNT(*) FROM decisions"` should show 50+)
3. `npm run dev` starts without errors on port 3004
4. All API routes return valid JSON (test with curl)
5. Layout renders with nav, top bar, org selector
6. Org selector shows 3 portfolio companies
7. Home page (`/`) renders without errors (can be placeholder content for now, but layout must work)

## HANDOFF
After completing everything, create `WAVE1-HANDOFF.md` at repo root documenting:
- What was built
- File structure
- How to run (npm install, npm run seed, npm run dev)
- API routes with example responses
- Any decisions made or deviations from spec
- What Wave 2 agents need to know
