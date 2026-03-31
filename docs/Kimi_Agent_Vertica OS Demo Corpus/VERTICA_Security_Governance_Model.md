
================================================================================
                    VERTICA SECURITY & GOVERNANCE MODEL
              Private Equity Deal Context - Agentic Operations
================================================================================

TABLE OF CONTENTS:
1. Executive Summary
2. HITL (Human-in-the-Loop) Gate Framework
3. RBAC Matrix by Role
4. Audit Logging Standards
5. Data Retention Policies
6. Two-Person Rule Implementation
7. Partner Sharing Posture
8. Compliance Framework

================================================================================
SECTION 1: EXECUTIVE SUMMARY
================================================================================

PURPOSE:
Establish trust, auditability, and operator confidence for VERTICA's agentic
operating system handling sensitive PE deal data across multiple stakeholder
groups.

PRINCIPLES:
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. ZERO TRUST: Verify every action, every user, every time                  │
│ 2. LEAST PRIVILEGE: Minimum access required to perform function             │
│ 3. DEFENSE IN DEPTH: Multiple security layers with no single point of failure│
│ 4. AUDIT EVERYTHING: Complete, immutable, queryable activity logs           │
│ 5. HUMAN OVERSIGHT: AI assists; humans approve critical actions             │
│ 6. DATA SOVEREIGNTY: Clear ownership and lineage for all data               │
└─────────────────────────────────────────────────────────────────────────────┘

THREAT MODEL (PE Context):
┌─────────────────────┬─────────────────────┬─────────────────────────────────┐
│ Threat Category     │ Risk Level          │ Mitigation Strategy             │
├─────────────────────┼─────────────────────┼─────────────────────────────────┤
│ Insider Data Leak   │ CRITICAL            │ RBAC + DLP + Watermarking       │
│ Unauthorized Access │ HIGH                │ MFA + JIT Access + Session Mgmt │
│ Data Tampering      │ HIGH                │ Immutable Logs + Checksums      │
│ AI Hallucination    │ MEDIUM              │ HITL Gates + Confidence Scoring │
│ Partner Overreach   │ MEDIUM              │ Data Segmentation + Contracts   │
│ Audit Failure       │ HIGH                │ Comprehensive Logging + Retention│
└─────────────────────┴─────────────────────┴─────────────────────────────────┘

================================================================================
SECTION 2: HITL (HUMAN-IN-THE-LOOP) GATE FRAMEWORK
================================================================================

2.1 GATE CLASSIFICATION SYSTEM

┌─────────────────────────────────────────────────────────────────────────────┐
│ TIER 1: AUTONOMOUS (No HITL Required)                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│ • Data ingestion from approved sources                                      │
│ • Read-only queries and dashboards                                          │
│ • Automated data quality checks (non-blocking)                              │
│ • Scheduled report generation (distribution requires approval)              │
│ • Non-sensitive metric calculations                                         │
│ CONFIDENCE THRESHOLD: AI Confidence ≥ 95%                                   │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TIER 2: SUPERVISED (Async HITL - Batch Approval)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│ • Bulk data updates (>100 records)                                          │
│ • Financial model recalculations                                            │
│ • Report distribution to external parties                                   │
│ • Configuration changes to data pipelines                                   │
│ • AI-generated insights requiring validation                                │
│ CONFIDENCE THRESHOLD: AI Confidence 75-94%                                  │
│ APPROVAL WINDOW: 24-48 hours                                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TIER 3: CONTROLLED (Sync HITL - Real-time Approval)                         │
├─────────────────────────────────────────────────────────────────────────────┤
│ • Deal valuation changes                                                    │
│ • Write operations to canonical data stores                                 │
│ • Partner data sharing activation                                           │
│ • AI recommendations with financial impact >$1M                             │
│ • Role/permission modifications                                             │
│ CONFIDENCE THRESHOLD: AI Confidence < 75% OR High Impact                    │
│ APPROVAL WINDOW: Real-time (blocking)                                       │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│ TIER 4: RESTRICTED (Multi-Person HITL + Documentation)                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ • Fund-level financial reporting                                            │
│ • LP data room access grants                                                │
│ • Data deletion/archival operations                                         │
│ • Security policy changes                                                   │
│ • Cross-fund data access requests                                           │
│ CONFIDENCE THRESHOLD: N/A - Always requires approval                        │
│ APPROVAL WINDOW: Multi-stage with 48-72 hour SLA                            │
└─────────────────────────────────────────────────────────────────────────────┘

2.2 HITL GATE CONFIGURATION MATRIX

┌─────────────────────────────────────────────────────────────────────────────┐
│ ACTION TYPE              │ TIER │ APPROVERS    │ TIMEOUT    │ ESCALATION   │
├─────────────────────────────────────────────────────────────────────────────┤
│ Data Query (Read)        │ 1    │ N/A          │ N/A        │ N/A          │
│ Dashboard View           │ 1    │ N/A          │ N/A        │ N/A          │
│ Report Generation        │ 2    │ 1 (Author)   │ 24h        │ Auto-approve │
│ Bulk Data Import         │ 2    │ 1 (Data Owner│ 48h        │ Data Steward │
│ Valuation Update         │ 3    │ 1 (Deal Lead)│ Real-time  │ Fund Manager │
│ Partner Data Share       │ 3    │ 1 (Partner)  │ Real-time  │ Compliance   │
│ Write to SSOT            │ 3    │ 2 (4-eyes)   │ Real-time  │ Security     │
│ Fund Report Distribution │ 4    │ 2 (CFO+CCO)  │ 72h        │ CEO          │
│ Role Permission Change   │ 4    │ 2 (Admin+Sec)│ 48h        │ CISO         │
│ Data Deletion            │ 4    │ 3 (Multi)    │ 72h        │ Legal        │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
SECTION 3: RBAC MATRIX BY ROLE
================================================================================

3.1 ROLE HIERARCHY

┌─────────────────────────────────────────────────────────────────────────────┐
│ ROLE HIERARCHY (Least Privilege Principle)                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LEVEL 1: SYSTEM ADMINISTRATORS                                              │
│  (Platform Engineering, Security Operations, Data Engineering)               │
│                                                                              │
│  LEVEL 2: GOVERNANCE OVERSIGHT                                               │
│  (CISO, Compliance Officer, Data Protection Officer)                         │
│                                                                              │
│  LEVEL 3: FUND MANAGEMENT                                                    │
│  (Managing Partners, Fund Managers, CFO)                                     │
│                                                                              │
│  LEVEL 4: DEAL EXECUTION                                                     │
│  (Deal Team Leads, Investment Associates, Analysts)                          │
│                                                                              │
│  LEVEL 5: PORTFOLIO OPERATIONS                                               │
│  (Operating Partners, Portfolio Company Reps, Value Creation)                │
│                                                                              │
│  LEVEL 6: EXTERNAL STAKEHOLDERS                                              │
│  (LPs, Advisors, Auditors, Legal Counsel)                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘

3.2 DEAL DATA DOMAIN PERMISSIONS

┌────────────────────────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ Permission             │ SYS │ GOV │ FND │ DTL │ DTM │ OPP │ EXT │
├────────────────────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ View Deal List         │  ✓  │  ✓  │  ✓  │  ✓  │  ✓  │  ○  │  ✗  │
│ View Deal Details      │  ✓  │  ✓  │  ✓  │  ✓  │  ✓  │  ○  │  ✗  │
│ Create Deal Record     │  ✗  │  ✗  │  ✓  │  ✓  │  ✗  │  ✗  │  ✗  │
│ Edit Deal (Own)        │  ✗  │  ✗  │  ✓  │  ✓  │  ✓  │  ✗  │  ✗  │
│ Edit Deal (Any)        │  ✗  │  ✗  │  ✓  │  ✗  │  ✗  │  ✗  │  ✗  │
│ Delete Deal            │  ✗  │  ✗  │  ✓  │  ✗  │  ✗  │  ✗  │  ✗  │
│ View Financial Model   │  ✓  │  ✓  │  ✓  │  ✓  │  ✓  │  ○  │  ✗  │
│ Edit Financial Model   │  ✗  │  ✗  │  ✓  │  ✓  │  ✗  │  ✗  │  ✗  │
│ View Cap Table         │  ✓  │  ✓  │  ✓  │  ✓  │  ✓  │  ○  │  ✗  │
│ Export Deal Data       │  ✗  │  ✓  │  ✓  │  ✓  │  ✗  │  ✗  │  ✗  │
└────────────────────────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘

Legend: ✓ = Full Access | ○ = Conditional/Delegated | ✗ = No Access
Roles: SYS=System Admin | GOV=Governance | FND=Fund Manager
       DTL=Deal Team Lead | DTM=Deal Team Member | OPP=Operating Partner
       EXT=External

================================================================================
SECTION 4: AUDIT LOGGING STANDARDS
================================================================================

4.1 MANDATORY LOG FIELDS (All Events)

┌─────────────────────────────────────────────────────────────────────────────┐
│ □ event_id: UUID v4, globally unique                                        │
│ □ timestamp: ISO 8601 with millisecond precision (UTC)                      │
│ □ event_type: Categorized action per taxonomy                               │
│ □ actor_id: User or service account identifier                              │
│ □ actor_type: USER | SERVICE | SYSTEM | AI_AGENT                            │
│ □ action: Specific operation performed                                      │
│ □ resource_type: Type of object accessed/modified                           │
│ □ resource_id: Unique identifier of resource                                │
│ □ session_id: Link to user session for traceability                         │
│ □ ip_address: Source IP (anonymized for external)                           │
│ □ user_agent: Client application identifier                                 │
│ □ result: SUCCESS | FAILURE | DENIED | ERROR                                │
│ □ before_state: Previous state (for modifications)                          │
│ □ after_state: New state (for modifications)                                │
│ □ change_reason: Business justification (if applicable)                     │
│ □ approval_chain: HITL approval references                                  │
│ □ ai_confidence: AI confidence score (if AI-involved)                       │
│ □ data_classification: SENSITIVE | CONFIDENTIAL | INTERNAL | PUBLIC         │
│ □ retention_class: How long to retain (see retention policy)                │
│ □ integrity_hash: SHA-256 of log entry for tamper detection                 │
└─────────────────────────────────────────────────────────────────────────────┘

4.2 EVENT TAXONOMY

AUTHENTICATION & ACCESS:
  AUTH.login.success/failure, AUTH.logout, AUTH.mfa.verify, AUTH.session.*

AUTHORIZATION:
  AUTHZ.access.granted/denied, AUTHZ.role.assigned/revoked

DATA OPERATIONS:
  DATA.create/read/update/delete, DATA.export/import, DATA.search

AI/AGENTIC OPERATIONS:
  AI.query, AI.insight.generated, AI.recommendation.made, AI.action.approved/rejected

HITL WORKFLOW:
  HITL.request.created/approved/rejected/escalated/timeout

SYSTEM & ADMIN:
  SYS.config.change, SYS.backup.*, SYS.alert.*, SYS.maintenance.*

4.3 LOG STORAGE & RETENTION

┌─────────────────────────────────────────────────────────────────────────────┐
│  HOT STORAGE (0-30 days)    │ Real-time queries, alerting, dashboards      │
│  WARM STORAGE (31-365 days) │ Historical analysis, compliance queries      │
│  COLD STORAGE (1-7 years)   │ Regulatory compliance, legal hold            │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
SECTION 5: DATA RETENTION POLICIES
================================================================================

5.1 RETENTION CLASSIFICATION

CLASS A: REGULATORY (7+ Years)
  • Financial transaction records
  • Audit logs
  • Fund financial statements
  • LP capital call/distribution records
  • Tax documentation
  • Regulatory filings

CLASS B: BUSINESS CRITICAL (5-7 Years)
  • Deal documentation
  • Due diligence materials
  • Board meeting materials
  • Portfolio company financial reports

CLASS C: OPERATIONAL (2-5 Years)
  • Internal communications
  • Working documents
  • AI training data
  • User activity logs

CLASS D: TRANSIENT (30-90 Days)
  • Draft documents
  • Temporary files
  • Cache data

CLASS E: IMMEDIATE DELETION (On Event)
  • Legal hold release
  • GDPR deletion requests
  • Expired credentials

================================================================================
SECTION 6: TWO-PERSON RULE IMPLEMENTATION
================================================================================

6.1 TWO-PERSON RULE MATRIX

TIER 1: DUAL AUTHORIZATION (Any Two Authorized Users)
  • Write operations to SSOT
  • Deal valuation changes >$5M
  • Financial model baseline updates
  • Partner portal access grants
  • Bulk data exports (>1000 records)
  • AI model deployment to production

TIER 2: SEPARATION OF DUTIES (Specific Role Pairs)
  • Fund report distribution: Author + Reviewer
  • LP capital call: Originator + Authorizer
  • User role changes: Requestor + Security Admin
  • Data deletion: Requestor + Data Owner + Legal

TIER 3: BREAK-GLASS EMERGENCY
  • System outage recovery
  • Security incident response
  • Regulatory deadline emergency
  Requirements: Pre-authorized accounts, real-time notification,
                incident report within 24 hours, post-review

================================================================================
SECTION 7: PARTNER SHARING POSTURE
================================================================================

7.1 PARTNER CLASSIFICATION

TIER 1: STRATEGIC PARTNERS
  Access: Portfolio KPIs, board materials, 100-day plans
  Controls: NDA, MFA, watermarking, view-only mode, quarterly review

TIER 2: TRANSACTIONAL PARTNERS
  Access: Deal-specific data room only
  Controls: Time-bound access, no export, activity logging

TIER 3: LIMITED PARTNERS (LPs)
  Access: Fund-level reports, capital statements
  Controls: LP portal, watermarking, no deal-level data

TIER 4: PUBLIC/ANONYMIZED
  Access: Anonymized metrics, press releases
  Controls: Pre-approval, aggregate data only

7.2 MANDATORY CONTRACT CLAUSES
  • Data use restrictions
  • Security requirements
  • Audit rights
  • Return/destruction obligations
  • Breach notification (24 hours)
  • Indemnification

================================================================================
SECTION 8: COMPLIANCE FRAMEWORK
================================================================================

8.1 REGULATORY MAPPING

SEC INVESTMENT ADVISERS ACT:
  • 7-year retention for books and records
  • Custody rule compliance
  • Advertising pre-approval

GDPR:
  • Lawful basis for processing
  • Data subject rights (access, erasure)
  • Data processing agreements
  • Cross-border transfer safeguards

SOC 2 TYPE II:
  • Security, availability, confidentiality controls
  • Annual audit with continuous monitoring
  • Incident response procedures

8.2 KEY RISK INDICATORS (KRIs)

Security Metrics:
  • Failed login attempts/hour (>10 = alert)
  • Privileged access elevations/day (>5 = alert)
  • After-hours privileged access/week (>10 = alert)

Governance Metrics:
  • HITL approval SLA breaches (>5% = warning)
  • Dual-authorization bypasses (0 without incident report)
  • Access recertification overdue (>10% = alert)

================================================================================
                           END OF SECURITY & GOVERNANCE MODEL
================================================================================
