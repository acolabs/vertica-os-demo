import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { createHash, randomUUID } from 'crypto';

// ── Setup ──────────────────────────────────────────────────────────────────────
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'gencap.db');
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
    type TEXT NOT NULL CHECK(type IN ('nrr','support','board_pack','pipeline')),
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
  { id: 'org_gencap', name: 'GenCap Holdings', type: 'holding', parent_id: null, industry: 'Private Equity', arr_millions: null, employee_count: 45, created_at: daysAgo(365) },
  { id: 'org_smartsheet', name: 'Smartsheet', type: 'portfolio', parent_id: 'org_gencap', industry: 'Productivity Software', arr_millions: 500, employee_count: 3000, created_at: daysAgo(365) },
  { id: 'org_acme', name: 'Acme SaaS Corp', type: 'portfolio', parent_id: 'org_gencap', industry: 'Marketing Automation', arr_millions: 80, employee_count: 450, created_at: daysAgo(300) },
  { id: 'org_dataflow', name: 'DataFlow Inc', type: 'portfolio', parent_id: 'org_gencap', industry: 'Data Integration', arr_millions: 35, employee_count: 200, created_at: daysAgo(250) },
];

const insertOrg = db.prepare(`INSERT INTO organizations (id, name, type, parent_id, logo_url, industry, arr_millions, employee_count, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
for (const o of orgs) {
  insertOrg.run(o.id, o.name, o.type, o.parent_id, null, o.industry, o.arr_millions, o.employee_count, o.created_at);
}
console.log(`✅ ${orgs.length} organizations`);

// ── Agents ─────────────────────────────────────────────────────────────────────
const agents = [
  // Smartsheet agents
  {
    id: 'agent_renewal', org_id: 'org_smartsheet', name: 'Renewal Guardian', type: 'nrr' as const,
    status: 'active', description: 'Monitors renewal pipeline, detects churn signals, and generates save plays for at-risk accounts.',
    model: 'claude-sonnet-4.5', total_runs: 147, total_decisions: 73, total_value_created: 847000, accuracy_rate: 0.91,
    config: JSON.stringify({ capabilities: ["salesforce_read","zendesk_read","analytics_read","jira_write","email_draft"], thresholds: { risk_score: 0.65, confidence_min: 0.7 }, schedule: "every_4_hours" }),
  },
  {
    id: 'agent_support', org_id: 'org_smartsheet', name: 'Support Sentinel', type: 'support' as const,
    status: 'active', description: 'Automatically triages and resolves common support tickets, escalating complex issues to human agents.',
    model: 'claude-sonnet-4.5', total_runs: 312, total_decisions: 189, total_value_created: 234000, accuracy_rate: 0.87,
    config: JSON.stringify({ capabilities: ["zendesk_read","zendesk_write","kb_read","kb_write"], auto_resolve_categories: ["password_reset","billing_inquiry","status_check","feature_question"], escalation_threshold: 0.6 }),
  },
  {
    id: 'agent_board', org_id: 'org_smartsheet', name: 'Executive Lens', type: 'board_pack' as const,
    status: 'active', description: 'Compiles weekly board-ready analytics decks with KPIs, trends, and executive insights.',
    model: 'claude-sonnet-4.5', total_runs: 12, total_decisions: 8, total_value_created: 0, accuracy_rate: 0.95,
    config: JSON.stringify({ capabilities: ["snowflake_read","salesforce_read","looker_read","slides_write","slack_write"], schedule: "weekly_monday", output_format: "google_slides" }),
  },
  // Acme agents
  {
    id: 'agent_acme_nrr', org_id: 'org_acme', name: 'Retention Radar', type: 'nrr' as const,
    status: 'active', description: 'Tracks churn risk signals across Acme SaaS portfolio accounts.',
    model: 'claude-sonnet-4.5', total_runs: 89, total_decisions: 34, total_value_created: 312000, accuracy_rate: 0.88,
    config: JSON.stringify({ capabilities: ["hubspot_read","intercom_read","analytics_read"], thresholds: { risk_score: 0.6, confidence_min: 0.7 }, schedule: "every_6_hours" }),
  },
  {
    id: 'agent_acme_support', org_id: 'org_acme', name: 'Ticket Tamer', type: 'support' as const,
    status: 'active', description: 'Auto-resolves common Acme SaaS support inquiries.',
    model: 'claude-sonnet-4.5', total_runs: 156, total_decisions: 98, total_value_created: 89000, accuracy_rate: 0.84,
    config: JSON.stringify({ capabilities: ["intercom_read","intercom_write","kb_read"], auto_resolve_categories: ["password_reset","billing_inquiry","feature_question"], escalation_threshold: 0.65 }),
  },
  // DataFlow agents
  {
    id: 'agent_df_pipeline', org_id: 'org_dataflow', name: 'Pipeline Scout', type: 'pipeline' as const,
    status: 'active', description: 'Monitors DataFlow pipeline health and identifies expansion opportunities.',
    model: 'claude-sonnet-4.5', total_runs: 67, total_decisions: 22, total_value_created: 145000, accuracy_rate: 0.90,
    config: JSON.stringify({ capabilities: ["salesforce_read","analytics_read","slack_write"], schedule: "every_8_hours" }),
  },
  {
    id: 'agent_df_support', org_id: 'org_dataflow', name: 'Data Doctor', type: 'support' as const,
    status: 'deploying', description: 'Handles DataFlow integration support tickets.',
    model: 'claude-sonnet-4.5', total_runs: 23, total_decisions: 12, total_value_created: 34000, accuracy_rate: 0.82,
    config: JSON.stringify({ capabilities: ["zendesk_read","zendesk_write","kb_read"], auto_resolve_categories: ["connection_issues","api_errors"], escalation_threshold: 0.7 }),
  },
];

const insertAgent = db.prepare(`INSERT INTO agents (id, org_id, name, type, status, description, model, config, total_runs, total_decisions, total_value_created, accuracy_rate, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
for (const a of agents) {
  insertAgent.run(a.id, a.org_id, a.name, a.type, a.status, a.description, a.model, a.config, a.total_runs, a.total_decisions, a.total_value_created, a.accuracy_rate, daysAgo(90), NOW);
}
console.log(`✅ ${agents.length} agents`);

// ── Decisions ──────────────────────────────────────────────────────────────────
const insertDecision = db.prepare(`INSERT INTO decisions (id, org_id, agent_id, type, severity, status, title, summary, impact_dollars, confidence, evidence, recommended_action, action_preview, approved_by, approved_at, due_date, account_name, account_arr, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

// 7 Critical Decisions for Smartsheet
const criticalDecisions = [
  {
    id: 'dec_crit_1', org_id: 'org_smartsheet', agent_id: 'agent_renewal', type: 'renewal_risk', severity: 'critical', status: 'pending',
    title: 'Acme Corp — Critical Renewal Risk',
    summary: 'Multi-signal risk detected: usage down 34% over 60 days, 3 open P1 support escalations, executive champion (VP of Operations Sarah Chen) departed 2 weeks ago. Renewal in 47 days.',
    impact_dollars: 450000, confidence: 0.92,
    account_name: 'Acme Corp', account_arr: 450000,
    due_date: daysAgo(-47),
    evidence: JSON.stringify([
      { source: "Salesforce", type: "renewal_date", detail: "Renewal: March 28, 2026. Contract value: $450,000/yr. 3-year customer." },
      { source: "Product Analytics", type: "usage_decline", detail: "DAU dropped from 847 to 558 (-34%) over last 60 days. Feature adoption for new Automation module: 12% (vs 45% benchmark)." },
      { source: "Zendesk", type: "escalations", detail: "3 open P1 tickets: #48291 (data export failures, 12 days open), #48456 (API rate limiting, 8 days open), #48501 (SSO intermittent failures, 5 days open)" },
      { source: "Salesforce", type: "champion_change", detail: "VP of Operations Sarah Chen (primary champion) left company on Jan 28. New VP Marcus Rivera has no prior relationship with us." },
      { source: "Billing", type: "payment_history", detail: "Last 2 invoices paid late (7 days, 12 days). Previously always on time." }
    ]),
    recommended_action: JSON.stringify({ actions: [
      { type: "exec_outreach", detail: "Schedule executive meeting with Marcus Rivera (new VP Ops) within 1 week. Draft email prepared.", system: "email", requires_approval: true },
      { type: "support_escalation", detail: "Escalate 3 P1 tickets to Engineering Lead. Create Jira epic ACME-CRITICAL.", system: "jira", requires_approval: true },
      { type: "renewal_offer", detail: "Prepare 12% renewal discount ($396K) with 2-year lock-in. Within authorized discount range.", system: "salesforce", requires_approval: true },
      { type: "success_plan", detail: "Assign dedicated CSM for daily check-ins. Schedule Automation module training for team.", system: "internal", requires_approval: false }
    ]}),
    action_preview: JSON.stringify({ changes: [
      { system: "Salesforce", field: "Opportunity.Risk_Level__c", from: "Medium", to: "Critical" },
      { system: "Salesforce", field: "Opportunity.Next_Step__c", from: "Standard renewal", to: "Executive save play" },
      { system: "Jira", action: "Create epic ACME-CRITICAL with 3 sub-tasks for P1 tickets" },
      { system: "Email", action: "Draft outreach to Marcus Rivera (VP Ops) — awaiting approval" }
    ]}),
    created_at: hoursAgo(3),
  },
  {
    id: 'dec_crit_2', org_id: 'org_smartsheet', agent_id: 'agent_renewal', type: 'renewal_risk', severity: 'critical', status: 'pending',
    title: 'GlobalTech Industries — Competitive Displacement Risk',
    summary: 'Usage stagnant for 90 days. Sales intel detected active evaluation of Monday.com and Asana. Key stakeholder (Director of PMO) downloaded competitor comparison guide. Renewal in 62 days.',
    impact_dollars: 380000, confidence: 0.88,
    account_name: 'GlobalTech Industries', account_arr: 380000,
    due_date: daysAgo(-62),
    evidence: JSON.stringify([
      { source: "Salesforce", type: "renewal_date", detail: "Renewal: April 13, 2026. Contract value: $380,000/yr. 2-year customer." },
      { source: "Product Analytics", type: "usage_stagnant", detail: "DAU flat at 412 for 90 days. No growth despite 50 additional licenses purchased in Q3." },
      { source: "Sales Intel", type: "competitor_eval", detail: "LinkedIn Sales Navigator: Director of PMO David Park connected with Monday.com AE. Downloaded Monday.com vs Smartsheet comparison on G2 (Jan 15)." },
      { source: "Product Analytics", type: "feature_gap", detail: "Top requested features: Gantt chart enhancements, resource management. Both available but adoption at 8%." },
      { source: "Zendesk", type: "sentiment", detail: "CSAT score for this account dropped from 4.5 to 3.2 over last quarter. 2 negative survey responses citing 'clunky interface'." }
    ]),
    recommended_action: JSON.stringify({ actions: [
      { type: "exec_outreach", detail: "Request meeting with CTO and Director of PMO. Prepare competitive differentiation deck.", system: "email", requires_approval: true },
      { type: "product_demo", detail: "Schedule personalized demo of Gantt + Resource Management features they haven't adopted.", system: "calendar", requires_approval: true },
      { type: "renewal_offer", detail: "Prepare multi-year discount (15% for 3-year commitment = $323K/yr).", system: "salesforce", requires_approval: true }
    ]}),
    action_preview: JSON.stringify({ changes: [
      { system: "Salesforce", field: "Opportunity.Risk_Level__c", from: "Low", to: "Critical" },
      { system: "Salesforce", field: "Opportunity.Competitive_Threat__c", from: null, to: "Monday.com, Asana" },
      { system: "Calendar", action: "Block CSM time for personalized demo prep" }
    ]}),
    created_at: hoursAgo(5),
  },
  {
    id: 'dec_crit_3', org_id: 'org_smartsheet', agent_id: 'agent_renewal', type: 'renewal_risk', severity: 'critical', status: 'pending',
    title: 'Meridian Health — CSAT Crisis',
    summary: 'CSAT plummeted from 4.4 to 2.8 in 30 days. 5 unresolved P1/P2 tickets spanning compliance-critical workflows. Healthcare client with strict SLA requirements. Renewal in 38 days.',
    impact_dollars: 320000, confidence: 0.94,
    account_name: 'Meridian Health', account_arr: 320000,
    due_date: daysAgo(-38),
    evidence: JSON.stringify([
      { source: "Salesforce", type: "renewal_date", detail: "Renewal: March 19, 2026. Contract value: $320,000/yr. HIPAA BAA in place. 4-year customer." },
      { source: "Zendesk", type: "escalations", detail: "5 open tickets: #47892 (HIPAA audit trail gap, P1, 18 days), #48012 (PHI field encryption error, P1, 14 days), #48234 (report scheduling failures, P2, 10 days), #48389 (SSO timeout in clinical workflows, P2, 7 days), #48445 (API webhook delivery failures, P2, 5 days)" },
      { source: "Zendesk", type: "csat_drop", detail: "Account CSAT: 2.8 (was 4.4 thirty days ago). 3 surveys with score 1/5. Comments: 'Unacceptable for healthcare', 'Compliance risk'." },
      { source: "Salesforce", type: "exec_engagement", detail: "VP of Health IT Dr. Rebecca Torres sent escalation email to our CEO directly on Feb 3. No response logged." },
      { source: "Legal", type: "compliance", detail: "BAA requires 99.9% uptime on PHI-related features. Current incident may trigger SLA penalty clause ($50K)." }
    ]),
    recommended_action: JSON.stringify({ actions: [
      { type: "exec_outreach", detail: "CEO-to-VP call within 24 hours. Acknowledge issues, present remediation timeline.", system: "email", requires_approval: true },
      { type: "support_escalation", detail: "Create P0 engineering sprint for all 5 tickets. Assign senior engineer dedicated to Meridian.", system: "jira", requires_approval: true },
      { type: "sla_credit", detail: "Proactively offer 1-month service credit ($26,667) for SLA breach.", system: "billing", requires_approval: true },
      { type: "success_plan", detail: "Weekly executive status calls until all P1s resolved.", system: "internal", requires_approval: false }
    ]}),
    action_preview: JSON.stringify({ changes: [
      { system: "Salesforce", field: "Opportunity.Risk_Level__c", from: "Medium", to: "Critical" },
      { system: "Jira", action: "Create P0 sprint 'Meridian Emergency' with 5 tickets" },
      { system: "Email", action: "Draft CEO apology + remediation plan to Dr. Torres" }
    ]}),
    created_at: hoursAgo(2),
  },
  {
    id: 'dec_crit_4', org_id: 'org_smartsheet', agent_id: 'agent_renewal', type: 'renewal_risk', severity: 'critical', status: 'pending',
    title: 'NovaPay Solutions — Integration Deprecation Crisis',
    summary: 'Critical Plaid integration deprecated in v3 API migration. NovaPay\'s core payment workflow depends on it. Migration stalled at 12% completion. Renewal in 55 days.',
    impact_dollars: 290000, confidence: 0.89,
    account_name: 'NovaPay Solutions', account_arr: 290000,
    due_date: daysAgo(-55),
    evidence: JSON.stringify([
      { source: "Salesforce", type: "renewal_date", detail: "Renewal: April 5, 2026. Contract value: $290,000/yr. FinTech vertical. 2-year customer." },
      { source: "Product Analytics", type: "integration_health", detail: "Plaid v2 integration (deprecated) used 847 times/day by NovaPay. v3 migration wizard started but abandoned at step 3/8. Only 12% of endpoints migrated." },
      { source: "Zendesk", type: "escalations", detail: "Ticket #48123: 'Plaid v2 sunset will break our entire payment reconciliation workflow. Need migration support ASAP.' — Filed by their CTO directly." },
      { source: "Engineering", type: "deprecation_timeline", detail: "Plaid v2 sunset: March 31, 2026. No extension possible. 847 daily API calls will fail." },
      { source: "Product Analytics", type: "migration_blockers", detail: "3 custom fields in NovaPay's Plaid config have no v3 equivalent. Requires engineering custom work." }
    ]),
    recommended_action: JSON.stringify({ actions: [
      { type: "engineering_support", detail: "Assign integration specialist for 2-week dedicated migration sprint. Build custom field mappers.", system: "jira", requires_approval: true },
      { type: "exec_outreach", detail: "CTO-to-CTO call to present migration plan and timeline guarantee.", system: "email", requires_approval: true },
      { type: "renewal_offer", detail: "Offer free professional services package ($25K value) for migration assistance.", system: "salesforce", requires_approval: true }
    ]}),
    action_preview: JSON.stringify({ changes: [
      { system: "Jira", action: "Create epic 'NovaPay Plaid v3 Migration' with 8 stories" },
      { system: "Salesforce", field: "Opportunity.Risk_Level__c", from: "Low", to: "Critical" },
      { system: "Resource Planning", action: "Block integration specialist for 2-week engagement" }
    ]}),
    created_at: hoursAgo(6),
  },
  {
    id: 'dec_crit_5', org_id: 'org_smartsheet', agent_id: 'agent_renewal', type: 'renewal_risk', severity: 'critical', status: 'pending',
    title: 'Vertex Analytics — Budget Freeze Impact',
    summary: 'Public announcement of 15% workforce reduction at Vertex. 2 power users (team leads) departed. Usage down 28% in 2 weeks. Finance team requesting cost breakdown. Renewal in 41 days.',
    impact_dollars: 275000, confidence: 0.86,
    account_name: 'Vertex Analytics', account_arr: 275000,
    due_date: daysAgo(-41),
    evidence: JSON.stringify([
      { source: "Salesforce", type: "renewal_date", detail: "Renewal: March 22, 2026. Contract value: $275,000/yr. Data analytics firm. 3-year customer." },
      { source: "News", type: "company_event", detail: "TechCrunch (Feb 1): 'Vertex Analytics announces 15% layoffs amid market downturn, affecting 120 employees.' CFO quoted: 'reviewing all vendor contracts.'" },
      { source: "Product Analytics", type: "usage_decline", detail: "DAU dropped from 234 to 168 (-28%) in past 14 days. 2 admin accounts (team leads) deactivated." },
      { source: "Salesforce", type: "contact_changes", detail: "Team Lead Alex Kim (power user, 340 sheets owned) and Team Lead Priya Patel (280 sheets owned) both marked as departed." },
      { source: "Email", type: "procurement_inquiry", detail: "Email from Vertex Finance (Jan 30): 'Please provide detailed usage report, per-seat cost breakdown, and available downgrade options.' Suggests contract renegotiation." }
    ]),
    recommended_action: JSON.stringify({ actions: [
      { type: "exec_outreach", detail: "Schedule value demonstration meeting with CFO. Show ROI metrics and cost-per-outcome data.", system: "email", requires_approval: true },
      { type: "renewal_offer", detail: "Prepare flexible licensing: reduce seats by 30% ($192,500) with right-to-grow clause.", system: "salesforce", requires_approval: true },
      { type: "data_migration", detail: "Migrate orphaned sheets from departed users to active team members.", system: "internal", requires_approval: false }
    ]}),
    action_preview: JSON.stringify({ changes: [
      { system: "Salesforce", field: "Opportunity.Risk_Level__c", from: "Medium", to: "Critical" },
      { system: "Salesforce", field: "Opportunity.Contract_Value__c", from: "$275,000", to: "$192,500 (proposed)" },
      { system: "Email", action: "Draft CFO value brief with ROI analysis" }
    ]}),
    created_at: hoursAgo(8),
  },
  {
    id: 'dec_crit_6', org_id: 'org_smartsheet', agent_id: 'agent_renewal', type: 'renewal_risk', severity: 'critical', status: 'pending',
    title: 'Pinnacle Retail — Seasonal + Payment Risk',
    summary: 'Seasonal usage drop coincides with 2 consecutive late payments. Account moved to Net-60 without authorization. Holiday season dependency creates natural usage valley but payment pattern is concerning.',
    impact_dollars: 250000, confidence: 0.84,
    account_name: 'Pinnacle Retail', account_arr: 250000,
    due_date: daysAgo(-33),
    evidence: JSON.stringify([
      { source: "Salesforce", type: "renewal_date", detail: "Renewal: March 14, 2026. Contract value: $250,000/yr. Retail vertical. 2-year customer." },
      { source: "Product Analytics", type: "usage_pattern", detail: "Seasonal pattern confirmed: Q1 usage typically -40% vs Q4 peak. Current -45% is slightly worse than historical. 312 DAU vs 567 in December." },
      { source: "Billing", type: "payment_risk", detail: "Invoice #INV-2024-847 ($62,500): paid 23 days late. Invoice #INV-2025-012 ($62,500): 18 days overdue and counting. AP contact unresponsive." },
      { source: "Salesforce", type: "terms_change", detail: "Account unilaterally moved to Net-60 payment terms (contract specifies Net-30). No amendment signed." },
      { source: "Zendesk", type: "support_volume", detail: "Support tickets down 60% — consistent with seasonal pattern but also could indicate disengagement." }
    ]),
    recommended_action: JSON.stringify({ actions: [
      { type: "finance_escalation", detail: "Flag payment terms violation to Legal. Prepare collections outreach.", system: "billing", requires_approval: true },
      { type: "exec_outreach", detail: "VP Sales call with Pinnacle COO to discuss payment terms and renewal.", system: "email", requires_approval: true },
      { type: "renewal_offer", detail: "Offer quarterly billing option with 3% convenience fee to ease cash flow.", system: "salesforce", requires_approval: true }
    ]}),
    action_preview: JSON.stringify({ changes: [
      { system: "Billing", action: "Flag account for collections review" },
      { system: "Salesforce", field: "Opportunity.Risk_Level__c", from: "Low", to: "Critical" },
      { system: "Legal", action: "Draft payment terms violation notice" }
    ]}),
    created_at: hoursAgo(10),
  },
  {
    id: 'dec_crit_7', org_id: 'org_smartsheet', agent_id: 'agent_renewal', type: 'renewal_risk', severity: 'critical', status: 'pending',
    title: 'Atlas Logistics — Champion Departure',
    summary: 'Primary champion (Director of Operations) promoted to VP at parent company, leaving the Smartsheet account without an advocate. New Director has no product familiarity. Usage steady but political risk is high.',
    impact_dollars: 220000, confidence: 0.82,
    account_name: 'Atlas Logistics', account_arr: 220000,
    due_date: daysAgo(-52),
    evidence: JSON.stringify([
      { source: "Salesforce", type: "renewal_date", detail: "Renewal: April 2, 2026. Contract value: $220,000/yr. Logistics vertical. 3-year customer." },
      { source: "Salesforce", type: "champion_change", detail: "Director of Operations Michael Torres promoted to VP Operations at Atlas parent company (Atlas Group). New Director: Jennifer Walsh, previously at competitor (Wrike user)." },
      { source: "LinkedIn", type: "contact_intel", detail: "Jennifer Walsh: 4 years at competitor firm using Wrike. Posted about 'operational transformation' in new role — may want to bring familiar tools." },
      { source: "Product Analytics", type: "usage_stable", detail: "DAU: 189 (stable). But 67% of workflows were created/managed by Michael Torres. Ownership transfer incomplete." },
      { source: "Salesforce", type: "engagement_gap", detail: "No executive engagement in 45 days. QBR scheduled for Feb 28 but new Director hasn't confirmed attendance." }
    ]),
    recommended_action: JSON.stringify({ actions: [
      { type: "exec_outreach", detail: "Welcome package for Jennifer Walsh. Request introductory meeting with our VP CS.", system: "email", requires_approval: true },
      { type: "success_plan", detail: "Build personalized onboarding path comparing Smartsheet vs Wrike capabilities.", system: "internal", requires_approval: false },
      { type: "ownership_transfer", detail: "Migrate Michael Torres's 67% of workflows to team ownership model.", system: "internal", requires_approval: false }
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
  { name: 'TerraForm Solutions', arr: 195000, type: 'renewal_risk', summary: 'Usage declining 18% over 45 days. 2 open P2 tickets. Key user on PIP. Renewal in 68 days.' },
  { name: 'CloudBridge Networks', arr: 180000, type: 'expansion', summary: 'Strong adoption in Engineering (92% DAU). 3 new departments requesting access. Expansion potential: $120K additional ARR.' },
  { name: 'Zenith Manufacturing', arr: 175000, type: 'renewal_risk', summary: 'CSAT declining from 4.1 to 3.4. Champion recently expressed frustration about reporting limitations. Renewal in 74 days.' },
  { name: 'Horizon Pharma', arr: 165000, type: 'expansion', summary: 'Successfully deployed in R&D (45 users). Clinical trials team (80 users) requesting pilot. Expansion potential: $95K.' },
  { name: 'Pacific Trading Co', arr: 155000, type: 'renewal_risk', summary: 'Competitor POC detected (Asana). Usage flat. No executive engagement in 60 days.' },
  { name: 'Sterling Financial', arr: 148000, type: 'renewal_risk', summary: 'Regulatory change requiring new compliance workflows. Current implementation gaps may force platform switch.' },
  { name: 'Cascade Energy', arr: 140000, type: 'expansion', summary: 'Wind farm division adopted Smartsheet independently. Consolidation opportunity across 3 business units.' },
  { name: 'Quantum Robotics', arr: 135000, type: 'renewal_risk', summary: 'Series B burn rate concerns. CFO reviewing all SaaS contracts above $100K. Renewal in 82 days.' },
  { name: 'Silverline Media', arr: 128000, type: 'expansion', summary: 'Agency team driving 4x more project throughput with Smartsheet. Requesting API access for custom integrations.' },
  { name: 'Nordic Analytics', arr: 120000, type: 'renewal_risk', summary: 'EU data residency requirement. Current data center in US. GDPR compliance audit upcoming.' },
  { name: 'Ember Technologies', arr: 115000, type: 'expansion', summary: 'Hardware division wants to replicate software division\'s Smartsheet success. 200 potential new seats.' },
  { name: 'Vanguard Consulting', arr: 108000, type: 'renewal_risk', summary: 'M&A announced — Vanguard being acquired by Deloitte. Contract assignability clause may be triggered.' },
];

let highDecisionCount = 0;
for (let i = 0; i < highAccounts.length; i++) {
  const a = highAccounts[i];
  insertDecision.run(
    `dec_high_${i + 1}`, 'org_smartsheet', 'agent_renewal', a.type, 'high', 'pending',
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
const mediumDecisions: { name: string; arr: number; type: string; agentId: string; summary: string }[] = [
  { name: 'BlueStar Logistics', arr: 78000, type: 'renewal_risk', agentId: 'agent_renewal', summary: 'Minor usage dip (-8%). Single open P3 ticket. Low overall risk but monitoring.' },
  { name: 'Apex Digital', arr: 72000, type: 'expansion', agentId: 'agent_renewal', summary: 'Marketing team requesting 15 additional licenses. Moderate expansion potential.' },
  { name: 'Redwood Labs', arr: 68000, type: 'support_resolution', agentId: 'agent_support', summary: 'Auto-resolved 3 password reset tickets. Suggested KB article update for SSO setup.' },
  { name: 'ClearView Optics', arr: 64000, type: 'renewal_risk', agentId: 'agent_renewal', summary: 'Engagement score dropped from 7.2 to 5.8. CSM should schedule check-in call.' },
  { name: 'Summit Partners', arr: 61000, type: 'expansion', agentId: 'agent_renewal', summary: 'Fund III team independently purchased 5 seats. Opportunity to consolidate under enterprise agreement.' },
  { name: 'Harbor Marine', arr: 58000, type: 'support_resolution', agentId: 'agent_support', summary: 'Resolved billing dispute over proration. Credit issued automatically per policy.' },
  { name: 'Catalyst Biotech', arr: 55000, type: 'anomaly', agentId: 'agent_renewal', summary: 'Unusual spike in data exports (3x normal). Could indicate data migration to competitor or internal audit.' },
  { name: 'Prism Education', arr: 52000, type: 'renewal_risk', agentId: 'agent_renewal', summary: 'Academic calendar effect: usage drops every summer. Currently in expected trough period.' },
  { name: 'Echo Communications', arr: 49000, type: 'support_resolution', agentId: 'agent_support', summary: 'Resolved API rate limiting issue by recommending batch endpoint. Response time: 4 minutes.' },
  { name: 'Forge Industrial', arr: 46000, type: 'expansion', agentId: 'agent_renewal', summary: 'Plant floor team wants tablet-optimized dashboards. Mobile feature upsell opportunity.' },
  { name: 'Lakeshore Properties', arr: 43000, type: 'support_resolution', agentId: 'agent_support', summary: 'Auto-resolved feature question about conditional formatting. Linked to tutorial video.' },
  { name: 'Phoenix Aerospace', arr: 75000, type: 'renewal_risk', agentId: 'agent_renewal', summary: 'Defense contract requirements may need FedRAMP compliance. Current plan doesn\'t include.' },
  { name: 'Ironclad Security', arr: 67000, type: 'expansion', agentId: 'agent_renewal', summary: 'SOC team wants to build incident tracking in Smartsheet. Could expand to security operations use case.' },
  { name: 'Nimbus Weather Tech', arr: 41000, type: 'support_resolution', agentId: 'agent_support', summary: 'Resolved 5 status check tickets automatically. All weather alert dashboard queries.' },
  { name: 'Coral Healthcare', arr: 56000, type: 'anomaly', agentId: 'agent_renewal', summary: 'New admin added 30 users in one day without prior request. May indicate shadow IT growth (positive).' },
  { name: 'Dynamo Sports', arr: 38000, type: 'support_resolution', agentId: 'agent_support', summary: 'Auto-resolved billing inquiry about annual vs monthly pricing difference.' },
  { name: 'Sequoia Legal', arr: 71000, type: 'renewal_risk', agentId: 'agent_renewal', summary: 'Legal industry pivot to AI tools. Client evaluating contract management platforms that may overlap.' },
  { name: 'Marble Arch Partners', arr: 44000, type: 'expansion', agentId: 'agent_renewal', summary: 'London office expansion creating demand for 25 new seats. Cross-region opportunity.' },
  { name: 'Titan Construction', arr: 63000, type: 'support_resolution', agentId: 'agent_support', summary: 'Resolved complex formula error in resource allocation sheet. Provided optimized template.' },
  { name: 'Oasis Hospitality', arr: 35000, type: 'renewal_risk', agentId: 'agent_renewal', summary: 'Small account but high NPS (9). Low risk. Monitoring for potential referral opportunity.' },
  { name: 'Vector Dynamics', arr: 48000, type: 'support_resolution', agentId: 'agent_support', summary: 'Resolved SSO configuration question. Linked to admin setup documentation.' },
  { name: 'Keystone Ventures', arr: 57000, type: 'expansion', agentId: 'agent_renewal', summary: 'Portfolio company onboarding standardization. Potential to add 4 portfolio companies.' },
  { name: 'Arctic Research Group', arr: 32000, type: 'support_resolution', agentId: 'agent_support', summary: 'Resolved offline access question for field researchers. Recommended mobile app download.' },
  { name: 'Sapphire Gaming', arr: 69000, type: 'anomaly', agentId: 'agent_renewal', summary: 'API usage 5x above plan limits. Likely automated integration. Should discuss enterprise API tier.' },
  { name: 'Golden Gate Ventures', arr: 53000, type: 'expansion', agentId: 'agent_renewal', summary: 'Due diligence team expanding. Need secure external sharing features. Control Center upsell.' },
];

let medDecisionCount = 0;
for (let i = 0; i < mediumDecisions.length; i++) {
  const d = mediumDecisions[i];
  const statusOptions = ['pending', 'pending', 'pending', 'auto_resolved'];
  const status = d.type === 'support_resolution' ? 'auto_resolved' : statusOptions[Math.floor(Math.random() * statusOptions.length)];
  insertDecision.run(
    `dec_med_${i + 1}`, 'org_smartsheet', d.agentId,
    d.type as 'renewal_risk' | 'expansion' | 'support_resolution' | 'anomaly',
    'medium', status,
    `${d.name} — ${d.type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}`,
    d.summary, d.arr, 0.65 + Math.random() * 0.2,
    JSON.stringify([{ source: "System", type: "auto_analysis", detail: d.summary }]),
    null, null,
    status === 'auto_resolved' ? 'agent_support' : null,
    status === 'auto_resolved' ? hoursAgo(12 + i * 2) : null,
    null, d.name, d.arr, hoursAgo(24 + i * 3)
  );
  medDecisionCount++;
}
console.log(`✅ ${medDecisionCount} medium decisions`);

// 6 Approved/completed decisions (success stories)
const successDecisions = [
  { name: 'BrightPath Education', arr: 340000, saved: 340000, summary: 'Identified renewal risk 60 days before expiration. Executive save play recovered $340K account. Customer signed 3-year extension.' },
  { name: 'Meridian Financial', arr: 280000, saved: 280000, summary: 'Detected competitor evaluation early. Personalized feature demo + pricing adjustment retained account with 2-year commitment.' },
  { name: 'CoreTech Solutions', arr: 195000, saved: 195000, summary: 'Champion departure detected. Successful transition to new stakeholder with tailored onboarding program.' },
  { name: 'Velocity Motors', arr: 156000, saved: 156000, summary: 'Payment issues flagged and resolved proactively. Flexible billing arrangement prevented churn.' },
  { name: 'Summit Healthcare', arr: 420000, saved: 0, summary: 'Expansion opportunity identified: 3 new departments adopted platform. ARR grew from $280K to $420K.' },
  { name: 'Alpine Research', arr: 89000, saved: 89000, summary: 'Auto-resolved 47 support tickets over 30 days, saving 23 hours of agent time. CSAT improved from 4.0 to 4.7.' },
];

for (let i = 0; i < successDecisions.length; i++) {
  const d = successDecisions[i];
  insertDecision.run(
    `dec_success_${i + 1}`, 'org_smartsheet', i < 4 ? 'agent_renewal' : (i === 4 ? 'agent_renewal' : 'agent_support'),
    i === 4 ? 'expansion' : 'renewal_risk', i < 2 ? 'critical' : 'high', 'approved',
    `${d.name} — ${i === 4 ? 'Expansion Won' : 'Save Successful'}`,
    d.summary, d.arr, 0.88 + Math.random() * 0.1,
    JSON.stringify([{ source: "Outcome", type: "resolved", detail: d.summary }]),
    null, null,
    'sarah.johnson@smartsheet.com', daysAgo(5 + i * 7),
    null, d.name, d.arr, daysAgo(10 + i * 10)
  );
}
console.log(`✅ ${successDecisions.length} success decisions`);

// ── Runs ───────────────────────────────────────────────────────────────────────
const insertRun = db.prepare(`INSERT INTO runs (id, org_id, agent_id, status, trigger_type, started_at, completed_at, duration_ms, steps, tools_used, tokens_used, cost_usd, decisions_created, error) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

// 7 Detailed runs for critical decisions
const detailedRuns = [
  {
    id: 'run_crit_1', agent_id: 'agent_renewal', created_at: hoursAgo(3) - 30 * MINUTE,
    duration_ms: 30600, tokens_used: 11050, cost_usd: 0.18, decisions_created: 7,
    steps: JSON.stringify([
      { step: 1, type: "plan", title: "Analyzing renewal risk signals", detail: "Initiating multi-source risk assessment for accounts with renewals in next 90 days.", duration_ms: 1200, tokens: 450 },
      { step: 2, type: "tool_call", title: "Salesforce: Pull renewal pipeline", detail: "GET /api/opportunities?renewal_date_gte=2026-02-11&renewal_date_lte=2026-05-11 → 47 accounts returned", duration_ms: 3400, tokens: 0, system: "salesforce" },
      { step: 3, type: "tool_call", title: "Product Analytics: Usage trends", detail: "GET /api/usage/trends?accounts=47&period=60d → 12 accounts with >20% decline flagged", duration_ms: 2800, tokens: 0, system: "analytics" },
      { step: 4, type: "tool_call", title: "Zendesk: Support health", detail: "GET /api/tickets?accounts=12&status=open&priority=p1,p2 → 23 open escalations across flagged accounts", duration_ms: 2100, tokens: 0, system: "zendesk" },
      { step: 5, type: "analysis", title: "Cross-referencing signals", detail: "Correlating usage decline + support escalations + billing patterns + champion changes. Scoring risk 0-100 per account.", duration_ms: 8500, tokens: 3200 },
      { step: 6, type: "tool_call", title: "Salesforce: Champion verification", detail: "GET /api/contacts?role=champion&accounts=12 → 3 accounts with champion departures in last 30 days", duration_ms: 1900, tokens: 0, system: "salesforce" },
      { step: 7, type: "decision", title: "Risk assessment complete", detail: "7 accounts flagged as Critical (score >85), 5 as High (score 65-84). Total exposure: $2.4M ARR. Generating save plans.", duration_ms: 6200, tokens: 4100 },
      { step: 8, type: "output", title: "Save plans generated", detail: "Created 7 critical decisions with recommended actions. Drafts ready for human review in Decision Inbox.", duration_ms: 4500, tokens: 2800 }
    ]),
    tools_used: JSON.stringify(["salesforce","analytics","zendesk","jira"]),
  },
  {
    id: 'run_crit_2', agent_id: 'agent_support', created_at: hoursAgo(2) - 15 * MINUTE,
    duration_ms: 18400, tokens_used: 6800, cost_usd: 0.11, decisions_created: 3,
    steps: JSON.stringify([
      { step: 1, type: "plan", title: "Processing support ticket queue", detail: "Scanning 34 new tickets in Smartsheet Zendesk instance.", duration_ms: 800, tokens: 320 },
      { step: 2, type: "tool_call", title: "Zendesk: Fetch new tickets", detail: "GET /api/tickets?status=new&created_after=4h → 34 tickets returned", duration_ms: 1800, tokens: 0, system: "zendesk" },
      { step: 3, type: "analysis", title: "Classifying tickets", detail: "Categorizing by type: 12 password resets, 8 billing inquiries, 6 feature questions, 4 bug reports, 4 escalations.", duration_ms: 4200, tokens: 2400 },
      { step: 4, type: "tool_call", title: "KB: Fetching resolution templates", detail: "GET /api/kb/articles?categories=password,billing,features → 23 relevant articles", duration_ms: 1200, tokens: 0, system: "kb" },
      { step: 5, type: "output", title: "Auto-resolved 26 tickets", detail: "26/34 tickets resolved automatically. 4 escalated to human agents. 4 bug reports routed to engineering.", duration_ms: 6400, tokens: 3200 },
      { step: 6, type: "decision", title: "Escalation decisions created", detail: "Created 3 escalation decisions for complex tickets requiring human judgment.", duration_ms: 4000, tokens: 880 }
    ]),
    tools_used: JSON.stringify(["zendesk","kb"]),
  },
  {
    id: 'run_crit_3', agent_id: 'agent_board', created_at: daysAgo(1),
    duration_ms: 124000, tokens_used: 28400, cost_usd: 0.45, decisions_created: 1,
    steps: JSON.stringify([
      { step: 1, type: "plan", title: "Compiling weekly board pack", detail: "Gathering data for Week 6, 2026 executive summary.", duration_ms: 1500, tokens: 600 },
      { step: 2, type: "tool_call", title: "Snowflake: Revenue metrics", detail: "SELECT mrr, arr, nrr, churn FROM metrics WHERE week = 6 AND year = 2026 → Core financials retrieved", duration_ms: 8200, tokens: 0, system: "snowflake" },
      { step: 3, type: "tool_call", title: "Salesforce: Pipeline snapshot", detail: "GET /api/pipeline/summary → $12.4M pipeline, 67% stage-weighted", duration_ms: 4600, tokens: 0, system: "salesforce" },
      { step: 4, type: "tool_call", title: "Looker: Operational dashboards", detail: "GET /api/dashboards/export?ids=ops_weekly,support_weekly,product_weekly → 3 dashboard exports", duration_ms: 12400, tokens: 0, system: "looker" },
      { step: 5, type: "analysis", title: "Narrative synthesis", detail: "Generating executive narrative from 47 data points across 3 systems. Identifying top 5 highlights and 3 concerns.", duration_ms: 34000, tokens: 12000 },
      { step: 6, type: "tool_call", title: "Google Slides: Building deck", detail: "Creating 12-slide deck: Cover, Executive Summary, Revenue, Pipeline, Operations, Support, Product, Risks, Opportunities, Action Items, Appendix A, Appendix B", duration_ms: 45000, tokens: 0, system: "google_slides" },
      { step: 7, type: "tool_call", title: "Slack: Notification", detail: "POST /api/chat.postMessage → #executive-team: 'Weekly Board Pack ready for review'", duration_ms: 800, tokens: 0, system: "slack" },
      { step: 8, type: "decision", title: "Board pack review required", detail: "Created board_insight decision for CFO review. 24-hour review window per policy.", duration_ms: 17500, tokens: 15800 }
    ]),
    tools_used: JSON.stringify(["snowflake","salesforce","looker","google_slides","slack"]),
  },
];

for (const r of detailedRuns) {
  const startedAt = r.created_at;
  const completedAt = startedAt + r.duration_ms;
  insertRun.run(r.id, 'org_smartsheet', r.agent_id, 'completed', 'scheduled', startedAt, completedAt, r.duration_ms, r.steps, r.tools_used, r.tokens_used, r.cost_usd, r.decisions_created, null);
}

// 4 more detailed runs for other critical decisions
const moreDetailedRuns = [
  { id: 'run_crit_4', agent_id: 'agent_renewal', created_at: hoursAgo(6), duration_ms: 25000, tokens_used: 8200, cost_usd: 0.13 },
  { id: 'run_crit_5', agent_id: 'agent_renewal', created_at: hoursAgo(8), duration_ms: 22000, tokens_used: 7400, cost_usd: 0.12 },
  { id: 'run_crit_6', agent_id: 'agent_renewal', created_at: hoursAgo(10), duration_ms: 19000, tokens_used: 6800, cost_usd: 0.11 },
  { id: 'run_crit_7', agent_id: 'agent_renewal', created_at: hoursAgo(12), duration_ms: 21000, tokens_used: 7100, cost_usd: 0.11 },
];

for (const r of moreDetailedRuns) {
  const steps = JSON.stringify([
    { step: 1, type: "plan", title: "Renewal risk scan", detail: "Initiating focused risk assessment.", duration_ms: 900, tokens: 350 },
    { step: 2, type: "tool_call", title: "Salesforce: Account data", detail: "Pulling account details and renewal timeline.", duration_ms: 2800, tokens: 0, system: "salesforce" },
    { step: 3, type: "analysis", title: "Signal correlation", detail: "Analyzing usage, support, billing, and engagement signals.", duration_ms: 8000, tokens: 3200 },
    { step: 4, type: "decision", title: "Risk decision generated", detail: "Critical risk detected. Save plan generated.", duration_ms: 5000, tokens: 2400 }
  ]);
  insertRun.run(r.id, 'org_smartsheet', r.agent_id, 'completed', 'scheduled', r.created_at, r.created_at + r.duration_ms, r.duration_ms, steps, JSON.stringify(["salesforce","analytics","zendesk"]), r.tokens_used, r.cost_usd, 1, null);
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
    const cost = tokens * 0.000015;
    const decisions = Math.random() < 0.15 ? Math.floor(1 + Math.random() * 3) : 0;
    const status = Math.random() < 0.02 ? 'failed' : 'completed';
    const steps = JSON.stringify([
      { step: 1, type: "plan", title: "Scheduled renewal scan", detail: "Routine 4-hour renewal risk check.", duration_ms: 800, tokens: 300 },
      { step: 2, type: "tool_call", title: "Salesforce: Pipeline check", detail: `Scanned ${30 + Math.floor(Math.random() * 20)} accounts.`, duration_ms: 2500, tokens: 0 },
      { step: 3, type: "analysis", title: "Risk scoring", detail: `${decisions} accounts flagged for review.`, duration_ms: 6000, tokens: 2000 },
    ]);
    insertRun.run(runId, 'org_smartsheet', 'agent_renewal', status, 'scheduled', startedAt, startedAt + duration, duration, steps, JSON.stringify(["salesforce","analytics"]), tokens, cost, decisions, status === 'failed' ? 'Salesforce API timeout after 30s' : null);
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
    const cost = tokens * 0.000015;
    const resolved = Math.floor(1 + Math.random() * 5);
    const steps = JSON.stringify([
      { step: 1, type: "tool_call", title: "Zendesk: New tickets", detail: `Fetched ${resolved + Math.floor(Math.random() * 3)} new tickets.`, duration_ms: 1200, tokens: 0 },
      { step: 2, type: "analysis", title: "Classification", detail: `Classified tickets. ${resolved} auto-resolvable.`, duration_ms: 3000, tokens: 1200 },
      { step: 3, type: "output", title: "Tickets resolved", detail: `Auto-resolved ${resolved} tickets.`, duration_ms: 2000, tokens: 800 },
    ]);
    insertRun.run(runId, 'org_smartsheet', 'agent_support', 'completed', 'scheduled', startedAt, startedAt + duration, duration, steps, JSON.stringify(["zendesk","kb"]), tokens, cost, 0, null);
    simpleRunCount++;
  }

  // Board pack runs (weekly on Mondays)
  if (new Date(daysAgo(day)).getDay() === 1 && day >= 60) {
    const runId = `run_board_d${day}`;
    const startedAt = daysAgo(day) + 8 * HOUR;
    const duration = 90000 + Math.floor(Math.random() * 60000);
    const tokens = 20000 + Math.floor(Math.random() * 10000);
    const cost = tokens * 0.000015;
    const steps = JSON.stringify([
      { step: 1, type: "tool_call", title: "Snowflake: Metrics", detail: "Pulling weekly KPIs.", duration_ms: 6000, tokens: 0 },
      { step: 2, type: "tool_call", title: "Salesforce: Pipeline", detail: "Pulling pipeline snapshot.", duration_ms: 4000, tokens: 0 },
      { step: 3, type: "analysis", title: "Narrative synthesis", detail: "Generating executive summary.", duration_ms: 30000, tokens: 12000 },
      { step: 4, type: "tool_call", title: "Google Slides: Deck", detail: "Building 12-slide board pack.", duration_ms: 40000, tokens: 0 },
    ]);
    insertRun.run(runId, 'org_smartsheet', 'agent_board', 'completed', 'scheduled', startedAt, startedAt + duration, duration, steps, JSON.stringify(["snowflake","salesforce","looker","google_slides","slack"]), tokens, cost, 1, null);
    simpleRunCount++;
  }
}

console.log(`✅ ${detailedRuns.length + moreDetailedRuns.length + simpleRunCount} runs total`);

// ── KPI Snapshots (90 days for Smartsheet) ─────────────────────────────────────
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
    agentCost = 15 + ramp * 10 + n() * 3;
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
    `kpi_ss_${dateStr}`, 'org_smartsheet', dateStr,
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
  { id: 'int_sf', name: 'Salesforce', type: 'crm', health: 0.98, lastSync: minutesAgo(5), config: { instance: 'smartsheet.my.salesforce.com', api_version: 'v59.0' } },
  { id: 'int_zd', name: 'Zendesk', type: 'support', health: 1.0, lastSync: minutesAgo(2), config: { subdomain: 'smartsheet', plan: 'enterprise' } },
  { id: 'int_snow', name: 'Snowflake', type: 'data_warehouse', health: 0.95, lastSync: hoursAgo(1), config: { account: 'smartsheet.us-west-2', warehouse: 'ANALYTICS_WH' } },
  { id: 'int_slack', name: 'Slack', type: 'communication', health: 1.0, lastSync: minutesAgo(0.5), config: { workspace: 'smartsheet-hq', channels: ['#executive-team','#cs-alerts','#agent-notifications'] } },
  { id: 'int_jira', name: 'Jira', type: 'project_mgmt', health: 0.97, lastSync: minutesAgo(10), config: { instance: 'smartsheet.atlassian.net', projects: ['CS','ENG','PROD'] } },
  { id: 'int_gslides', name: 'Google Slides', type: 'reporting', health: 1.0, lastSync: daysAgo(3), config: { service_account: 'agent-os@smartsheet.iam.gserviceaccount.com' } },
];

for (const i of integrations) {
  insertIntegration.run(i.id, 'org_smartsheet', i.name, i.type, 'connected', JSON.stringify(i.config), i.lastSync, i.health, daysAgo(90));
}
console.log(`✅ ${integrations.length} integrations`);

// ── Policies ───────────────────────────────────────────────────────────────────
const insertPolicy = db.prepare(`INSERT INTO policies (id, org_id, name, type, scope, rules, enabled, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

const policies = [
  { id: 'pol_comms', name: 'Customer Communications', type: 'approval_required', scope: 'all', rules: { requires: 'manager_approval', applies_to: ['email_draft','slack_message'] } },
  { id: 'pol_discount', name: 'Discount Authorization', type: 'two_person', scope: 'nrr', rules: { threshold_percent: 15, requires: 'vp_approval_above_threshold' } },
  { id: 'pol_auto', name: 'Support Auto-Resolution', type: 'auto_approve', scope: 'support', rules: { categories: ['password_reset','billing_inquiry','status_check'], confidence_min: 0.85 } },
  { id: 'pol_budget', name: 'Daily Agent Budget', type: 'budget_limit', scope: 'all', rules: { max_daily_usd: 50, alert_at_percent: 80 } },
  { id: 'pol_board', name: 'Board Pack Review', type: 'approval_required', scope: 'board_pack', rules: { requires: 'cfo_review', review_window_hours: 24 } },
];

for (const p of policies) {
  insertPolicy.run(p.id, 'org_smartsheet', p.name, p.type, p.scope, JSON.stringify(p.rules), 1, daysAgo(90));
}
console.log(`✅ ${policies.length} policies`);

// ── Audit Log (200+ entries, hash-chained) ─────────────────────────────────────
const insertAudit = db.prepare(`INSERT INTO audit_log (id, org_id, prev_hash, hash, actor, action, resource_type, resource_id, details, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

let prevHash: string | null = null;
let auditCount = 0;

// Genesis entry
const genesisHash = createHash('sha256').update('genesis').digest('hex');
insertAudit.run(uuid(), 'org_smartsheet', null, genesisHash, 'system', 'system.initialized', 'system', 'org_smartsheet', JSON.stringify({ message: 'GenCap Agent OS initialized for Smartsheet' }), daysAgo(90));
prevHash = genesisHash;
auditCount++;

// Actors
const actors = [
  'agent:renewal_guardian', 'agent:support_sentinel', 'agent:executive_lens',
  'sarah.johnson@smartsheet.com', 'mike.chen@gencap.ai', 'lisa.park@smartsheet.com',
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

// Generate 250 audit entries across 90 days
for (let i = 0; i < 250; i++) {
  const day = Math.floor(Math.random() * 90);
  const timeInDay = Math.floor(Math.random() * 24 * HOUR);
  const timestamp = daysAgo(day) + timeInDay;
  
  const actionDef = pickAction();
  
  let actor: string;
  if (actionDef.action.startsWith('agent.') || actionDef.action === 'decision.created') {
    actor = actors[Math.floor(Math.random() * 3)]; // agent actors
  } else if (actionDef.action.startsWith('decision.approved') || actionDef.action.startsWith('decision.rejected')) {
    actor = actors[3 + Math.floor(Math.random() * 2)]; // human actors
  } else if (actionDef.action === 'integration.sync.completed') {
    actor = 'system';
  } else {
    actor = actors[3 + Math.floor(Math.random() * 3)]; // human + system
  }

  let resourceId: string;
  if (actionDef.resource_type === 'agent') {
    resourceId = ['agent_renewal', 'agent_support', 'agent_board'][Math.floor(Math.random() * 3)];
  } else if (actionDef.resource_type === 'decision') {
    resourceId = `dec_${Math.floor(Math.random() * 50)}`;
  } else if (actionDef.resource_type === 'run') {
    resourceId = `run_${Math.floor(Math.random() * 100)}`;
  } else if (actionDef.resource_type === 'integration') {
    resourceId = integrations[Math.floor(Math.random() * integrations.length)].id;
  } else {
    resourceId = policies[Math.floor(Math.random() * policies.length)].id;
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
  insertAudit.run(uuid(), 'org_smartsheet', prevHash, hash, actor, actionDef.action, actionDef.resource_type, resourceId, JSON.stringify(details), timestamp);
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
