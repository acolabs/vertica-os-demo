import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { createHash, randomUUID } from 'crypto';

// ── Setup ──────────────────────────────────────────────────────────────────────
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'vertica.db');
if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);

const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

function hashEntry(prev: string | null, data: string): string {
  const input = (prev || '') + data;
  return createHash('sha256').update(input).digest('hex');
}

function uuid(): string {
  return randomUUID();
}

// ── Schema ─────────────────────────────────────────────────────────────────────
db.exec(`
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
    type TEXT NOT NULL CHECK(type IN ('revenue_cadence','support_deflection','nrr','pipeline')),
    status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active','paused','deploying')),
    description TEXT,
    model TEXT DEFAULT 'claude-sonnet-4.5',
    config TEXT,
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
    evidence TEXT,
    recommended_action TEXT,
    action_preview TEXT,
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
    steps TEXT,
    tools_used TEXT,
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
    details TEXT,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (org_id) REFERENCES organizations(id)
  );

  CREATE TABLE IF NOT EXISTS integrations (
    id TEXT PRIMARY KEY,
    org_id TEXT NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('crm','support','data_warehouse','communication','project_mgmt','reporting')),
    status TEXT NOT NULL DEFAULT 'connected' CHECK(status IN ('connected','disconnected','error')),
    config TEXT,
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
    rules TEXT,
    enabled INTEGER DEFAULT 1,
    created_at INTEGER NOT NULL,
    FOREIGN KEY (org_id) REFERENCES organizations(id)
  );

  CREATE INDEX IF NOT EXISTS idx_agents_org ON agents(org_id);
  CREATE INDEX IF NOT EXISTS idx_decisions_org ON decisions(org_id);
  CREATE INDEX IF NOT EXISTS idx_decisions_org_severity_status ON decisions(org_id, severity, status);
  CREATE INDEX IF NOT EXISTS idx_runs_org ON runs(org_id);
  CREATE INDEX IF NOT EXISTS idx_runs_agent ON runs(agent_id);
  CREATE INDEX IF NOT EXISTS idx_audit_org ON audit_log(org_id);
  CREATE INDEX IF NOT EXISTS idx_integrations_org ON integrations(org_id);
  CREATE INDEX IF NOT EXISTS idx_kpi_org ON kpi_snapshots(org_id);
  CREATE INDEX IF NOT EXISTS idx_kpi_org_date ON kpi_snapshots(org_id, date);
  CREATE INDEX IF NOT EXISTS idx_policies_org ON policies(org_id);
`);

console.log('✅ Schema created');

// ── Timestamps ─────────────────────────────────────────────────────────────────
const NOW = Date.now();
const DAY = 86400000;
const HOUR = 3600000;
const MINUTE = 60000;

function daysAgo(n: number): number { return NOW - n * DAY; }
function hoursAgo(n: number): number { return NOW - n * HOUR; }
function minutesAgo(n: number): number { return NOW - n * MINUTE; }
function noise(base: number, pct: number): number {
  return base + base * pct * (Math.random() * 2 - 1);
}

// ── Organizations ──────────────────────────────────────────────────────────────
const orgs = [
  { id: 'org_vertica', name: 'Vertica Capital Partners', type: 'holding', parent_id: null, industry: 'Private Equity', arr_millions: null, employee_count: 35, created_at: daysAgo(365) },
  { id: 'org_dsn', name: 'DSN Software', type: 'portfolio', parent_id: 'org_vertica', industry: 'Dental Practice Management', arr_millions: 15, employee_count: 150, created_at: daysAgo(365) },
  { id: 'org_campspot', name: 'Campspot', type: 'portfolio', parent_id: 'org_vertica', industry: 'Campground Management', arr_millions: 12, employee_count: 100, created_at: daysAgo(300) },
  { id: 'org_condocontrol', name: 'Condo Control', type: 'portfolio', parent_id: 'org_vertica', industry: 'HOA & Condo Management', arr_millions: 8, employee_count: 80, created_at: daysAgo(250) },
];

const insertOrg = db.prepare(`INSERT INTO organizations (id, name, type, parent_id, logo_url, industry, arr_millions, employee_count, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
for (const o of orgs) {
  insertOrg.run(o.id, o.name, o.type, o.parent_id, null, o.industry, o.arr_millions, o.employee_count, o.created_at);
}
console.log(`✅ ${orgs.length} organizations`);

// ── Agents ─────────────────────────────────────────────────────────────────────
const agents = [
  // DSN Software agents
  {
    id: 'agent_revenue_cadence', org_id: 'org_dsn', name: 'Revenue Cadence Agent', type: 'revenue_cadence' as const,
    status: 'active', description: 'Compiles daily sales operating cadence by aggregating pipeline data from Salesforce, call insights from Gong, and lead metrics from HubSpot. Generates rep-level coaching plans, identifies coverage gaps, and distributes actionable briefings to sales leadership. Targets: pipeline coverage ↑, stage conversion ↑, forecast accuracy ↑.',
    model: 'claude-sonnet-4.5', total_runs: 178, total_decisions: 84, total_value_created: 920000, accuracy_rate: 0.91,
    config: JSON.stringify({ capabilities: ["salesforce_read","hubspot_read","gong_read","outreach_write","slack_write"], thresholds: { coverage_gap: 3.0, stage_aging_days: 14 }, schedule: "daily_7am" }),
  },
  {
    id: 'agent_support_deflect', org_id: 'org_dsn', name: 'Support Autopilot', type: 'support_deflection' as const,
    status: 'active', description: 'Monitors the Zendesk ticket queue in real-time, auto-classifying incoming support tickets across dental practice categories (imaging, EDI claims, billing, scheduling). Resolves routine inquiries using knowledge base templates and escalates complex cases to specialists. Targets: deflection rate ↑, AHT ↓, cost-per-ticket ↓, CSAT ↑.',
    model: 'claude-sonnet-4.5', total_runs: 342, total_decisions: 205, total_value_created: 267000, accuracy_rate: 0.88,
    config: JSON.stringify({ capabilities: ["zendesk_read","zendesk_write","kb_read","kb_write"], auto_resolve_categories: ["password_reset","billing_inquiry","imaging_setup","edi_claim_status","scheduling_question"], escalation_threshold: 0.6 }),
  },
  {
    id: 'agent_nrr', org_id: 'org_dsn', name: 'Renewal & Expansion Guardian', type: 'nrr' as const,
    status: 'active', description: 'Runs multi-source renewal risk assessments every 4 hours by cross-referencing Salesforce pipeline data, product usage analytics, support ticket patterns, and billing signals. Scores each dental practice account 0-100 for churn risk and generates proactive save plans for high-risk accounts. Targets: NRR ↑, churn rate ↓, renewal rate ↑.',
    model: 'claude-sonnet-4.5', total_runs: 134, total_decisions: 67, total_value_created: 780000, accuracy_rate: 0.90,
    config: JSON.stringify({ capabilities: ["salesforce_read","zendesk_read","analytics_read","jira_write","email_draft"], thresholds: { risk_score: 0.65, confidence_min: 0.7 }, schedule: "every_4_hours" }),
  },
  // Campspot agents
  {
    id: 'agent_camp_revenue', org_id: 'org_campspot', name: 'Booking Revenue Optimizer', type: 'revenue_cadence' as const,
    status: 'active', description: 'Optimizes booking revenue across campground portfolios by analyzing seasonal demand patterns, competitor pricing, and occupancy forecasts. Identifies expansion opportunities, flags at-risk renewals, and recommends dynamic pricing adjustments for peak/off-peak seasons. Targets: booking revenue ↑, occupancy optimization, expansion ARR ↑.',
    model: 'claude-sonnet-4.5', total_runs: 95, total_decisions: 38, total_value_created: 345000, accuracy_rate: 0.89,
    config: JSON.stringify({ capabilities: ["hubspot_read","analytics_read","stripe_read","slack_write"], schedule: "daily_8am" }),
  },
  {
    id: 'agent_camp_support', org_id: 'org_campspot', name: 'Park Support Bot', type: 'support_deflection' as const,
    status: 'active', description: 'Handles campground operator support inquiries including reservation systems, OTA channel distribution, seasonal rate configuration, and POS integration. Auto-resolves common setup and configuration questions using campground-specific knowledge base. Targets: resolution time ↓, operator satisfaction ↑, ticket volume ↓.',
    model: 'claude-sonnet-4.5', total_runs: 167, total_decisions: 104, total_value_created: 95000, accuracy_rate: 0.85,
    config: JSON.stringify({ capabilities: ["intercom_read","intercom_write","kb_read"], auto_resolve_categories: ["reservation_lookup","payment_status","site_config","seasonal_pricing"], escalation_threshold: 0.65 }),
  },
  // Condo Control agents
  {
    id: 'agent_condo_pipeline', org_id: 'org_condocontrol', name: 'Property Pipeline Scout', type: 'pipeline' as const,
    status: 'active', description: 'Monitors the HOA and condo management sales pipeline, tracking property management company evaluations, competitive displacement risks, and expansion opportunities across managed buildings. Flags M&A activity and regulatory changes that could impact renewals. Targets: pipeline coverage ↑, competitive win rate ↑, expansion revenue ↑.',
    model: 'claude-sonnet-4.5', total_runs: 72, total_decisions: 25, total_value_created: 156000, accuracy_rate: 0.90,
    config: JSON.stringify({ capabilities: ["salesforce_read","analytics_read","slack_write"], schedule: "every_8_hours" }),
  },
  {
    id: 'agent_condo_support', org_id: 'org_condocontrol', name: 'Resident Support Agent', type: 'support_deflection' as const,
    status: 'deploying', description: 'Manages resident and property manager support requests including amenity booking, access control, payment processing, and portal configuration. Auto-resolves routine inquiries and escalates complex compliance or integration issues. Targets: resident satisfaction ↑, manager efficiency ↑, support cost ↓.',
    model: 'claude-sonnet-4.5', total_runs: 28, total_decisions: 14, total_value_created: 38000, accuracy_rate: 0.83,
    config: JSON.stringify({ capabilities: ["zendesk_read","zendesk_write","kb_read"], auto_resolve_categories: ["access_control","payment_inquiry","maintenance_status"], escalation_threshold: 0.7 }),
  },
];

const insertAgent = db.prepare(`INSERT INTO agents (id, org_id, name, type, status, description, model, config, total_runs, total_decisions, total_value_created, accuracy_rate, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
for (const a of agents) {
  insertAgent.run(a.id, a.org_id, a.name, a.type, a.status, a.description, a.model, a.config, a.total_runs, a.total_decisions, a.total_value_created, a.accuracy_rate, daysAgo(90), NOW);
}
console.log(`✅ ${agents.length} agents`);

// ── Decisions ──────────────────────────────────────────────────────────────────
const insertDecision = db.prepare(`INSERT INTO decisions (id, org_id, agent_id, type, severity, status, title, summary, impact_dollars, confidence, evidence, recommended_action, action_preview, approved_by, approved_at, due_date, account_name, account_arr, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

// 7 Critical Decisions — dental practices, campground operators, HOA management companies
const criticalDecisions = [
  {
    id: 'dec_crit_1', org_id: 'org_dsn', agent_id: 'agent_nrr', type: 'renewal_risk', severity: 'critical', status: 'pending',
    title: 'Bright Smile Dental Group — Critical Renewal Risk',
    summary: 'Multi-signal risk detected: active chair utilization down 28% over 60 days, 3 open P1 support escalations for imaging integration failures, executive champion (COO Dr. Sarah Chen) departed 2 weeks ago. Renewal in 47 days. 12-location group practice.',
    impact_dollars: 186000, confidence: 0.92,
    account_name: 'Bright Smile Dental Group', account_arr: 186000,
    due_date: daysAgo(-47),
    evidence: JSON.stringify([
      { source: "Salesforce", type: "renewal_date", detail: "Renewal: March 28, 2026. Contract value: $186,000/yr. 12-location group practice. 3-year customer." },
      { source: "Product Analytics", type: "usage_decline", detail: "Active chair utilization dropped from 847 to 610 (-28%) over last 60 days. Digital imaging module adoption: 12% (vs 45% benchmark for multi-location groups)." },
      { source: "Zendesk", type: "escalations", detail: "3 open P1 tickets: #48291 (DEXIS imaging bridge failures, 12 days open), #48456 (EDI claim rejection rate spiked 40%, 8 days open), #48501 (patient scheduling sync errors, 5 days open)" },
      { source: "Salesforce", type: "champion_change", detail: "COO Dr. Sarah Chen (primary champion) departed 2 weeks ago. New Operations Director Marcus Rivera has no prior relationship with DSN." },
      { source: "Billing", type: "payment_history", detail: "Last 2 invoices paid late (7 days, 12 days). Previously always on time." }
    ]),
    recommended_action: JSON.stringify({ actions: [
      { type: "exec_outreach", detail: "Schedule executive meeting with Marcus Rivera (new Ops Director) within 1 week. Draft email prepared.", system: "email", requires_approval: true },
      { type: "support_escalation", detail: "Escalate 3 P1 tickets to Engineering Lead. Create Jira epic BRIGHTSMILE-CRITICAL.", system: "jira", requires_approval: true },
      { type: "renewal_offer", detail: "Prepare 12% renewal discount ($163,680) with 2-year lock-in. Within authorized discount range.", system: "salesforce", requires_approval: true },
      { type: "success_plan", detail: "Assign dedicated CSM for daily check-ins. Schedule imaging module training for all 12 locations.", system: "internal", requires_approval: false }
    ]}),
    action_preview: JSON.stringify({ changes: [
      { system: "Salesforce", field: "Opportunity.Risk_Level__c", from: "Medium", to: "Critical" },
      { system: "Salesforce", field: "Opportunity.Next_Step__c", from: "Standard renewal", to: "Executive save play" },
      { system: "Jira", action: "Create epic BRIGHTSMILE-CRITICAL with 3 sub-tasks for P1 tickets" },
      { system: "Email", action: "Draft outreach to Marcus Rivera (Ops Director) — awaiting approval" }
    ]}),
    created_at: hoursAgo(3),
  },
  {
    id: 'dec_crit_2', org_id: 'org_dsn', agent_id: 'agent_nrr', type: 'renewal_risk', severity: 'critical', status: 'pending',
    title: 'Pacific Dental Partners — Competitive Displacement Risk',
    summary: 'Usage stagnant for 90 days across 8 locations. Sales intel detected active evaluation of Dentrix Ascend and Open Dental. Practice administrator downloaded competitor comparison guide. Renewal in 62 days.',
    impact_dollars: 142000, confidence: 0.88,
    account_name: 'Pacific Dental Partners', account_arr: 142000,
    due_date: daysAgo(-62),
    evidence: JSON.stringify([
      { source: "Salesforce", type: "renewal_date", detail: "Renewal: April 13, 2026. Contract value: $142,000/yr. 8-location DSO. 2-year customer." },
      { source: "Product Analytics", type: "usage_stagnant", detail: "DAU flat at 412 for 90 days across 8 practices. No growth despite 50 additional operatory licenses purchased in Q3." },
      { source: "Sales Intel", type: "competitor_eval", detail: "LinkedIn Sales Navigator: Practice Administrator David Park connected with Dentrix Ascend AE. Downloaded Dentrix vs DSN comparison on G2 (Jan 15)." },
      { source: "Product Analytics", type: "feature_gap", detail: "Top requested features: perio charting enhancements, patient communication portal. Both available but adoption at 8%." },
      { source: "Zendesk", type: "sentiment", detail: "CSAT score for this account dropped from 4.5 to 3.2 over last quarter. 2 negative survey responses citing 'clunky clinical workflow'." }
    ]),
    recommended_action: JSON.stringify({ actions: [
      { type: "exec_outreach", detail: "Request meeting with managing partner and practice admin. Prepare competitive differentiation deck.", system: "email", requires_approval: true },
      { type: "product_demo", detail: "Schedule personalized demo of perio charting + patient portal features they haven't adopted.", system: "calendar", requires_approval: true },
      { type: "renewal_offer", detail: "Prepare multi-year discount (15% for 3-year commitment = $120,700/yr).", system: "salesforce", requires_approval: true }
    ]}),
    action_preview: JSON.stringify({ changes: [
      { system: "Salesforce", field: "Opportunity.Risk_Level__c", from: "Low", to: "Critical" },
      { system: "Salesforce", field: "Opportunity.Competitive_Threat__c", from: null, to: "Dentrix Ascend, Open Dental" },
      { system: "Calendar", action: "Block CSM time for personalized demo prep" }
    ]}),
    created_at: hoursAgo(5),
  },
  {
    id: 'dec_crit_3', org_id: 'org_dsn', agent_id: 'agent_nrr', type: 'renewal_risk', severity: 'critical', status: 'pending',
    title: 'Aspen Ridge Dental Care — CSAT Crisis',
    summary: 'CSAT plummeted from 4.4 to 2.8 in 30 days. 5 unresolved P1/P2 tickets spanning clinical-critical workflows. Multi-specialty group with strict HIPAA SLA requirements. Renewal in 38 days.',
    impact_dollars: 128000, confidence: 0.94,
    account_name: 'Aspen Ridge Dental Care', account_arr: 128000,
    due_date: daysAgo(-38),
    evidence: JSON.stringify([
      { source: "Salesforce", type: "renewal_date", detail: "Renewal: March 19, 2026. Contract value: $128,000/yr. 6-location multi-specialty group. HIPAA BAA in place. 4-year customer." },
      { source: "Zendesk", type: "escalations", detail: "5 open tickets: #47892 (HIPAA audit trail gap in patient records, P1, 18 days), #48012 (X-ray image storage encryption error, P1, 14 days), #48234 (appointment scheduling failures, P2, 10 days), #48389 (insurance verification timeout, P2, 7 days), #48445 (eClinicalWorks bridge failures, P2, 5 days)" },
      { source: "Zendesk", type: "csat_drop", detail: "Account CSAT: 2.8 (was 4.4 thirty days ago). 3 surveys with score 1/5. Comments: 'Unacceptable for clinical practice', 'Patient data at risk'." },
      { source: "Salesforce", type: "exec_engagement", detail: "Managing Partner Dr. Rebecca Torres sent escalation email to our VP directly on Feb 3. No response logged." },
      { source: "Legal", type: "compliance", detail: "BAA requires 99.9% uptime on PHI-related features. Current incidents may trigger SLA penalty clause ($25K)." }
    ]),
    recommended_action: JSON.stringify({ actions: [
      { type: "exec_outreach", detail: "VP-to-Managing-Partner call within 24 hours. Acknowledge issues, present remediation timeline.", system: "email", requires_approval: true },
      { type: "support_escalation", detail: "Create P0 engineering sprint for all 5 tickets. Assign senior engineer dedicated to Aspen Ridge.", system: "jira", requires_approval: true },
      { type: "sla_credit", detail: "Proactively offer 1-month service credit ($10,667) for SLA breach.", system: "billing", requires_approval: true },
      { type: "success_plan", detail: "Weekly executive status calls until all P1s resolved.", system: "internal", requires_approval: false }
    ]}),
    action_preview: JSON.stringify({ changes: [
      { system: "Salesforce", field: "Opportunity.Risk_Level__c", from: "Medium", to: "Critical" },
      { system: "Jira", action: "Create P0 sprint 'Aspen Ridge Emergency' with 5 tickets" },
      { system: "Email", action: "Draft VP apology + remediation plan to Dr. Torres" }
    ]}),
    created_at: hoursAgo(2),
  },
  {
    id: 'dec_crit_4', org_id: 'org_campspot', agent_id: 'agent_camp_revenue', type: 'renewal_risk', severity: 'critical', status: 'pending',
    title: 'Great Lakes Campground Alliance — Seasonal Booking System Failure',
    summary: 'Critical booking engine integration deprecated in v3 API migration. Alliance\'s 22-park reservation system depends on it. Migration stalled at 15% completion. Peak season begins in 65 days.',
    impact_dollars: 94000, confidence: 0.89,
    account_name: 'Great Lakes Campground Alliance', account_arr: 94000,
    due_date: daysAgo(-55),
    evidence: JSON.stringify([
      { source: "Salesforce", type: "renewal_date", detail: "Renewal: April 5, 2026. Contract value: $94,000/yr. 22-park campground alliance. 2-year customer." },
      { source: "Product Analytics", type: "integration_health", detail: "Legacy booking API (deprecated) used 1,247 times/day by Great Lakes. v3 migration wizard started but abandoned at step 3/8. Only 15% of endpoints migrated." },
      { source: "Zendesk", type: "escalations", detail: "Ticket #48123: 'Legacy API sunset will break our entire reservation system across 22 parks right before peak season. Need migration support ASAP.' — Filed by their Operations Director directly." },
      { source: "Engineering", type: "deprecation_timeline", detail: "Legacy booking API sunset: March 31, 2026. No extension possible. 1,247 daily API calls will fail." },
      { source: "Product Analytics", type: "migration_blockers", detail: "3 custom rate configurations in Great Lakes' booking setup have no v3 equivalent. Requires engineering custom work." }
    ]),
    recommended_action: JSON.stringify({ actions: [
      { type: "engineering_support", detail: "Assign integration specialist for 2-week dedicated migration sprint. Build custom rate configuration mappers.", system: "jira", requires_approval: true },
      { type: "exec_outreach", detail: "VP-to-Operations Director call to present migration plan and timeline guarantee.", system: "email", requires_approval: true },
      { type: "renewal_offer", detail: "Offer free professional services package ($15K value) for migration assistance.", system: "salesforce", requires_approval: true }
    ]}),
    action_preview: JSON.stringify({ changes: [
      { system: "Jira", action: "Create epic 'Great Lakes Booking v3 Migration' with 8 stories" },
      { system: "Salesforce", field: "Opportunity.Risk_Level__c", from: "Low", to: "Critical" },
      { system: "Resource Planning", action: "Block integration specialist for 2-week engagement" }
    ]}),
    created_at: hoursAgo(6),
  },
  {
    id: 'dec_crit_5', org_id: 'org_campspot', agent_id: 'agent_camp_revenue', type: 'renewal_risk', severity: 'critical', status: 'pending',
    title: 'Mountain West RV Parks — Payment Gateway Crisis',
    summary: 'Stripe payment gateway integration failing for 3 of 14 parks. Reservation revenue down 23% this month. Owner threatening to switch to RMS. Renewal in 41 days.',
    impact_dollars: 72000, confidence: 0.86,
    account_name: 'Mountain West RV Parks', account_arr: 72000,
    due_date: daysAgo(-41),
    evidence: JSON.stringify([
      { source: "Salesforce", type: "renewal_date", detail: "Renewal: March 22, 2026. Contract value: $72,000/yr. 14-park RV network. 3-year customer." },
      { source: "Product Analytics", type: "payment_failures", detail: "Stripe payment processing failing at 3 parks: Yellowstone Gateway (38% failure rate), Glacier View (29%), Flathead Lake (22%). Combined reservation revenue down 23% this month." },
      { source: "Zendesk", type: "escalations", detail: "Ticket #48567: 'We are losing thousands of dollars in bookings every day. Guests are calling to complain they can\'t complete reservations online.' — Park owner Jim Bridger." },
      { source: "Sales Intel", type: "competitor_eval", detail: "Mountain West Operations Manager seen attending RMS Cloud webinar on LinkedIn. RMS rep confirmed outreach." },
      { source: "Email", type: "procurement_inquiry", detail: "Email from Mountain West finance (Jan 30): 'Please provide credit for lost revenue during payment outages and confirm this won\'t happen again.'" }
    ]),
    recommended_action: JSON.stringify({ actions: [
      { type: "exec_outreach", detail: "Schedule urgent call with park owner. Present payment issue root cause and resolution timeline.", system: "email", requires_approval: true },
      { type: "engineering_support", detail: "Emergency Stripe integration fix for all 3 affected parks. Target 24-hour resolution.", system: "jira", requires_approval: true },
      { type: "renewal_offer", detail: "Offer 2-month service credit ($12,000) for lost revenue during payment outages.", system: "salesforce", requires_approval: true }
    ]}),
    action_preview: JSON.stringify({ changes: [
      { system: "Salesforce", field: "Opportunity.Risk_Level__c", from: "Medium", to: "Critical" },
      { system: "Jira", action: "Create P0 'Mountain West Payment Emergency' sprint" },
      { system: "Email", action: "Draft owner apology + credit offer + resolution timeline" }
    ]}),
    created_at: hoursAgo(8),
  },
  {
    id: 'dec_crit_6', org_id: 'org_condocontrol', agent_id: 'agent_condo_pipeline', type: 'renewal_risk', severity: 'critical', status: 'pending',
    title: 'Harbor Point Property Management — Access Control Outage',
    summary: 'Key fob and gate access control integration down for 3 days across 8 buildings. 2,400 residents affected. Building managers escalating to property management CEO. Renewal in 33 days.',
    impact_dollars: 68000, confidence: 0.84,
    account_name: 'Harbor Point Property Management', account_arr: 68000,
    due_date: daysAgo(-33),
    evidence: JSON.stringify([
      { source: "Salesforce", type: "renewal_date", detail: "Renewal: March 14, 2026. Contract value: $68,000/yr. 8-building HOA complex. 2-year customer." },
      { source: "Product Analytics", type: "integration_failure", detail: "Access control bridge to HID system offline for 72 hours. Key fob provisioning, gate access, and visitor management all non-functional across 8 buildings. 2,400 residents impacted." },
      { source: "Zendesk", type: "escalations", detail: "14 tickets opened by building managers in 3 days. Ticket #48890: 'Residents are locked out of amenity areas. Board meeting called for emergency vendor review.' — Property Director." },
      { source: "Salesforce", type: "exec_engagement", detail: "CEO of Harbor Point PMC called our sales VP directly. Demanded resolution within 24 hours or 'we walk.'" },
      { source: "Zendesk", type: "support_volume", detail: "Support volume from this account up 700% in past 72 hours. All tickets access-control related." }
    ]),
    recommended_action: JSON.stringify({ actions: [
      { type: "engineering_support", detail: "Deploy on-site integration engineer within 24 hours. Emergency HID bridge restoration.", system: "jira", requires_approval: true },
      { type: "exec_outreach", detail: "VP Sales call with Harbor Point CEO to present remediation plan and SLA commitment.", system: "email", requires_approval: true },
      { type: "sla_credit", detail: "Offer 2-month service credit ($11,333) plus free HID bridge upgrade to redundant failover.", system: "salesforce", requires_approval: true }
    ]}),
    action_preview: JSON.stringify({ changes: [
      { system: "Salesforce", field: "Opportunity.Risk_Level__c", from: "Low", to: "Critical" },
      { system: "Jira", action: "Create P0 'Harbor Point Access Control Emergency'" },
      { system: "Resource Planning", action: "Deploy field engineer to Harbor Point within 24h" }
    ]}),
    created_at: hoursAgo(10),
  },
  {
    id: 'dec_crit_7', org_id: 'org_dsn', agent_id: 'agent_nrr', type: 'renewal_risk', severity: 'critical', status: 'pending',
    title: 'Smile Design Studios — Champion Departure',
    summary: 'Primary champion (IT Director) recruited away to a DSO using Dentrix. New IT lead has no DSN experience and previously administered Open Dental. Usage steady but political risk is high. Renewal in 52 days.',
    impact_dollars: 96000, confidence: 0.82,
    account_name: 'Smile Design Studios', account_arr: 96000,
    due_date: daysAgo(-52),
    evidence: JSON.stringify([
      { source: "Salesforce", type: "renewal_date", detail: "Renewal: April 2, 2026. Contract value: $96,000/yr. 5-location cosmetic dentistry group. 3-year customer." },
      { source: "Salesforce", type: "champion_change", detail: "IT Director Michael Torres recruited to a Dentrix-based DSO. New IT Lead: Jennifer Walsh, previously administered Open Dental at her prior practice group." },
      { source: "LinkedIn", type: "contact_intel", detail: "Jennifer Walsh: 4 years managing Open Dental at Premier Dental Group. Posted about 'modernizing practice technology' in new role — may want to bring familiar tools." },
      { source: "Product Analytics", type: "usage_stable", detail: "DAU: 189 (stable). But 67% of workflows and templates were created/managed by Michael Torres. Ownership transfer incomplete." },
      { source: "Salesforce", type: "engagement_gap", detail: "No executive engagement in 45 days. QBR scheduled for Feb 28 but new IT Lead hasn't confirmed attendance." }
    ]),
    recommended_action: JSON.stringify({ actions: [
      { type: "exec_outreach", detail: "Welcome package for Jennifer Walsh. Request introductory meeting with our VP of Customer Success.", system: "email", requires_approval: true },
      { type: "success_plan", detail: "Build personalized onboarding path comparing DSN vs Open Dental capabilities and migration benefits.", system: "internal", requires_approval: false },
      { type: "ownership_transfer", detail: "Migrate Michael Torres's 67% of clinical workflows to team ownership model.", system: "internal", requires_approval: false }
    ]}),
    action_preview: JSON.stringify({ changes: [
      { system: "Salesforce", field: "Opportunity.Risk_Level__c", from: "Low", to: "Critical" },
      { system: "Salesforce", field: "Contact.Primary_Champion__c", from: "Michael Torres", to: "Jennifer Walsh (pending)" },
      { system: "Email", action: "Draft welcome + intro meeting request to Jennifer Walsh" }
    ]}),
    created_at: hoursAgo(12),
  },
];

for (const d of criticalDecisions) {
  insertDecision.run(d.id, d.org_id, d.agent_id, d.type, d.severity, d.status, d.title, d.summary, d.impact_dollars, d.confidence, d.evidence, d.recommended_action, d.action_preview, null, null, d.due_date, d.account_name, d.account_arr, d.created_at);
}
console.log(`✅ ${criticalDecisions.length} critical decisions`);

// 12 High severity decisions
const highAccounts = [
  { name: 'Mountain View Dental Associates', arr: 78000, type: 'renewal_risk', agentId: 'agent_nrr', orgId: 'org_dsn', summary: 'Usage declining 18% over 45 days across 4 operatories. 2 open P2 tickets for EDI claim rejections. Office manager on PIP. Renewal in 68 days.' },
  { name: 'Great Outdoors Campground Group', arr: 65000, type: 'expansion', agentId: 'agent_camp_revenue', orgId: 'org_campspot', summary: 'Strong adoption across 9 parks (92% DAU). 3 newly acquired parks requesting onboarding. Expansion potential: $28K additional ARR.' },
  { name: 'Sunrise Property Management', arr: 52000, type: 'renewal_risk', agentId: 'agent_condo_pipeline', orgId: 'org_condocontrol', summary: 'CSAT declining from 4.1 to 3.4 across 12 managed buildings. Board president expressed frustration about resident portal limitations. Renewal in 74 days.' },
  { name: 'Lakeside Family Dentistry', arr: 48000, type: 'expansion', agentId: 'agent_nrr', orgId: 'org_dsn', summary: 'Successfully deployed in main practice (6 chairs). New satellite office (4 chairs) opening next month. Expansion potential: $22K additional ARR.' },
  { name: 'Pine Valley Camping Resort', arr: 55000, type: 'renewal_risk', agentId: 'agent_camp_revenue', orgId: 'org_campspot', summary: 'Competitor POC detected (Bonfire). Usage flat. No engagement from park owner in 60 days. Peak season approaching.' },
  { name: 'Summit HOA Services', arr: 46000, type: 'renewal_risk', agentId: 'agent_condo_pipeline', orgId: 'org_condocontrol', summary: 'New state regulation requiring updated payment processing compliance. Current implementation gaps may force platform switch.' },
  { name: 'Cascade Dental Group', arr: 62000, type: 'expansion', agentId: 'agent_nrr', orgId: 'org_dsn', summary: 'Orthodontics division adopted DSN independently. Consolidation opportunity across 3 specialty departments — ortho, perio, oral surgery.' },
  { name: 'Redwood National RV Resort', arr: 41000, type: 'renewal_risk', agentId: 'agent_camp_revenue', orgId: 'org_campspot', summary: 'Seasonal resort with off-season cash flow concerns. CFO reviewing all vendor contracts above $30K. Renewal in 82 days.' },
  { name: 'Coastal Living Properties', arr: 58000, type: 'expansion', agentId: 'agent_condo_pipeline', orgId: 'org_condocontrol', summary: 'Property manager driving 4x faster maintenance resolution with Condo Control. Requesting API access for custom owner portal.' },
  { name: 'Nordic Smile Dental Clinic', arr: 44000, type: 'renewal_risk', agentId: 'agent_nrr', orgId: 'org_dsn', summary: 'Canadian practice with data residency requirement. Current data center in US. Privacy audit upcoming.' },
  { name: 'Timber Creek Campgrounds', arr: 38000, type: 'expansion', agentId: 'agent_camp_revenue', orgId: 'org_campspot', summary: 'Glamping division wants to replicate traditional camping division\'s booking success. 50 potential new glamping sites to onboard.' },
  { name: 'Heritage Tower Condominiums', arr: 42000, type: 'renewal_risk', agentId: 'agent_condo_pipeline', orgId: 'org_condocontrol', summary: 'M&A announced — Heritage management company being acquired by Associa. Contract assignability clause may be triggered.' },
];

let highDecisionCount = 0;
for (let i = 0; i < highAccounts.length; i++) {
  const a = highAccounts[i];
  insertDecision.run(
    `dec_high_${i + 1}`, a.orgId, a.agentId, a.type, 'high', 'pending',
    `${a.name} — ${a.type === 'renewal_risk' ? 'Elevated Risk' : 'Expansion Opportunity'}`,
    a.summary, a.arr, 0.72 + Math.random() * 0.15,
    JSON.stringify([
      { source: "Salesforce", type: "account_data", detail: `Account ARR: $${a.arr.toLocaleString()}. ${a.type === 'renewal_risk' ? 'Renewal upcoming.' : 'Expansion opportunity identified.'}` },
      { source: "Product Analytics", type: "usage", detail: `Usage trends analyzed across ${Math.floor(50 + Math.random() * 200)} daily active users.` }
    ]),
    JSON.stringify({ actions: [{ type: "review", detail: "Detailed analysis and action plan required.", system: "internal", requires_approval: true }] }),
    null, null, null, daysAgo(-30 - Math.floor(Math.random() * 60)),
    a.name, a.arr, hoursAgo(12 + i * 4)
  );
  highDecisionCount++;
}
console.log(`✅ ${highDecisionCount} high decisions`);

// 25 Medium severity decisions
const mediumDecisions: { name: string; arr: number; type: string; agentId: string; orgId: string; summary: string }[] = [
  // DSN dental practice customers
  { name: 'Evergreen Family Dental', arr: 32000, type: 'renewal_risk', agentId: 'agent_nrr', orgId: 'org_dsn', summary: 'Minor usage dip (-8%) after front desk staff turnover. Single open P3 ticket for schedule template issue. Low overall risk but monitoring.' },
  { name: 'Apex Orthodontics', arr: 28000, type: 'expansion', agentId: 'agent_nrr', orgId: 'org_dsn', summary: 'Requesting 3 additional operatory licenses for new treatment rooms. Moderate expansion potential.' },
  { name: 'Redwood Pediatric Dentistry', arr: 24000, type: 'support_resolution', agentId: 'agent_support_deflect', orgId: 'org_dsn', summary: 'Auto-resolved 3 password reset tickets. Suggested KB article update for Dentrix-to-DSN migration guide.' },
  { name: 'ClearView Dental Imaging', arr: 36000, type: 'renewal_risk', agentId: 'agent_nrr', orgId: 'org_dsn', summary: 'Engagement score dropped from 7.2 to 5.8 after imaging module update. CSM should schedule check-in call.' },
  { name: 'Summit Dental Partners', arr: 42000, type: 'expansion', agentId: 'agent_nrr', orgId: 'org_dsn', summary: 'New associate dentist independently purchased 2 operatory licenses. Opportunity to consolidate under group agreement.' },
  { name: 'Gentle Care Dental', arr: 18000, type: 'support_resolution', agentId: 'agent_support_deflect', orgId: 'org_dsn', summary: 'Resolved billing dispute over proration when adding hygienist chair. Credit issued automatically per policy.' },
  { name: 'Premier Oral Surgery Center', arr: 45000, type: 'anomaly', agentId: 'agent_nrr', orgId: 'org_dsn', summary: 'Unusual spike in patient record exports (3x normal). Could indicate migration to competitor PMS or internal audit preparation.' },
  { name: 'Sunshine Smiles Pediatrics', arr: 22000, type: 'renewal_risk', agentId: 'agent_nrr', orgId: 'org_dsn', summary: 'School year effect: usage drops every summer when pediatric appointments decline. Currently in expected trough period.' },
  // Campspot campground customers
  { name: 'Blue Ridge Camping Co', arr: 26000, type: 'support_resolution', agentId: 'agent_camp_support', orgId: 'org_campspot', summary: 'Resolved API rate limiting issue for OTA channel distribution. Recommended batch booking endpoint. Response time: 4 minutes.' },
  { name: 'Frontier RV Village', arr: 19000, type: 'expansion', agentId: 'agent_camp_revenue', orgId: 'org_campspot', summary: 'New glamping section opening with 20 premium sites. Wants dynamic pricing module. Upsell opportunity.' },
  { name: 'Lakeshore Family Campground', arr: 15000, type: 'support_resolution', agentId: 'agent_camp_support', orgId: 'org_campspot', summary: 'Auto-resolved feature question about seasonal rate configuration. Linked to setup tutorial video.' },
  { name: 'Desert Oasis RV Resort', arr: 34000, type: 'renewal_risk', agentId: 'agent_camp_revenue', orgId: 'org_campspot', summary: 'Snowbird season winding down. Occupancy-based pricing needs reconfiguration for summer rates. Support request pending.' },
  { name: 'Northern Lights Camp Resort', arr: 28000, type: 'expansion', agentId: 'agent_camp_revenue', orgId: 'org_campspot', summary: 'Canadian park expanding from 80 to 140 sites. Need additional site management licenses and POS integration.' },
  { name: 'Riverbend Campground', arr: 12000, type: 'support_resolution', agentId: 'agent_camp_support', orgId: 'org_campspot', summary: 'Resolved 5 reservation lookup tickets automatically. All related to group booking confirmation emails.' },
  { name: 'Evergreen State Parks Alliance', arr: 48000, type: 'anomaly', agentId: 'agent_camp_revenue', orgId: 'org_campspot', summary: 'New admin added 30 park ranger accounts in one day without prior request. May indicate expansion across state park system (positive).' },
  // Condo Control HOA/property customers
  { name: 'Seaside Towers HOA', arr: 22000, type: 'support_resolution', agentId: 'agent_condo_support', orgId: 'org_condocontrol', summary: 'Auto-resolved billing inquiry about annual vs monthly assessment processing fees.' },
  { name: 'Metropolitan Living Corp', arr: 38000, type: 'renewal_risk', agentId: 'agent_condo_pipeline', orgId: 'org_condocontrol', summary: 'Property management industry consolidation. Client evaluating all-in-one platforms that may overlap with Condo Control features.' },
  { name: 'Parkview Estates Management', arr: 16000, type: 'expansion', agentId: 'agent_condo_pipeline', orgId: 'org_condocontrol', summary: 'London, ON office expansion managing 12 new condo buildings. Cross-region opportunity for 800 new units.' },
  { name: 'Oceanfront Condo Association', arr: 25000, type: 'support_resolution', agentId: 'agent_condo_support', orgId: 'org_condocontrol', summary: 'Resolved complex amenity booking conflict. Provided optimized pool/gym scheduling template for seasonal residents.' },
  { name: 'Greenfield HOA Partners', arr: 14000, type: 'renewal_risk', agentId: 'agent_condo_pipeline', orgId: 'org_condocontrol', summary: 'Small account but high NPS (9). Low risk. Monitoring for potential referral opportunity to sister management companies.' },
  { name: 'Harborview Condominiums', arr: 20000, type: 'support_resolution', agentId: 'agent_condo_support', orgId: 'org_condocontrol', summary: 'Resolved resident portal SSO configuration question. Linked to admin setup documentation.' },
  { name: 'Silverstone Property Group', arr: 34000, type: 'expansion', agentId: 'agent_condo_pipeline', orgId: 'org_condocontrol', summary: 'Portfolio company onboarding standardization. Potential to add 6 managed communities under enterprise agreement.' },
  { name: 'Alpine Village Condos', arr: 11000, type: 'support_resolution', agentId: 'agent_condo_support', orgId: 'org_condocontrol', summary: 'Resolved offline access question for on-site property managers. Recommended mobile app configuration.' },
  { name: 'Crown Heights Cooperative', arr: 29000, type: 'anomaly', agentId: 'agent_condo_pipeline', orgId: 'org_condocontrol', summary: 'API usage 5x above plan limits for board document generation. Likely automated integration. Should discuss enterprise API tier.' },
  { name: 'Bayfront Property Services', arr: 26000, type: 'expansion', agentId: 'agent_condo_pipeline', orgId: 'org_condocontrol', summary: 'Due diligence team expanding. Need secure external sharing for board packages. Premium tier upsell opportunity.' },
];

let medDecisionCount = 0;
for (let i = 0; i < mediumDecisions.length; i++) {
  const d = mediumDecisions[i];
  const statusOptions = ['pending', 'pending', 'pending', 'auto_resolved'];
  const status = d.type === 'support_resolution' ? 'auto_resolved' : statusOptions[Math.floor(Math.random() * statusOptions.length)];
  insertDecision.run(
    `dec_med_${i + 1}`, d.orgId, d.agentId,
    d.type as 'renewal_risk' | 'expansion' | 'support_resolution' | 'anomaly',
    'medium', status,
    `${d.name} — ${d.type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`,
    d.summary, d.arr, 0.65 + Math.random() * 0.2,
    JSON.stringify([{ source: "System", type: "auto_analysis", detail: d.summary }]),
    null, null,
    status === 'auto_resolved' ? d.agentId : null,
    status === 'auto_resolved' ? hoursAgo(12 + i * 2) : null,
    null, d.name, d.arr, hoursAgo(24 + i * 3)
  );
  medDecisionCount++;
}
console.log(`✅ ${medDecisionCount} medium decisions`);

// 6 Approved/completed decisions (success stories)
const successDecisions = [
  { name: 'Dental Care Network', arr: 156000, saved: 156000, agentId: 'agent_nrr', orgId: 'org_dsn', summary: 'Identified renewal risk 60 days before expiration. Executive save play recovered $156K 8-location dental group. Customer signed 3-year extension.' },
  { name: 'Yosemite Gateway Campgrounds', arr: 82000, saved: 82000, agentId: 'agent_camp_revenue', orgId: 'org_campspot', summary: 'Detected competitor evaluation early. Personalized booking optimization demo + pricing adjustment retained 15-park account with 2-year commitment.' },
  { name: 'Pinnacle Dental Associates', arr: 68000, saved: 68000, agentId: 'agent_nrr', orgId: 'org_dsn', summary: 'Champion departure detected. Successful transition to new practice administrator with tailored DSN onboarding program.' },
  { name: 'Riverside HOA Management', arr: 44000, saved: 44000, agentId: 'agent_condo_pipeline', orgId: 'org_condocontrol', summary: 'Payment issues flagged and resolved proactively. Flexible billing arrangement prevented churn for 6-building management company.' },
  { name: 'Family First Dental Group', arr: 92000, saved: 0, agentId: 'agent_nrr', orgId: 'org_dsn', summary: 'Expansion opportunity identified: 3 new practice locations adopted platform. ARR grew from $58K to $92K.' },
  { name: 'Wildwood Camping Resorts', arr: 36000, saved: 36000, agentId: 'agent_camp_support', orgId: 'org_campspot', summary: 'Auto-resolved 47 support tickets over 30 days, saving 23 hours of agent time. Park operator CSAT improved from 4.0 to 4.7.' },
];

for (let i = 0; i < successDecisions.length; i++) {
  const d = successDecisions[i];
  insertDecision.run(
    `dec_success_${i + 1}`, d.orgId, d.agentId,
    i === 4 ? 'expansion' : 'renewal_risk', i < 2 ? 'critical' : 'high', 'approved',
    `${d.name} — ${i === 4 ? 'Expansion Won' : 'Save Successful'}`,
    d.summary, d.arr, 0.88 + Math.random() * 0.1,
    JSON.stringify([{ source: "Outcome", type: "resolved", detail: d.summary }]),
    null, null,
    'sarah.johnson@dsnsoftware.com', daysAgo(5 + i * 7),
    null, d.name, d.arr, daysAgo(10 + i * 10)
  );
}
console.log(`✅ ${successDecisions.length} success decisions`);

// ── Runs ───────────────────────────────────────────────────────────────────────
const insertRun = db.prepare(`INSERT INTO runs (id, org_id, agent_id, status, trigger_type, started_at, completed_at, duration_ms, steps, tools_used, tokens_used, cost_usd, decisions_created, error) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

// 7 Detailed runs for critical decisions
const detailedRuns = [
  {
    id: 'run_crit_1', agent_id: 'agent_nrr', created_at: hoursAgo(3) - 30 * MINUTE,
    duration_ms: 30600, tokens_used: 11050, cost_usd: 2.45, decisions_created: 7,
    steps: JSON.stringify([
      { step: 1, type: "plan", title: "Analyzing renewal risk signals", detail: "Initiating multi-source risk assessment for dental practice accounts with renewals in next 90 days.", duration_ms: 1200, tokens: 450 },
      { step: 2, type: "tool_call", title: "Salesforce: Pull renewal pipeline", detail: "GET /api/opportunities?renewal_date_gte=2026-02-11&renewal_date_lte=2026-05-11 → 47 accounts returned", duration_ms: 3400, tokens: 0, system: "salesforce" },
      { step: 3, type: "tool_call", title: "Product Analytics: Usage trends", detail: "GET /api/usage/trends?accounts=47&period=60d → 12 accounts with >20% decline flagged", duration_ms: 2800, tokens: 0, system: "analytics" },
      { step: 4, type: "tool_call", title: "Zendesk: Support health", detail: "GET /api/tickets?accounts=12&status=open&priority=p1,p2 → 23 open escalations across flagged dental practices", duration_ms: 2100, tokens: 0, system: "zendesk" },
      { step: 5, type: "analysis", title: "Cross-referencing signals", detail: "Correlating chair utilization + imaging module adoption + EDI claim rates + billing patterns + champion changes. Scoring risk 0-100 per practice.", duration_ms: 8500, tokens: 3200 },
      { step: 6, type: "tool_call", title: "Salesforce: Champion verification", detail: "GET /api/contacts?role=champion&accounts=12 → 3 accounts with champion departures in last 30 days", duration_ms: 1900, tokens: 0, system: "salesforce" },
      { step: 7, type: "decision", title: "Risk assessment complete", detail: "7 accounts flagged as Critical (score >85), 5 as High (score 65-84). Total exposure: $786K ARR. Generating save plans.", duration_ms: 6200, tokens: 4100 },
      { step: 8, type: "output", title: "Save plans generated", detail: "Created 7 critical decisions with recommended actions. Drafts ready for human review in Decision Inbox.", duration_ms: 4500, tokens: 2800 }
    ]),
    tools_used: JSON.stringify(["salesforce","analytics","zendesk","jira"]),
  },
  {
    id: 'run_crit_2', agent_id: 'agent_support_deflect', created_at: hoursAgo(2) - 15 * MINUTE,
    duration_ms: 18400, tokens_used: 6800, cost_usd: 1.12, decisions_created: 3,
    steps: JSON.stringify([
      { step: 1, type: "plan", title: "Processing support ticket queue", detail: "Scanning 34 new tickets in DSN Zendesk instance.", duration_ms: 800, tokens: 320 },
      { step: 2, type: "tool_call", title: "Zendesk: Fetch new tickets", detail: "GET /api/tickets?status=new&created_after=4h → 34 tickets returned", duration_ms: 1800, tokens: 0, system: "zendesk" },
      { step: 3, type: "analysis", title: "Classifying tickets", detail: "Categorizing by type: 10 password resets, 7 billing inquiries, 6 imaging setup questions, 5 EDI claim status checks, 3 scheduling questions, 3 escalations.", duration_ms: 4200, tokens: 2400 },
      { step: 4, type: "tool_call", title: "KB: Fetching resolution templates", detail: "GET /api/kb/articles?categories=password,billing,imaging,edi,scheduling → 23 relevant articles", duration_ms: 1200, tokens: 0, system: "kb" },
      { step: 5, type: "output", title: "Auto-resolved 28 tickets", detail: "28/34 tickets resolved automatically. 3 escalated to dental integration specialists. 3 bug reports routed to engineering.", duration_ms: 6400, tokens: 3200 },
      { step: 6, type: "decision", title: "Escalation decisions created", detail: "Created 3 escalation decisions for complex imaging and EDI integration tickets requiring specialist judgment.", duration_ms: 4000, tokens: 880 }
    ]),
    tools_used: JSON.stringify(["zendesk","kb"]),
  },
  {
    id: 'run_crit_3', agent_id: 'agent_revenue_cadence', created_at: daysAgo(1),
    duration_ms: 124000, tokens_used: 28400, cost_usd: 3.85, decisions_created: 1,
    steps: JSON.stringify([
      { step: 1, type: "plan", title: "Compiling daily revenue cadence report", detail: "Gathering data for Week 6, 2026 sales performance and pipeline health.", duration_ms: 1500, tokens: 600 },
      { step: 2, type: "tool_call", title: "Salesforce: Revenue metrics", detail: "SELECT pipeline_value, weighted_pipeline, new_arr, expansion_arr FROM metrics WHERE week = 6 AND year = 2026 → Core pipeline data retrieved", duration_ms: 8200, tokens: 0, system: "salesforce" },
      { step: 3, type: "tool_call", title: "HubSpot: Pipeline snapshot", detail: "GET /api/pipeline/summary → $4.2M pipeline, 67% stage-weighted across dental practice prospects", duration_ms: 4600, tokens: 0, system: "hubspot" },
      { step: 4, type: "tool_call", title: "Gong: Call insights", detail: "GET /api/calls/insights?period=weekly → 23 discovery calls, 14 demos completed, key objection patterns identified", duration_ms: 12400, tokens: 0, system: "gong" },
      { step: 5, type: "analysis", title: "Cadence synthesis", detail: "Generating sales leader narrative from 47 data points across 3 systems. Identifying top 5 pipeline gaps and 3 coaching opportunities per rep.", duration_ms: 34000, tokens: 12000 },
      { step: 6, type: "tool_call", title: "Outreach: Sequence updates", detail: "Updating 8 prospect sequences with personalized next-best-actions based on stage aging analysis.", duration_ms: 45000, tokens: 0, system: "outreach" },
      { step: 7, type: "tool_call", title: "Slack: Notification", detail: "POST /api/chat.postMessage → #sales-leadership: 'Daily Revenue Cadence ready — 3 coverage gaps flagged'", duration_ms: 800, tokens: 0, system: "slack" },
      { step: 8, type: "decision", title: "Pipeline gap review required", detail: "Created pipeline decision for VP Sales review. 3 reps below 3x coverage threshold.", duration_ms: 17500, tokens: 15800 }
    ]),
    tools_used: JSON.stringify(["salesforce","hubspot","gong","outreach","slack"]),
  },
];

for (const r of detailedRuns) {
  const startedAt = r.created_at;
  const completedAt = startedAt + r.duration_ms;
  insertRun.run(r.id, 'org_dsn', r.agent_id, 'completed', 'scheduled', startedAt, completedAt, r.duration_ms, r.steps, r.tools_used, r.tokens_used, r.cost_usd, r.decisions_created, null);
}

// 4 more detailed runs for other critical decisions
const moreDetailedRuns = [
  { id: 'run_crit_4', agent_id: 'agent_nrr', created_at: hoursAgo(6), duration_ms: 25000, tokens_used: 8200, cost_usd: 1.95 },
  { id: 'run_crit_5', agent_id: 'agent_nrr', created_at: hoursAgo(8), duration_ms: 22000, tokens_used: 7400, cost_usd: 1.78 },
  { id: 'run_crit_6', agent_id: 'agent_camp_revenue', created_at: hoursAgo(10), duration_ms: 19000, tokens_used: 6800, cost_usd: 2.65 },
  { id: 'run_crit_7', agent_id: 'agent_nrr', created_at: hoursAgo(12), duration_ms: 21000, tokens_used: 7100, cost_usd: 1.84 },
];

for (const r of moreDetailedRuns) {
  const orgId = r.agent_id.startsWith('agent_camp') ? 'org_campspot' : 'org_dsn';
  const steps = JSON.stringify([
    { step: 1, type: "plan", title: "Renewal risk scan", detail: "Initiating focused risk assessment.", duration_ms: 900, tokens: 350 },
    { step: 2, type: "tool_call", title: "Salesforce: Account data", detail: "Pulling account details and renewal timeline.", duration_ms: 2800, tokens: 0, system: "salesforce" },
    { step: 3, type: "analysis", title: "Signal correlation", detail: "Analyzing usage, support, billing, and engagement signals.", duration_ms: 8000, tokens: 3200 },
    { step: 4, type: "decision", title: "Risk decision generated", detail: "Critical risk detected. Save plan generated.", duration_ms: 5000, tokens: 2400 }
  ]);
  insertRun.run(r.id, orgId, r.agent_id, 'completed', 'scheduled', r.created_at, r.created_at + r.duration_ms, r.duration_ms, steps, JSON.stringify(["salesforce","analytics","zendesk"]), r.tokens_used, r.cost_usd, 1, null);
}

// 90+ simpler runs over 90 days
let simpleRunCount = 0;
for (let day = 0; day < 90; day++) {
  const isWeekend = new Date(daysAgo(day)).getDay() % 6 === 0;
  
  // NRR agent runs (every 4 hours on weekdays, twice on weekends)
  const nrrRunsPerDay = isWeekend ? 2 : 6;
  for (let r = 0; r < nrrRunsPerDay; r++) {
    if (day < 60 && Math.random() < 0.4) continue; // Skip some early runs for realism
    const runId = `run_nrr_d${day}_r${r}`;
    const startedAt = daysAgo(day) + r * 4 * HOUR + Math.floor(Math.random() * HOUR);
    const duration = 15000 + Math.floor(Math.random() * 20000);
    const tokens = 3000 + Math.floor(Math.random() * 5000);
    const cost = 1.0 + Math.random() * 2.0; // $1-3 per NRR/renewal run
    const decisions = Math.random() < 0.15 ? Math.floor(1 + Math.random() * 3) : 0;
    const status = Math.random() < 0.02 ? 'failed' : 'completed';
    const steps = JSON.stringify([
      { step: 1, type: "plan", title: "Scheduled renewal scan", detail: "Routine 4-hour renewal risk check.", duration_ms: 800, tokens: 300 },
      { step: 2, type: "tool_call", title: "Salesforce: Pipeline check", detail: `Scanned ${30 + Math.floor(Math.random() * 20)} dental practice accounts.`, duration_ms: 2500, tokens: 0 },
      { step: 3, type: "analysis", title: "Risk scoring", detail: `${decisions} accounts flagged for review.`, duration_ms: 6000, tokens: 2000 },
    ]);
    insertRun.run(runId, 'org_dsn', 'agent_nrr', status, 'scheduled', startedAt, startedAt + duration, duration, steps, JSON.stringify(["salesforce","analytics"]), tokens, cost, decisions, status === 'failed' ? 'Salesforce API timeout after 30s' : null);
    simpleRunCount++;
  }

  // Support agent runs (more frequent — every 2 hours on weekdays)
  if (day < 60) continue; // Support agent deployed at day 30 (i.e. daysAgo(60))
  const supportRunsPerDay = isWeekend ? 3 : 12;
  for (let r = 0; r < supportRunsPerDay; r++) {
    if (Math.random() < 0.2) continue;
    const runId = `run_support_d${day}_r${r}`;
    const startedAt = daysAgo(day) + r * 2 * HOUR + Math.floor(Math.random() * HOUR);
    const duration = 8000 + Math.floor(Math.random() * 12000);
    const tokens = 1500 + Math.floor(Math.random() * 3000);
    const cost = 0.50 + Math.random() * 1.0; // $0.50-1.50 per support deflection run
    const resolved = Math.floor(1 + Math.random() * 5);
    const steps = JSON.stringify([
      { step: 1, type: "tool_call", title: "Zendesk: New tickets", detail: `Fetched ${resolved + Math.floor(Math.random() * 3)} new dental support tickets.`, duration_ms: 1200, tokens: 0 },
      { step: 2, type: "analysis", title: "Classification", detail: `Classified tickets: imaging, EDI, scheduling, billing. ${resolved} auto-resolvable.`, duration_ms: 3000, tokens: 1200 },
      { step: 3, type: "output", title: "Tickets resolved", detail: `Auto-resolved ${resolved} tickets.`, duration_ms: 2000, tokens: 800 },
    ]);
    insertRun.run(runId, 'org_dsn', 'agent_support_deflect', 'completed', 'scheduled', startedAt, startedAt + duration, duration, steps, JSON.stringify(["zendesk","kb"]), tokens, cost, 0, null);
    simpleRunCount++;
  }

  // Revenue cadence runs (daily on weekdays)
  if (new Date(daysAgo(day)).getDay() !== 0 && new Date(daysAgo(day)).getDay() !== 6 && day >= 60) {
    const runId = `run_cadence_d${day}`;
    const startedAt = daysAgo(day) + 7 * HOUR; // 7am daily
    const duration = 90000 + Math.floor(Math.random() * 60000);
    const tokens = 20000 + Math.floor(Math.random() * 10000);
    const cost = 2.0 + Math.random() * 3.0; // $2-5 per revenue cadence run (heavy)
    const steps = JSON.stringify([
      { step: 1, type: "tool_call", title: "Salesforce: Pipeline data", detail: "Pulling daily pipeline metrics and rep activity.", duration_ms: 6000, tokens: 0 },
      { step: 2, type: "tool_call", title: "HubSpot: Lead flow", detail: "Pulling inbound lead metrics and conversion rates.", duration_ms: 4000, tokens: 0 },
      { step: 3, type: "analysis", title: "Cadence synthesis", detail: "Generating daily operating cadence with coverage gaps and coaching prompts.", duration_ms: 30000, tokens: 12000 },
      { step: 4, type: "tool_call", title: "Slack: Distribution", detail: "Posting cadence report to #sales-leadership.", duration_ms: 2000, tokens: 0 },
    ]);
    insertRun.run(runId, 'org_dsn', 'agent_revenue_cadence', 'completed', 'scheduled', startedAt, startedAt + duration, duration, steps, JSON.stringify(["salesforce","hubspot","gong","outreach","slack"]), tokens, cost, 1, null);
    simpleRunCount++;
  }
}

// Campspot agent runs (deployed 45 days ago)
let campRunCount = 0;
for (let day = 0; day < 45; day++) {
  const isWeekend = new Date(daysAgo(day)).getDay() % 6 === 0;

  // agent_camp_revenue runs (every 6 hours)
  const campRevenuePerDay = isWeekend ? 2 : 4;
  for (let r = 0; r < campRevenuePerDay; r++) {
    if (Math.random() < 0.15) continue;
    const runId = `run_camp_rev_d${day}_r${r}`;
    const startedAt = daysAgo(day) + r * 6 * HOUR + Math.floor(Math.random() * HOUR);
    const duration = 60000 + Math.floor(Math.random() * 60000);
    const tokens = 15000 + Math.floor(Math.random() * 10000);
    const cost = 2.0 + Math.random() * 3.0; // $2-5 per revenue run
    const decisions = Math.random() < 0.12 ? Math.floor(1 + Math.random() * 2) : 0;
    const status = Math.random() < 0.02 ? 'failed' : 'completed';
    const steps = JSON.stringify([
      { step: 1, type: "tool_call", title: "Salesforce: Booking pipeline", detail: `Scanned ${20 + Math.floor(Math.random() * 15)} campground accounts.`, duration_ms: 5000, tokens: 0 },
      { step: 2, type: "tool_call", title: "Google Analytics: Booking trends", detail: "Pulling seasonal booking and occupancy data.", duration_ms: 3500, tokens: 0 },
      { step: 3, type: "analysis", title: "Revenue optimization", detail: `Analyzing pricing and utilization patterns. ${decisions} accounts flagged.`, duration_ms: 20000, tokens: 8000 },
      { step: 4, type: "tool_call", title: "Slack: Alerts", detail: "Posting revenue insights to #campspot-ops.", duration_ms: 1500, tokens: 0 },
    ]);
    insertRun.run(runId, 'org_campspot', 'agent_camp_revenue', status, 'scheduled', startedAt, startedAt + duration, duration, steps, JSON.stringify(["salesforce","analytics","slack"]), tokens, cost, decisions, status === 'failed' ? 'Analytics API timeout' : null);
    campRunCount++;
  }

  // agent_camp_support runs (every 3 hours)
  const campSupportPerDay = isWeekend ? 4 : 8;
  for (let r = 0; r < campSupportPerDay; r++) {
    if (Math.random() < 0.15) continue;
    const runId = `run_camp_sup_d${day}_r${r}`;
    const startedAt = daysAgo(day) + r * 3 * HOUR + Math.floor(Math.random() * HOUR);
    const duration = 8000 + Math.floor(Math.random() * 12000);
    const tokens = 1500 + Math.floor(Math.random() * 3000);
    const cost = 0.50 + Math.random() * 1.0; // $0.50-1.50 per support run
    const resolved = Math.floor(1 + Math.random() * 4);
    const steps = JSON.stringify([
      { step: 1, type: "tool_call", title: "Intercom: New conversations", detail: `Fetched ${resolved + Math.floor(Math.random() * 3)} new campground support tickets.`, duration_ms: 1200, tokens: 0 },
      { step: 2, type: "analysis", title: "Classification", detail: `Classified: reservations, payments, site config, pricing. ${resolved} auto-resolvable.`, duration_ms: 3000, tokens: 1200 },
      { step: 3, type: "output", title: "Tickets resolved", detail: `Auto-resolved ${resolved} tickets.`, duration_ms: 2000, tokens: 800 },
    ]);
    insertRun.run(runId, 'org_campspot', 'agent_camp_support', 'completed', 'scheduled', startedAt, startedAt + duration, duration, steps, JSON.stringify(["intercom","kb"]), tokens, cost, 0, null);
    campRunCount++;
  }
}

// Condo Control agent runs (deployed 30 days ago)
let condoRunCount = 0;
for (let day = 0; day < 30; day++) {
  const isWeekend = new Date(daysAgo(day)).getDay() % 6 === 0;

  // agent_condo_pipeline runs (every 8 hours)
  const condoPipelinePerDay = isWeekend ? 1 : 3;
  for (let r = 0; r < condoPipelinePerDay; r++) {
    if (Math.random() < 0.15) continue;
    const runId = `run_condo_pipe_d${day}_r${r}`;
    const startedAt = daysAgo(day) + r * 8 * HOUR + Math.floor(Math.random() * HOUR);
    const duration = 30000 + Math.floor(Math.random() * 40000);
    const tokens = 8000 + Math.floor(Math.random() * 8000);
    const cost = 1.0 + Math.random() * 1.0; // $1-2 per pipeline run
    const decisions = Math.random() < 0.10 ? 1 : 0;
    const status = Math.random() < 0.03 ? 'failed' : 'completed';
    const steps = JSON.stringify([
      { step: 1, type: "tool_call", title: "HubSpot: Pipeline scan", detail: `Scanned ${15 + Math.floor(Math.random() * 10)} property management leads.`, duration_ms: 4000, tokens: 0 },
      { step: 2, type: "analysis", title: "Opportunity scoring", detail: `Scoring expansion opportunities across HOA accounts. ${decisions} flagged.`, duration_ms: 12000, tokens: 5000 },
      { step: 3, type: "tool_call", title: "Slack: Updates", detail: "Posting pipeline insights to #condocontrol-sales.", duration_ms: 1000, tokens: 0 },
    ]);
    insertRun.run(runId, 'org_condocontrol', 'agent_condo_pipeline', status, 'scheduled', startedAt, startedAt + duration, duration, steps, JSON.stringify(["hubspot","analytics","slack"]), tokens, cost, decisions, status === 'failed' ? 'HubSpot rate limit exceeded' : null);
    condoRunCount++;
  }

  // agent_condo_support runs (every 4 hours)
  const condoSupportPerDay = isWeekend ? 3 : 6;
  for (let r = 0; r < condoSupportPerDay; r++) {
    if (Math.random() < 0.2) continue;
    const runId = `run_condo_sup_d${day}_r${r}`;
    const startedAt = daysAgo(day) + r * 4 * HOUR + Math.floor(Math.random() * HOUR);
    const duration = 8000 + Math.floor(Math.random() * 10000);
    const tokens = 1500 + Math.floor(Math.random() * 2500);
    const cost = 0.50 + Math.random() * 1.0; // $0.50-1.50 per support run
    const resolved = Math.floor(1 + Math.random() * 3);
    const steps = JSON.stringify([
      { step: 1, type: "tool_call", title: "Zendesk: New tickets", detail: `Fetched ${resolved + Math.floor(Math.random() * 2)} new property management tickets.`, duration_ms: 1200, tokens: 0 },
      { step: 2, type: "analysis", title: "Classification", detail: `Classified: access control, payments, maintenance. ${resolved} auto-resolvable.`, duration_ms: 3000, tokens: 1000 },
      { step: 3, type: "output", title: "Tickets resolved", detail: `Auto-resolved ${resolved} tickets.`, duration_ms: 2000, tokens: 700 },
    ]);
    insertRun.run(runId, 'org_condocontrol', 'agent_condo_support', 'completed', 'scheduled', startedAt, startedAt + duration, duration, steps, JSON.stringify(["zendesk","kb"]), tokens, cost, 0, null);
    condoRunCount++;
  }
}

console.log(`✅ ${detailedRuns.length + moreDetailedRuns.length + simpleRunCount + campRunCount + condoRunCount} runs total`);

// ── KPI Snapshots (90 days for DSN Software) ───────────────────────────────────
const insertKpi = db.prepare(`INSERT INTO kpi_snapshots (id, org_id, date, nrr_percent, churn_rate_percent, churn_prevented_dollars, expansion_revenue, support_deflection_rate, support_cost_per_ticket, avg_handle_time_minutes, csat_score, operator_hours_saved, board_pack_hours, agent_cost_total, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

let kpiCount = 0;
for (let day = 89; day >= 0; day--) {
  const date = new Date(daysAgo(day));
  const dateStr = date.toISOString().split('T')[0];
  const progress = (89 - day) / 89; // 0 to 1 over 90 days
  const deploymentDay = 60; // Agents deployed at day 60 from end (i.e. daysAgo(60))
  const isPostDeployment = day < deploymentDay;
  const postDeployProgress = isPostDeployment ? (deploymentDay - day) / deploymentDay : 0;
  const n = () => (Math.random() - 0.5) * 2; // noise -1 to 1

  let nrr: number, churn: number, deflection: number, costPerTicket: number;
  let aht: number, csat: number, hoursSaved: number, boardPackHours: number, agentCost: number;
  let churnPrevented: number, expansionRevenue: number;

  if (!isPostDeployment) {
    // Pre-deployment baseline (days 89 down to 60)
    nrr = 104 + n() * 1.5;
    churn = 2.0 + n() * 0.2;
    deflection = 0;
    costPerTicket = 19 + n() * 2;
    aht = 27 + n() * 3;
    csat = 4.15 + n() * 0.15;
    hoursSaved = 0;
    boardPackHours = 37 + n() * 3;
    agentCost = 0;
    churnPrevented = 0;
    expansionRevenue = 50000 + n() * 20000;
  } else {
    // Post-deployment improvement (days 59 down to 0)
    const ramp = Math.min(postDeployProgress * 1.5, 1); // Rapid ramp then plateau
    nrr = 106 + ramp * 6 + n() * 0.8;
    churn = 2.1 - ramp * 0.7 + n() * 0.1;
    deflection = ramp * 42 + n() * 3;
    costPerTicket = 20 - ramp * 8 + n() * 1;
    aht = 28 - ramp * 11 + n() * 1.5;
    csat = 4.2 + ramp * 0.4 + n() * 0.05;
    hoursSaved = ramp * 32 + n() * 2;
    boardPackHours = 38 - ramp * 30 + n() * 2;
    agentCost = 80 + ramp * 70 + n() * 15; // $80-150/day for 3 agents running
    churnPrevented = ramp * 45000 + n() * 10000;
    expansionRevenue = 50000 + ramp * 80000 + n() * 15000;
  }

  // Clamp values
  churn = Math.max(0.8, churn);
  deflection = Math.max(0, deflection);
  costPerTicket = Math.max(8, costPerTicket);
  aht = Math.max(14, aht);
  csat = Math.min(5, Math.max(3.5, csat));
  hoursSaved = Math.max(0, hoursSaved);
  boardPackHours = Math.max(6, boardPackHours);
  agentCost = Math.max(0, agentCost);
  churnPrevented = Math.max(0, churnPrevented);

  insertKpi.run(
    `kpi_dsn_${dateStr}`, 'org_dsn', dateStr,
    Math.round(nrr * 10) / 10,
    Math.round(churn * 100) / 100,
    Math.round(churnPrevented),
    Math.round(expansionRevenue),
    Math.round(deflection * 10) / 10,
    Math.round(costPerTicket * 100) / 100,
    Math.round(aht * 10) / 10,
    Math.round(csat * 100) / 100,
    Math.round(hoursSaved * 10) / 10,
    Math.round(boardPackHours * 10) / 10,
    Math.round(agentCost * 100) / 100,
    daysAgo(day) + 23 * HOUR
  );
  kpiCount++;
}
// Campspot KPI snapshots (90 days, deployed 45 days ago)
for (let day = 89; day >= 0; day--) {
  const date = new Date(daysAgo(day));
  const dateStr = date.toISOString().split('T')[0];
  const deploymentDay = 45;
  const isPostDeployment = day < deploymentDay;
  const postDeployProgress = isPostDeployment ? (deploymentDay - day) / deploymentDay : 0;
  const n = () => (Math.random() - 0.5) * 2;

  let nrr: number, churn: number, deflection: number, costPerTicket: number;
  let aht: number, csat: number, hoursSaved: number, boardPackHours: number, agentCost: number;
  let churnPrevented: number, expansionRevenue: number;

  if (!isPostDeployment) {
    nrr = 108 + n() * 1.5;
    churn = 1.6 + n() * 0.15;
    deflection = 0;
    costPerTicket = 15 + n() * 1.5;
    aht = 22 + n() * 2;
    csat = 4.25 + n() * 0.12;
    hoursSaved = 0;
    boardPackHours = 28 + n() * 3;
    agentCost = 0;
    churnPrevented = 0;
    expansionRevenue = 40000 + n() * 15000;
  } else {
    const ramp = Math.min(postDeployProgress * 1.5, 1);
    nrr = 108 + ramp * 6 + n() * 0.8;
    churn = 1.6 - ramp * 0.5 + n() * 0.08;
    deflection = ramp * 38 + n() * 3;
    costPerTicket = 15 - ramp * 6 + n() * 1;
    aht = 22 - ramp * 8 + n() * 1.5;
    csat = 4.25 + ramp * 0.35 + n() * 0.05;
    hoursSaved = ramp * 24 + n() * 2;
    boardPackHours = 28 - ramp * 20 + n() * 2;
    agentCost = 50 + ramp * 50 + n() * 12; // $50-100/day for 2 agents
    churnPrevented = ramp * 30000 + n() * 8000;
    expansionRevenue = 40000 + ramp * 60000 + n() * 12000;
  }

  churn = Math.max(0.8, churn);
  deflection = Math.max(0, deflection);
  costPerTicket = Math.max(7, costPerTicket);
  aht = Math.max(12, aht);
  csat = Math.min(5, Math.max(3.5, csat));
  hoursSaved = Math.max(0, hoursSaved);
  boardPackHours = Math.max(5, boardPackHours);
  agentCost = Math.max(0, agentCost);
  churnPrevented = Math.max(0, churnPrevented);

  insertKpi.run(
    `kpi_camp_${dateStr}`, 'org_campspot', dateStr,
    Math.round(nrr * 10) / 10,
    Math.round(churn * 100) / 100,
    Math.round(churnPrevented),
    Math.round(expansionRevenue),
    Math.round(deflection * 10) / 10,
    Math.round(costPerTicket * 100) / 100,
    Math.round(aht * 10) / 10,
    Math.round(csat * 100) / 100,
    Math.round(hoursSaved * 10) / 10,
    Math.round(boardPackHours * 10) / 10,
    Math.round(agentCost * 100) / 100,
    daysAgo(day) + 23 * HOUR
  );
  kpiCount++;
}

// Condo Control KPI snapshots (90 days, deployed 30 days ago)
for (let day = 89; day >= 0; day--) {
  const date = new Date(daysAgo(day));
  const dateStr = date.toISOString().split('T')[0];
  const deploymentDay = 30;
  const isPostDeployment = day < deploymentDay;
  const postDeployProgress = isPostDeployment ? (deploymentDay - day) / deploymentDay : 0;
  const n = () => (Math.random() - 0.5) * 2;

  let nrr: number, churn: number, deflection: number, costPerTicket: number;
  let aht: number, csat: number, hoursSaved: number, boardPackHours: number, agentCost: number;
  let churnPrevented: number, expansionRevenue: number;

  if (!isPostDeployment) {
    nrr = 102 + n() * 1.2;
    churn = 2.4 + n() * 0.2;
    deflection = 0;
    costPerTicket = 22 + n() * 2;
    aht = 30 + n() * 3;
    csat = 4.0 + n() * 0.15;
    hoursSaved = 0;
    boardPackHours = 32 + n() * 3;
    agentCost = 0;
    churnPrevented = 0;
    expansionRevenue = 25000 + n() * 10000;
  } else {
    const ramp = Math.min(postDeployProgress * 1.5, 1);
    nrr = 102 + ramp * 5 + n() * 0.8;
    churn = 2.4 - ramp * 0.6 + n() * 0.1;
    deflection = ramp * 35 + n() * 3;
    costPerTicket = 22 - ramp * 8 + n() * 1.5;
    aht = 30 - ramp * 10 + n() * 2;
    csat = 4.0 + ramp * 0.4 + n() * 0.05;
    hoursSaved = ramp * 18 + n() * 2;
    boardPackHours = 32 - ramp * 22 + n() * 2;
    agentCost = 40 + ramp * 40 + n() * 10; // $40-80/day for 2 agents
    churnPrevented = ramp * 20000 + n() * 6000;
    expansionRevenue = 25000 + ramp * 40000 + n() * 10000;
  }

  churn = Math.max(1.0, churn);
  deflection = Math.max(0, deflection);
  costPerTicket = Math.max(10, costPerTicket);
  aht = Math.max(15, aht);
  csat = Math.min(5, Math.max(3.5, csat));
  hoursSaved = Math.max(0, hoursSaved);
  boardPackHours = Math.max(6, boardPackHours);
  agentCost = Math.max(0, agentCost);
  churnPrevented = Math.max(0, churnPrevented);

  insertKpi.run(
    `kpi_condo_${dateStr}`, 'org_condocontrol', dateStr,
    Math.round(nrr * 10) / 10,
    Math.round(churn * 100) / 100,
    Math.round(churnPrevented),
    Math.round(expansionRevenue),
    Math.round(deflection * 10) / 10,
    Math.round(costPerTicket * 100) / 100,
    Math.round(aht * 10) / 10,
    Math.round(csat * 100) / 100,
    Math.round(hoursSaved * 10) / 10,
    Math.round(boardPackHours * 10) / 10,
    Math.round(agentCost * 100) / 100,
    daysAgo(day) + 23 * HOUR
  );
  kpiCount++;
}

console.log(`✅ ${kpiCount} KPI snapshots`);

// ── Integrations ───────────────────────────────────────────────────────────────
const insertIntegration = db.prepare(`INSERT INTO integrations (id, org_id, name, type, status, config, last_sync_at, health_score, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);

const integrations = [
  { id: 'int_sf', name: 'Salesforce', type: 'crm', health: 0.98, lastSync: minutesAgo(5), config: { instance: 'dsnsoftware.my.salesforce.com', api_version: 'v59.0' } },
  { id: 'int_zd', name: 'Zendesk', type: 'support', health: 1.0, lastSync: minutesAgo(2), config: { subdomain: 'dsn-support', plan: 'enterprise' } },
  { id: 'int_snow', name: 'Snowflake', type: 'data_warehouse', health: 0.95, lastSync: hoursAgo(1), config: { account: 'dsn-analytics.us-east-1', warehouse: 'ANALYTICS_WH' } },
  { id: 'int_slack', name: 'Slack', type: 'communication', health: 1.0, lastSync: minutesAgo(0.5), config: { workspace: 'dsn-team', channels: ['#sales-leadership','#cs-alerts','#agent-notifications'] } },
  { id: 'int_jira', name: 'Jira', type: 'project_mgmt', health: 0.97, lastSync: minutesAgo(10), config: { instance: 'dsn.atlassian.net', projects: ['CS','ENG','PROD'] } },
  { id: 'int_gslides', name: 'Google Slides', type: 'reporting', health: 1.0, lastSync: daysAgo(3), config: { service_account: 'agent-os@dsn.iam.gserviceaccount.com' } },
];

for (const i of integrations) {
  insertIntegration.run(i.id, 'org_dsn', i.name, i.type, 'connected', JSON.stringify(i.config), i.lastSync, i.health, daysAgo(90));
}

// Campspot integrations
const campspotIntegrations = [
  { id: 'int_camp_sf', name: 'Salesforce', type: 'crm', health: 0.97, lastSync: minutesAgo(8), config: { instance: 'campspot.my.salesforce.com', api_version: 'v59.0' } },
  { id: 'int_camp_intercom', name: 'Intercom', type: 'support', health: 0.99, lastSync: minutesAgo(3), config: { workspace_id: 'campspot-support', plan: 'pro' } },
  { id: 'int_camp_ga', name: 'Google Analytics', type: 'reporting', health: 0.96, lastSync: hoursAgo(2), config: { property_id: 'GA4-CAMPSPOT-001', measurement_id: 'G-CAMP12345' } },
  { id: 'int_camp_slack', name: 'Slack', type: 'communication', health: 1.0, lastSync: minutesAgo(1), config: { workspace: 'campspot-team', channels: ['#campspot-ops','#booking-alerts','#agent-notifications'] } },
];

for (const i of campspotIntegrations) {
  insertIntegration.run(i.id, 'org_campspot', i.name, i.type, 'connected', JSON.stringify(i.config), i.lastSync, i.health, daysAgo(45));
}

// Condo Control integrations
const condoIntegrations = [
  { id: 'int_condo_hs', name: 'HubSpot', type: 'crm', health: 0.98, lastSync: minutesAgo(6), config: { portal_id: 'condocontrol-crm', api_version: 'v3' } },
  { id: 'int_condo_zd', name: 'Zendesk', type: 'support', health: 0.97, lastSync: minutesAgo(4), config: { subdomain: 'condocontrol-support', plan: 'professional' } },
  { id: 'int_condo_mp', name: 'Mixpanel', type: 'reporting', health: 0.95, lastSync: hoursAgo(1), config: { project_id: 'condocontrol-prod', token: 'mp-condo-***' } },
  { id: 'int_condo_slack', name: 'Slack', type: 'communication', health: 1.0, lastSync: minutesAgo(2), config: { workspace: 'condocontrol-team', channels: ['#condocontrol-sales','#property-alerts','#agent-notifications'] } },
];

for (const i of condoIntegrations) {
  insertIntegration.run(i.id, 'org_condocontrol', i.name, i.type, 'connected', JSON.stringify(i.config), i.lastSync, i.health, daysAgo(30));
}

console.log(`✅ ${integrations.length + campspotIntegrations.length + condoIntegrations.length} integrations`);

// ── Policies ───────────────────────────────────────────────────────────────────
const insertPolicy = db.prepare(`INSERT INTO policies (id, org_id, name, type, scope, rules, enabled, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

const policies = [
  { id: 'pol_comms', name: 'Customer Communications', type: 'approval_required', scope: 'all', rules: { requires: 'manager_approval', applies_to: ['email_draft','slack_message'] } },
  { id: 'pol_discount', name: 'Discount Authorization', type: 'two_person', scope: 'nrr', rules: { threshold_percent: 15, requires: 'vp_approval_above_threshold' } },
  { id: 'pol_auto', name: 'Support Auto-Resolution', type: 'auto_approve', scope: 'support_deflection', rules: { categories: ['password_reset','billing_inquiry','imaging_setup','edi_claim_status','scheduling_question'], confidence_min: 0.85 } },
  { id: 'pol_budget', name: 'Daily Agent Budget', type: 'budget_limit', scope: 'all', rules: { max_daily_usd: 50, alert_at_percent: 80 } },
  { id: 'pol_cadence', name: 'Revenue Cadence Review', type: 'approval_required', scope: 'revenue_cadence', rules: { requires: 'vp_sales_review', review_window_hours: 24 } },
];

for (const p of policies) {
  insertPolicy.run(p.id, 'org_dsn', p.name, p.type, p.scope, JSON.stringify(p.rules), 1, daysAgo(90));
}

// Campspot policies
const campspotPolicies = [
  { id: 'pol_camp_comms', name: 'Park Operator Communications', type: 'approval_required', scope: 'all', rules: { requires: 'manager_approval', applies_to: ['email_draft','intercom_message'] } },
  { id: 'pol_camp_budget', name: 'Agent Spending Limit', type: 'budget_limit', scope: 'all', rules: { max_daily_usd: 120, alert_at_percent: 80 } },
  { id: 'pol_camp_auto', name: 'Booking Support Auto-Resolution', type: 'auto_approve', scope: 'support_deflection', rules: { categories: ['reservation_lookup','payment_status','site_config','seasonal_pricing'], confidence_min: 0.82 } },
];

for (const p of campspotPolicies) {
  insertPolicy.run(p.id, 'org_campspot', p.name, p.type, p.scope, JSON.stringify(p.rules), 1, daysAgo(45));
}

// Condo Control policies
const condoPolicies = [
  { id: 'pol_condo_comms', name: 'Property Manager Communications', type: 'approval_required', scope: 'all', rules: { requires: 'manager_approval', applies_to: ['email_draft','zendesk_message'] } },
  { id: 'pol_condo_budget', name: 'Agent Spending Limit', type: 'budget_limit', scope: 'all', rules: { max_daily_usd: 90, alert_at_percent: 75 } },
  { id: 'pol_condo_auto', name: 'Resident Support Auto-Resolution', type: 'auto_approve', scope: 'support_deflection', rules: { categories: ['access_control','payment_inquiry','maintenance_status'], confidence_min: 0.85 } },
];

for (const p of condoPolicies) {
  insertPolicy.run(p.id, 'org_condocontrol', p.name, p.type, p.scope, JSON.stringify(p.rules), 1, daysAgo(30));
}

console.log(`✅ ${policies.length + campspotPolicies.length + condoPolicies.length} policies`);

// ── Audit Log (200+ entries, hash-chained) ─────────────────────────────────────
const insertAudit = db.prepare(`INSERT INTO audit_log (id, org_id, prev_hash, hash, actor, action, resource_type, resource_id, details, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

let prevHash: string | null = null;
let auditCount = 0;

// Genesis entries for all orgs
const genesisHash = createHash('sha256').update('genesis').digest('hex');
insertAudit.run(uuid(), 'org_dsn', null, genesisHash, 'system', 'system.initialized', 'system', 'org_dsn', JSON.stringify({ message: 'Vertica Agent OS initialized for DSN Software' }), daysAgo(90));
prevHash = genesisHash;
auditCount++;

const genesisHash2 = hashEntry(prevHash, 'genesis_campspot');
insertAudit.run(uuid(), 'org_campspot', prevHash, genesisHash2, 'system', 'system.initialized', 'system', 'org_campspot', JSON.stringify({ message: 'Vertica Agent OS initialized for Campspot' }), daysAgo(45));
prevHash = genesisHash2;
auditCount++;

const genesisHash3 = hashEntry(prevHash, 'genesis_condocontrol');
insertAudit.run(uuid(), 'org_condocontrol', prevHash, genesisHash3, 'system', 'system.initialized', 'system', 'org_condocontrol', JSON.stringify({ message: 'Vertica Agent OS initialized for Condo Control' }), daysAgo(30));
prevHash = genesisHash3;
auditCount++;

// Actors per org
const actorsByOrg: Record<string, { agents: string[]; humans: string[] }> = {
  'org_dsn': {
    agents: ['agent:revenue_cadence', 'agent:support_autopilot', 'agent:renewal_guardian'],
    humans: ['sarah.johnson@dsnsoftware.com', 'philip.v@verticacp.com', 'lisa.park@dsnsoftware.com'],
  },
  'org_campspot': {
    agents: ['agent:booking_revenue_optimizer', 'agent:park_support_bot'],
    humans: ['mike.chen@campspot.com', 'philip.v@verticacp.com', 'rachel.kumar@campspot.com'],
  },
  'org_condocontrol': {
    agents: ['agent:property_pipeline_scout', 'agent:resident_support_agent'],
    humans: ['david.park@condocontrol.com', 'philip.v@verticacp.com', 'anna.torres@condocontrol.com'],
  },
};
const auditOrgs = ['org_dsn', 'org_campspot', 'org_condocontrol'];

const actors = [
  'agent:revenue_cadence', 'agent:support_autopilot', 'agent:renewal_guardian',
  'sarah.johnson@dsnsoftware.com', 'philip.v@verticacp.com', 'lisa.park@dsnsoftware.com',
  'system'
];

const auditActions = [
  { action: 'agent.config.updated', resource_type: 'agent', weight: 3 },
  { action: 'agent.run.completed', resource_type: 'run', weight: 40 },
  { action: 'agent.run.failed', resource_type: 'run', weight: 2 },
  { action: 'decision.created', resource_type: 'decision', weight: 20 },
  { action: 'decision.approved', resource_type: 'decision', weight: 12 },
  { action: 'decision.rejected', resource_type: 'decision', weight: 3 },
  { action: 'integration.sync.completed', resource_type: 'integration', weight: 15 },
  { action: 'policy.updated', resource_type: 'policy', weight: 2 },
];

// Calculate total weight for weighted random selection
const totalWeight = auditActions.reduce((sum, a) => sum + a.weight, 0);
function pickAction() {
  let r = Math.random() * totalWeight;
  for (const a of auditActions) {
    r -= a.weight;
    if (r <= 0) return a;
  }
  return auditActions[0];
}

// Generate 350 audit entries across 90 days for all orgs
const allIntegrationIds = [...integrations.map(i => i.id), ...campspotIntegrations.map(i => i.id), ...condoIntegrations.map(i => i.id)];
const allPolicyIds = [...policies.map(p => p.id), ...campspotPolicies.map(p => p.id), ...condoPolicies.map(p => p.id)];
const agentsByOrg: Record<string, string[]> = {
  'org_dsn': ['agent_revenue_cadence', 'agent_support_deflect', 'agent_nrr'],
  'org_campspot': ['agent_camp_revenue', 'agent_camp_support'],
  'org_condocontrol': ['agent_condo_pipeline', 'agent_condo_support'],
};
const integrationsByOrg: Record<string, string[]> = {
  'org_dsn': integrations.map(i => i.id),
  'org_campspot': campspotIntegrations.map(i => i.id),
  'org_condocontrol': condoIntegrations.map(i => i.id),
};
const policiesByOrg: Record<string, string[]> = {
  'org_dsn': policies.map(p => p.id),
  'org_campspot': campspotPolicies.map(p => p.id),
  'org_condocontrol': condoPolicies.map(p => p.id),
};

for (let i = 0; i < 350; i++) {
  const day = Math.floor(Math.random() * 90);
  const timeInDay = Math.floor(Math.random() * 24 * HOUR);
  const timestamp = daysAgo(day) + timeInDay;

  // Pick an org — weight DSN heavier (longer history), skip if entry would be before deployment
  let orgId: string;
  const orgRoll = Math.random();
  if (orgRoll < 0.5) {
    orgId = 'org_dsn';
  } else if (orgRoll < 0.8) {
    orgId = 'org_campspot';
    if (day >= 45) continue; // Campspot deployed 45 days ago
  } else {
    orgId = 'org_condocontrol';
    if (day >= 30) continue; // Condo Control deployed 30 days ago
  }
  
  const actionDef = pickAction();
  const orgActors = actorsByOrg[orgId];
  
  let actor: string;
  if (actionDef.action.startsWith('agent.') || actionDef.action === 'decision.created') {
    actor = orgActors.agents[Math.floor(Math.random() * orgActors.agents.length)];
  } else if (actionDef.action.startsWith('decision.approved') || actionDef.action.startsWith('decision.rejected')) {
    actor = orgActors.humans[Math.floor(Math.random() * Math.min(2, orgActors.humans.length))];
  } else if (actionDef.action === 'integration.sync.completed') {
    actor = 'system';
  } else {
    actor = orgActors.humans[Math.floor(Math.random() * orgActors.humans.length)];
  }

  let resourceId: string;
  const orgAgents = agentsByOrg[orgId];
  const orgIntegrations = integrationsByOrg[orgId];
  const orgPolicies = policiesByOrg[orgId];
  if (actionDef.resource_type === 'agent') {
    resourceId = orgAgents[Math.floor(Math.random() * orgAgents.length)];
  } else if (actionDef.resource_type === 'decision') {
    resourceId = `dec_${Math.floor(Math.random() * 50)}`;
  } else if (actionDef.resource_type === 'run') {
    resourceId = `run_${Math.floor(Math.random() * 100)}`;
  } else if (actionDef.resource_type === 'integration') {
    resourceId = orgIntegrations[Math.floor(Math.random() * orgIntegrations.length)];
  } else {
    resourceId = orgPolicies[Math.floor(Math.random() * orgPolicies.length)];
  }

  let details: Record<string, unknown> = {};
  switch (actionDef.action) {
    case 'agent.run.completed':
      details = { duration_ms: 10000 + Math.floor(Math.random() * 30000), tokens: 2000 + Math.floor(Math.random() * 8000) };
      break;
    case 'agent.run.failed':
      details = { error: ['API timeout','Rate limited','Invalid response','Connection refused'][Math.floor(Math.random() * 4)] };
      break;
    case 'decision.created':
      details = { severity: ['critical','high','medium','low'][Math.floor(Math.random() * 4)], impact_dollars: Math.floor(30000 + Math.random() * 420000) };
      break;
    case 'decision.approved':
      details = { approved_by: actor };
      break;
    case 'decision.rejected':
      details = { rejected_by: actor, reason: ['Insufficient evidence','Already handled','Policy exception needed'][Math.floor(Math.random() * 3)] };
      break;
    case 'integration.sync.completed':
      details = { records_synced: Math.floor(100 + Math.random() * 5000), duration_ms: 1000 + Math.floor(Math.random() * 10000) };
      break;
    case 'policy.updated':
      details = { field: 'rules', updated_by: actor };
      break;
    case 'agent.config.updated':
      details = { field: ['thresholds','schedule','capabilities'][Math.floor(Math.random() * 3)], updated_by: actor };
      break;
  }

  const hash = hashEntry(prevHash, `${actionDef.action}${resourceId}${timestamp}`);
  insertAudit.run(uuid(), orgId, prevHash, hash, actor, actionDef.action, actionDef.resource_type, resourceId, JSON.stringify(details), timestamp);
  prevHash = hash;
  auditCount++;
}

console.log(`✅ ${auditCount} audit log entries (hash-chained)`);

// ── Summary ────────────────────────────────────────────────────────────────────
const counts = {
  organizations: (db.prepare('SELECT COUNT(*) as c FROM organizations').get() as { c: number }).c,
  agents: (db.prepare('SELECT COUNT(*) as c FROM agents').get() as { c: number }).c,
  decisions: (db.prepare('SELECT COUNT(*) as c FROM decisions').get() as { c: number }).c,
  runs: (db.prepare('SELECT COUNT(*) as c FROM runs').get() as { c: number }).c,
  audit_log: (db.prepare('SELECT COUNT(*) as c FROM audit_log').get() as { c: number }).c,
  kpi_snapshots: (db.prepare('SELECT COUNT(*) as c FROM kpi_snapshots').get() as { c: number }).c,
  integrations: (db.prepare('SELECT COUNT(*) as c FROM integrations').get() as { c: number }).c,
  policies: (db.prepare('SELECT COUNT(*) as c FROM policies').get() as { c: number }).c,
};

console.log('\n📊 Final counts:');
for (const [table, count] of Object.entries(counts)) {
  console.log(`   ${table}: ${count}`);
}
console.log('\n🎉 Seed complete!');

db.close();
