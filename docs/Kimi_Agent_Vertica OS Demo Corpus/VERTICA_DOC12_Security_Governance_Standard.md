================================================================================
                    DOCUMENT 12
    SECURITY & GOVERNANCE STANDARD FOR AGENTIC OPERATIONS
                    VERTICA PE Operating System
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│ DOCUMENT CONTROL                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ Document ID:      VERTICA-DOC-12                                            │
│ Version:          1.0                                                       │
│ Status:           DRAFT                                                     │
│ Classification:   CONFIDENTIAL                                              │
│ Owner:            Chief Information Security Officer (CISO)                 │
│ Review Cycle:     Quarterly                                                 │
│ Last Updated:     2024-01-15                                                │
│ Compliance:       SOC 2 Type II, GDPR, SEC Investment Advisers Act          │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
SECTION 1: PURPOSE & AUDIENCE
================================================================================

1.1 PURPOSE
This document establishes the security and governance framework for VERTICA's
agentic (AI-assisted) operating system in a Private Equity context.

1.2 AUDIENCE
Primary Audience:
  • Chief Information Security Officer (policy owner)
  • Security Operations Team (implementation)
  • Compliance Officer (regulatory alignment)
  • AI/ML Engineering Team (HITL integration)

Secondary Audience:
  • Deal Team Members (understanding access rights)
  • Portfolio Operations (partner sharing guidelines)
  • Legal Counsel (contract alignment)
  • External Auditors (control evidence)

1.3 INPUTS
  • Industry security frameworks (NIST CSF, ISO 27001)
  • PE regulatory requirements (SEC, GDPR, CCPA)
  • AI governance standards (IEEE 2857, EU AI Act)
  • Internal security policies

1.4 OUTPUTS
  • Security control specifications
  • HITL gate configuration rules
  • RBAC implementation matrix
  • Audit log schema and retention rules
  • Partner sharing agreement templates

================================================================================
SECTION 2: HITL GATE FRAMEWORK
================================================================================

2.1 HITL PRINCIPLES

1. HUMAN ULTIMATE AUTHORITY
   AI provides recommendations; humans make decisions on all material actions.

2. TRANSPARENT AI OPERATION
   All AI actions must be explainable. "Black box" decisions prohibited.

3. CONFIDENCE-BASED ESCALATION
   Lower AI confidence triggers higher human oversight.
   No autonomous action below 75% confidence on sensitive operations.

4. AUDITABLE DECISION TRAIL
   Every AI recommendation and human decision logged with full context.

5. GRACEFUL DEGRADATION
   System operates safely when AI unavailable. Human workflows always available.

2.2 HITL TIER CLASSIFICATION

TIER 1: AUTONOMOUS (No HITL Required)
  AI Confidence: ≥ 95%
  Operations:
    • Data ingestion from approved sources
    • Read-only queries and dashboards
    • Automated data quality checks (non-blocking)
    • Non-sensitive metric calculations
  Controls: Audit logging, anomaly detection, rate limiting

TIER 2: SUPERVISED (Async HITL - Batch Approval)
  AI Confidence: 75-94%
  Approval Window: 24-48 hours
  Operations:
    • Bulk data updates (>100 records)
    • Financial model recalculations
    • AI-generated insights requiring validation
    • Report distribution to external parties
  Workflow: AI generates → Queued for approval → Execute & Log

TIER 3: CONTROLLED (Sync HITL - Real-time Approval)
  AI Confidence: < 75% OR High Impact
  Approval Window: Real-time (blocking)
  Operations:
    • Deal valuation changes
    • Write operations to SSOT
    • Partner data sharing activation
    • AI recommendations with financial impact >$1M
  Required UI Elements:
    • Clear statement of proposed action
    • AI confidence score with explanation
    • Key data points supporting recommendation
    • Alternative actions considered
    • Estimated impact
    • Approve/Reject/Request Info buttons
    • Mandatory comment field

TIER 4: RESTRICTED (Multi-Person HITL + Documentation)
  AI Confidence: N/A - Always requires approval
  Approval Window: 48-72 hours
  Operations:
    • Fund-level financial reporting to LPs
    • LP data room access grants
    • Data deletion/archival operations
    • Security policy changes
    • AI model deployment to production
  Approval Matrix:
    • Fund Report: CFO + Chief Compliance Officer
    • Data Deletion: Data Owner + Legal + CISO
    • Security Policy: CISO + Compliance Officer

2.3 HITL GATE CONFIGURATION

┌──────────────────────────┬──────┬────────────┬───────────┬──────────────┐
│ Operation                │ Tier │ Approvers  │ Timeout   │ Escalation   │
├──────────────────────────┼──────┼────────────┼───────────┼──────────────┤
│ Data Query (Read)        │ 1    │ N/A        │ N/A       │ N/A          │
│ Report Generation        │ 2    │ 1 (Author) │ 24h       │ Auto-approve │
│ Bulk Data Import         │ 2    │ 1 (Owner)  │ 48h       │ Data Steward │
│ Valuation Update         │ 3    │ 1 (Lead)   │ Real-time │ Fund Manager │
│ Write to SSOT            │ 3    │ 2 (4-eyes) │ Real-time │ Security     │
│ Partner Data Share       │ 3    │ 1 (Partner)│ Real-time │ Compliance   │
│ Fund Report Distribution │ 4    │ 2 (CFO+CCO)│ 72h       │ CEO          │
│ Data Deletion            │ 4    │ 3 (Multi)  │ 72h       │ Legal        │
└──────────────────────────┴──────┴────────────┴───────────┴──────────────┘

================================================================================
SECTION 3: RBAC MATRIX
================================================================================

3.1 ROLE HIERARCHY

Level 1: SYSTEM ADMINISTRATORS
  Platform Engineering, Security Operations, Database Administration

Level 2: GOVERNANCE OVERSIGHT
  CISO, Chief Compliance Officer, Data Protection Officer

Level 3: FUND MANAGEMENT
  Managing Partners, Fund Managers, CFO

Level 4: DEAL EXECUTION
  Deal Team Leads, Investment Associates, Analysts

Level 5: PORTFOLIO OPERATIONS
  Operating Partners, Portfolio Company Reps

Level 6: EXTERNAL STAKEHOLDERS
  LPs, Advisors, Auditors

3.2 PERMISSION MATRIX

DEAL DATA DOMAIN:
┌────────────────────────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ Permission             │ SYS │ GOV │ FND │ DTL │ DTM │ OPP │ EXT │
├────────────────────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ View Deal List         │  ✓  │  ✓  │  ✓  │  ✓  │  ✓  │  ○  │  ✗  │
│ View Deal Details      │  ✓  │  ✓  │  ✓  │  ✓  │  ✓  │  ○  │  ✗  │
│ Create Deal            │  ✗  │  ✗  │  ✓  │  ✓  │  ✗  │  ✗  │  ✗  │
│ Edit Deal (Own)        │  ✗  │  ✗  │  ✓  │  ✓  │  ✓  │  ✗  │  ✗  │
│ Delete Deal            │  ✗  │  ✗  │  ✓  │  ✗  │  ✗  │  ✗  │  ✗  │
│ View Financial Model   │  ✓  │  ✓  │  ✓  │  ✓  │  ✓  │  ○  │  ✗  │
│ Edit Financial Model   │  ✗  │  ✗  │  ✓  │  ✓  │  ✗  │  ✗  │  ✗  │
│ Export Deal Data       │  ✗  │  ✓  │  ✓  │  ✓  │  ✗  │  ✗  │  ✗  │
└────────────────────────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘

AI/AGENTIC OPERATIONS:
┌────────────────────────┬─────┬─────┬─────┬─────┬─────┬─────┬─────┐
│ Permission             │ SYS │ GOV │ FND │ DTL │ DTM │ OPP │ EXT │
├────────────────────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
│ Query AI Assistant     │  ✓  │  ✓  │  ✓  │  ✓  │  ✓  │  ✓  │  ✗  │
│ Approve AI Actions     │  ✗  │  ✓  │  ✓  │  ✓  │  ✗  │  ✓  │  ✗  │
│ Configure AI Prompts   │  ✗  │  ✓  │  ✓  │  ✓  │  ✗  │  ✗  │  ✗  │
│ Train/Fine-tune Models │  ✗  │  ✓  │  ✗  │  ✗  │  ✗  │  ✗  │  ✗  │
│ Deploy AI to Production│  ✗  │  ✓  │  ✗  │  ✗  │  ✗  │  ✗  │  ✗  │
└────────────────────────┴─────┴─────┴─────┴─────┴─────┴─────┴─────┘

3.3 ATTRIBUTE-BASED ACCESS CONTROL (ABAC)

Contextual Rules:
  • Fund Affiliation: Users only see deals from assigned funds
  • Deal Stage: Access varies by stage (Sourcing → Exited)
  • Time-Based: After-hours requires pre-authorization + additional MFA
  • Device-Based: Sensitive operations require managed devices
  • Location-Based: Geo-fencing for high-risk operations

Sample Policy:
  IF user.role = "Deal Team Member"
     AND user.fund IN deal.authorized_funds
     AND deal.stage != "Exited"
     AND (time.business_hours OR user.after_hours_approved)
     AND device.managed
  THEN grant_access(deal.view)

================================================================================
SECTION 4: AUDIT LOGGING STANDARDS
================================================================================

4.1 MANDATORY LOG FIELDS

Identification:
  event_id (UUID), event_type, timestamp (ISO 8601 UTC)

Actor Information:
  actor_id, actor_type (USER|SERVICE|SYSTEM|AI_AGENT), actor_email, actor_role

Action Details:
  action, resource_type, resource_id, resource_name

Context:
  session_id, ip_address, user_agent, request_id

Result:
  result (SUCCESS|FAILURE|DENIED|ERROR), result_code, error_message

Data State:
  before_state, after_state, changed_fields

Governance:
  change_reason, approval_chain, data_classification, retention_class

AI Context:
  ai_agent_id, ai_confidence, ai_recommendation, ai_reasoning, human_override

Integrity:
  integrity_hash (SHA-256), previous_hash, chain_verified

4.2 EVENT TAXONOMY

AUTHENTICATION (AUTH.*):
  login.success/failure, logout, mfa.verify, session.*, pwd.changed, token.*

AUTHORIZATION (AUTHZ.*):
  access.granted/denied, role.assigned/revoked, elevation.*

DATA OPERATIONS (DATA.*):
  create, read, update, delete, export, import, search, classify.changed

AI/AGENTIC (AI.*):
  query, insight.generated, recommendation.made, action.approved/rejected,
  override.human, model.invoked/deployed, training.*

HITL WORKFLOW (HITL.*):
  request.created/approved/rejected/escalated/timeout/delegated

SYSTEM (SYS.*):
  config.changed, backup.*, alert.*, maintenance.*

4.3 LOG STORAGE & RETENTION

Hot Storage (0-30 days):
  Purpose: Real-time queries, alerting, dashboards
  Technology: Time-series database
  Performance: Sub-second query response

Warm Storage (31-365 days):
  Purpose: Historical analysis, compliance queries
  Technology: Compressed columnar storage
  Performance: < 30 second query response

Cold Storage (1-7 years):
  Purpose: Regulatory compliance, legal hold
  Technology: WORM storage with encryption
  Retrieval: 4-48 hour SLA

Immutability Requirements:
  • Write-once, read-many (WORM)
  • Cryptographic chain verification
  • Geographic replication (3+ regions)
  • Legal hold capability
  • No delete capability

================================================================================
SECTION 5: DATA RETENTION POLICIES
================================================================================

5.1 RETENTION CLASSES

CLASS A: REGULATORY (7+ Years)
  Data: Financial transactions, audit logs, fund statements, LP records,
        tax docs, regulatory filings, IC memos
  Deletion: Requires legal approval + documentation

CLASS B: BUSINESS CRITICAL (5-7 Years)
  Data: Deal documentation, DD materials, board materials,
        portfolio reports, valuation models
  Deletion: Requires Fund Manager + Compliance approval

CLASS C: OPERATIONAL (2-5 Years)
  Data: Internal communications, working docs, AI training data,
        user activity logs, config history
  Deletion: Automated after retention period

CLASS D: TRANSIENT (30-90 Days)
  Data: Draft docs, temp files, cache, failed uploads
  Deletion: Automated, no approval required

CLASS E: IMMEDIATE DELETION (On Event)
  Data: Legal hold release, GDPR requests, expired credentials
  Deletion: Automated within 24 hours

5.2 RETENTION WORKFLOW

Creation → Classification → Active Use → Archival → Destruction

Triggers:
  • Time-based: Retention period expiration
  • Event-based: Deal exit, fund close, user departure
  • Legal-based: Litigation hold, regulatory request
  • User-based: Data subject deletion request

================================================================================
SECTION 6: TWO-PERSON RULE
================================================================================

6.1 REQUIREMENTS BY TIER

TIER 1: DUAL AUTHORIZATION (Any Two Authorized Users)
  • Write operations to SSOT
  • Deal valuation changes >$5M
  • Financial model baseline updates
  • Partner portal access grants
  • Bulk data exports (>1000 records)
  • AI model deployment

TIER 2: SEPARATION OF DUTIES (Specific Role Pairs)
  • Fund report: Author + Reviewer
  • LP capital call: Originator + Authorizer
  • User role changes: Requestor + Security Admin
  • Data deletion: Requestor + Data Owner + Legal

TIER 3: BREAK-GLASS EMERGENCY
  • System outage recovery
  • Security incident response
  • Regulatory deadline emergency
  Requirements: Pre-authorized accounts, real-time notification,
                incident report within 24h, post-review

6.2 CONFLICT OF INTEREST DETECTION

System SHALL reject if:
  • Same department (same manager)
  • Same deal team
  • Reporting relationship
  • Same pair within 24 hours
  • Security alert on either account
  • Same device/IP

Exception: Escalate to manager for override with justification

================================================================================
SECTION 7: PARTNER SHARING POSTURE
================================================================================

7.1 PARTNER TIERS

TIER 1: STRATEGIC PARTNERS
  Access: Portfolio KPIs, board materials, 100-day plans
  Controls: NDA, MFA, watermarking, view-only, quarterly review

TIER 2: TRANSACTIONAL PARTNERS
  Access: Deal-specific data room only
  Controls: Time-bound, no export, activity logging

TIER 3: LIMITED PARTNERS (LPs)
  Access: Fund-level reports, capital statements
  Controls: LP portal, watermarking, no deal-level data

TIER 4: PUBLIC/ANONYMIZED
  Access: Anonymized metrics, press releases
  Controls: Pre-approval, aggregate data only (min 5 companies)

7.2 MANDATORY CONTRACT CLAUSES

1. Data Use Restrictions
   "Recipient shall use Shared Data solely for the Purpose stated in Exhibit A."

2. Security Requirements
   "Encryption in transit and at rest, MFA, regular assessments, 24h incident notification."

3. Audit Rights
   "Discloser reserves right to audit upon 30 days' notice, annually."

4. Return/Destruction
   "Within 10 days of termination or request, return or certify destruction."

5. Breach Notification
   "Within 24 hours of any unauthorized access or disclosure."

6. Indemnification
   "Recipient shall indemnify for damages from breach."

7.3 TECHNICAL CONTROLS

Document Security:
  • Dynamic watermarking with partner ID
  • View-only mode (disable download/print/copy)
  • Screen capture prevention
  • Document expiry

Access Controls:
  • Time-based restrictions
  • Location-based geo-fencing
  • Device-based (managed devices)
  • Concurrent session limits (1)
  • Idle timeout (15 minutes)

Monitoring:
  • Real-time activity monitoring
  • Anomaly detection
  • Alert thresholds (>50 views/hour)
  • Monthly access reports

Data Loss Prevention:
  • Email DLP
  • Upload monitoring
  • USB/print controls
  • Clipboard restrictions

================================================================================
SECTION 8: SOP
================================================================================

SOP-12.1: CONFIGURE HITL GATE

Purpose: Configure a new Human-in-the-Loop gate

Prerequisites:
  • Security Admin or Governance role
  • Approved HITL gate design document

Procedure:
  1. Access Security > HITL Configuration
  2. Define gate parameters (name, tier, confidence threshold)
  3. Configure approvers and escalation path
  4. Set up notifications
  5. Define UI requirements
  6. Test and validate
  7. Deploy and monitor

KPIs:
  • Configuration time: < 2 hours
  • Test pass rate: 100%
  • Zero production issues within 48h

SOP-12.2: RESPOND TO SECURITY INCIDENT

Purpose: Respond to detected security incident

Timeline:
  0-15 min: Detect & acknowledge
  15-60 min: Contain
  1-24 hours: Investigate
  24-48 hours: Eradicate
  48-72 hours: Recover
  72+ hours: Post-incident

KPIs:
  • Time to acknowledge: < 15 minutes
  • Time to contain: < 1 hour
  • Time to resolve: Based on severity

================================================================================
SECTION 9: TEMPLATES
================================================================================

SECURITY INCIDENT REPORT TEMPLATE:

Incident ID: SEC-YYYY-NNNN
Date: YYYY-MM-DD
Severity: [LOW|MEDIUM|HIGH|CRITICAL]
Status: [OPEN|CONTAINED|RESOLVED|CLOSED]

Summary: [Brief description]
Timeline: [Key events with timestamps]
Affected Systems: [List]
Root Cause: [Technical explanation]
Impact: [Data accessed, systems compromised, business impact]
Containment: [Actions taken]
Eradication: [Actions taken]
Recovery: [Actions taken]
Evidence: [Preserved evidence locations]
Lessons Learned: [What went well, improvements needed]
Preventive Actions: [With owners and due dates]

HITL APPROVAL REQUEST TEMPLATE:

Request ID: HITL-YYYY-NNNN
Tier: [1|2|3|4]
Operation: [Type]
Requestor: [Name/Role]

Proposed Action: [Description]
Business Justification: [Why needed]
AI Confidence: [X%] (if applicable)
AI Reasoning: [Explanation]
Supporting Data: [Key points]
Estimated Impact: [Financial/operational/compliance]

Approver Decision:
□ APPROVED  □ REJECTED  □ NEED MORE INFO

Approver Comments: [Required]
Approved By: _________________ Date: _______

================================================================================
SECTION 10: OPEN QUESTIONS
================================================================================

1. HITL Implementation
   □ Target response time for Tier 3 approvals?
   □ Mobile approval for after-hours requests?
   □ Approver unavailability handling?

2. RBAC Scope
   □ Dynamic role assignment by deal stage?
   □ Temporary access for consultants?
   □ Emergency access (break-glass) process?

3. Audit Log Retention
   □ Maximum retention period?
   □ Legal hold on audit logs?
   □ Export process for external auditors?

4. Partner Sharing
   □ Self-service partner onboarding?
   □ Partner access revocation process?
   □ Partner data export requests?

5. AI Governance
   □ AI model explainability requirements?
   □ AI bias detection and mitigation?
   □ Training data retention requirements?

================================================================================
                           END OF DOCUMENT 12
================================================================================
