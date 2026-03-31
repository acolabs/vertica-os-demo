# WAVE 6: RECONCILIATION — UNIFIED MVP PLAN

## Executive Summary

After productive disagreement across three specialist perspectives and stress-testing by the Skeptical IC Reviewer, we have reconciled into a single, defensible MVP plan that addresses the core concerns while delivering immediate value.

---

## THREE PERSPECTIVES SUMMARY

| Perspective | Top Workflow | Core Argument | Key Risk If Ignored |
|-------------|--------------|---------------|---------------------|
| **Deal Ops** | Deal Intake & Thesis Triage | Foundation effect — clean intake unlocks everything | Garbage data poisons all downstream workflows |
| **GTM/Value Creation** | Pipeline Hygiene & Forecast | Revenue is lifeblood; dirty pipeline = broken forecasting | Board drama, AE churn, growth stalls |
| **Portfolio Monitoring** | KPI Early Warning | Visibility precedes action; can't optimize what you can't see | Surprise underperformers, late interventions |
| **Skeptical IC** | — | "11 surfaces before PMF is death"; start with ONE | Adoption failure, partner rejection |

---

## THE RECONCILIATION: HYBRID MVP SCOPE

### Core Insight
The Skeptical IC is right: **11 surfaces is death**. But each specialist identified a real pain point. The reconciliation:
- **Start with ONE surface**: Decision Inbox (universal entry point)
- **Embed 3 workflows** within that surface, prioritized by immediacy of pain
- **Design for expansion** without requiring re-architecture

---

## RECOMMENDED MVP SCOPE (30-Day Pilot)

### WHAT'S IN SCOPE

| Component | Specification | Rationale |
|-----------|---------------|-----------|
| **Decision Inbox (Single Surface)** | Unified approval queue with 4 workflow types | Addresses "email problem" — becomes system of record for decisions |
| **Workflow 1: Deal Triage** | Intake form → thesis scoring → routing | Deal Ops priority; 5-10 days → same-day determination |
| **Workflow 2: Pipeline Alert** | Weekly hygiene report → flagged deals → approval to intervene | GTM priority; forecast accuracy is acute pain |
| **Workflow 3: KPI Threshold Breach** | Anomaly detection → escalation packet → approval to engage | Portfolio priority; visibility enables everything else |
| **Evidence Links** | Every decision links to source docs | Trust signal; addresses "black box" concern |
| **Email Integration** | Decisions can be approved/rejected via email | Non-negotiable per kill memo; partners live in Gmail |

### WHAT'S EXPLICITLY OUT OF SCOPE

| Item | Rationale | Future Phase |
|------|-----------|--------------|
| Full Deal Room surface | Too complex for 30 days | Phase 2 (60 days) |
| Value Creation Hub | Requires proven monitoring first | Phase 2 (60 days) |
| GTM Console (full) | Start with alerts only | Phase 2 (60 days) |
| Talent & Comp Lab | Post-portfolio monitoring | Phase 3 (90 days) |
| Portfolio Pulse (full) | Start with 5-7 companies only | Phase 2 (60 days) |
| Run Trace UI | Log only, no visualization | Phase 2 (60 days) |
| Policy Center | RBAC hardcoded for pilot | Phase 2 (60 days) |
| Mobile app | Web + email only | Phase 3 (90 days) |
| AI-generated IC memos | Human-written with AI assist only | Revisit at scale |
| Real-time data streaming | Daily batch sufficient | Phase 2 (60 days) |

---

## TOP 3 WORKFLOWS (RECONCILED PRIORITY)

### WORKFLOW 1: Deal Intake & Thesis Triage (Week 1-2)
**Owner**: Deal Ops
**Pain Addressed**: 5-10 day thesis fit determination
**Workflow**:
1. Deal enters via form (source: inbound, proprietary, banker)
2. Auto-score against thesis criteria (7 weighted factors)
3. Route to sector lead if score > 70
4. Sector lead approves/rejects in Decision Inbox
5. Approved deals auto-create CRM record + DD tracker

**Success Metric**: Thesis determination < 24 hours for 90% of deals

---

### WORKFLOW 2: Pipeline Hygiene Alert & Intervention Approval (Week 2-3)
**Owner**: GTM/RevOps
**Pain Addressed**: Forecast variance ±30%, surprise deals
**Workflow**:
1. Weekly pipeline scrub runs (Sundays)
2. System flags: stage mismatches, aging deals, coverage gaps
3. Alert appears in Decision Inbox with evidence links
4. CRO approves intervention plan or dismisses
5. Approved interventions auto-create 30/60/90 tasks

**Success Metric**: Forecast variance < ±15% within 30 days

---

### WORKFLOW 3: KPI Threshold Breach & Escalation (Week 3-4)
**Owner**: Portfolio Monitoring
**Pain Addressed**: Surprise underperformers, late interventions
**Workflow**:
1. Daily KPI refresh (5 companies in pilot)
2. Yellow/Red breach triggers escalation packet generation
3. Packet appears in Decision Inbox with context
4. Deal lead approves intervention or requests more info
5. Approved interventions log to company timeline

**Success Metric**: < 24 hour response time to Yellow alerts

---

## PILOT NARRATIVE (12 BULLETS)

1. **Problem**: Vertica's deal team spends 30-50 hrs/month chasing documents, 7-14 days scheduling ICs, and discovers portfolio issues too late

2. **Current State**: Decisions happen in email, Slack, and meetings — no system of record, no audit trail, no learning loop

3. **Proposed Solution**: A single Decision Inbox that captures, routes, and tracks the 20+ approval decisions Vertica makes weekly

4. **Scope**: 30-day pilot with 3 workflows (Deal Triage, Pipeline Alert, KPI Breach) across 5 portfolio companies

5. **Workflow 1**: New deals get same-day thesis fit scoring and routing — no more "is this worth partner time?" ambiguity

6. **Workflow 2**: Weekly pipeline alerts surface at-risk deals before they surprise the forecast — CRO approves interventions in one click

7. **Workflow 3**: KPI breaches auto-generate escalation packets — deal leads respond in < 24 hours instead of weeks

8. **Trust Model**: Every decision links to evidence; confidence scores surface uncertainty; human approval required for all writes

9. **Integration**: Email-native — partners approve/reject without leaving Gmail; full experience available in web app

10. **Success Criteria**: 80% adoption, < 24hr thesis determination, < ±15% forecast variance, < 24hr alert response

11. **Expansion Path**: After 30 days, add Deal Room surface, expand to all portfolio companies, enable Value Creation Hub

12. **Risk Mitigation**: Start small, prove value, earn trust — no "big bang" deployment that risks partner rejection

---

## WHAT WE NEED FROM VERTICA (DISCOVERY LIST)

### Technical/Integration (Items 1-4)

1. **CRM Access**: What system houses deal data today? (Salesforce, HubSpot, spreadsheets?) Can we get read-only API access for pilot?

2. **Portfolio Data**: Where do portfolio company KPIs live? (Excel, BI tool, manual collection?) What's the current reporting cadence?

3. **Email Integration**: Can we integrate with Vertica's Gmail/Google Workspace for email-native approvals? Any security concerns?

4. **SSO/Auth**: What identity provider does Vertica use? (Okta, Google, Azure AD?) Can we integrate for pilot user management?

### Process/Workflow (Items 5-7)

5. **Thesis Criteria**: What are the 5-7 weighted factors for thesis fit scoring? Who owns these criteria? How often do they change?

6. **Approval Authority**: Who can approve deal screening? IC scheduling? Pipeline interventions? KPI escalations? (RACI clarification)

7. **Current Pain Ranking**: Of the three workflows, which causes the most daily friction? (Deal triage delays? Forecast surprises? Portfolio blind spots?)

### Organizational (Items 8-10)

8. **Pilot Sponsor**: Which partner will champion this internally? Who has authority to mandate adoption for 30 days?

9. **Deal Team Bandwidth**: How many hours/week can Deal Ops dedicate to pilot feedback and iteration?

10. **Success Definition**: Beyond the metrics, what would make Vertica say "this is worth expanding" after 30 days? (Time saved? Decisions improved? Partner satisfaction?)

---

## 5-SLIDE EXECUTIVE SUMMARY OUTLINE

### Slide 1: The Problem
- Vertica makes 20+ approval decisions weekly across deals, GTM, and portfolio
- Today: scattered across email, Slack, meetings — no system of record
- Cost: 30-50 hrs/month chasing docs, 7-14 day IC delays, surprise underperformers

### Slide 2: The Solution
- Decision Inbox: single surface for all approvals with evidence links
- Three workflows: Deal Triage, Pipeline Alert, KPI Breach
- Email-native: partners approve without leaving Gmail

### Slide 3: The Pilot (30 Days)
- Scope: 3 workflows, 5 portfolio companies, 5-7 deal team users
- Success: 80% adoption, < 24hr thesis determination, < ±15% forecast variance
- Out of scope: 8 surfaces (Deal Room, GTM Console, etc.) — Phase 2

### Slide 4: Why This Approach
- Addresses Skeptical IC concerns: start with ONE surface, prove value, expand
- Balances three specialist priorities: foundation (Deal Ops), revenue (GTM), visibility (Portfolio)
- Trust-first: evidence links, confidence scores, human approval for all writes

### Slide 5: Next Steps
- Discovery: 10 questions to answer in next 48 hours
- Pilot kickoff: Week of [DATE] with identified sponsor
- 30-day review: Go/No-Go decision on Phase 2 expansion

---

## KILL MEMO CONCERNS ADDRESSED

| Concern | How MVP Addresses |
|---------|-------------------|
| "11 surfaces before PMF" | Start with ONE surface (Decision Inbox) |
| "AI drafting IC memos" | Not in MVP; human-written with AI assist only |
| "Data architecture fantasy" | Start with manual CSV/API bridge; full integration Phase 2 |
| "Small team paradox" | 30-day pilot with 5-7 users only; no FTE overhead |
| "Email problem" | Email-native approvals — partners never leave Gmail |
| "Black box problem" | Evidence links on every decision; confidence scores |
| "False positive flood" | Human approval required for all actions; AI assists only |
| "Change management reality" | One surface, 3 workflows — minimal learning curve |

---

## CONCLUSION

This reconciled plan:
- ✅ Honors the Skeptical IC's "start small" wisdom
- ✅ Incorporates each specialist's top priority
- ✅ Addresses the kill memo's core concerns
- ✅ Provides a clear 30-day path to value demonstration
- ✅ Sets up natural expansion without re-architecture

**The path forward: Prove value in 30 days with Decision Inbox, then expand to the full OS vision.**
