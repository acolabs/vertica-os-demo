import { getDb } from './db';

export function initializeDatabase(): void {
  const db = getDb();

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

    -- Indexes
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
}
