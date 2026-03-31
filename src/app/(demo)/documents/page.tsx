"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FileText,
  ClipboardList,
  Shield,
  BarChart3,
  CheckSquare,
  Scale,
  PlayCircle,
  HelpCircle,
  AlertTriangle,
  Target,
  Zap,
  Bot,
  Users,
  Lock,
  CheckCircle,
  TrendingUp,
  Clock,
  DollarSign,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { InvestmentCalculator } from "@/components/documents/investment-calculator";

/* ------------------------------------------------------------------ */
/*  Types & Data                                                       */
/* ------------------------------------------------------------------ */

interface DocSection {
  id: string;
  title: string;
  icon: LucideIcon;
  status: "complete" | "draft";
  group: "closing" | "appendix";
}

const sections: DocSection[] = [
  { id: "proposal", title: "Platform Proposal", icon: FileText, status: "complete", group: "closing" },
  { id: "sow", title: "Pilot SOW", icon: ClipboardList, status: "complete", group: "closing" },
  { id: "security", title: "Security & Data", icon: Shield, status: "complete", group: "closing" },
  { id: "roi", title: "ROI & Attribution", icon: BarChart3, status: "complete", group: "closing" },
  { id: "raci", title: "Implementation RACI", icon: CheckSquare, status: "complete", group: "closing" },
  { id: "legal", title: "Legal & Terms", icon: Scale, status: "draft", group: "closing" },
  { id: "demo", title: "Demo Walkthrough", icon: PlayCircle, status: "complete", group: "closing" },
  { id: "faq", title: "Executive FAQ", icon: HelpCircle, status: "complete", group: "appendix" },
  { id: "risks", title: "Risks & Mitigations", icon: AlertTriangle, status: "complete", group: "appendix" },
];

/* ------------------------------------------------------------------ */
/*  Section content components                                         */
/* ------------------------------------------------------------------ */

function ProposalContent() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-[var(--primary-10)] flex items-center justify-center">
            <FileText className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">VERTICA OS — Platform Proposal</h1>
            <p className="text-sm text-[var(--text-secondary)]">Portfolio Operator Platform powered by Adapt Agents</p>
          </div>
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-2">
          Prepared for Philip Vorobeychik, Managing Director — Vertica Capital Partners
        </p>
      </div>

      {/* Executive Summary */}
      <Card className="glass-card shadow-premium border-[var(--card-border)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
            <Target className="w-5 h-5 text-[var(--primary)]" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            VERTICA OS is a{" "}
            <span className="text-[var(--text-primary)] font-medium">Portfolio Operator Platform</span>{" "}
            that deploys AI agents to automate and optimize the value creation playbook across Vertica
            Capital Partners&apos; 75+ portfolio companies.
          </p>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Unlike generic AI tools, VERTICA OS encodes Vertica&apos;s proven operational DNA — inside
            sales best practices, GTM cadence discipline, and portfolio-wide pattern recognition — into
            autonomous agents that operate 24/7 with full human oversight.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="text-center p-3 rounded-lg bg-[var(--surface)]">
              <p className="text-2xl font-bold text-[var(--primary)]">15-25x</p>
              <p className="text-xs text-[var(--text-muted)]">Target Agent ROI</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-[var(--surface)]">
              <p className="text-2xl font-bold text-emerald-400">30-45%</p>
              <p className="text-xs text-[var(--text-muted)]">Target Support Deflection</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-[var(--surface)]">
              <p className="text-2xl font-bold text-purple-400">+3-8pts</p>
              <p className="text-xs text-[var(--text-muted)]">Target NRR Improvement</p>
            </div>
          </div>
          <p className="text-[10px] text-[var(--text-muted)] italic pt-1">
            All metrics are target ranges based on benchmarks from comparable deployments. Actual results
            depend on data quality, operator adoption, and business context. The pilot will establish
            baselines and validate projections. See ROI &amp; Attribution section for methodology.
          </p>
        </CardContent>
      </Card>

      {/* The Opportunity */}
      <Card className="glass-card shadow-premium border-[var(--card-border)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
            <Zap className="w-5 h-5 text-amber-400" />
            The Opportunity
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Vertica&apos;s competitive advantage is operational rigor — the ability to deploy proven GTM
            playbooks, sales cadences, and operational best practices across portfolio companies. Today,
            this relies on human operators scaling across 75+ companies.
          </p>
          <div className="space-y-2 pt-2">
            {[
              "Sales leaders manually compile pipeline reports and coaching plans — 4-6 hours/week per company",
              "Support teams handle repetitive tickets that could be auto-resolved — $15-22 cost per ticket",
              "Renewal risks are caught reactively — often after signals have been present for weeks",
              "Operational playbooks exist as documents, not as executable systems",
              "Portfolio-wide pattern recognition is impossible at human scale",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span>
                <p className="text-sm text-[var(--text-secondary)]">{item}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* How It Works */}
      <Card className="glass-card shadow-premium border-[var(--card-border)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
            <Bot className="w-5 h-5 text-[var(--primary)]" />
            How VERTICA OS Works
          </CardTitle>
          <CardDescription>Three-layer architecture: Connect → Analyze → Act</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="border-l-2 border-[var(--primary)] pl-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
              1. Connect — System Integration
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Agents connect to existing tools (Salesforce, HubSpot, Zendesk, Intercom, Gong, Slack) via
              secure API integrations. Read access is default; write access requires explicit policy
              approval.
            </p>
          </div>
          <div className="border-l-2 border-purple-400 pl-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
              2. Analyze — Continuous Intelligence
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Agents run on configurable schedules (every 2-8 hours), cross-referencing signals across CRM,
              support, product analytics, and billing to surface insights humans would miss. Every analysis
              produces a transparent reasoning trace.
            </p>
          </div>
          <div className="border-l-2 border-emerald-400 pl-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">
              3. Act — Governed Execution
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              All agent recommendations flow to the{" "}
              <span className="font-medium text-[var(--text-primary)]">Decision Inbox</span> for human
              review. Low-risk actions (e.g., KB-based support resolution) can be auto-approved via
              configurable policies. High-impact actions always require human approval.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Agent Fleet */}
      <Card className="glass-card shadow-premium border-[var(--card-border)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
            <Users className="w-5 h-5 text-sky-400" />
            Agent Fleet — Template Library
          </CardTitle>
          <CardDescription>Deployable across any portfolio company in under 1 week</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              name: "Revenue Cadence Agent",
              badge: "Highest ROI",
              badgeColor: "text-emerald-400 bg-emerald-500/15",
              desc: "Compiles daily/weekly sales operating cadence from CRM, call intelligence, and pipeline data. Generates rep coaching plans, identifies coverage gaps, and distributes actionable briefings. Encodes Vertica's GTM rigor into an automated system.",
              metrics: "Pipeline coverage ↑ | Stage conversion ↑ | Forecast accuracy ↑",
            },
            {
              name: "Support Deflection Agent",
              badge: "Fast EBITDA Impact",
              badgeColor: "text-sky-400 bg-sky-500/15",
              desc: "Auto-triages and resolves support tickets using knowledge base matching and classification. Handles routine inquiries autonomously (with approval gates), escalates complex issues to specialists. Direct cost center impact.",
              metrics: "Deflection rate ↑ | AHT ↓ | Cost-per-ticket ↓ | CSAT stable",
            },
            {
              name: "NRR / Renewal Agent",
              badge: "Revenue Protection",
              badgeColor: "text-purple-400 bg-purple-500/15",
              desc: "Runs continuous renewal risk assessments by cross-referencing usage trends, support health, billing patterns, and champion changes. Generates proactive save plans for at-risk accounts before signals become churn events.",
              metrics: "NRR ↑ | Churn rate ↓ | Save rate ↑ | Early detection",
            },
            {
              name: "Pipeline Scout Agent",
              badge: "Growth Engine",
              badgeColor: "text-amber-400 bg-amber-500/15",
              desc: "Monitors expansion signals, competitive displacement risks, and M&A activity across the customer base. Flags upsell opportunities and new market entry points for sales teams.",
              metrics: "Expansion revenue ↑ | Competitive win rate ↑ | Pipeline velocity ↑",
            },
          ].map((agent, i) => (
            <div key={i} className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)]">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">{agent.name}</h3>
                <Badge variant="outline" className={`text-[10px] border-transparent ${agent.badgeColor}`}>
                  {agent.badge}
                </Badge>
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-2">{agent.desc}</p>
              <p className="text-[10px] text-[var(--text-muted)] font-mono">{agent.metrics}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Governance & Trust */}
      <Card className="glass-card shadow-premium border-[var(--card-border)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
            <Shield className="w-5 h-5 text-emerald-400" />
            Governance & Trust
          </CardTitle>
          <CardDescription>PE-grade compliance and auditability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: Lock,
                title: "RBAC Policies",
                desc: "Role-based access control with per-agent, per-action permissions. Two-person rule for high-risk actions.",
              },
              {
                icon: Shield,
                title: "SHA-256 Audit Chain",
                desc: "Every agent action is recorded in an immutable, hash-chained audit log. Tamper-proof compliance trail.",
              },
              {
                icon: CheckCircle,
                title: "Human-in-the-Loop",
                desc: "All decisions flow through approval gates. Shadow mode → suggestion mode → limited autonomy progression.",
              },
              {
                icon: BarChart3,
                title: "Outcome Attribution",
                desc: "Every dollar of value created is traceable to a specific agent action, decision, and approval. Board-ready reporting.",
              },
            ].map((item, i) => (
              <div key={i} className="p-3 rounded-lg bg-[var(--surface)]">
                <div className="flex items-center gap-2 mb-1.5">
                  <item.icon className="w-4 h-4 text-emerald-400" />
                  <h4 className="text-xs font-semibold text-[var(--text-primary)]">{item.title}</h4>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Deployment & Data Boundaries */}
      <Card className="glass-card shadow-premium border-[var(--card-border)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
            <Lock className="w-5 h-5 text-[var(--primary)]" />
            Deployment & Data Boundaries
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            {[
              { label: "Data Residency", value: "US-based cloud infrastructure (AWS us-east-1). EU hosting available on request." },
              { label: "Data Retention", value: "Configurable: 30 or 90 days for session context. Audit logs retained 12 months. All data deleted within 30 days of pilot termination." },
              { label: "No Training on Customer Data", value: "Your data is never used to train AI models. We use Anthropic Claude via their API with explicit no-training provisions. Model outputs are ephemeral." },
              { label: "Encryption", value: "AES-256 at rest, TLS 1.3 in transit. Per-tenant credential vault with envelope encryption." },
              { label: "Tenant Isolation", value: "Hard data boundaries at the database level. Separate schemas per org. No cross-tenant access under any circumstance." },
            ].map((item, i) => (
              <div key={i} className="flex gap-3 p-2 rounded-lg bg-[var(--surface)]">
                <span className="text-xs font-semibold text-[var(--text-primary)] w-44 shrink-0">{item.label}</span>
                <span className="text-xs text-[var(--text-secondary)]">{item.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pilot Scope & Deliverables */}
      <Card className="glass-card shadow-premium border-[var(--card-border)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
            <CheckSquare className="w-5 h-5 text-[var(--primary)]" />
            Pilot Scope & Deliverables
          </CardTitle>
          <CardDescription>What ships in 30 days</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "3 Connectors Live", desc: "CRM + Support + one additional (Gong, Slack, or analytics)" },
              { label: "2 Agents Enabled", desc: "Revenue Cadence Agent + Support Deflection Agent fully operational" },
              { label: "Decision Inbox", desc: "Centralized approval interface for all agent-generated actions" },
              { label: "Audit Log", desc: "Immutable, hash-chained activity trail from Day 1" },
              { label: "Policy Gates", desc: "Configurable approval rules by action type and risk level" },
              { label: "Day 30 Value Report", desc: "Comprehensive attribution report with baseline comparisons and ROI analysis" },
            ].map((d, i) => (
              <div key={i} className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)]">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-3.5 h-3.5 text-[var(--primary)]" />
                  <span className="text-xs font-semibold text-[var(--text-primary)]">{d.label}</span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)]">{d.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Scale */}
      <Card className="glass-card shadow-premium border-[var(--card-border)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
            <TrendingUp className="w-5 h-5 text-[var(--primary)]" />
            Portfolio-Scale Value
          </CardTitle>
          <CardDescription>Template once, deploy everywhere</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            VERTICA OS is{" "}
            <span className="font-medium text-[var(--text-primary)]">multi-tenant by design</span>. Each
            portfolio company is a hard-isolated tenant with its own data boundaries, agent fleet, and
            policies. Agent templates that prove ROI in one company can be deployed across the entire
            portfolio in days, not months.
          </p>
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { cluster: "Booking & Experiences", companies: "Rezdy, Regiondo, Checkfront, Campspot", count: "4 companies" },
              { cluster: "Vertical SaaS Ops", companies: "DSN, Condo Control, ARMS", count: "3 companies" },
              { cluster: "Security & GRC", companies: "Pathlock, ProLion", count: "2 companies" },
            ].map((c, i) => (
              <div key={i} className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)]">
                <p className="text-xs font-semibold text-[var(--text-primary)] mb-1">{c.cluster}</p>
                <p className="text-[10px] text-[var(--text-muted)] mb-1">{c.companies}</p>
                <Badge variant="outline" className="text-[9px] border-transparent bg-[var(--primary-10)] text-[var(--primary)]">
                  {c.count}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 30-Day Pilot Plan */}
      <Card className="glass-card shadow-premium border-[var(--card-border)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
            <Clock className="w-5 h-5 text-amber-400" />
            Proposed 30-Day Pilot
          </CardTitle>
          <CardDescription>Prove value with one portfolio company before portfolio-wide rollout</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { week: "Week 0", title: "Connect & Baseline", desc: "Select pilot company. Connect CRM + support + analytics. Establish baseline KPIs (pipeline coverage, conversion, cycle time, deflection, AHT).", status: "Setup" },
            { week: "Week 1", title: "Shadow Mode", desc: "Agents run daily but do NOT write to any system. Build evaluation dataset from top 50 deals and 200 tickets. Score accuracy of recommendations.", status: "Observe" },
            { week: "Week 2", title: "Suggestion Mode (HITL)", desc: "Agents create drafts and tasks with human approval required. Measure: acceptance rate, time-to-action, operator satisfaction.", status: "Validate" },
            { week: "Week 3-4", title: "Limited Autonomy", desc: "Enable auto-actions for pre-approved low-risk categories only. Deliver board-ready value creation report: KPI deltas, savings, ARR impact, rollout plan.", status: "Prove" },
          ].map((phase, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[var(--primary-10)] flex items-center justify-center text-xs font-bold text-[var(--primary)]">
                  {i + 1}
                </div>
                {i < 3 && <div className="w-px h-full bg-[var(--border)] mt-1" />}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-[10px] border-[var(--border)] text-[var(--text-muted)]">
                    {phase.week}
                  </Badge>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">{phase.title}</h3>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{phase.desc}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Investment & Next Steps — Interactive Calculator */}
      <InvestmentCalculator />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function SOWContent() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-[var(--primary-10)] flex items-center justify-center">
            <ClipboardList className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Pilot Statement of Work</h1>
            <p className="text-sm text-[var(--text-secondary)]">30-Day Proof of Value Engagement</p>
          </div>
        </div>
      </div>

      {/* Pilot Parameters */}
      <Card className="glass-card shadow-premium border-[var(--card-border)]">
        <CardHeader>
          <CardTitle className="text-[var(--text-primary)]">Pilot Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-[var(--surface)]">
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Duration</p>
              <p className="text-sm font-semibold text-[var(--text-primary)]">30 Days</p>
            </div>
            <div className="p-3 rounded-lg bg-[var(--surface)]">
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Portfolio Company</p>
              <p className="text-sm font-semibold text-[var(--text-primary)]">[Selected at Kickoff]</p>
            </div>
            <div className="p-3 rounded-lg bg-[var(--surface)]">
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">Phase 1 Agents</p>
              <p className="text-sm font-semibold text-[var(--text-primary)]">Revenue Cadence + Support Deflection</p>
            </div>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Phase 2 (if warranted): NRR / Renewal Agent activated based on Phase 1 results.
          </p>
        </CardContent>
      </Card>

      {/* Systems in Scope */}
      <Card className="glass-card shadow-premium border-[var(--card-border)]">
        <CardHeader>
          <CardTitle className="text-[var(--text-primary)]">Systems in Scope</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[var(--card-border)]">
                <TableHead className="text-[var(--text-muted)]">System</TableHead>
                <TableHead className="text-[var(--text-muted)]">Platform</TableHead>
                <TableHead className="text-[var(--text-muted)]">Access Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { system: "CRM", platform: "Salesforce or HubSpot", access: "Read + limited write" },
                { system: "Support", platform: "Zendesk or Intercom", access: "Read + auto-draft" },
                { system: "Call Intelligence", platform: "Gong", access: "Read-only" },
                { system: "Communication", platform: "Slack", access: "Notification delivery" },
                { system: "All others", platform: "—", access: "Read-only unless explicitly approved" },
              ].map((s, i) => (
                <TableRow key={i} className="border-[var(--card-border)]">
                  <TableCell className="text-sm font-medium text-[var(--text-primary)]">{s.system}</TableCell>
                  <TableCell className="text-sm text-[var(--text-secondary)]">{s.platform}</TableCell>
                  <TableCell className="text-sm text-[var(--text-secondary)]">{s.access}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Write Access Boundaries */}
      <Card className="glass-card shadow-premium border-[var(--card-border)]">
        <CardHeader>
          <CardTitle className="text-[var(--text-primary)]">Write Access Boundaries</CardTitle>
          <CardDescription>Read-only by default for all integrations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <h4 className="text-xs font-semibold text-emerald-400 mb-2">Approved Writes</h4>
            <ul className="space-y-1">
              {[
                "CRM field updates (risk score, next step)",
                "Jira ticket creation",
                "Email drafts (human sends)",
              ].map((item, i) => (
                <li key={i} className="text-xs text-[var(--text-secondary)] flex items-center gap-2">
                  <span className="text-emerald-400">•</span> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <h4 className="text-xs font-semibold text-red-400 mb-2">🚫 Never Writes</h4>
            <ul className="space-y-1">
              {[
                "Customer-facing emails",
                "Discount or contract changes",
                "Financial transactions",
                "Bulk data modifications",
              ].map((item, i) => (
                <li key={i} className="text-xs text-[var(--text-secondary)] flex items-center gap-2">
                  <span className="text-red-400">•</span> {item}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Success Metrics */}
      <Card className="glass-card shadow-premium border-[var(--card-border)]">
        <CardHeader>
          <CardTitle className="text-[var(--text-primary)]">Success Metrics & Thresholds</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[var(--card-border)]">
                <TableHead className="text-[var(--text-muted)]">Metric</TableHead>
                <TableHead className="text-[var(--text-muted)]">Baseline (Week 0)</TableHead>
                <TableHead className="text-[var(--text-muted)]">Target (Day 30)</TableHead>
                <TableHead className="text-[var(--text-muted)]">Measurement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { metric: "Pipeline Coverage", baseline: "Current", target: "≥ 3.5x", measurement: "CRM pipeline / quota" },
                { metric: "Stage Conversion", baseline: "Current", target: "↑ 15%+", measurement: "Win rate by stage" },
                { metric: "Forecast Accuracy", baseline: "Current", target: "↑ 10%+", measurement: "Forecast vs actual" },
                { metric: "Support Deflection", baseline: "Current", target: "≥ 25%", measurement: "Auto-resolved / total" },
                { metric: "Avg Handle Time", baseline: "Current", target: "↓ 20%+", measurement: "Minutes per ticket" },
                { metric: "CSAT", baseline: "Current", target: "≥ baseline", measurement: "Post-resolution survey" },
              ].map((m, i) => (
                <TableRow key={i} className="border-[var(--card-border)]">
                  <TableCell className="text-sm font-medium text-[var(--text-primary)]">{m.metric}</TableCell>
                  <TableCell className="text-sm text-[var(--text-secondary)]">{m.baseline}</TableCell>
                  <TableCell className="text-sm font-semibold text-[var(--primary)]">{m.target}</TableCell>
                  <TableCell className="text-sm text-[var(--text-muted)]">{m.measurement}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Go/No-Go */}
      <Card className="glass-card shadow-premium border-[var(--card-border)]">
        <CardHeader>
          <CardTitle className="text-[var(--text-primary)]">Go / No-Go Exit Criteria</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <p className="text-sm text-[var(--text-primary)]">
              <span className="font-semibold text-emerald-400">EXPAND</span> — 3+ metrics meet targets AND operator satisfaction ≥ 4/5
            </p>
          </div>
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <p className="text-sm text-[var(--text-primary)]">
              <span className="font-semibold text-amber-400">REVISE</span> — 1-2 metrics meet targets, others trending positive
            </p>
          </div>
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-[var(--text-primary)]">
              <span className="font-semibold text-red-400">STOP</span> — 0 metrics trending positive after Week 3
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Deliverables */}
      <Card className="glass-card shadow-premium border-[var(--card-border)]">
        <CardHeader>
          <CardTitle className="text-[var(--text-primary)]">Deliverables</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { num: 1, text: "Working tenant with org-specific configuration" },
            { num: 2, text: "2-3 live integrations (CRM + Support + one additional)" },
            { num: 3, text: "Agent templates configured for portfolio company context" },
            { num: 4, text: "Decision Inbox, Audit Log, and Policy Gates operational" },
            { num: 5, text: "Day 30 Value Creation Report with attribution" },
          ].map((d) => (
            <div key={d.num} className="flex items-start gap-3 p-2">
              <div className="w-6 h-6 rounded-full bg-[var(--primary-10)] flex items-center justify-center text-xs font-bold text-[var(--primary)] shrink-0">
                {d.num}
              </div>
              <p className="text-sm text-[var(--text-secondary)]">{d.text}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function SecurityContent() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-[var(--primary-10)] flex items-center justify-center">
            <Shield className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Security & Data Handling</h1>
            <p className="text-sm text-[var(--text-secondary)]">Enterprise-grade data protection and compliance</p>
          </div>
        </div>
      </div>

      {/* Data Flow Architecture */}
      <Card className="glass-card shadow-premium border-[var(--card-border)]">
        <CardHeader>
          <CardTitle className="text-[var(--text-primary)]">Data Flow Architecture</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            "Agent reads data from connected systems via OAuth2 / API keys",
            "Data processed in-memory for analysis; structured outputs stored in tenant-isolated database",
            "No raw customer PII stored beyond session context (configurable retention: 30/90 days)",
            "All data encrypted at rest (AES-256) and in transit (TLS 1.3)",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-[var(--surface)]">
              <Lock className="w-3.5 h-3.5 text-[var(--primary)] mt-0.5 shrink-0" />
              <p className="text-sm text-[var(--text-secondary)]">{item}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Tenant Isolation */}
      <Card className="glass-card shadow-premium border-[var(--card-border)]">
        <CardHeader>
          <CardTitle className="text-[var(--text-primary)]">Tenant Isolation Model</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            "Each portfolio company is a separate tenant with hard data boundaries",
            "Database-level isolation (separate schemas per org)",
            "API keys and credentials stored per-tenant in encrypted vault",
            "No cross-tenant data access, even for portfolio-level analytics",
            "Portfolio-level insights only from aggregated, anonymized metrics",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-[var(--surface)]">
              <Shield className="w-3.5 h-3.5 text-emerald-400 mt-0.5 shrink-0" />
              <p className="text-sm text-[var(--text-secondary)]">{item}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Access Controls */}
      <Card className="glass-card shadow-premium border-[var(--card-border)]">
        <CardHeader>
          <CardTitle className="text-[var(--text-primary)]">Access Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[var(--card-border)]">
                <TableHead className="text-[var(--text-muted)]">Control</TableHead>
                <TableHead className="text-[var(--text-muted)]">Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { control: "RBAC Roles", details: "Partner / Operating Lead / CRO / Head of Support / Viewer" },
                { control: "SSO", details: "SAML 2.0 / OIDC (configurable)" },
                { control: "MFA", details: "Enforced for all admin accounts" },
                { control: "Session Timeout", details: "8 hours (configurable)" },
                { control: "IP Allowlisting", details: "Available for all tenants" },
              ].map((row, i) => (
                <TableRow key={i} className="border-[var(--card-border)]">
                  <TableCell className="text-sm font-medium text-[var(--text-primary)]">{row.control}</TableCell>
                  <TableCell className="text-sm text-[var(--text-secondary)]">{row.details}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Audit & Compliance */}
      <Card className="glass-card shadow-premium border-[var(--card-border)]">
        <CardHeader>
          <CardTitle className="text-[var(--text-primary)]">Audit & Compliance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            "SHA-256 hash-chained audit log (immutable, tamper-evident)",
            "Every agent action, approval, and data access logged",
            "Exportable audit trail for compliance review",
            "12-month audit log retention (configurable)",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-[var(--surface)]">
              <CheckCircle className="w-3.5 h-3.5 text-[var(--primary)] mt-0.5 shrink-0" />
              <p className="text-sm text-[var(--text-secondary)]">{item}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Model & AI Providers */}
      <Card className="glass-card shadow-premium border-[var(--card-border)]">
        <CardHeader>
          <CardTitle className="text-[var(--text-primary)]">Model & AI Providers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            "Primary: Anthropic Claude (Sonnet/Opus) — no customer data used for training",
            "All model calls via Anthropic's API with data processing agreement",
            "Model outputs are ephemeral — not stored by provider",
            "Option to use customer's own API keys for full data control",
            "No third-party subprocessors beyond the model provider",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-[var(--surface)]">
              <Bot className="w-3.5 h-3.5 text-purple-400 mt-0.5 shrink-0" />
              <p className="text-sm text-[var(--text-secondary)]">{item}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Incident Response */}
      <Card className="glass-card shadow-premium border-[var(--card-border)]">
        <CardHeader>
          <CardTitle className="text-[var(--text-primary)]">Incident Response</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            "24-hour breach notification",
            "Dedicated security contact",
            "Quarterly security review available",
            "SOC 2 Type II in progress (target: Q3 2026)",
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-[var(--surface)]">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
              <p className="text-sm text-[var(--text-secondary)]">{item}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function ROIContent() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-[var(--primary-10)] flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">ROI & Attribution Methodology</h1>
            <p className="text-sm text-[var(--text-secondary)]">How we measure and attribute value creation</p>
          </div>
        </div>
      </div>

      {/* Headline Metrics */}
      <Card className="glass-card shadow-premium border-[var(--card-border)]">
        <CardHeader>
          <CardTitle className="text-[var(--text-primary)]">Headline Metrics — Targets, Not Guarantees</CardTitle>
          <CardDescription>
            All metrics are target ranges based on benchmarks from comparable deployments. Actual results
            depend on data quality, operator adoption, and business context.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[var(--card-border)]">
                <TableHead className="text-[var(--text-muted)]">Metric</TableHead>
                <TableHead className="text-[var(--text-muted)]">Target Range</TableHead>
                <TableHead className="text-[var(--text-muted)]">Assumption</TableHead>
                <TableHead className="text-[var(--text-muted)]">Attribution Method</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  metric: "Agent ROI",
                  range: "15-25x",
                  assumption: "Agent cost $80-150/day, value from prevented churn + efficiency",
                  attribution: "Total attributed value / total agent compute cost",
                },
                {
                  metric: "Support Deflection",
                  range: "30-45%",
                  assumption: "Baseline deflection <15%, adequate KB coverage",
                  attribution: "Tickets auto-resolved / total tickets (agent-handled)",
                },
                {
                  metric: "NRR Improvement",
                  range: "+3-8 pts",
                  assumption: "Baseline NRR 95-102%, churn >5%",
                  attribution: "Compare cohort NRR: agent-monitored vs control",
                },
                {
                  metric: "Pipeline Coverage",
                  range: "↑ 20-35%",
                  assumption: "Current coverage <3x, CRM data quality adequate",
                  attribution: "Pipeline/quota ratio change, pre vs post",
                },
              ].map((m, i) => (
                <TableRow key={i} className="border-[var(--card-border)]">
                  <TableCell className="text-sm font-medium text-[var(--text-primary)]">{m.metric}</TableCell>
                  <TableCell className="text-sm font-semibold text-[var(--primary)]">{m.range}</TableCell>
                  <TableCell className="text-xs text-[var(--text-secondary)]">{m.assumption}</TableCell>
                  <TableCell className="text-xs text-[var(--text-muted)]">{m.attribution}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Separator className="bg-[var(--card-border)]" />

      {/* Attribution Rules */}
      <Card className="glass-card shadow-premium border-[var(--card-border)]">
        <CardHeader>
          <CardTitle className="text-[var(--text-primary)]">Attribution Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
            <h4 className="text-xs font-semibold text-emerald-400 mb-1">Direct Attribution</h4>
            <p className="text-sm text-[var(--text-secondary)]">
              Agent created the decision AND human approved AND measurable outcome occurred.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/20">
            <h4 className="text-xs font-semibold text-sky-400 mb-1">Assisted Attribution</h4>
            <p className="text-sm text-[var(--text-secondary)]">
              Agent surfaced insight that influenced human decision (logged in audit trail).
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--card-border)]">
            <h4 className="text-xs font-semibold text-[var(--text-muted)] mb-1">Excluded</h4>
            <p className="text-sm text-[var(--text-secondary)]">
              Outcomes that would have occurred without agent intervention (conservative baseline).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Sample Report */}
      <Card className="glass-card shadow-premium border-[var(--card-border)]">
        <CardHeader>
          <CardTitle className="text-[var(--text-primary)]">Sample Value Creation Report Output</CardTitle>
          <CardDescription>What you receive at Day 30</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              "Executive summary with key findings",
              "Metric baselines vs current performance",
              "Agent activity log with decision counts",
              "Decision acceptance rate by operator",
              "Time-to-action improvement analysis",
              "Dollar impact by category (revenue protected, cost saved, efficiency gained)",
              "Recommendation for next phase with projected portfolio-wide impact",
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <ArrowRight className="w-3 h-3 text-[var(--primary)] mt-1 shrink-0" />
                <p className="text-sm text-[var(--text-secondary)]">{item}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function RACIContent() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-[var(--primary-10)] flex items-center justify-center">
            <CheckSquare className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Implementation RACI</h1>
            <p className="text-sm text-[var(--text-secondary)]">Roles, responsibilities, and readiness checklist</p>
          </div>
        </div>
      </div>

      {/* RACI Table */}
      <Card className="glass-card shadow-premium border-[var(--card-border)]">
        <CardHeader>
          <CardTitle className="text-[var(--text-primary)]">Responsibility Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-[var(--card-border)]">
                <TableHead className="text-[var(--text-muted)]">Activity</TableHead>
                <TableHead className="text-[var(--text-muted)]">Vertica / PortCo</TableHead>
                <TableHead className="text-[var(--text-muted)]">Our Team</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                { activity: "Pilot sponsor (executive)", vertica: "Responsible", ours: "Consulted" },
                { activity: "Daily operator / approver", vertica: "Responsible", ours: "Informed" },
                { activity: "CRM admin (API access)", vertica: "Responsible", ours: "Consulted" },
                { activity: "Support admin (API access)", vertica: "Responsible", ours: "Consulted" },
                { activity: "Agent configuration", vertica: "Consulted", ours: "Responsible" },
                { activity: "Integration setup", vertica: "Consulted", ours: "Responsible" },
                { activity: "Policy / approval rules", vertica: "Approve", ours: "Responsible" },
                { activity: "Weekly review meetings", vertica: "Attend", ours: "Facilitate" },
                { activity: "Value Creation Report", vertica: "Informed", ours: "Responsible" },
                { activity: "Go/No-Go decision", vertica: "Responsible", ours: "Consulted" },
              ].map((row, i) => (
                <TableRow key={i} className="border-[var(--card-border)]">
                  <TableCell className="text-sm text-[var(--text-primary)]">{row.activity}</TableCell>
                  <TableCell className="text-sm">
                    <span className={cn(
                      "font-semibold",
                      row.vertica === "Responsible" ? "text-[var(--primary)]" :
                      row.vertica === "Approve" ? "text-amber-400" :
                      "text-[var(--text-secondary)]"
                    )}>
                      {row.vertica}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm">
                    <span className={cn(
                      "font-semibold",
                      row.ours === "Responsible" || row.ours === "Facilitate" ? "text-[var(--primary)]" :
                      "text-[var(--text-secondary)]"
                    )}>
                      {row.ours}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Separator className="bg-[var(--card-border)]" />

      {/* Access Checklist */}
      <Card className="glass-card shadow-premium border-[var(--card-border)]">
        <CardHeader>
          <CardTitle className="text-[var(--text-primary)]">Access Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            "CRM API credentials (read + field update)",
            "Support platform API credentials (read + draft)",
            "SSO/IdP configuration (if required)",
            "Sandbox environment access (for shadow mode)",
            "Designated operator(s) identified",
            "Weekly meeting cadence scheduled",
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-[var(--surface)]">
              <div className="w-4 h-4 rounded border border-[var(--card-border)] shrink-0" />
              <p className="text-sm text-[var(--text-secondary)]">{item}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Meeting Cadence */}
      <Card className="glass-card shadow-premium border-[var(--card-border)]">
        <CardHeader>
          <CardTitle className="text-[var(--text-primary)]">Meeting Cadence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { time: "Week 0", title: "Kickoff", duration: "60 min", desc: "Scope confirmation, access setup, baseline measurement" },
            { time: "Weeks 1-4", title: "Weekly Review", duration: "30 min", desc: "Metrics, decision quality, adjustment" },
            { time: "Day 30", title: "Value Report", duration: "60 min", desc: "Results, recommendation, next steps" },
            { time: "Async", title: "Decision Inbox", duration: "Continuous", desc: "Serves as continuous communication channel" },
          ].map((meeting, i) => (
            <div key={i} className="flex items-start gap-4 p-3 rounded-lg bg-[var(--surface)]">
              <div className="shrink-0">
                <Badge variant="outline" className="text-[10px] border-[var(--card-border)] text-[var(--text-muted)]">
                  {meeting.time}
                </Badge>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-[var(--text-primary)]">{meeting.title}</h4>
                  <span className="text-xs text-[var(--primary)]">{meeting.duration}</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">{meeting.desc}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function LegalContent() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <Scale className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Legal & Terms</h1>
            <p className="text-sm text-[var(--text-secondary)]">Standard terms for pilot engagement</p>
          </div>
        </div>
        <Badge className="mt-2 bg-amber-500/15 text-amber-400 border-amber-500/30">
          Draft — Final terms negotiated at engagement
        </Badge>
      </div>

      <Card className="glass-card shadow-premium border-[var(--card-border)]">
        <CardHeader>
          <CardTitle className="text-[var(--text-primary)]">Standard Terms (Pilot Engagement)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              term: "Confidentiality",
              desc: "Mutual NDA covering all shared data and business information.",
            },
            {
              term: "IP Ownership",
              desc: "Platform IP remains with provider; customer-specific configurations and \"operational DNA\" templates belong to customer.",
            },
            {
              term: "Data",
              desc: "Customer retains full ownership; provider processes data solely for service delivery; no use for training without explicit consent.",
            },
            {
              term: "Retention",
              desc: "Data deleted within 30 days of pilot termination (or retained per agreement).",
            },
            {
              term: "Liability",
              desc: "Standard limitation of liability; no consequential damages.",
            },
            {
              term: "Publicity",
              desc: "No logo/name usage without written permission.",
            },
          ].map((item, i) => (
            <div key={i} className="p-3 rounded-lg bg-[var(--surface)]">
              <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-1">{item.term}</h4>
              <p className="text-sm text-[var(--text-secondary)]">{item.desc}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
        <p className="text-sm text-[var(--text-secondary)]">
          <span className="font-semibold text-amber-400">Note:</span> Full MSA, DPA, and pilot addendum
          to be provided upon engagement. This section represents standard commercial terms and is subject
          to negotiation.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function DemoContent() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-[var(--primary-10)] flex items-center justify-center">
            <PlayCircle className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Platform Walkthrough</h1>
            <p className="text-sm text-[var(--text-secondary)]">A guided tour of VERTICA OS capabilities</p>
          </div>
        </div>
        <p className="text-sm text-[var(--text-secondary)] mt-4 leading-relaxed">
          This walkthrough covers the core capabilities of the VERTICA OS platform. Each section below
          corresponds to a page in the application — use the left navigation to explore any area in
          detail at your own pace.
        </p>
      </div>

      {[
        {
          step: "1",
          title: "Command Dashboard",
          href: "/",
          summary: "The operating command center for each portfolio company. Real-time KPIs update continuously as agents process data from connected systems.",
          features: [
            "Live KPI cards — pipeline health, support efficiency, retention, agent ROI",
            "Trend charts with 90-day historical data",
            "Decision summary bar with pending action counts",
            "Agent fleet status with activity sparklines",
            "Portfolio company selector with isolated data per tenant",
          ],
        },
        {
          step: "2",
          title: "Decision Inbox",
          href: "/decisions",
          summary: "The central hub where agent recommendations surface for human review. Every high-stakes action requires explicit approval before execution.",
          features: [
            "Prioritized queue with impact, confidence, severity, and due date",
            "Evidence panel — linked CRM records, tickets, usage data, billing signals",
            "Action preview showing exact changes the agent will make",
            "Approve, reject, or escalate with full audit trail",
            "Owner assignment and approval requirement indicators",
          ],
        },
        {
          step: "3",
          title: "Work Queues",
          href: "/queues",
          summary: "Operational queues organized by agent capability so each operator sees only what matters to them. Items are sorted by severity and impact.",
          features: [
            "Revenue Cadence queue — pipeline gaps, deal slippage, coaching alerts",
            "Support Deflection queue — KB gaps, auto-resolution candidates, sentiment",
            "Renewals & Expansion queue — churn risk, competitive displacement, upsell",
            "Quick approve/reject actions directly from queue items",
            "Queue-level metrics — item count, critical items, value at risk",
          ],
        },
        {
          step: "4",
          title: "Agent Fleet & Playbooks",
          href: "/playbooks",
          summary: "Monitor deployed agents and manage the reusable template library that scales across the portfolio. Each playbook encodes a specific operational capability.",
          features: [
            "Live agent status with accuracy, value created, and run counts",
            "Deployment stage indicators — shadow, suggest, gated auto, full auto",
            "Playbook templates with required integrations and expected ROI",
            "One-click deploy to any portfolio company with mode selection",
            "KPI impact mapping per playbook template",
          ],
        },
        {
          step: "5",
          title: "Evaluations & Replay",
          href: "/evaluations",
          summary: "Validate agent accuracy on historical data before production deployment. This is how ROI is proven before a single dollar is spent.",
          features: [
            "Evaluation scorecards — precision, recall, true/false positive rates",
            "Dollar value captured vs. missed for each evaluation run",
            "Before/after metric comparison across key KPIs",
            "Evaluation history with pass/fail/review status tracking",
            "Per-portfolio-company evaluation data",
          ],
        },
        {
          step: "6",
          title: "Governance & Audit",
          href: "/audit",
          summary: "Immutable, hash-chained audit log for every agent action and approval. Policy gates define what agents can and cannot do.",
          features: [
            "SHA-256 hash-chained audit entries — tamper-evident and verifiable",
            "Clickable entries with full detail drawer (actor, timestamp, resource, hash)",
            "Approval rules, budget limits, and two-person authorization policies",
            "CSV export for compliance review",
            "Configurable auto-approve thresholds per action category",
          ],
        },
        {
          step: "7",
          title: "Comp Simulator",
          href: "/simulator",
          summary: "Interactive compensation modeling tool that encodes Vertica\u2019s proven sales economics framework. Validate plans against best practices in real time.",
          features: [
            "7 adjustable inputs — base, OTE, quota, ramp, accelerator, team size, attainment",
            "5x Quota-to-OTE rule validation with sweet-spot indicators",
            "50/50 base/variable split analysis",
            "Three-scenario comparison — conservative, target, and stretch",
            "Cost of revenue and capital efficiency calculations",
          ],
        },
        {
          step: "8",
          title: "Analytics & Impact",
          href: "/analytics",
          summary: "Outcome dashboards that attribute business impact directly to agent actions. These produce the board-ready value creation reports for each pilot phase.",
          features: [
            "Total value created, agent cost, and ROI multiple",
            "Revenue impact charts — churn prevented, expansion revenue",
            "Support metrics — deflection rate, handle time, cost per ticket",
            "Operator hours saved tracking",
            "Agent efficiency table with per-agent cost and acceptance rate",
          ],
        },
      ].map((section, i) => (
        <Card key={i} className="glass-card shadow-premium border-[var(--card-border)] card-hover-lift">
          <CardContent className="py-5">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-[var(--primary-10)] flex items-center justify-center text-sm font-bold text-[var(--primary)] shrink-0 mt-0.5">
                {section.step}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-[var(--text-primary)]">{section.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-1.5">{section.summary}</p>
                <div className="mt-3 space-y-1.5">
                  {section.features.map((f, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-[var(--primary)] shrink-0 mt-0.5" />
                      <span className="text-xs text-[var(--text-muted)]">{f}</span>
                    </div>
                  ))}
                </div>
                <Link
                  href={section.href}
                  className="inline-flex items-center gap-1.5 mt-4 px-3.5 py-1.5 rounded-lg bg-[var(--primary-10)] text-[var(--primary)] text-xs font-medium hover:bg-[var(--primary-20)] transition-colors"
                >
                  Open {section.title}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      <Card className="glass-card shadow-premium border-[var(--card-border)] border-l-4 border-l-[var(--primary)]">
        <CardContent className="py-4">
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            <span className="font-medium text-[var(--text-primary)]">Explore freely.</span>{" "}
            Every page in the left navigation is fully interactive. Switch between portfolio companies
            using the org selector to see how data isolation works across tenants. The platform is
            designed to be self-explanatory — but if you have questions at any point, the Executive FAQ
            section of this document covers the most common topics.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function FAQContent() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-[var(--primary-10)] flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-[var(--primary)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Executive FAQ</h1>
            <p className="text-sm text-[var(--text-secondary)]">Answers to the 10 most common questions</p>
          </div>
        </div>
      </div>

      {[
        {
          q: "What data do agents access?",
          a: "Only data from systems you explicitly connect. Read-only by default. Write access requires your approval for each action category.",
        },
        {
          q: "Can agents send emails or contact customers directly?",
          a: "Never without explicit human approval. Agents draft; humans send. Customer-facing actions always require human-in-the-loop.",
        },
        {
          q: "What happens if an agent makes a wrong recommendation?",
          a: "Nothing — until a human approves it. Shadow mode validates accuracy on historical data before any live actions. Our evaluation harness measures false positive rates.",
        },
        {
          q: "How is our data isolated from other portfolio companies?",
          a: "Hard tenant boundaries at the database level. No cross-tenant access. Even portfolio-level analytics use only aggregated, anonymized metrics.",
        },
        {
          q: "Is our data used to train AI models?",
          a: "No. We use Anthropic's Claude via their API with explicit \"no training\" provisions. Your data is processed ephemerally.",
        },
        {
          q: "What's the minimum commitment?",
          a: "30-day pilot, single portfolio company, 2 agents. No long-term commitment until value is proven.",
        },
        {
          q: "How long does setup take?",
          a: "Week 0: Connect systems + configure. Week 1: Shadow mode (agents run, no actions). Weeks 2-4: Suggestion → gated autonomy. Total: 1 week to first insights.",
        },
        {
          q: "What if we want to stop?",
          a: "Pilot includes explicit go/no-go criteria at Day 30. All data deleted within 30 days of termination. No penalties.",
        },
        {
          q: "How does pricing work at portfolio scale?",
          a: "Pilot: $25K-50K for single company. Scale: $10K-25K/month per portfolio company with volume discounts. Templates are reusable — the second deployment is 80% faster.",
        },
        {
          q: "Who from our team needs to be involved?",
          a: "One executive sponsor (30 min/week), one operator (uses Decision Inbox daily), one admin (initial API access setup). We handle everything else.",
        },
      ].map((faq, i) => (
        <Card key={i} className="glass-card shadow-premium border-[var(--card-border)]">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-[var(--primary-10)] flex items-center justify-center text-xs font-bold text-[var(--primary)] shrink-0">
                {i + 1}
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">{faq.q}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{faq.a}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function RisksContent() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Risks & Mitigations</h1>
            <p className="text-sm text-[var(--text-secondary)]">Known risks with proactive mitigation strategies</p>
          </div>
        </div>
      </div>

      <Card className="glass-card shadow-premium border-[var(--card-border)]">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow className="border-[var(--card-border)]">
                <TableHead className="text-[var(--text-muted)]">Risk</TableHead>
                <TableHead className="text-[var(--text-muted)]">Likelihood</TableHead>
                <TableHead className="text-[var(--text-muted)]">Impact</TableHead>
                <TableHead className="text-[var(--text-muted)]">Mitigation</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  risk: "Data access delays (API provisioning)",
                  likelihood: "Medium",
                  likelihoodColor: "text-amber-400",
                  impact: "Schedule slip",
                  mitigation: "Read-only first + sandbox connectors; start with available data",
                },
                {
                  risk: "Noisy signals (too many false positives)",
                  likelihood: "Medium",
                  likelihoodColor: "text-amber-400",
                  impact: "Operator fatigue",
                  mitigation: "Shadow mode + eval harness validates before live; tunable thresholds",
                },
                {
                  risk: "Over-automation risk",
                  likelihood: "Low",
                  likelihoodColor: "text-emerald-400",
                  impact: "Trust erosion",
                  mitigation: "HITL approvals for all high-impact actions; staged rollout",
                },
                {
                  risk: "Stakeholder adoption",
                  likelihood: "Medium",
                  likelihoodColor: "text-amber-400",
                  impact: "Low utilization",
                  mitigation: "Weekly cadence outputs + Decision Inbox reduces friction to zero",
                },
                {
                  risk: "Attribution disputes",
                  likelihood: "Low",
                  likelihoodColor: "text-emerald-400",
                  impact: "ROI credibility",
                  mitigation: "Defined measurement plan + audit trail + conservative attribution",
                },
                {
                  risk: "Integration breaks",
                  likelihood: "Low",
                  likelihoodColor: "text-emerald-400",
                  impact: "Service disruption",
                  mitigation: "Health monitoring + circuit breakers + fallback to manual",
                },
                {
                  risk: "Data privacy concern",
                  likelihood: "Low",
                  likelihoodColor: "text-emerald-400",
                  impact: "Deal blocker",
                  mitigation: "Tenant isolation + encryption + DPA + no-training guarantee",
                },
              ].map((row, i) => (
                <TableRow key={i} className="border-[var(--card-border)]">
                  <TableCell className="text-sm font-medium text-[var(--text-primary)]">{row.risk}</TableCell>
                  <TableCell className={cn("text-sm font-semibold", row.likelihoodColor)}>{row.likelihood}</TableCell>
                  <TableCell className="text-sm text-[var(--text-secondary)]">{row.impact}</TableCell>
                  <TableCell className="text-xs text-[var(--text-secondary)]">{row.mitigation}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Page Component                                                */
/* ------------------------------------------------------------------ */

export default function DocumentsPage() {
  const [activeSection, setActiveSection] = useState("proposal");

  const closingSections = sections.filter((s) => s.group === "closing");
  const appendixSections = sections.filter((s) => s.group === "appendix");

  return (
    <div className="flex gap-6">
      {/* Sidebar */}
      <div className="w-56 shrink-0">
        <div className="sticky top-0 space-y-1 p-3 rounded-xl bg-[var(--card-bg)]/60 backdrop-blur-md border border-[var(--card-border)]">
          <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider px-3 pb-1">
            Closing Packet
          </p>
          {closingSections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors",
                activeSection === s.id
                  ? "bg-[var(--primary)]/10 text-[var(--primary)] border-l-2 border-[var(--primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)]"
              )}
            >
              <s.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 truncate">{s.title}</span>
              {s.status === "complete" ? (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              )}
            </button>
          ))}
          <Separator className="bg-[var(--card-border)] my-2" />
          <p className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider px-3 pb-1">
            Appendix
          </p>
          {appendixSections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors",
                activeSection === s.id
                  ? "bg-[var(--primary)]/10 text-[var(--primary)] border-l-2 border-[var(--primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)]"
              )}
            >
              <s.icon className="w-4 h-4 shrink-0" />
              <span className="flex-1 truncate">{s.title}</span>
              {s.status === "complete" ? (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : (
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 max-w-4xl min-w-0">
        {activeSection === "proposal" && <ProposalContent />}
        {activeSection === "sow" && <SOWContent />}
        {activeSection === "security" && <SecurityContent />}
        {activeSection === "roi" && <ROIContent />}
        {activeSection === "raci" && <RACIContent />}
        {activeSection === "legal" && <LegalContent />}
        {activeSection === "demo" && <DemoContent />}
        {activeSection === "faq" && <FAQContent />}
        {activeSection === "risks" && <RisksContent />}

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-xs text-[var(--text-muted)]">
            VERTICA OS — Confidential — Prepared by Adapt Agents for Vertica Capital Partners
          </p>
        </div>
      </div>
    </div>
  );
}
