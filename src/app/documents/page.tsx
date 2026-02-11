"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Target, Zap, Shield, Users, TrendingUp, CheckCircle, ArrowRight, Clock, DollarSign, Bot, BarChart3, Lock } from "lucide-react";

export default function DocumentsPage() {
  return (
    <div className="space-y-8 max-w-4xl">
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
        <p className="text-xs text-[var(--text-muted)] mt-2">Prepared for Philip Vorobeychik, Managing Director — Vertica Capital Partners</p>
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
            VERTICA OS is a <span className="text-[var(--text-primary)] font-medium">Portfolio Operator Platform</span> that deploys AI agents to automate and optimize the value creation playbook across Vertica Capital Partners&apos; 75+ portfolio companies.
          </p>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            Unlike generic AI tools, VERTICA OS encodes Vertica&apos;s proven operational DNA — inside sales best practices, GTM cadence discipline, and portfolio-wide pattern recognition — into autonomous agents that operate 24/7 with full human oversight.
          </p>
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="text-center p-3 rounded-lg bg-[var(--surface)]">
              <p className="text-2xl font-bold text-[var(--primary)]">15-25x</p>
              <p className="text-xs text-[var(--text-muted)]">Agent ROI</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-[var(--surface)]">
              <p className="text-2xl font-bold text-emerald-400">42%</p>
              <p className="text-xs text-[var(--text-muted)]">Support Deflection</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-[var(--surface)]">
              <p className="text-2xl font-bold text-purple-400">+8pts</p>
              <p className="text-xs text-[var(--text-muted)]">NRR Improvement</p>
            </div>
          </div>
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
            Vertica&apos;s competitive advantage is operational rigor — the ability to deploy proven GTM playbooks, sales cadences, and operational best practices across portfolio companies. Today, this relies on human operators scaling across 75+ companies.
          </p>
          <div className="space-y-2 pt-2">
            {[
              "Sales leaders manually compile pipeline reports and coaching plans — 4-6 hours/week per company",
              "Support teams handle repetitive tickets that could be auto-resolved — $15-22 cost per ticket",
              "Renewal risks are caught reactively — often after signals have been present for weeks",
              "Operational playbooks exist as documents, not as executable systems",
              "Portfolio-wide pattern recognition is impossible at human scale"
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
          {/* Layer 1: Connect */}
          <div className="border-l-2 border-[var(--primary)] pl-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">1. Connect — System Integration</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Agents connect to existing tools (Salesforce, HubSpot, Zendesk, Intercom, Gong, Slack) via secure API integrations. Read access is default; write access requires explicit policy approval.
            </p>
          </div>
          {/* Layer 2: Analyze */}
          <div className="border-l-2 border-purple-400 pl-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">2. Analyze — Continuous Intelligence</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Agents run on configurable schedules (every 2-8 hours), cross-referencing signals across CRM, support, product analytics, and billing to surface insights humans would miss. Every analysis produces a transparent reasoning trace.
            </p>
          </div>
          {/* Layer 3: Act */}
          <div className="border-l-2 border-emerald-400 pl-4">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1">3. Act — Governed Execution</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              All agent recommendations flow to the <span className="font-medium text-[var(--text-primary)]">Decision Inbox</span> for human review. Low-risk actions (e.g., KB-based support resolution) can be auto-approved via configurable policies. High-impact actions always require human approval.
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
              metrics: "Pipeline coverage ↑ | Stage conversion ↑ | Forecast accuracy ↑"
            },
            {
              name: "Support Deflection Agent",
              badge: "Fast EBITDA Impact",
              badgeColor: "text-sky-400 bg-sky-500/15",
              desc: "Auto-triages and resolves support tickets using knowledge base matching and classification. Handles routine inquiries autonomously (with approval gates), escalates complex issues to specialists. Direct cost center impact.",
              metrics: "Deflection rate ↑ | AHT ↓ | Cost-per-ticket ↓ | CSAT stable"
            },
            {
              name: "NRR / Renewal Agent",
              badge: "Revenue Protection",
              badgeColor: "text-purple-400 bg-purple-500/15",
              desc: "Runs continuous renewal risk assessments by cross-referencing usage trends, support health, billing patterns, and champion changes. Generates proactive save plans for at-risk accounts before signals become churn events.",
              metrics: "NRR ↑ | Churn rate ↓ | Save rate ↑ | Early detection"
            },
            {
              name: "Pipeline Scout Agent",
              badge: "Growth Engine",
              badgeColor: "text-amber-400 bg-amber-500/15",
              desc: "Monitors expansion signals, competitive displacement risks, and M&A activity across the customer base. Flags upsell opportunities and new market entry points for sales teams.",
              metrics: "Expansion revenue ↑ | Competitive win rate ↑ | Pipeline velocity ↑"
            }
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
              { icon: Lock, title: "RBAC Policies", desc: "Role-based access control with per-agent, per-action permissions. Two-person rule for high-risk actions." },
              { icon: Shield, title: "SHA-256 Audit Chain", desc: "Every agent action is recorded in an immutable, hash-chained audit log. Tamper-proof compliance trail." },
              { icon: CheckCircle, title: "Human-in-the-Loop", desc: "All decisions flow through approval gates. Shadow mode → suggestion mode → limited autonomy progression." },
              { icon: BarChart3, title: "Outcome Attribution", desc: "Every dollar of value created is traceable to a specific agent action, decision, and approval. Board-ready reporting." }
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
            VERTICA OS is <span className="font-medium text-[var(--text-primary)]">multi-tenant by design</span>. Each portfolio company is a hard-isolated tenant with its own data boundaries, agent fleet, and policies. Agent templates that prove ROI in one company can be deployed across the entire portfolio in days, not months.
          </p>
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { cluster: "Booking & Experiences", companies: "Rezdy, Regiondo, Checkfront, Campspot", count: "4 companies" },
              { cluster: "Vertical SaaS Ops", companies: "DSN, Condo Control, ARMS", count: "3 companies" },
              { cluster: "Security & GRC", companies: "Pathlock, ProLion", count: "2 companies" }
            ].map((c, i) => (
              <div key={i} className="p-3 rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)]">
                <p className="text-xs font-semibold text-[var(--text-primary)] mb-1">{c.cluster}</p>
                <p className="text-[10px] text-[var(--text-muted)] mb-1">{c.companies}</p>
                <Badge variant="outline" className="text-[9px] border-transparent bg-[var(--primary-10)] text-[var(--primary)]">{c.count}</Badge>
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
            { week: "Week 3-4", title: "Limited Autonomy", desc: "Enable auto-actions for pre-approved low-risk categories only. Deliver board-ready value creation report: KPI deltas, savings, ARR impact, rollout plan.", status: "Prove" }
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
                  <Badge variant="outline" className="text-[10px] border-[var(--border)] text-[var(--text-muted)]">{phase.week}</Badge>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">{phase.title}</h3>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{phase.desc}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Investment & Next Steps */}
      <Card className="glass-card shadow-premium border-[var(--primary)]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
            <DollarSign className="w-5 h-5 text-[var(--primary)]" />
            Investment & Next Steps
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)]">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Pilot (1 company)</p>
              <p className="text-xl font-bold text-[var(--text-primary)]">$25K - $50K</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">30-day proof of value with full agent deployment</p>
            </div>
            <div className="p-4 rounded-lg bg-[var(--surface)] border border-[var(--border-subtle)]">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-1">Per Company / Month</p>
              <p className="text-xl font-bold text-[var(--text-primary)]">$10K - $25K</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">Ongoing operation + optimization + support</p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-[var(--primary-10)] border border-[var(--primary)]/20">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-2">Immediate Next Steps</h3>
            <div className="space-y-2">
              {[
                "Select pilot portfolio company (recommendation: DSN Software — richest data, 3 agents deployed)",
                "Define primary KPI target (NRR, pipeline conversion, or support cost)",
                "Confirm system access (CRM, support platform, analytics)",
                "Identify daily operator/approver for the pilot",
                "Kick off Week 0 setup (target: within 5 business days)"
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <ArrowRight className="w-3 h-3 text-[var(--primary)] flex-shrink-0" />
                  <p className="text-xs text-[var(--text-secondary)]">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-xs text-[var(--text-muted)]">
          VERTICA OS — Confidential — Prepared by Adapt Agents for Vertica Capital Partners
        </p>
      </div>
    </div>
  );
}
