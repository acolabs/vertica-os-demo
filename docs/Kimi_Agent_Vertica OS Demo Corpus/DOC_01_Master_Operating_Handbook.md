# DOC 01 — VERTICA OS: MASTER OPERATING HANDBOOK (v1)
## The Complete Guide to Vertica Capital Partners' Operating System

---

## DOCUMENT CONTROL

| Field | Value |
|-------|-------|
| **Document ID** | VERTICA-DOC-01 |
| **Version** | 1.0 |
| **Effective Date** | [DATE] |
| **Review Cycle** | Quarterly |
| **Owner** | Managing Partner |
| **Approver** | Executive Committee |
| **Classification** | INTERNAL USE |

---

## TABLE OF CONTENTS

1. [Purpose, Audience, Inputs & Outputs](#1-purpose-audience-inputs--outputs)
2. [Vertica OS Overview](#2-vertica-os-overview)
3. [System Architecture](#3-system-architecture)
4. [User Roles & Permissions](#4-user-roles--permissions)
5. [Core Workflows](#5-core-workflows)
6. [Document Library](#6-document-library)
7. [Getting Started](#7-getting-started)
8. [Support & Escalation](#8-support--escalation)
9. [Version History](#9-version-history)

---

## 1. PURPOSE, AUDIENCE, INPUTS & OUTPUTS

### 1.1 PURPOSE

This Master Operating Handbook serves as the **central reference document** for Vertica Capital Partners' Operating System (Vertica OS). It provides:

- **Unified Context**: Single source of truth for how Vertica OS works
- **Navigation Guide**: Clear pointers to all supporting documentation
- **Onboarding Resource**: New team member orientation
- **Decision Framework**: Governance and escalation pathways
- **Quality Standard**: Consistency across all operations

**Primary Objective**: Enable every Vertica team member to understand the operating system, find relevant guidance quickly, and execute their responsibilities with confidence.

### 1.2 AUDIENCE

| Role | Primary Use | Key Sections |
|------|-------------|--------------|
| **Managing Partners** | Strategic oversight, governance decisions | 2, 3, 4, 5, 8 |
| **Principals/VPs** | Deal execution, team leadership | 2, 3, 5, 6, 7 |
| **Associates/Analysts** | Day-to-day operations, data management | 3, 5, 6, 7 |
| **Operating Partners** | Value creation, portfolio support | 2, 5, 6 |
| **Deal Operations** | Process management, quality control | 3, 5, 6, 8 |
| **New Hires** | Onboarding, system orientation | 1, 2, 6, 7 |
| **Portfolio Company Leaders** | Understanding Vertica's approach | 2, 5 |

### 1.3 INPUTS

| Input Category | Specific Inputs | Source |
|----------------|-----------------|--------|
| **Deal Flow** | Inbound opportunities, referrals, direct outreach | Bankers, OPs, PortCos, Network |
| **Market Data** | Industry reports, competitive intelligence, benchmarks | Third-party providers, Research |
| **Portfolio Data** | Financials, KPIs, board materials, management updates | Portfolio Companies |
| **Internal Knowledge** | Thesis, playbooks, lessons learned, best practices | Vertica Team |
| **External Intelligence** | Win/loss analysis, customer feedback, expert calls | Primary research |

### 1.4 OUTPUTS

| Output Category | Specific Outputs | Consumer |
|-----------------|------------------|----------|
| **Investment Decisions** | IC packs, diligence reports, recommendations | Investment Committee |
| **Portfolio Management** | Board packs, monitoring reports, early warnings | Board Members, Management |
| **Value Creation** | 100-day plans, operating playbooks, KPI tracking | Portfolio Companies |
| **Internal Reporting** | Pipeline reviews, portfolio dashboards, LP updates | Vertica Team, LPs |
| **Knowledge Assets** | Templates, SOPs, battlecards, training materials | All Stakeholders |

---

## 2. VERTICA OS OVERVIEW

### 2.1 PHILOSOPHY

Vertica OS is built on five core principles:

```
┌─────────────────────────────────────────────────────────────────┐
│                  VERTICA OS PHILOSOPHY                          │
├─────────────────────────────────────────────────────────────────┤
│  1. DISCIPLINED EXCELLENCE                                      │
│     "Process enables creativity. Standards free up thinking."   │
│                                                                 │
│  2. DATA-DRIVEN DECISIONS                                       │
│     "Opinions are validated by evidence. Intuition is tested."  │
│                                                                 │
│  3. OPERATOR-LED VALUE CREATION                                 │
│     "We don't just invest. We build. Our OPs are our edge."     │
│                                                                 │
│  4. CONTINUOUS IMPROVEMENT                                      │
│     "Every deal teaches. Every quarter refines."                │
│                                                                 │
│  5. HUMAN-CENTERED AUTOMATION                                   │
│     "AI amplifies judgment. Humans retain authority."           │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 DESIGN PRINCIPLES

| Principle | Implementation | Rationale |
|-----------|----------------|-----------|
| **Single Source of Truth** | Centralized data model, canonical entities | Eliminates version conflicts, ensures consistency |
| **Human-in-the-Loop (HITL)** | Tiered approval gates based on AI confidence | Maintains human authority on material decisions |
| **Role-Based Access** | Granular RBAC with attribute-based controls | Security + usability balance |
| **Audit Everything** | Comprehensive logging, immutable records | Compliance, learning, accountability |
| **Template-Driven** | Standardized documents, repeatable processes | Efficiency, quality, training |
| **Stage-Appropriate** | Different thresholds by company stage | Relevant benchmarks, fair evaluation |

### 2.3 SYSTEM CAPABILITIES

Vertica OS enables:

**DEAL LIFECYCLE MANAGEMENT**
- Systematic intake and screening
- Structured diligence and IC process
- Standardized documentation and workflows

**PORTFOLIO MONITORING**
- Real-time KPI tracking
- Automated anomaly detection
- Early warning escalation

**VALUE CREATION**
- Operating partner deployment
- 30/60/90 day intervention plans
- Playbook library and enablement

**GOVERNANCE & REPORTING**
- Board pack generation
- LP reporting
- Compliance and audit trails

**KNOWLEDGE MANAGEMENT**
- Centralized document library
- Searchable deal history
- Lessons learned capture

---

## 3. SYSTEM ARCHITECTURE

### 3.1 HIGH-LEVEL ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           VERTICA OS ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      USER INTERFACE LAYER                            │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │   │
│  │  │  Deal    │ │ Portfolio│ │  Value   │ │ Reporting│ │  Admin   │   │   │
│  │  │  Module  │ │  Module  │ │ Creation │ │  Module  │ │  Module  │   │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    AI/AGENTIC LAYER (HITL)                           │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐                 │   │
│  │  │   AI Assist  │ │  Deal Score  │ │  Anomaly     │                 │   │
│  │  │   (Query)    │ │  (Prioritize)│ │  Detection   │                 │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘                 │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │              HITL GATES (Tier 1-4)                           │    │   │
│  │  │  Autonomous → Supervised → Controlled → Restricted          │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    APPLICATION LAYER                                 │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │   │
│  │  │  Deal    │ │ Company  │ │ Financial│ │  Board   │ │ Document │   │   │
│  │  │  Engine  │ │ Directory│ │  Models  │ │  Packs   │ │   Mgmt   │   │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    DATA LAYER (SSOT)                                 │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │   │
│  │  │   Fund   │ │   Deal   │ │  Company │ │   KPI    │ │ Financial│   │   │
│  │  │  Entity  │ │  Entity  │ │  Entity  │ │  Entity  │ │  Model   │   │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                 INTEGRATION LAYER                                    │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │   │
│  │  │   CRM    │ │   ERP    │ │  Product │ │   HRIS   │ │  Banking │   │   │
│  │  │ (Sales)  │ │(Finance) │ │Analytics │ │ (People) │ │  Feeds   │   │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 CORE COMPONENTS

| Component | Description | Key Function |
|-----------|-------------|--------------|
| **Deal Engine** | End-to-end deal workflow management | Intake → Screening → Diligence → IC → Close |
| **Company Directory** | Centralized company profiles | Master data, relationships, history |
| **KPI Warehouse** | Performance metrics storage | Tracking, benchmarking, alerting |
| **Financial Models** | Valuation and returns analysis | LBO, DCF, scenario modeling |
| **Board Pack Generator** | Automated report creation | Monthly/quarterly board materials |
| **Document Management** | Secure file storage and retrieval | Version control, access control, audit |
| **AI Assistant** | Natural language query interface | Deal search, insights, recommendations |
| **HITL Framework** | Human approval workflow system | Tiered gates based on confidence/impact |

### 3.3 DATA FLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                     DATA FLOW DIAGRAM                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  EXTERNAL SOURCES                                                │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐                │
│  │ Bankers │ │  CRMs   │ │   ERPs  │ │Research │                │
│  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘                │
│       │           │           │           │                      │
│       └───────────┴───────────┴───────────┘                      │
│                   │                                              │
│                   ▼                                              │
│  ┌─────────────────────────────────────┐                        │
│  │      INTEGRATION LAYER              │                        │
│  │  • Data validation                  │                        │
│  │  • Quality checks                   │                        │
│  │  • Deduplication                    │                        │
│  └──────────────────┬──────────────────┘                        │
│                     │                                            │
│                     ▼                                            │
│  ┌─────────────────────────────────────┐                        │
│  │      SINGLE SOURCE OF TRUTH         │                        │
│  │  • Canonical entities               │                        │
│  │  • Relationships                    │                        │
│  │  • History/audit trail              │                        │
│  └──────────────────┬──────────────────┘                        │
│                     │                                            │
│       ┌─────────────┼─────────────┐                              │
│       │             │             │                              │
│       ▼             ▼             ▼                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐                          │
│  │   AI    │  │  USER   │  │ REPORTS │                          │
│  │ LAYER   │  │  APPS   │  │ & ALERTS│                          │
│  └─────────┘  └─────────┘  └─────────┘                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.4 INTEGRATIONS

| System Type | Examples | Integration Method | Data Flow |
|-------------|----------|-------------------|-----------|
| **CRM** | Salesforce, HubSpot | API | Bi-directional sync |
| **ERP** | NetSuite, Sage | API/CSV | Inbound financials |
| **Product Analytics** | Mixpanel, Amplitude | Event streaming | Usage data |
| **HRIS** | BambooHR, Workday | API | Headcount, org data |
| **Banking** | Silicon Valley Bank, JPM | Bank feeds | Cash positions |
| **Document Storage** | Box, SharePoint | API | Document sync |
| **Email** | Outlook, Gmail | API | Notifications |

---

## 4. USER ROLES & PERMISSIONS

### 4.1 ROLE HIERARCHY

```
┌─────────────────────────────────────────────────────────────────┐
│                    VERTICA OS ROLE HIERARCHY                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  LEVEL 1: SYSTEM ADMINISTRATORS                                  │
│  └── Platform Engineering, Security Operations, Database Admin   │
│                                                                  │
│  LEVEL 2: GOVERNANCE OVERSIGHT                                   │
│  └── CISO, Chief Compliance Officer, Data Protection Officer     │
│                                                                  │
│  LEVEL 3: FUND MANAGEMENT                                        │
│  └── Managing Partners, Fund Managers, CFO                       │
│                                                                  │
│  LEVEL 4: DEAL EXECUTION                                         │
│  └── Deal Team Leads, Investment Associates, Analysts            │
│                                                                  │
│  LEVEL 5: PORTFOLIO OPERATIONS                                   │
│  └── Operating Partners, Portfolio Company Representatives       │
│                                                                  │
│  LEVEL 6: EXTERNAL STAKEHOLDERS                                  │
│  └── LPs, Advisors, Auditors                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 RBAC MATRIX (SUMMARY)

| Permission | SYS | GOV | FND | DTL | DTM | OPP | EXT |
|------------|-----|-----|-----|-----|-----|-----|-----|
| View Deal List | ✓ | ✓ | ✓ | ✓ | ✓ | ○ | ✗ |
| Create Deal | ✗ | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Edit Deal (Own) | ✗ | ✗ | ✓ | ✓ | ✓ | ✗ | ✗ |
| Delete Deal | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ |
| View Financial Model | ✓ | ✓ | ✓ | ✓ | ✓ | ○ | ✗ |
| Edit Financial Model | ✗ | ✗ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Query AI Assistant | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ |
| Approve AI Actions | ✗ | ✓ | ✓ | ✓ | ✗ | ✓ | ✗ |
| Configure AI Prompts | ✗ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |
| Export Deal Data | ✗ | ✓ | ✓ | ✓ | ✗ | ✗ | ✗ |

*✓ = Full Access, ○ = Limited Access, ✗ = No Access*

### 4.3 ATTRIBUTE-BASED ACCESS CONTROL (ABAC)

Contextual rules that modify access:

| Context | Rule | Impact |
|---------|------|--------|
| **Fund Affiliation** | Users see only assigned funds | Data isolation |
| **Deal Stage** | Access varies by stage | Stage-appropriate visibility |
| **Time-Based** | After-hours requires pre-auth + MFA | Enhanced security |
| **Device-Based** | Sensitive ops require managed devices | Endpoint security |
| **Location-Based** | Geo-fencing for high-risk operations | Geographic controls |

### 4.4 HITL TIER CLASSIFICATION

| Tier | AI Confidence | Operations | Approval |
|------|---------------|------------|----------|
| **Tier 1: Autonomous** | ≥ 95% | Read queries, calculations, non-blocking checks | None |
| **Tier 2: Supervised** | 75-94% | Bulk updates, model recalcs, external reports | Async (24-48h) |
| **Tier 3: Controlled** | < 75% OR High Impact | Valuation changes, SSOT writes, partner sharing | Real-time |
| **Tier 4: Restricted** | N/A | Fund reports, LP access, data deletion, policy changes | Multi-person |

---

## 5. CORE WORKFLOWS

### 5.1 DEAL FLOW WORKFLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEAL FLOW WORKFLOW                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐      │
│  │  INTAKE  │ → │  TRIAGE  │ → │ SCREENING│ → │ DILIGENCE│      │
│  │  (T+0-1) │   │ (T+1-3)  │   │ (T+3-10) │   │(T+10-40) │      │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘      │
│       │              │              │              │             │
│       ▼              ▼              ▼              ▼             │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐      │
│  │ CRM Log  │   │  Score   │   │   Call   │   │   Data   │      │
│  │  Ack     │   │  Filter  │   │  Notes   │   │   Room   │      │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘      │
│                                                                  │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐                      │
│  │    IC    │ → │  CLOSE   │ → │ MONITOR  │                      │
│  │ (T+40-45)│   │(T+45-90) │   │ (Ongoing)│                      │
│  └──────────┘   └──────────┘   └──────────┘                      │
│       │              │              │                            │
│       ▼              ▼              ▼                            │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐                      │
│  │   Pack   │   │  Legal   │   │  Board   │                      │
│  │   Vote   │   │  Docs    │   │   Pack   │                      │
│  └──────────┘   └──────────┘   └──────────┘                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Key Documents**: DOC 02 (Intake & Screening), DOC 03 (Diligence & IC Pack)

### 5.2 VALUE CREATION WORKFLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                  VALUE CREATION WORKFLOW                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  DAY 0 (CLOSING)                                                 │
│  ├── Baseline data collection                                    │
│  ├── OP assignment                                               │
│  └── Initial VCP sketch                                          │
│                                                                  │
│  DAYS 1-30 (ASSESS)                                              │
│  ├── CRM audit, financial reconciliation                         │
│  ├── Stakeholder mapping (1:1s)                                  │
│  ├── Customer immersion (top 10 calls)                           │
│  ├── Sales process audit                                         │
│  └── 30-day assessment report                                    │
│                                                                  │
│  DAYS 31-60 (INTERVENE)                                          │
│  ├── Quick wins execution                                        │
│  ├── Org restructure                                             │
│  ├── Comp plan redesign                                          │
│  ├── Sales process redesign                                      │
│  └── Pipeline reset                                              │
│                                                                  │
│  DAYS 61-90 (SCALE)                                              │
│  ├── Playbook development                                        │
│  ├── Onboarding program                                          │
│  ├── Territory optimization                                      │
│  ├── Forecast discipline                                         │
│  └── 90-day value creation scorecard                             │
│                                                                  │
│  ONGOING                                                         │
│  ├── Weekly operating cadence                                    │
│  ├── Monthly board reporting                                     │
│  └── Quarterly value creation review                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Key Documents**: DOC 04 (Post-Close VCP), DOC 05 (Sales Cadence), DOC 08 (GTM Enablement)

### 5.3 PORTFOLIO MONITORING WORKFLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                PORTFOLIO MONITORING WORKFLOW                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  DATA COLLECTION                                                 │
│  ├── Weekly: Cash, ARR, Pipeline (P0 metrics)                   │
│  ├── Monthly: Full P&L, KPIs, Headcount                         │
│  └── Quarterly: Deep dive, cohort analysis, unit economics      │
│                                                                  │
│  ANOMALY DETECTION                                               │
│  ├── Statistical analysis (3-sigma, Z-score)                    │
│  ├── Business logic rules                                        │
│  └── Confidence scoring                                          │
│                                                                  │
│  ESCALATION DECISION TREE                                        │
│  ├── GREEN: Standard monitoring                                  │
│  ├── YELLOW: Enhanced monitoring (L1)                           │
│  ├── RED (Single): Active support (L2)                          │
│  ├── RED (Multiple): Formal intervention (L3)                   │
│  └── CRISIS: Crisis management (L4)                             │
│                                                                  │
│  OUTPUTS                                                         │
│  ├── Weekly Flash Report                                         │
│  ├── Monthly KPI Scorecard                                       │
│  ├── Quarterly Deep Dive                                         │
│  └── Anomaly Alerts (real-time)                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Key Documents**: DOC 09 (Portfolio Monitoring), DOC 10 (Board Pack Generator)

### 5.4 FORECASTING WORKFLOW

```
┌─────────────────────────────────────────────────────────────────┐
│                    FORECASTING WORKFLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  DAILY                                                           │
│  ├── Activity tracking (calls, emails, meetings)                │
│  └── Pipeline hygiene check                                      │
│                                                                  │
│  WEEKLY                                                          │
│  ├── Pipeline review (deal inspection)                          │
│  ├── Forecast update                                             │
│  └── 1:1 coaching                                                │
│                                                                  │
│  MONTHLY                                                         │
│  ├── Forecast call                                               │
│  │   ├── Performance review                                      │
│  │   ├── Next month forecast                                     │
│  │   ├── Coverage analysis                                       │
│  │   └── Risk/upside identification                              │
│  └── Forecast lock                                               │
│                                                                  │
│  QUARTERLY                                                       │
│  ├── QBR (4 hours)                                              │
│  │   ├── Performance vs. plan                                    │
│  │   ├── Win/loss analysis                                       │
│  │   ├── Forward planning                                         │
│  │   └── Strategic topics                                        │
│  └── Kickoff                                                     │
│                                                                  │
│  FORECAST CATEGORIES                                             │
│  ├── Closed (100%)                                               │
│  ├── Commit (80-90%)                                             │
│  ├── Best Case (40-60%)                                          │
│  ├── Pipeline (10-30%)                                           │
│  └── Upside (5-15%)                                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Key Documents**: DOC 05 (Sales Cadence), DOC 06 (Pipeline Hygiene)

---

## 6. DOCUMENT LIBRARY

### 6.1 DOCUMENT INDEX

| Doc # | Title | Purpose | Primary Audience | Key Output |
|-------|-------|---------|------------------|------------|
| **DOC 01** | **Master Operating Handbook** | System overview, navigation guide | All users | Unified understanding |
| **DOC 02** | Deal Intake & Screening SOP | Standardized deal intake process | Deal team | Qualified opportunities |
| **DOC 03** | Diligence & IC Pack Template | Investment committee documentation | IC members | Investment decisions |
| **DOC 04** | Post-Close Value Creation Plan | 30/60/90 day operating framework | Operating Partners | Value creation execution |
| **DOC 05** | Sales Cadence Operating System | Inside sales rhythm & meetings | Sales teams | Predictable revenue |
| **DOC 06** | Pipeline Hygiene & Forecasting SOP | Pipeline management standards | Sales/RevOps | Accurate forecasts |
| **DOC 07** | Comp & Talent Operating Model | AE/SDR compensation design | Sales leadership | Motivated teams |
| **DOC 08** | GTM Enablement Library | Call scripts, battlecards, onboarding | Sales teams | Sales effectiveness |
| **DOC 09** | Portfolio Monitoring & Early Warning SOP | Performance monitoring framework | Portfolio ops | Early intervention |
| **DOC 10** | Board Pack Generator Standard | Board material creation process | CEOs/CFOs | Board communication |
| **DOC 11** | Data Model & SSOT Specification | Canonical data model definition | Data engineering | Data consistency |
| **DOC 12** | Security & Governance Standard | Security framework for agentic ops | Security team | Secure operations |
| **DOC 13** | Pilot SOW, RACI & Access Checklist | 30-day pilot implementation | Implementation team | Successful pilot |

### 6.2 DOCUMENT RELATIONSHIPS

```
┌─────────────────────────────────────────────────────────────────┐
│                  DOCUMENT RELATIONSHIP MAP                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    DOC 01 (MASTER)                       │    │
│  │              Central Reference & Navigation              │    │
│  └─────────────────────────────────────────────────────────┘    │
│                              │                                   │
│         ┌────────────────────┼────────────────────┐              │
│         │                    │                    │              │
│         ▼                    ▼                    ▼              │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐      │
│  │   DEAL      │      │  PORTFOLIO  │      │   SALES     │      │
│  │   FLOW      │      │    OPS      │      │   OPS       │      │
│  ├─────────────┤      ├─────────────┤      ├─────────────┤      │
│  │ DOC 02      │      │ DOC 04      │      │ DOC 05      │      │
│  │ DOC 03      │      │ DOC 09      │      │ DOC 06      │      │
│  │             │      │ DOC 10      │      │ DOC 07      │      │
│  │             │      │             │      │ DOC 08      │      │
│  └─────────────┘      └─────────────┘      └─────────────┘      │
│         │                    │                    │              │
│         └────────────────────┼────────────────────┘              │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              FOUNDATION (DOC 11, 12, 13)                 │    │
│  │         Data, Security, Implementation                   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 6.3 QUICK REFERENCE BY ROLE

| Role | Start Here | Core Documents | Reference Documents |
|------|------------|----------------|---------------------|
| **Managing Partner** | DOC 01, DOC 03 | DOC 02, DOC 09, DOC 10 | DOC 12 |
| **Principal** | DOC 01, DOC 02 | DOC 03, DOC 04, DOC 09 | DOC 05-08 |
| **Associate** | DOC 01, DOC 02 | DOC 03, DOC 06, DOC 09 | DOC 10, DOC 11 |
| **Operating Partner** | DOC 01, DOC 04 | DOC 05, DOC 08, DOC 09 | DOC 10 |
| **CRO/VP Sales** | DOC 01, DOC 05 | DOC 06, DOC 07, DOC 08 | DOC 04 |
| **Deal Operations** | DOC 01, DOC 02 | DOC 03, DOC 09, DOC 10 | DOC 11-13 |
| **New Hire** | DOC 01, DOC 07 | DOC 02, DOC 05, DOC 08 | All |

---

## 7. GETTING STARTED

### 7.1 FIRST 30 DAYS: NEW HIRE ONBOARDING

```
┌─────────────────────────────────────────────────────────────────┐
│                  NEW HIRE ONBOARDING PATH                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  WEEK 1: FOUNDATION                                              │
│  ├── Day 1: Welcome, system access, DOC 01 overview             │
│  ├── Day 2: Read DOC 02 (Intake & Screening)                    │
│  ├── Day 3: Shadow deal team member                             │
│  ├── Day 4: Read DOC 03 (Diligence & IC)                        │
│  └── Day 5: First deal review participation                     │
│                                                                  │
│  WEEK 2: DEEPEN                                                  │
│  ├── Day 6-7: Read role-specific documents                      │
│  ├── Day 8-9: CRM training, data entry practice                 │
│  ├── Day 10: Attend pipeline review                             │
│  └── Complete first deal intake exercise                         │
│                                                                  │
│  WEEK 3: PRACTICE                                                │
│  ├── Day 15-17: Lead screening call (supervised)                │
│  ├── Day 18-19: Build financial model (practice)                │
│  └── Day 20: Present at team meeting                             │
│                                                                  │
│  WEEK 4: INTEGRATE                                               │
│  ├── Day 22-25: Own deal intake end-to-end                      │
│  ├── Day 26-27: Portfolio company introduction                  │
│  └── Day 28-30: 30-day check-in with manager                     │
│                                                                  │
│  30-DAY DELIVERABLES                                             │
│  ├── Complete 3 deal intakes independently                       │
│  ├── Pass document knowledge quiz (80%+)                        │
│  ├── Build one financial model from template                     │
│  └── Present one deal to team                                    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 SYSTEM ACCESS SETUP

| Step | Action | Owner | Timeline |
|------|--------|-------|----------|
| 1 | Request access via IT ticket | Manager | Day 0 |
| 2 | Complete security training | New Hire | Day 1 |
| 3 | MFA enrollment | IT + New Hire | Day 1 |
| 4 | RBAC role assignment | Security Admin | Day 1 |
| 5 | CRM access provisioning | Deal Ops | Day 2 |
| 6 | Document system access | IT | Day 2 |
| 7 | AI assistant onboarding | Deal Ops | Day 3 |
| 8 | Verify all access working | New Hire | Day 3 |

### 7.3 KEY CONTACTS

| Function | Contact | Purpose |
|----------|---------|---------|
| **IT Helpdesk** | it@vertica-capital.com | System access, technical issues |
| **Deal Operations** | dealops@vertica-capital.com | Process questions, templates |
| **Security** | security@vertica-capital.com | Access requests, security incidents |
| **Knowledge Base** | [Internal Wiki] | Self-service documentation |
| **AI Assistant** | In-platform | Deal queries, navigation help |

### 7.4 ESSENTIAL READING ORDER

**For Investment Team Members:**
1. DOC 01 (this handbook)
2. DOC 02 (Intake & Screening)
3. DOC 03 (Diligence & IC Pack)
4. DOC 09 (Portfolio Monitoring)
5. Role-specific documents

**For Operating Partners:**
1. DOC 01 (this handbook)
2. DOC 04 (Post-Close VCP)
3. DOC 05 (Sales Cadence)
4. DOC 08 (GTM Enablement)
5. DOC 09 (Portfolio Monitoring)

**For Sales/RevOps:**
1. DOC 01 (this handbook)
2. DOC 05 (Sales Cadence)
3. DOC 06 (Pipeline Hygiene)
4. DOC 07 (Comp & Talent)
5. DOC 08 (GTM Enablement)

---

## 8. SUPPORT & ESCALATION

### 8.1 SUPPORT TIERS

| Tier | Issue Type | Response Time | Resolution Target | Contact |
|------|------------|---------------|-------------------|---------|
| **L1** | How-to questions, access issues | 4 hours | 24 hours | Deal Ops |
| **L2** | Process guidance, template help | 8 hours | 48 hours | Principals |
| **L3** | Complex decisions, exceptions | 24 hours | 72 hours | Managing Partners |
| **L4** | Security incidents, system outages | 15 min | 4 hours | IT/Security |

### 8.2 ESCALATION PATHWAYS

```
┌─────────────────────────────────────────────────────────────────┐
│                  ESCALATION PATHWAYS                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  DEAL-RELATED ESCALATIONS                                        │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐       │
│  │Associate│ → │Principal│ → │Managing │ → │Investment│       │
│  │         │    │         │    │ Partner │    │Committee │       │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘       │
│                                                                  │
│  PORTFOLIO ESCALATIONS                                           │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐       │
│  │ Analyst │ → │Associate│ → │Principal│ → │Managing │       │
│  │         │    │         │    │         │    │ Partner │       │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘       │
│                                                                  │
│  TECHNICAL ESCALATIONS                                           │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐       │
│  │  User   │ → │Deal Ops │ → │   IT    │ → │  CISO   │       │
│  │         │    │         │    │         │    │         │       │
│  └─────────┘    └─────────┘    └─────────┘    └─────────┘       │
│                                                                  │
│  SECURITY ESCALATIONS                                            │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐                      │
│  │  User   │ → │  CISO   │ → │Managing │                      │
│  │         │    │         │    │ Partner │                      │
│  └─────────┘    └─────────┘    └─────────┘                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 8.3 EMERGENCY CONTACTS

| Scenario | Contact | Method |
|----------|---------|--------|
| **System Outage** | IT On-Call | Slack #incidents or call |
| **Security Incident** | CISO | security@vertica-capital.com |
| **Data Breach** | CISO + Legal | Immediate call |
| **Urgent Deal Issue** | Managing Partner | Direct call |
| **After-Hours Emergency** | On-Call Partner | Escalation list |

### 8.4 COMMON ISSUES & SOLUTIONS

| Issue | Solution | Document Reference |
|-------|----------|-------------------|
| Can't access deal | Check RBAC role, fund assignment | DOC 12 (Security) |
| AI recommendation seems wrong | Check confidence score, escalate to Tier 3 | DOC 12 (HITL) |
| Missing template | Contact Deal Ops, check document library | DOC 06-10 |
| Data quality alert | Follow remediation SOP | DOC 11 (Data Model) |
| Partner access request | Submit via partner portal workflow | DOC 12 (Partner Sharing) |

---

## 9. VERSION HISTORY

### 9.1 DOCUMENT REVISION LOG

| Version | Date | Author | Changes | Approved By |
|---------|------|--------|---------|-------------|
| 0.1 | [DATE] | [AUTHOR] | Initial draft | - |
| 0.2 | [DATE] | [AUTHOR] | Added architecture diagrams | - |
| 0.3 | [DATE] | [AUTHOR] | Incorporated feedback from pilot | - |
| 1.0 | [DATE] | [AUTHOR] | Official release v1.0 | Managing Partner |

### 9.2 PLANNED UPDATES

| Version | Target Date | Scope | Owner |
|---------|-------------|-------|-------|
| 1.1 | [DATE+90] | Post-pilot learnings, AI feature updates | Deal Ops |
| 1.2 | [DATE+180] | Expanded portfolio monitoring, new KPIs | Portfolio Ops |
| 2.0 | [DATE+365] | Major revision based on full year of usage | Managing Partner |

### 9.3 CHANGE REQUEST PROCESS

1. **Submit**: Email change request to dealops@vertica-capital.com
2. **Review**: Deal Ops reviews for impact and alignment
3. **Approve**: Managing Partner approves material changes
4. **Implement**: Update document, maintain version history
5. **Communicate**: Notify stakeholders of changes

---

## APPENDIX A: GLOSSARY

| Term | Definition |
|------|------------|
| **ARR** | Annual Recurring Revenue |
| **HITL** | Human-in-the-Loop (AI approval framework) |
| **IC** | Investment Committee |
| **KPI** | Key Performance Indicator |
| **LP** | Limited Partner |
| **MOIC** | Multiple on Invested Capital |
| **NRR** | Net Revenue Retention |
| **OP** | Operating Partner |
| **RBAC** | Role-Based Access Control |
| **SOP** | Standard Operating Procedure |
| **SSOT** | Single Source of Truth |
| **VCP** | Value Creation Plan |
| **VIEP** | Vertica Intervention Escalation Packet |

## APPENDIX B: QUICK REFERENCE

### B.1 Key Metrics Thresholds (Series A Example)

| Metric | Green | Yellow | Red |
|--------|-------|--------|-----|
| ARR Growth YoY | >80% | 40-80% | <40% |
| NRR | >115% | 105-115% | <105% |
| Cash Runway | >18 mo | 12-18 mo | <12 mo |
| Burn Multiple | <1.0x | 1.0-2.0x | >2.0x |

### B.2 Document Quick Links

| Document | Location | Last Updated |
|----------|----------|--------------|
| DOC 01 | [Link] | [Date] |
| DOC 02 | [Link] | [Date] |
| ... | ... | ... |

### B.3 Emergency Procedures

| Scenario | Immediate Action | Follow-Up |
|----------|------------------|-----------|
| Suspected data breach | Disconnect, notify CISO | Incident response plan |
| System unavailable | Check status page, notify IT | Escalation to on-call |
| Wrong deal data entered | Do not delete, flag for review | Data remediation SOP |

---

*Document Version: 1.0 | Vertica OS Master Operating Handbook | Confidential*

*For questions or feedback, contact: dealops@vertica-capital.com*

---

**END OF DOCUMENT 01 — VERTICA OS MASTER OPERATING HANDBOOK**
