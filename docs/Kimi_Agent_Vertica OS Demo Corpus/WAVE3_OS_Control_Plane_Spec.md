# WAVE 3: VERTICA OS CONTROL PLANE SPECIFICATION
## Operator Console UI/UX/AX Specification for Demo

**Version:** 1.0  
**Date:** January 2025  
**Classification:** Internal - Demo Ready  
**Target Audience:** PE Operators, Investment Committees, Portfolio CEOs

---

## EXECUTIVE SUMMARY

The Vertica OS Control Plane is an **operator-first console** designed for PE professionals managing $2M-$40M ARR portfolio companies. Unlike chatbot interfaces that bury context in conversation threads, this console surfaces actionable intelligence with clear ownership, trust signals, and intervention pathways.

**Design Philosophy:**
- **Signal over noise:** Every pixel earns its place
- **Trust through transparency:** Evidence links, confidence scores, data lineage
- **Action-oriented:** Decisions, not discussions
- **Operator empathy:** Built by operators, for operators

---

## 1. INFORMATION ARCHITECTURE (Left Navigation)

```
┌─────────────────────────────────────────────────────────┐
│  [VERTICA LOGO]                    [Search ⌘K] [👤]    │
├─────────────────────────────────────────────────────────┤
│  ⚡ OPERATE                                             │
│  ├── Decision Inbox        [3 pending]                  │
│  ├── Deal Room             [2 active]                   │
│  └── Value Creation Hub    [5 portcos]                  │
│                                                         │
│  📊 MONITOR                                             │
│  ├── GTM Console                                        │
│  ├── Talent & Comp Lab                                  │
│  └── Portfolio Pulse       [2 alerts]                   │
│                                                         │
│  📚 KNOWLEDGE                                           │
│  ├── Evidence Room                                      │
│  └── Run Trace                                          │
│                                                         │
│  ⚙️ SYSTEM                                              │
│  ├── Integrations Health   [1 warning]                  │
│  ├── Policy Center                                      │
│  └── Audit Log                                          │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│  [?] Help    [⌘] Shortcuts    [⚡] Feedback             │
└─────────────────────────────────────────────────────────┘
```

### Navigation Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Progressive Disclosure** | Primary nav shows counts/badges; drill down reveals detail |
| **Muscle Memory** | Fixed positions, keyboard shortcuts (⌘1-9) |
| **Context Preservation** | Breadcrumb trail, tab state persistence |
| **Visual Hierarchy** | Color-coded urgency (red=action required, yellow=watch, green=healthy) |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| ⌘K | Global search |
| ⌘1 | Decision Inbox |
| ⌘2 | Deal Room |
| ⌘3 | Value Creation Hub |
| ⌘4 | GTM Console |
| ⌘5 | Talent & Comp Lab |
| ⌘6 | Portfolio Pulse |
| ⌘/ | Toggle sidebar |
| Esc | Close modal/return to previous |

---

## 2. CORE SURFACES SPECIFICATION

---

### SURFACE 1: DECISION INBOX

**Purpose:** Centralized approval queue for all operator decisions requiring human judgment

#### What It Shows

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ DECISION INBOX                                                    [⚙️] [📥]│
├─────────────────────────────────────────────────────────────────────────────┤
│ [All ▼] [Pending 🔴 3] [Approved ✓ 12] [Rejected ✗ 2] [Needs Info ⚠ 1]     │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ 🔴 APPROVE: $2.4M Series B Extension - CloudSync Inc          2h ago    │ │
│ │    Confidence: 87% | IC Memo: v3.2 | Diligence: Complete                │ │
│ │    [View Deal Room] [Approve] [Reject] [Request Changes]                │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ 🔴 APPROVE: 30/60/90 Plan - DataFlow Systems                  4h ago    │ │
│ │    Confidence: 92% | CEO Review: Complete | Board: Scheduled            │ │
│ │    [View Plan] [Approve] [Reject] [Request Changes]                     │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ 🟡 REVIEW: Quota/OTE Adjustment - Nexus Analytics               1d ago  │ │
│ │    Confidence: 71% | Comp Model: Draft | HR: Pending Review             │ │
│ │    [View Analysis] [Override] [Request Analysis]                        │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ 🟢 INFO: Pipeline Reset Complete - Vertex AI                    2d ago  │ │
│ │    Auto-approved | Confidence: 95% | No action required                 │ │
│ │    [View Details] [Acknowledge]                                         │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Object Model

| Field | Type | Description |
|-------|------|-------------|
| `decision_id` | UUID | Unique identifier |
| `decision_type` | Enum | approval, rejection, override, info |
| `category` | Enum | investment, value_creation, compensation, policy |
| `subject` | EntityRef | Company, person, or deal reference |
| `confidence_score` | Float | 0-100% algorithmic confidence |
| `evidence_links` | Array[URL] | Supporting documents, memos, data |
| `requested_by` | UserRef | Originator |
| `required_approvers` | Array[UserRef] | Based on policy rules |
| `sla_deadline` | DateTime | Auto-escalation trigger |
| `impact_estimate` | Money/Percent | Estimated value at stake |

#### Default Filters & Priority Ordering

**Default View:** Pending decisions, sorted by:
1. SLA deadline (ascending - closest first)
2. Impact estimate (descending - largest first)
3. Confidence score (ascending - needs more eyes)

**Priority Rules:**
- 🔴 **Critical:** SLA < 4 hours OR impact > $5M
- 🟡 **High:** SLA < 24 hours OR impact > $1M
- 🟢 **Normal:** All others

#### Primary Actions

| Action | Trigger | Result |
|--------|---------|--------|
| **Approve** | Click + confirm | Logs approval, triggers downstream workflows |
| **Reject** | Click + reason | Returns to originator with feedback |
| **Request Changes** | Click + comments | Pauses clock, requests revision |
| **Override** | Click + justification | Bypasses recommendation (logged) |
| **Delegate** | Click + assignee | Transfers approval authority |

#### Trust Signals

| Signal | Display | Source |
|--------|---------|--------|
| **Confidence Score** | 87% (green if >80, yellow 60-80, red <60) | ML model + rule engine |
| **Evidence Links** | [IC Memo v3.2] [Financial Model] [Legal Review] | Document registry |
| **Data Freshness** | "Data as of 2 hours ago" | Integration timestamps |
| **Approver Consensus** | "2 of 3 IC members have approved" | Approval chain |
| **Similar Decisions** | "3 similar deals approved in last 90 days" | Historical pattern |

#### Failure Modes & Recovery UX

| Failure | Detection | Operator UX |
|---------|-----------|-------------|
| **Stale Data** | Freshness > 24h | Yellow banner: "Data may be stale. [Refresh] [View Source]" |
| **Conflicting Sources** | Variance > 10% | Red banner: "Source conflict detected. [View Diff] [Override]" |
| **Missing Evidence** | Required doc absent | Grey banner: "Missing: Legal opinion. [Request] [Waive]" |
| **Approver Unavailable** | SLA approaching | Auto-escalation to backup approver + notification |
| **System Error** | API timeout | "Unable to load. [Retry] [Contact Support]" |

---

### SURFACE 2: DEAL ROOM

**Purpose:** Single source of truth for active deals - pipeline, diligence, IC process

#### What It Shows

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ DEAL ROOM                                                         [+ New]   │
├─────────────────────────────────────────────────────────────────────────────┤
│ [Pipeline ▼] [Active 🔵 8] [Diligence 🟡 3] [IC Review 🟠 2] [Closed ✓ 5]   │
│                                                                             │
│ PIPELINE VIEW                                                               │
│ ┌─────────────┬─────────────┬─────────────┬─────────────┬─────────────────┐ │
│ │ SOURCING    │ SCREENING   │ DEEP DIVE   │ DILIGENCE   │ IC DECISION     │ │
│ │ 12 deals    │ 8 deals     │ 5 deals     │ 3 deals     │ 2 deals         │ │
│ ├─────────────┼─────────────┼─────────────┼─────────────┼─────────────────┤ │
│ │ CloudSync   │ DataFlow    │ Nexus AI    │ ▓▓▓ Vertex  │ ▓▓▓▓ Quantum    │ │
│ │ $2.4M ARR   │ $8M ARR     │ $15M ARR    │ $22M ARR    │ $35M ARR        │ │
│ │ [Open]      │ [Open]      │ [Open]      │ 87% complete│ 92% complete    │ │
│ │             │             │             │ [View]      │ [View Memo]     │ │
│ │ CyberDef    │ SecureStack │ ML Ops      │ ▓▓ DataMesh │                 │ │
│ │ $1.8M ARR   │ $5M ARR     │ $12M ARR    │ $18M ARR    │                 │ │
│ │ [Open]      │ [Open]      │ [Open]      │ 62% complete│                 │ │
│ │             │             │             │ [View]      │                 │ │
│ └─────────────┴─────────────┴─────────────┴─────────────┴─────────────────┘ │
│                                                                             │
│ SELECTED: Vertex AI (Diligence - 87% Complete)                              │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ COMPANY OVERVIEW          DILIGENCE CHECKLIST        IC MEMO PREVIEW    │ │
│ │ ─────────────────         ───────────────────        ────────────────   │ │
│ │ ARR: $22M                 ✓ Financial (12/12)        [DRAFT v2.1]       │ │
│ │ Growth: 145% YoY          ✓ Legal (8/8)              Investment: $40M   │ │
│ │ NRR: 118%                 ✓ Tech (6/6)               Pre-money: $160M   │ │
│ │ CAC Payback: 14mo         ▓ Customer (4/5)           Ownership: 20%     │ │
│ │ Logo Count: 247           ✗ Market (2/4) ⚠           Expected MOIC: 3.2x│ │
│ │                           [Complete Checklist]       [Edit Memo]        │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Object Model

| Entity | Fields |
|--------|--------|
| **Deal** | deal_id, company_name, arr, growth_rate, stage, owner, created_date, expected_close |
| **Diligence Checklist** | category, items[], completion_pct, blockers[], owner |
| **IC Memo** | version, sections[], authors[], approval_status |
| **Financial Model** | assumptions, projections, sensitivity_analysis |

#### Default Filters & Priority Ordering

**Pipeline View:** Grouped by stage, sorted by:
1. Expected close date (ascending)
2. Deal size (descending)
3. Days in stage (ascending - stalled deals)

**Diligence View:** Sorted by completion %, then by blocker severity

#### Primary Actions

| Action | Context | Result |
|--------|---------|--------|
| **Move Stage** | Pipeline card | Updates deal stage, triggers stage-specific workflows |
| **Complete Checklist Item** | Diligence view | Updates completion %, may unblock next stage |
| **Generate IC Memo** | Diligence complete | Auto-drafts memo from template + data |
| **Schedule IC** | Memo approved | Creates calendar invite, distributes materials |
| **Log Decision** | Post-IC | Records approve/reject/pass with rationale |

#### Trust Signals

| Signal | Display | Source |
|--------|---------|--------|
| **Data Verification** | "ARR verified via Stripe API" | Integration badge |
| **Reference Checks** | "3/3 customer references completed" | Diligence tracker |
| **Market Validation** | "TAM confirmed by 2 independent sources" | Research links |
| **Team Verification** | "Founder background checks complete" | Third-party report |

#### Failure Modes & Recovery UX

| Failure | Detection | Operator UX |
|---------|-----------|-------------|
| **Stale Pipeline Data** | No update > 7 days | "Last update 9 days ago. [Sync CRM] [Manual Update]" |
| **Incomplete Diligence** | Blockers present | Red checklist items with owner + due date |
| **Missing IC Memo Section** | Template incomplete | "[Market Analysis] section empty. [Auto-Generate] [Write]" |
| **Version Conflict** | Multiple editors | "Sarah edited this 5 min ago. [View Changes] [Merge]" |

---

### SURFACE 3: VALUE CREATION HUB

**Purpose:** Command center for post-close value creation - 30/60/90 plans, interventions, operating cadence

#### What It Shows

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ VALUE CREATION HUB                                                [+ Plan]  │
├─────────────────────────────────────────────────────────────────────────────┤
│ [All Portcos ▼] [Active Plans 12] [Interventions 5] [Board Packs 3]         │
│                                                                             │
│ PORTFOLIO OVERVIEW                                                          │
│ ┌────────────────┬────────────────┬────────────────┬──────────────────────┐ │
│ │ CloudSync      │ DataFlow       │ Nexus AI       │ Vertex Systems       │ │
│ │ [Active]       │ [Active]       │ [Active]       │ [Active]             │ │
│ │                │                │                │                      │ │
│ │ 30/60/90: D45  │ 30/60/90: D12  │ 30/60/90: D78  │ 30/60/90: D23        │ │
│ │ ████████░░ 80% │ ██░░░░░░░░ 20% │ █████████░ 90% │ ████░░░░░░ 40%       │ │
│ │                │                │                │                      │ │
│ │ Interventions: │ Interventions: │ Interventions: │ Interventions:       │ │
│ │ 2 active       │ 0 active       │ 1 active       │ 2 active             │ │
│ │ [View]         │ [View]         │ [View]         │ [View]               │ │
│ └────────────────┴────────────────┴────────────────┴──────────────────────┘ │
│                                                                             │
│ SELECTED: DataFlow Systems (Day 12 of 30/60/90)                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ 30/60/90 PLAN              OPERATING CADENCE           INTERVENTIONS    │ │
│ │ ─────────────              ────────────────            ─────────────    │ │
│ │                            Next 7 Days:                                 │ │
│ │ DAYS 1-30: FOUNDATION      • Mon: Weekly Standup       PIPELINE RESET   │ │
│ │ ████░░░░░░ 40%             • Wed: 1:1 with CEO         Status: Active   │ │
│ │                            • Thu: Board Update         Owner: @sarah    │ │
│ │ ✓ Cash runway analysis     • Fri: Team Sync            Due: D15         │ │
│ │ ✓ Leadership assessment    [View Full Calendar]        [View Playbook]  │ │
│ │ ▓ GTM audit (in progress)                                               │ │
│ │ ✗ Product roadmap review   KPI TREE HEALTH                              │ │
│ │   [Assign Owner]           ████████████████████ 94%                     │ │
│ │                            2 yellow metrics, 0 red                      │ │
│ │ DAYS 31-60: OPTIMIZATION   [View KPI Tree]                              │ │
│ │ ░░░░░░░░░░ 0%                                                           │ │
│ │ (Locked until D30)                                                      │ │
│ │                                                                         │ │
│ │ DAYS 61-90: SCALE                                                       │ │
│ │ ░░░░░░░░░░ 0%                                                           │ │
│ │ (Locked until D60)                                                      │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Object Model

| Entity | Fields |
|--------|--------|
| **30/60/90 Plan** | portco_id, phases[], milestones[], owners[], completion_pct |
| **Milestone** | title, description, owner, due_date, status, dependencies[] |
| **Intervention** | type, status, owner, playbook_ref, start_date, target_date |
| **Operating Cadence** | recurring_meetings[], ad_hoc_meetings[], attendees[] |
| **KPI Tree** | metrics[], thresholds, health_score, trend_direction |

#### Default Filters & Priority Ordering

**Portfolio Grid:** Sorted by:
1. Days since close (newest first - needs attention)
2. Intervention count (most active first)
3. KPI health score (lowest first)

**Plan View:** Grouped by phase (30/60/90), sorted by due date

#### Primary Actions

| Action | Context | Result |
|--------|---------|--------|
| **Create Plan** | Portfolio view | Generates template plan from portco profile |
| **Mark Complete** | Milestone | Updates completion %, may unlock next phase |
| **Launch Intervention** | Plan view | Creates intervention from playbook template |
| **Edit Cadence** | Calendar view | Modifies recurring meeting schedule |
| **Generate Board Pack** | KPI view | Auto-assembles board materials |

#### Trust Signals

| Signal | Display | Source |
|--------|---------|--------|
| **Milestone Evidence** | "Completed: [Cash Model v2]" | Document link |
| **Owner Assignment** | "@sarah (VP Ops) assigned" | User directory |
| **Dependency Check** | "Blocked by: GTM Audit" | Dependency graph |
| **Historical Pattern** | "Similar plans: 85% on-time completion" | Analytics |

#### Failure Modes & Recovery UX

| Failure | Detection | Operator UX |
|---------|-----------|-------------|
| **Plan Stalled** | No progress > 7 days | "No updates in 8 days. [Check In] [Reassign]" |
| **Milestone Overdue** | Past due date | Red alert + escalation to plan owner |
| **Intervention Failed** | Target not met | "Pipeline reset: 60% of goal. [Extend] [Pivot] [Close]" |
| **KPI Data Missing** | Integration down | "Salesforce sync failed. [Retry] [Manual Entry]" |

---

### SURFACE 4: GTM CONSOLE

**Purpose:** Pipeline hygiene, forecast accuracy, sales cadence, and enablement tracking

#### What It Shows

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ GTM CONSOLE                                                       [⚙️]      │
├─────────────────────────────────────────────────────────────────────────────┤
│ [CloudSync ▼] [Last 30 Days ▼] [All Reps ▼]           [Refresh] [Export]    │
│                                                                             │
│ PIPELINE HEALTH                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ $4.2M PIPELINE    2.1x COVERAGE      34% WIN RATE      67 DAY CYCLE     │ │
│ │ ████████████      ██████░░░░         ██░░░░░░░░        ██████░░░░       │ │
│ │ Target: $6M       Target: 3x         Target: 25%       Target: 60d      │ │
│ │ Status: 🔴        Status: 🔴         Status: 🟢        Status: 🟡       │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ PIPELINE BY STAGE                                                           │
│ ┌──────────────┬──────────────┬──────────────┬──────────────┬─────────────┐ │
│ │ QUALIFYING   │ DISCOVERING  │ EVALUATING   │ NEGOTIATING  │ CLOSED WON  │ │
│ │ $1.2M        │ $1.8M        │ $800K        │ $400K        │ $1.4M       │ │
│ │ 8 opps       │ 12 opps      │ 5 opps       │ 3 opps       │ 7 opps      │ │
│ │ 14d avg      │ 21d avg      │ 18d avg      │ 12d avg      │ -           │ │
│ │ [View]       │ [View]       │ [View]       │ [View]       │ [View]      │ │
│ └──────────────┴──────────────┴──────────────┴──────────────┴─────────────┘ │
│                                                                             │
│ FORECAST vs ACTUAL                                                          │
│ │                                                                          │ │
│ │  $2M ┤                                          ┌─── Q3 Commit: $1.8M    │ │
│ │  $1M ┤    ┌───┐    ┌───┐    ┌───┐             │                        │ │
│ │      │    │   │    │   │    │   │    ┌───┐    │  ▓▓▓ Actual            │ │
│ │   $0 ┼────┘   └────┘   └────┘   └────┘   └────┘  ░░░ Forecast          │ │
│ │      │    JAN    FEB    MAR    APR    MAY    JUN                        │ │
│ │                                                                          │ │
│ │  Accuracy: 87% (Last 6 months)  [View Detail]                            │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ SALES CADENCE COMPLIANCE                                                    │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ REP          ACTIVITIES/WEEK    PIPELINE GEN    MEETINGS    SCORE       │ │
│ │ ───────────  ────────────────   ─────────────   ─────────   ──────────  │ │
│ │ @alex_m      45/40 ✓            $180K ✓         12/10 ✓     98% 🟢      │ │
│ │ @jordan_k    32/40 ⚠            $95K ⚠          8/10 ⚠      72% 🟡      │ │
│ │ @casey_r     28/40 🔴           $45K 🔴         5/10 🔴      58% 🔴      │ │
│ │ [View Detail] [Send Coaching] [Adjust Targets]                          │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Object Model

| Entity | Fields |
|--------|--------|
| **Pipeline** | total_value, stage_breakdown[], coverage_ratio, velocity |
| **Opportunity** | amount, stage, probability, close_date, owner, last_activity |
| **Forecast** | period, commit, best_case, pipeline, actual (backfilled) |
| **Rep Performance** | activities, pipeline_gen, meetings, quota_attainment |
| **Cadence** | expected_activities, actual_activities, compliance_pct |

#### Default Filters & Priority Ordering

**Default View:** Current quarter, all reps, sorted by:
1. Pipeline coverage (lowest first - risk)
2. Stage velocity (slowest first - stuck deals)
3. Forecast variance (largest gap first)

#### Primary Actions

| Action | Context | Result |
|--------|---------|--------|
| **Deep Dive Stage** | Pipeline stage | Opens opportunity list for that stage |
| **Adjust Forecast** | Forecast section | Updates commit/best case with justification |
| **Coach Rep** | Rep row | Opens coaching template with performance data |
| **Run Pipeline Reset** | Health alert | Launches intervention playbook |
| **Export to Board Pack** | Any view | Generates formatted summary |

#### Trust Signals

| Signal | Display | Source |
|--------|---------|--------|
| **Data Source** | "Salesforce sync: 2 hours ago" | Integration timestamp |
| **Opportunity Verification** | "Last activity: 2 days ago" | Activity log |
| **Historical Accuracy** | "Rep forecast accuracy: 92%" | 6-month rolling average |
| **Stage Definition** | Hover: "Evaluating = POC initiated" | Stage definitions |

#### Failure Modes & Recovery UX

| Failure | Detection | Operator UX |
|---------|-----------|-------------|
| **CRM Sync Failed** | No update > 4h | "Salesforce disconnected. [Reconnect] [Manual Import]" |
| **Stale Opportunities** | No activity > 14d | "12 opps stale. [Bulk Update] [Archive] [Reassign]" |
| **Forecast Way Off** | Variance > 30% | "Q3 forecast 40% below commit. [Explain] [Adjust]" |
| **Rep Underperforming** | <60% cadence 2+ weeks | Auto-flag for 1:1 + suggested coaching topics |

---

### SURFACE 5: TALENT & COMP LAB

**Purpose:** Hiring plans, ramp tracking, compensation modeling, and quota/OTE validation

#### What It Shows

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ TALENT & COMP LAB                                                 [+ Role]  │
├─────────────────────────────────────────────────────────────────────────────┤
│ [CloudSync ▼] [Sales ▼] [2024 Plan ▼]                                       │
│                                                                             │
│ HIRING PLAN vs ACTUAL                                                       │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ ROLE              PLAN    HIRED    RAMPING    PRODUCING    GAP          │ │
│ │ ────────────────  ──────  ──────  ─────────  ───────────  ────────────  │ │
│ │ AE - Enterprise   6       4       2          1            -2 🔴          │ │
│ │ AE - Mid-Market   8       8       3          4            0 ✓            │ │
│ │ SDR               10      12      5          5            +2 🟡          │ │
│ │ CSM               4       3       1          1            -1 🟡          │ │
│ │ [View Detail] [Adjust Plan] [Post Jobs]                                 │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ RAMP TRACKER                                                                │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ REP           START    MONTH 1    MONTH 2    MONTH 3    MONTH 4    STATUS│ │
│ │ ────────────  ───────  ────────   ────────   ────────   ────────  ──────│ │
│ │ @alex_m       Jan 15   ✓ $45K     ✓ $78K     ▓ $95K     - $120K   🟢     │ │
│ │ @jordan_k     Feb 1    ✓ $38K     ⚠ $52K     - $85K     - $120K   🟡     │ │
│ │ @casey_r      Mar 1    🔴 $12K    - $45K     - $75K     - $100K   🔴     │ │
│ │ [View Detail] [Adjust Ramp] [Coach]                                     │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ QUOTA/OTE VALIDATOR (Golden Ratio: 5x)                                      │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ ROLE          OTE      QUOTA     RATIO     50/50?    STATUS    ACTION   │ │
│ │ ────────────  ───────  ────────  ─────────  ───────  ────────  ──────── │ │
│ │ AE - Ent      $180K    $900K     5.0x ✓    Yes ✓     🟢 Valid  [Apply]   │ │
│ │ AE - MM       $140K    $700K     5.0x ✓    Yes ✓     🟢 Valid  [Apply]   │ │
│ │ SDR           $75K     $300K     4.0x ⚠    Yes ✓     🟡 Check  [Adjust]  │ │
│ │ CSM           $110K    $400K     3.6x 🔴   No 🔴     🔴 Review [Fix]     │ │
│ │                                                                           │ │
│ │ ⚠ SDR ratio below 5x. Industry standard: 5-7x. [See Benchmarks]         │ │
│ │ 🔴 CSM: 60/40 split detected. Recommended: 50/50 for CSMs.              │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ COMP MODEL GENERATOR                                                        │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ [Generate New Model] [Load Template] [Compare Scenarios]                │ │
│ │                                                                           │ │
│ │ QUICK CALC: If OTE = $____ and Quota = $____ → Ratio = __x [Validate]   │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Object Model

| Entity | Fields |
|--------|--------|
| **Hiring Plan** | role, planned_headcount, hired, ramping, producing, target_dates[] |
| **Rep** | name, start_date, ramp_schedule[], actual_performance[], status |
| **Comp Model** | role, ote, base_salary, variable, quota, ratio, split |
| **Benchmark** | role, market_ote, market_quota, market_ratio, source |

#### Default Filters & Priority Ordering

**Default View:** Current quarter, all roles, sorted by:
1. Hiring gap (largest negative gap first)
2. Ramp risk (reps behind schedule)
3. Comp model violations (golden ratio breaches)

#### Primary Actions

| Action | Context | Result |
|--------|---------|--------|
| **Post Job** | Hiring gap | Opens job posting workflow |
| **Adjust Ramp** | Rep row | Modifies ramp expectations with justification |
| **Validate Comp** | Quota/OTE row | Checks against golden ratio + benchmarks |
| **Generate Model** | Comp generator | Creates new comp plan from template |
| **Apply Changes** | Valid model | Pushes to HRIS with approval workflow |

#### Trust Signals

| Signal | Display | Source |
|--------|---------|--------|
| **Benchmark Source** | "Based on 150 SaaS companies, $10M-$50M ARR" | Survey data |
| **Ramp Validation** | "Historical ramp: 4.2 months to quota" | Company analytics |
| **Ratio Check** | "5.0x matches Vertica golden ratio" | Policy engine |
| **Market Position** | "OTE at 75th percentile for market" | Compensation survey |

#### Failure Modes & Recovery UX

| Failure | Detection | Operator UX |
|---------|-----------|-------------|
| **Hiring Behind** | <80% of plan | "2 roles behind plan. [Accelerate] [Adjust Plan] [Outsource]" |
| **Ramp Failure** | <50% of target Month 2 | "@casey_r significantly behind. [Extend Ramp] [PIP] [Exit]" |
| **Comp Out of Band** | Ratio <4x or >7x | "Ratio outside recommended range. [Explain] [Adjust] [Override]" |
| **HRIS Sync Failed** | Push failed | "Workday sync failed. [Retry] [Manual Entry] [Contact HR]" |

---

### SURFACE 6: PORTFOLIO PULSE

**Purpose:** KPI tree visualization, anomaly detection, and automated board pack generation

#### What It Shows

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PORTFOLIO PULSE                                         [+ Alert] [Export]  │
├─────────────────────────────────────────────────────────────────────────────┤
│ [All Portcos ▼] [Last 30 Days ▼] [Overview ▼]                               │
│                                                                             │
│ PORTFOLIO HEALTH DASHBOARD                                                  │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ OVERALL HEALTH: 87% 🟢                                                  │ │
│ │ 8 companies healthy | 2 watching | 0 critical                           │ │
│ │                                                                         │ │
│ │ REVENUE        GROWTH         EFFICIENCY        RETENTION               │ │
│ │ ████████░░     ██████░░░░     █████████░        ████████░░              │ │
│ │ 94% 🟢         78% 🟡          91% 🟢            89% 🟢                   │ │
│ │ $142M ARR      45% YoY        1.2x LTV/CAC      118% NRR                │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ KPI TREE - CloudSync Inc                                                    │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │                              [🟢 ARR: $24M]                             │ │
│ │                                    │                                    │ │
│ │           ┌────────────────────────┼────────────────────────┐           │ │
│ │           │                        │                        │           │ │
│ │      [🟢 New        [🟡 Expansion       [🟢 Retention]               │ │
│ │       ARR: $8M]      ARR: $12M]       Rate: 94%]                      │ │
│ │           │                        │                        │           │ │
│ │     ┌─────┴─────┐            ┌─────┴─────┐              │           │ │
│ │     │           │            │           │              │           │ │
│ │ [🟢 SQLs]  [🟢 Win      [🟢 Upsell   [🟡 Cross-    [🟢 Logo      │ │
│ │  145/mo]    Rate: 22%]    Rate: 85%]   sell: 60%]    Churn: 6%]     │ │
│ │     │           │            │           │              │           │ │
│ │ [🟢 MQLs]  [🟢 Avg      [🟢 Health    [🟢 Usage      [🟢 Support   │ │
│ │  520/mo]    Deal: $45K]    Score: 87]   Growth: 34%]    CSAT: 4.5]  │ │
│ │                                                                         │ │
│ │ 🟡 Cross-sell below target (60% vs 75%). [View Detail] [Set Alert]     │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ANOMALY DETECTION                                                           │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ ⚠️ ALERTS (2)                                                           │ │
│ │                                                                         │ │
│ │ 🟡 CloudSync: CAC increased 23% vs last month                           │ │
│ │    Expected: $12K | Actual: $14.8K | Threshold: >15%                    │ │
│ │    [View Detail] [Acknowledge] [Create Task]                            │ │
│ │                                                                         │ │
│ │ 🟡 DataFlow: NRR declined to 108% (was 115%)                            │ │
│ │    Expected: >110% | Actual: 108% | Threshold: <110%                    │ │
│ │    [View Detail] [Acknowledge] [Create Task]                            │ │
│ │                                                                         │ │
│ │ [View All Alerts] [Configure Thresholds]                                │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ BOARD PACK STATUS                                                           │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ COMPANY         NEXT BOARD    PACK STATUS      AUTO-GEN    ACTION       │ │
│ │ ──────────────  ────────────  ───────────────  ──────────  ───────────  │ │
│ │ CloudSync       Aug 15        🟢 Ready         2 days ago  [Preview]    │ │
│ │ DataFlow        Aug 22        🟡 Draft         1 day ago   [Complete]   │ │
│ │ Nexus AI        Sep 5         ⚪ Not started   -            [Generate]   │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Object Model

| Entity | Fields |
|--------|--------|
| **KPI Tree** | metrics[], relationships[], health_scores[], thresholds |
| **Metric** | name, value, target, threshold_green, threshold_yellow, threshold_red |
| **Anomaly** | metric, expected, actual, variance_pct, severity, detected_at |
| **Board Pack** | company, meeting_date, sections[], status, generated_at |

#### Default Filters & Priority Ordering

**Default View:** All portfolio companies, current month, sorted by:
1. Overall health score (lowest first)
2. Anomaly count (most alerts first)
3. Board pack due date (closest first)

#### Primary Actions

| Action | Context | Result |
|--------|---------|--------|
| **Drill Down** | KPI node | Opens detailed metric view with history |
| **Set Alert** | Metric | Creates anomaly detection rule |
| **Acknowledge** | Anomaly | Marks as reviewed, stops notifications |
| **Generate Board Pack** | Company | Auto-assembles from templates + data |
| **Export** | Any view | Creates PDF/Excel for distribution |

#### Trust Signals

| Signal | Display | Source |
|--------|---------|--------|
| **Data Lineage** | "ARR = Sum of MRR from Stripe" | Calculation tooltip |
| **Threshold Source** | "Target based on board commitment" | Board minutes link |
| **Historical Context** | "3σ deviation from 12-month average" | Statistical analysis |
| **Verification** | "Validated by CFO on Aug 1" | Approval workflow |

#### Failure Modes & Recovery UX

| Failure | Detection | Operator UX |
|---------|-----------|-------------|
| **Data Stale** | Last update > 24h | "Data 2 days old. [Refresh] [View Source]" |
| **Missing Metric** | Null value in tree | "[Expansion ARR] not available. [Manual Entry] [Skip]" |
| **False Positive** | Anomaly acknowledged | "Alert hidden. [Show Acknowledged] [Adjust Threshold]" |
| **Board Pack Late** | Due < 3 days, not ready | "Board in 2 days. [Expedite] [Request Extension]" |

---

### SURFACE 7: EVIDENCE ROOM

**Purpose:** Version-controlled document repository for memos, playbooks, data dictionaries

#### What It Shows

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ EVIDENCE ROOM                                          [+ Upload] [New Doc] │
├─────────────────────────────────────────────────────────────────────────────┤
│ [All ▼] [IC Memos] [Playbooks] [Diligence] [Data Dictionary] [Models]       │
│                                                                             │
│ RECENT DOCUMENTS                                                            │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ NAME                    TYPE         VERSION    UPDATED    STATUS       │ │
│ │ ──────────────────────  ───────────  ────────   ─────────  ───────────  │ │
│ │ Vertex AI - IC Memo     IC Memo      v3.2       2h ago     🟢 Approved   │ │
│ │ CloudSync - 30/60/90    Value Plan   v2.1       1d ago     🟢 Active     │ │
│ │ Pipeline Reset Playbook Playbook     v1.5       3d ago     🟢 Current    │ │
│ │ SaaS Metrics Dictionary Data Dict    v4.0       1w ago     🟢 Current    │ │
│ │ DataFlow - Financial    Model        v2.8       2w ago     🟡 Review     │ │
│ │ [View All]                                                              │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ SELECTED: Pipeline Reset Playbook (v1.5)                                    │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ VERSION HISTORY                                                         │ │
│ │ v1.5 (Current) - Aug 1, 2024 - @sarah - "Added SDR playbook section"    │ │
│ │ v1.4 - Jul 15, 2024 - @mike - "Updated AE messaging"                    │ │
│ │ v1.3 - Jul 1, 2024 - @sarah - "Initial draft"                           │ │
│ │ [View Diff] [Restore v1.4]                                              │ │
│ │                                                                         │ │
│ │ PLAYBOOK CONTENTS                                                       │ │
│ │ ─────────────────                                                       │ │
│ │ 1. Trigger Conditions                                                   │ │
│ │ 2. Pre-Work (Data Gathering)                                            │ │
│ │ 3. Day 1: Pipeline Audit                                                │ │
│ │ 4. Day 2-3: Opportunity Scoring                                         │ │
│ │ 5. Day 4: Rep 1:1s                                                      │ │
│ │ 6. Day 5: New Forecast                                                  │ │
│ │ 7. Week 2+: Execution                                                   │ │
│ │ 8. Success Metrics                                                      │ │
│ │                                                                         │ │
│ │ [Edit] [Duplicate] [Share] [Export PDF]                                 │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ DATA DICTIONARY                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ METRIC          DEFINITION                    SOURCE      OWNER         │ │
│ │ ──────────────  ────────────────────────────  ──────────  ────────────  │ │
│ │ ARR             Annual Recurring Revenue      Stripe      @finance      │ │
│ │ NRR             Net Revenue Retention         Salesforce  @revops       │ │
│ │ CAC             Customer Acquisition Cost     HubSpot     @marketing    │ │
│ │ [Add Entry] [Export]                                                    │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Object Model

| Entity | Fields |
|--------|--------|
| **Document** | doc_id, name, type, current_version, versions[], tags[] |
| **Version** | version_num, content, author, timestamp, change_summary |
| **Playbook** | title, sections[], trigger_conditions, success_metrics |
| **Data Dictionary Entry** | metric_name, definition, calculation, source, owner |

#### Default Filters & Priority Ordering

**Default View:** Recently updated, sorted by:
1. Update timestamp (newest first)
2. Document type (IC memos first)
3. Status (pending review first)

#### Primary Actions

| Action | Context | Result |
|--------|---------|--------|
| **Upload** | Toolbar | Opens file upload with metadata capture |
| **New Document** | Toolbar | Creates from template |
| **View Version** | Version history | Shows document at that version |
| **Compare Versions** | Two versions | Side-by-side diff view |
| **Restore** | Old version | Rolls back with audit log entry |

#### Trust Signals

| Signal | Display | Source |
|--------|---------|--------|
| **Version Control** | "v3.2 - 3 changes since v3.1" | Git-style history |
| **Author Attribution** | "Last edited by @sarah" | User directory |
| **Approval Status** | "Approved by IC on Aug 1" | Workflow log |
| **Usage Stats** | "Downloaded 12 times this month" | Analytics |

#### Failure Modes & Recovery UX

| Failure | Detection | Operator UX |
|---------|-----------|-------------|
| **Version Conflict** | Simultaneous edit | "@mike is editing. [View Their Changes] [Merge]" |
| **Broken Link** | Referenced doc deleted | "Linked document not found. [Restore] [Remove Link]" |
| **Stale Playbook** | Not updated > 6 months | "Playbook 8 months old. [Review] [Archive]" |
| **Missing Definition** | Metric not in dictionary | "[New ARR] undefined. [Add Definition] [Request]" |

---

### SURFACE 8: RUN TRACE

**Purpose:** Full audit trail of plan → tool calls → outputs → cost for every operation

#### What It Shows

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ RUN TRACE                                                         [Filter]  │
├─────────────────────────────────────────────────────────────────────────────┤
│ [Last 24h ▼] [All Users ▼] [All Operations ▼] [Success Only ▼]              │
│                                                                             │
│ RECENT OPERATIONS                                                           │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ TIME     OPERATION           USER        STATUS    COST    DURATION    │ │
│ │ ───────  ──────────────────  ──────────  ────────  ──────  ───────────  │ │
│ │ 14:32:05 Generate Board Pack  @sarah      ✓ Success  $0.12   4.2s       │ │
│ │ 14:28:17 Pipeline Analysis    @mike       ✓ Success  $0.08   2.1s       │ │
│ │ 14:15:33 Comp Model Validate  @alex       ✓ Success  $0.03   0.8s       │ │
│ │ 13:52:41 KPI Tree Refresh     system      ✓ Success  $0.15   5.7s       │ │
│ │ 13:45:22 Forecast Update      @jordan     ✗ Failed   -       -          │ │
│ │ [View Detail]                                                           │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ SELECTED: Generate Board Pack (14:32:05)                                    │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ EXECUTION TRACE                                                         │ │
│ │ ───────────────                                                         │ │
│ │ 14:32:05.123  [INIT]  Request received: generate_board_pack             │ │
│ │ 14:32:05.145  [AUTH]  User @sarah authenticated                         │ │
│ │ 14:32:05.201  [PLAN]  Plan generated (3 steps):                         │ │
│ │                     1. fetch_kpi_data(company_id: "cloudsync")          │ │
│ │                     2. fetch_financial_model(company_id: "cloudsync")   │ │
│ │                     3. generate_document(template: "board_pack")        │ │
│ │ 14:32:05.312  [TOOL]  fetch_kpi_data called                             │ │
│ │ 14:32:06.445  [DATA]  Retrieved 47 metrics from Portfolio Pulse         │ │
│ │ 14:32:06.501  [TOOL]  fetch_financial_model called                      │ │
│ │ 14:32:07.234  [DATA]  Retrieved financial model v2.3                    │ │
│ │ 14:32:07.301  [TOOL]  generate_document called                          │ │
│ │ 14:32:09.245  [OUT]   Document generated: 12 pages, 4 sections          │ │
│ │ 14:32:09.312  [SAVE]  Saved to Evidence Room: board_pack_cloudsync_v1   │ │
│ │ 14:32:09.323  [DONE]  Total cost: $0.12, Duration: 4.2s                 │ │
│ │                                                                         │ │
│ │ [View Raw Logs] [Export JSON] [Replay]                                  │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ COST BREAKDOWN (Last 30 Days)                                               │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ OPERATION TYPE         COUNT      TOTAL COST    AVG COST    % OF BUDGET │ │
│ │ ─────────────────────  ────────   ────────────  ──────────  ─────────── │ │
│ │ Board Pack Generation  45         $5.40         $0.12       23%         │ │
│ │ Pipeline Analysis      120        $9.60         $0.08       41%         │ │
│ │ Comp Validation        89         $2.67         $0.03       11%         │ │
│ │ KPI Refresh            180        $5.40         $0.03       23%         │ │
│ │ ─────────────────────  ────────   ────────────  ──────────  ─────────── │ │
│ │ TOTAL                  434        $23.07        $0.05       92%         │ │
│ │ Monthly Budget: $25    Remaining: $1.93                                 │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Object Model

| Entity | Fields |
|--------|--------|
| **Run** | run_id, operation, user, timestamp, status, duration, cost, trace[] |
| **Trace Step** | timestamp, level, message, metadata |
| **Cost Record** | operation_type, count, total_cost, avg_cost |

#### Default Filters & Priority Ordering

**Default View:** Last 24 hours, all operations, sorted by:
1. Timestamp (newest first)
2. Failed operations (highlighted)
3. High-cost operations (flagged if >$1)

#### Primary Actions

| Action | Context | Result |
|--------|---------|--------|
| **View Detail** | Run row | Opens full trace view |
| **Replay** | Successful run | Re-executes same operation |
| **Debug** | Failed run | Shows error details + stack trace |
| **Export** | Any run | Downloads JSON/CSV of trace |

#### Trust Signals

| Signal | Display | Source |
|--------|---------|--------|
| **Execution Time** | "4.2s - within SLA" | Performance benchmark |
| **Cost Transparency** | "$0.12 - 92% below budget" | Cost tracking |
| **Data Provenance** | "47 metrics from Portfolio Pulse" | Source attribution |
| **User Attribution** | "Initiated by @sarah" | Audit trail |

#### Failure Modes & Recovery UX

| Failure | Detection | Operator UX |
|---------|-----------|-------------|
| **Operation Failed** | Status = Failed | Red row with [Debug] [Retry] [Report] |
| **High Cost** | Cost > $1 | Yellow warning: "Unusual cost. [Investigate]" |
| **Slow Operation** | Duration > 30s | "Taking longer than expected. [Cancel] [Wait]" |
| **Budget Alert** | >80% of monthly budget | "Approaching cost limit. [Review Usage]" |

---

### SURFACE 9: INTEGRATIONS HEALTH

**Purpose:** Monitor data sync, schema drift, and freshness across all connected systems

#### What It Shows

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ INTEGRATIONS HEALTH                                               [+ Add]   │
├─────────────────────────────────────────────────────────────────────────────┤
│ [All Systems ▼] [Healthy ▼] [Warnings ▼] [Errors ▼]                         │
│                                                                             │
│ SYSTEM HEALTH OVERVIEW                                                      │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ 🟢 HEALTHY: 8    🟡 WARNINGS: 2    🔴 ERRORS: 1    Overall: 85%         │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ CONNECTED SYSTEMS                                                           │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ SYSTEM        TYPE         STATUS    LAST SYNC    FRESHNESS    SCHEMA   │ │
│ │ ────────────  ───────────  ────────  ──────────   ──────────   ───────  │ │
│ │ Salesforce    CRM          🟢        12 min ago   ✓ < 1h       ✓        │ │
│ │ Stripe        Billing      🟢        8 min ago    ✓ < 1h       ✓        │ │
│ │ HubSpot       Marketing    🟢        15 min ago   ✓ < 1h       ✓        │ │
│ │ Workday       HRIS         🟢        1 hour ago   ✓ < 4h       ✓        │ │
│ │ NetSuite      ERP          🟡        6 hours ago  ⚠ 4-12h      ✓        │ │
│ │ QuickBooks    Accounting   🟢        30 min ago   ✓ < 1h       ✓        │ │
│ │ Google Drive  Documents    🟡        2 hours ago  ⚠ 1-4h       ⚠ Drift  │ │
│ │ Slack         Messaging    🟢        5 min ago    ✓ < 1h       N/A      │ │
│ │ Custom API    Data Feed    🔴        2 days ago   🔴 > 24h     🔴       │ │
│ │ [View Detail] [Reconnect] [Configure]                                   │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ SELECTED: Google Drive (⚠ Schema Drift Detected)                            │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ SCHEMA DRIFT ALERT                                                      │ │
│ │                                                                         │ │
│ │ DETECTED: Aug 5, 2024 14:23 UTC                                         │ │
│ │                                                                         │ │
│ │ CHANGES:                                                                │ │
│ │ • Folder "IC Memos" renamed to "Investment Memos"                       │ │
│ │ • 3 files moved from /active to /archive                                │ │
│ │ • New folder created: /templates                                        │ │
│ │                                                                         │ │
│ │ IMPACT:                                                                 │ │
│ │ • 2 document links may be broken                                        │ │
│ │ • Auto-sync for IC memos paused                                         │ │
│ │                                                                         │ │
│ │ [View Affected Documents] [Update Mappings] [Ignore]                    │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ SYNC HISTORY                                                                │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ TIME              SYSTEM       STATUS    RECORDS    ERRORS    DURATION   │ │
│ │ ─────────────────  ──────────  ────────  ─────────  ────────  ────────── │ │
│ │ Aug 5 14:23       Salesforce  Success   1,245      0         12s         │ │
│ │ Aug 5 14:15       Stripe      Success   892        0         8s          │ │
│ │ Aug 5 14:08       HubSpot     Success   2,103      0         15s         │ │
│ │ Aug 5 13:45       NetSuite    Warning   5,432      3         45s         │ │
│ │ [View All]                                                              │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Object Model

| Entity | Fields |
|--------|--------|
| **Integration** | system_name, type, status, last_sync, freshness_threshold, schema_version |
| **Sync Record** | timestamp, system, status, records_processed, errors, duration |
| **Schema Drift** | system, detected_at, changes[], impact[], resolution |

#### Default Filters & Priority Ordering

**Default View:** All systems, sorted by:
1. Status (errors first, then warnings, then healthy)
2. Last sync (oldest first)
3. System criticality (CRM/ERP first)

#### Primary Actions

| Action | Context | Result |
|--------|---------|--------|
| **Reconnect** | Error status | Re-authenticates integration |
| **Configure** | Any system | Opens sync settings |
| **Force Sync** | Warning status | Triggers immediate sync |
| **Update Mappings** | Schema drift | Opens field mapping editor |

#### Trust Signals

| Signal | Display | Source |
|--------|---------|--------|
| **Freshness Badge** | "✓ < 1h" vs "⚠ 4-12h" | Sync timestamp comparison |
| **Record Count** | "1,245 records synced" | Sync log |
| **Error Details** | "3 errors - [View]" | Error log with specifics |
| **Schema Version** | "Schema v2.3" | Version tracking |

#### Failure Modes & Recovery UX

| Failure | Detection | Operator UX |
|---------|-----------|-------------|
| **Sync Failed** | Status = Error | Red row with error message + [Reconnect] [View Logs] |
| **Auth Expired** | 401 error | "Authentication expired. [Re-authenticate]" |
| **Rate Limited** | 429 error | "Rate limit hit. Retrying in 15 min. [Force Now]" |
| **Schema Drift** | Field mismatch | "Field 'ARR' not found. [Update Mapping] [Ignore]" |
| **Data Quality** | Validation errors | "12 records failed validation. [Review] [Skip]" |

---

### SURFACE 10: POLICY CENTER

**Purpose:** RBAC, allowlists, two-person rules, and "write" gates for sensitive operations

#### What It Shows

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ POLICY CENTER                                                     [+ Rule]  │
├─────────────────────────────────────────────────────────────────────────────┤
│ [Overview] [Roles] [Permissions] [Approval Chains] [Audit]                  │
│                                                                             │
│ POLICY OVERVIEW                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ ACTIVE POLICIES: 12    PENDING: 2    VIOLATIONS (24h): 0                │ │
│ │                                                                         │ │
│ │ CATEGORY              COUNT    STATUS                                   │ │
│ │ ────────────────────  ───────  ────────────────                         │ │
│ │ Investment Approvals  4        🟢 All Active                            │ │
│ │ Compensation Changes  3        🟢 All Active                            │ │
│ │ Data Access           2        🟢 All Active                            │ │
│ │ System Changes        3        🟡 1 Pending Review                      │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ROLES & PERMISSIONS                                                         │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ ROLE              USERS    PERMISSIONS                    LAST REVIEWED │ │
│ │ ────────────────  ───────  ─────────────────────────────  ────────────  │ │
│ │ Super Admin       2        Full system access             Jul 1, 2024   │ │
│ │ Investment Lead   4        Deals, Portfolio, Approvals    Jul 1, 2024   │ │
│ │ Operator          8        Portfolio, Value Creation      Jul 1, 2024   │ │
│ │ Analyst           6        Read-only, Analysis tools      Jul 1, 2024   │ │
│ │ [View Detail] [Edit] [Clone]                                            │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ TWO-PERSON RULES                                                            │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ OPERATION                    APPROVERS REQUIRED    CURRENT SETUP        │ │
│ │ ───────────────────────────  ────────────────────  ───────────────────  │ │
│ │ Investment > $10M            2 of: IC Chair, CFO,  ✓ Active             │ │
│ │                              Managing Partner                           │ │
│ │ Compensation Model Change    2 of: CEO, CFO, Head  ✓ Active             │ │
│ │                              of People                                  │ │
│ │ Delete Portfolio Company     2 of: Super Admin     ✓ Active             │ │
│ │ Export Sensitive Data        1 of: Data Owner +    ⚠ Needs 2nd approver │ │
│ │                              Legal                                      │ │
│ │ [Edit Rules]                                                            │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ WRITE GATES (Sensitive Operations)                                          │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ OPERATION              GATE TYPE         STATUS    LAST TRIGGERED       │ │
│ │ ─────────────────────  ────────────────  ────────  ───────────────────  │ │
│ │ Approve Investment     Multi-sig (2/3)   🟢        Aug 1, 2024          │ │
│ │ Change Quota/OTE       Approval Chain    🟢        Jul 28, 2024         │ │
│ │ Delete Documents       Two-person rule   🟢        Never                │ │
│ │ Modify KPI Targets     CEO + Board       🟢        Jul 15, 2024         │ │
│ │ Bulk Data Export       Legal Review      🟢        Never                │ │
│ │ [Configure Gates]                                                       │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ ALLOWLISTS                                                                  │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ CATEGORY              ITEMS    LAST UPDATED    UPDATED BY               │ │
│ │ ────────────────────  ───────  ──────────────  ───────────────────────  │ │
│ │ Approved Vendors      24       Jul 15, 2024    @admin                   │ │
│ │ IP Whitelist          12       Aug 1, 2024     @admin                   │ │
│ │ Email Domains         5        Jan 1, 2024     @admin                   │ │
│ │ File Types            15       Mar 15, 2024    @admin                   │ │
│ │ [View/Edit]                                                             │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Object Model

| Entity | Fields |
|--------|--------|
| **Role** | name, users[], permissions[], created_at, last_reviewed |
| **Permission** | resource, action, conditions |
| **TwoPersonRule** | operation, required_approvers, min_approvers, current_approvers[] |
| **WriteGate** | operation, gate_type, approvers[], status |
| **Allowlist** | category, items[], last_updated, updated_by |

#### Default Filters & Priority Ordering

**Default View:** Overview tab, policies sorted by:
1. Pending status (needs attention)
2. Last reviewed (oldest first)
3. Violation count (if any)

#### Primary Actions

| Action | Context | Result |
|--------|---------|--------|
| **Create Role** | Roles tab | Opens role builder |
| **Edit Permissions** | Role row | Opens permission matrix |
| **Add Two-Person Rule** | Rules section | Creates new approval rule |
| **Configure Gate** | Gate row | Opens gate configuration |
| **Review Policy** | Policy card | Marks as reviewed with notes |

#### Trust Signals

| Signal | Display | Source |
|--------|---------|--------|
| **Last Reviewed** | "Last reviewed: Jul 1, 2024" | Audit log |
| **Active Users** | "4 users assigned" | User directory |
| **Policy Version** | "Policy v2.1" | Version control |
| **Violation Log** | "0 violations in last 24h" | Security monitoring |

#### Failure Modes & Recovery UX

| Failure | Detection | Operator UX |
|---------|-----------|-------------|
| **Policy Violation** | Unauthorized action | "Action blocked by policy. [Request Exception] [Contact Admin]" |
| **Approver Unavailable** | No response > 24h | "Primary approver unavailable. Escalating to backup." |
| **Stale Policy** | Not reviewed > 90 days | "Policy 120 days old. [Schedule Review]" |
| **Permission Conflict** | Overlapping rules | "Conflicting permissions detected. [Resolve]" |

---

### SURFACE 11: AUDIT LOG

**Purpose:** Append-only record of all system actions for compliance and forensics

#### What It Shows

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ AUDIT LOG                                              [Export] [Subscribe] │
├─────────────────────────────────────────────────────────────────────────────┤
│ [All Events ▼] [Last 30 Days ▼] [All Users ▼] [All Resources ▼]             │
│                                                                             │
│ SEARCH: [🔍 _________________________] [Advanced]                           │
│                                                                             │
│ RECENT EVENTS                                                               │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ TIMESTAMP           USER        ACTION         RESOURCE      RESULT      │ │
│ │ ──────────────────  ──────────  ─────────────  ────────────  ──────────  │ │
│ │ Aug 5 14:32:05 UTC  @sarah      board_pack.gen  CloudSync     SUCCESS    │ │
│ │ Aug 5 14:28:17 UTC  @mike       pipeline.view   CloudSync     SUCCESS    │ │
│ │ Aug 5 14:15:33 UTC  @alex       comp.validate   DataFlow      SUCCESS    │ │
│ │ Aug 5 14:12:01 UTC  @jordan     deal.update     Vertex AI     SUCCESS    │ │
│ │ Aug 5 13:58:44 UTC  @sarah      user.login      system        SUCCESS    │ │
│ │ Aug 5 13:45:22 UTC  @jordan     forecast.update CloudSync     FAILED     │ │
│ │ Aug 5 13:30:15 UTC  @admin      policy.modify   System        SUCCESS    │ │
│ │ [View All]                                                              │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ SELECTED: @admin - policy.modify (Aug 5 13:30:15 UTC)                       │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ EVENT DETAIL                                                            │ │
│ │ ────────────                                                            │ │
│ │ Event ID:     audit_20240805_133015_admin_policy_modify                 │ │
│ │ Timestamp:    Aug 5, 2024 13:30:15 UTC                                  │ │
│ │ User:         @admin (Super Admin)                                      │ │
│ │ IP Address:   203.0.113.45                                              │ │
│ │ User Agent:   Mozilla/5.0 (Vertica OS Console)                          │ │
│ │ Session ID:   sess_abc123xyz                                            │ │
│ │                                                                         │ │
│ │ ACTION                                                                  │ │
│ │ Type:         policy.modify                                             │ │
│ │ Resource:     Two-Person Rule: Investment Approval                      │ │
│ │                                                                             │ │
│ │ BEFORE:                                                                 │ │
│ │ {                                                                         │ │
│ │   "min_approvers": 2,                                                   │ │
│ │   "required_approvers": ["ic_chair", "cfo", "managing_partner"]         │ │
│ │ }                                                                         │ │
│ │                                                                         │ │
│ │ AFTER:                                                                  │ │
│ │ {                                                                         │ │
│ │   "min_approvers": 2,                                                   │ │
│ │   "required_approvers": ["ic_chair", "cfo", "managing_partner", "ceo"]  │ │
│ │ }                                                                         │ │
│ │                                                                             │ │
│ │ Justification: "Added CEO to approval chain per board decision Aug 1"   │ │
│ │                                                                         │ │
│ │ [View Full Diff] [Export Event] [View Related]                          │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ COMPLIANCE SUMMARY                                                          │
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │ PERIOD              EVENTS    MODIFICATIONS    LOGINS    EXPORTS        │ │
│ │ ──────────────────  ────────  ───────────────  ────────  ────────────   │ │
│ │ Last 24 hours       1,245     23               89        12             │ │
│ │ Last 7 days         8,432     156              534       67             │ │
│ │ Last 30 days        34,567    612              2,103     234            │ │
│ │                                                                             │ │
│ │ RETENTION: Events retained for 7 years per policy                       │ │
│ │ ENCRYPTION: AES-256 at rest, TLS 1.3 in transit                         │ │
│ │ INTEGRITY: SHA-256 hashed, tamper-evident                               │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Object Model

| Entity | Fields |
|--------|--------|
| **Audit Event** | event_id, timestamp, user, action, resource, before, after, result, metadata |
| **Metadata** | ip_address, user_agent, session_id, justification |
| **Compliance Summary** | period, event_counts, retention_policy |

#### Default Filters & Priority Ordering

**Default View:** Last 30 days, all events, sorted by:
1. Timestamp (newest first)
2. Failed actions (highlighted)
3. Sensitive operations (policy changes, exports)

#### Primary Actions

| Action | Context | Result |
|--------|---------|--------|
| **Search** | Search bar | Full-text search across all fields |
| **Advanced Filter** | Filter button | Opens multi-criteria filter panel |
| **Export** | Toolbar | Downloads events (requires permission) |
| **Subscribe** | Toolbar | Sets up alerts for specific event types |
| **View Related** | Event detail | Shows events from same session/user |

#### Trust Signals

| Signal | Display | Source |
|--------|---------|--------|
| **Integrity Hash** | "SHA-256: a3f7...9e2d" | Cryptographic signature |
| **Retention Policy** | "Retained until Aug 5, 2031" | Policy engine |
| **Encryption Status** | "AES-256 encrypted" | Security config |
| **Tamper Evidence** | "Log integrity verified" | Hash chain validation |

#### Failure Modes & Recovery UX

| Failure | Detection | Operator UX |
|---------|-----------|-------------|
| **Log Corruption** | Hash mismatch | "⚠ Integrity check failed. [Contact Security]" |
| **Export Too Large** | >100K events | "Result set too large. [Narrow Filters] [Request Bulk]" |
| **Search Timeout** | >30s | "Search taking too long. [Simplify Query]" |
| **Permission Denied** | Unauthorized export | "Export requires 'audit_export' permission. [Request Access]" |

---

## 3. WOW DEMO SCRIPT (8-10 Minutes)

### Demo Flow Overview

**Target:** Investment Committee member  
**Goal:** Land 3 approvals in one session  
**Time:** 8-10 minutes  
**Screens:** 7 key surfaces

---

### DEMO SCRIPT

#### **MINUTE 0:00 - 0:30: OPENING & CONTEXT**

**[Screen: Portfolio Pulse - Overview]**

> **Narrator:** "Good morning. I'm going to show you how Vertica OS transforms how we operate our portfolio. This isn't a chatbot asking you questions—it's a command center giving you answers."

> "Right now we're looking at the Portfolio Pulse. Eight companies, $142M in ARR, growing at 45% year-over-year. But here's what matters—we have two yellow alerts that need attention."

**[Click: CloudSync alert]**

> "CloudSync's CAC is up 23% month-over-month. That's outside our threshold. Let's see what we can do about it."

---

#### **MINUTE 0:30 - 2:00: INTERVENTION WORKFLOW**

**[Screen: Value Creation Hub - CloudSync]**

> "CloudSync is on Day 45 of their 30/60/90 plan. They're 80% through the Foundation phase. But we flagged a GTM issue."

**[Scroll to Interventions section]**

> "I can launch a Pipeline Reset intervention directly from here. This isn't a blank slate—it pulls from our proven playbook."

**[Click: Launch Intervention]**

> "The system auto-assigns the right owner—Sarah, our VP of Ops who's done three of these before. It sets the timeline—15 days. And it pulls in the exact steps from our playbook."

**[Show: Intervention playbook preview]**

> "Day 1: Pipeline audit. Day 2-3: Opportunity scoring. Day 4: Rep 1:1s. Day 5: New forecast. This is operator-led value creation, not consultant theater."

---

#### **MINUTE 2:00 - 3:30: GTM CONSOLE DEEP DIVE**

**[Screen: GTM Console - CloudSync]**

> "Let's look at what's actually happening in the GTM organization. Pipeline coverage is 2.1x—below our 3x target. That's why we're doing the reset."

**[Point to pipeline stages]**

> "We can see exactly where deals are stuck. $1.8M in Discovering stage with a 21-day average. That's too long."

**[Scroll to Rep Performance]**

> "Here's the rep-level view. Alex is at 98% cadence compliance—he's doing the work. Jordan is at 72%, Casey at 58%. The reset will focus coaching on the bottom performers while Alex keeps crushing it."

**[Click: Generate Coaching Plan]**

> "I can auto-generate a coaching plan for Casey based on his actual activity data. No guessing. No generic feedback. Specific, actionable, tied to outcomes."

---

#### **MINUTE 3:30 - 5:00: APPROVAL #1 - COMPENSATION MODEL**

**[Screen: Talent & Comp Lab]**

> "Now let's talk about talent. We need to hire two more Enterprise AEs to hit our plan. But first, I want to show you something about how we think about comp."

**[Scroll to Quota/OTE Validator]**

> "This is our Golden Ratio: 5x quota to OTE, 50/50 split. Every comp model in the system is validated against this."

**[Point to table]**

> "Enterprise AEs: $180K OTE, $900K quota, 5.0x ratio. Perfect. Mid-Market: $140K OTE, $700K quota. Also perfect."

**[Point to yellow row]**

> "But look at the SDRs. $75K OTE, $300K quota—that's only 4.0x. Below our standard. The system flagged it."

**[Click: Adjust]**

> "I can fix this right now. If we move quota to $375K, we hit 5.0x. That's still aggressive but achievable based on our benchmarks."

**[Show: Benchmark comparison]**

> "Our data shows SDR ratios at 5-7x for companies our size. We're proposing 5x—right in the sweet spot."

> **ASK:** "Can I get approval to update the SDR comp model to $375K quota, maintaining the 5x golden ratio?"

**[Pause for approval]**

> "Great. That change flows directly to Workday, and the offer letters going out this week will have the right numbers."

---

#### **MINUTE 5:00 - 6:30: APPROVAL #2 - PIPELINE RESET**

**[Screen: Decision Inbox]**

> "Now let's look at what needs your attention. The Decision Inbox shows everything requiring human judgment."

**[Point to Pipeline Reset approval]**

> "Here's the Pipeline Reset we talked about for CloudSync. Confidence score: 92%. Evidence links to the GTM analysis we just reviewed. Owner assigned: Sarah."

**[Show: Impact estimate]**

> "The system estimates this intervention could improve Q4 pipeline coverage from 2.1x to 3.5x, worth approximately $2M in additional ARR if we close at historical rates."

> **ASK:** "Can I get approval to launch the Pipeline Reset intervention for CloudSync?"

**[Pause for approval]**

> "Approved. Sarah gets notified immediately, and the 15-day clock starts. We'll track progress in the Value Creation Hub."

---

#### **MINUTE 6:30 - 8:00: APPROVAL #3 - BOARD PACK**

**[Screen: Portfolio Pulse - Board Pack Section]**

> "Last item. Board season is coming up. CloudSync's board meeting is August 15th—that's 10 days away."

**[Click: Generate Board Pack]**

> "I can auto-generate the board pack right now. It pulls from our KPI tree, financial model, and recent updates."

**[Show: Generation progress]**

> "The system is gathering 47 metrics from Portfolio Pulse, pulling the latest financial model, and assembling everything into our standard template."

**[Screen: Generated Board Pack Preview]**

> "Here's the draft. 12 pages, 4 sections: Executive Summary, Financial Performance, Operational Metrics, and Forward Outlook."

**[Scroll through sections]**

> "The KPI tree we saw earlier—automatically formatted. The CAC alert we flagged—automatically included with context. The Pipeline Reset we just approved—automatically added to the initiatives section."

**[Show: Evidence links]**

> "Every number has a source. Click any metric, see where it came from. Click any chart, see the underlying data."

> **ASK:** "Can I get approval to distribute this board pack to the CloudSync board on August 12th, three days before the meeting?"

**[Pause for approval]**

> "Approved. The pack will auto-distribute on August 12th, and we'll track who opens it, how long they spend on each section, and what questions they ask."

---

#### **MINUTE 8:00 - 8:30: CLOSING**

**[Screen: Portfolio Pulse - Overview]**

> "In 8 minutes, we've:
> 1. Identified a GTM issue through automated alerts
> 2. Launched a data-driven intervention with clear ownership
> 3. Fixed a comp model violation using our golden ratio
> 4. Generated a board-ready pack with full provenance

> "This is operator-led value creation. Not reports. Not meetings. Decisions with evidence, owners, and outcomes."

> "The system doesn't replace judgment—it amplifies it. You still make the calls. But now you make them faster, with better data, and with full audit trails."

> "Questions?"

---

## APPENDIX: DESIGN SYSTEM NOTES

### Color Palette

| Usage | Color | Hex |
|-------|-------|-----|
| Primary | Deep Blue | #1a365d |
| Success | Green | #38a169 |
| Warning | Yellow | #d69e2e |
| Error | Red | #e53e3e |
| Neutral | Gray | #718096 |
| Background | Light Gray | #f7fafc |
| Surface | White | #ffffff |

### Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| H1 | Inter | 24px | 600 |
| H2 | Inter | 20px | 600 |
| H3 | Inter | 16px | 600 |
| Body | Inter | 14px | 400 |
| Caption | Inter | 12px | 400 |
| Mono | JetBrains Mono | 13px | 400 |

### Spacing

| Token | Value |
|-------|-------|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |

### Component Library

- **Buttons:** Primary (filled), Secondary (outline), Tertiary (text)
- **Inputs:** Bordered, 8px radius, focus ring
- **Tables:** Striped rows, hover state, sortable headers
- **Cards:** 8px radius, subtle shadow, 1px border
- **Badges:** Rounded pill, color-coded by status
- **Tooltips:** Dark background, 4px radius, arrow

---

## DOCUMENT CONTROL

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 2025 | Vertica Product | Initial specification |

---

*End of Specification*
