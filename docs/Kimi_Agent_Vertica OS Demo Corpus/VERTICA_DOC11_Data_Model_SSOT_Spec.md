================================================================================
                    DOCUMENT 11
        DATA MODEL & SINGLE SOURCE OF TRUTH (SSOT) SPECIFICATION
                    VERTICA PE Operating System
================================================================================

┌─────────────────────────────────────────────────────────────────────────────┐
│ DOCUMENT CONTROL                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ Document ID:      VERTICA-DOC-11                                            │
│ Version:          1.0                                                       │
│ Status:           DRAFT                                                     │
│ Classification:   INTERNAL                                                  │
│ Owner:            Chief Data Officer / Security & Governance Lead           │
│ Review Cycle:     Quarterly                                                 │
│ Last Updated:     2024-01-15                                                │
└─────────────────────────────────────────────────────────────────────────────┘

================================================================================
SECTION 1: PURPOSE & AUDIENCE
================================================================================

1.1 PURPOSE
This document defines the canonical data model for VERTICA's PE Operating System,
establishing:
• Single Source of Truth (SSOT) objects and their relationships
• Field-level dictionary with data types, validation rules, and ownership
• Data quality scorecard framework with measurable KPIs
• Data lineage and provenance standards

1.2 AUDIENCE
Primary Audience:
  • Data Engineering Team (implementation reference)
  • Product Managers (feature scoping)
  • Deal Team Leads (data entry standards)

Secondary Audience:
  • Security & Compliance (data classification)
  • AI/ML Engineers (model input specifications)
  • Integration Partners (API contract reference)
  • Audit & Legal (data governance evidence)

1.3 INPUTS
  • PE industry data standards (ILPA, EVCA)
  • Existing fund data dictionaries
  • Regulatory requirements (SEC, GDPR)
  • AI/ML model input requirements
  • Partner integration specifications

1.4 OUTPUTS
  • Database schema definitions
  • API contract specifications
  • Data validation rules
  • Quality monitoring dashboards
  • AI training data specifications

================================================================================
SECTION 2: CANONICAL OBJECT MODEL
================================================================================

2.1 CORE ENTITIES

ENTITY: FUND
  Description: Investment fund entity - top of data hierarchy
  SSOT Status: CANONICAL

  Key Attributes:
    fund_id (UUID PK), fund_code (VARCHAR 20), fund_name (VARCHAR 200)
    fund_type (ENUM: BUYOUT|GROWTH|VC|DEBT), vintage_year (INTEGER)
    fund_size_usd (DECIMAL 15,2), currency (CHAR 3), status (ENUM)
    inception_date (DATE), target_irr (DECIMAL 5,2)
    management_fee_pct (DECIMAL 5,4), carry_pct (DECIMAL 5,4)
    legal_structure (ENUM), jurisdiction (VARCHAR 100)
    created_at/created_by/updated_at/updated_by (TIMESTAMP/UUID)
    data_classification (ENUM: CONFIDENTIAL)

  Relationships:
    HAS_MANY: deals, lps
    BELONGS_TO: managing_firm

  Data Quality Rules:
    • fund_code must be unique
    • vintage_year within 2 years of inception_date
    • fund_size_usd reconciles with LP commitments sum

ENTITY: DEAL
  Description: Investment opportunity/deal - central to VERTICA workflow
  SSOT Status: CANONICAL

  Key Attributes:
    deal_id (UUID PK), deal_code (VARCHAR 30), fund_id (UUID FK)
    company_id (UUID FK), deal_name (VARCHAR 200)
    deal_stage (ENUM: SOURCING|NDA|DD|IC|NEGOTIATION|CLOSED|MONITORING|EXITED)
    stage_entry_date (DATE), investment_type (ENUM)
    sector (VARCHAR 100), geography (VARCHAR 100)
    enterprise_value/equity_invested/ownership_pct (DECIMAL)
    entry_multiple (DECIMAL 5,2), deal_team_lead (UUID FK)
    deal_team_members (UUID[]), operating_partner (UUID FK)
    close_date/exit_date/exit_value (DATE/DECIMAL)
    moic/irr (DECIMAL 5,2 - auto-calculated)
    status (ENUM), priority_score (INTEGER), next_action (VARCHAR 500)
    data_classification (ENUM: CONFIDENTIAL|SENSITIVE)

  Relationships:
    BELONGS_TO: fund, company
    HAS_MANY: financial_models, valuations, documents, board_meetings

  Data Quality Rules:
    • deal_code format: [FUND_CODE]-[YYYY]-[SEQUENCE]
    • Valid stage transitions only
    • Required fields based on stage (close_date if CLOSED, etc.)
    • moic/irr auto-calculated, not manual

ENTITY: COMPANY
  Description: Portfolio company or target company entity
  SSOT Status: CANONICAL

  Key Attributes:
    company_id (UUID PK), company_name (VARCHAR 200)
    legal_name (VARCHAR 200), duns_number (VARCHAR 9)
    registration_number (VARCHAR 50), tax_id (VARCHAR 50, encrypted)
    website (VARCHAR 255), year_founded (INTEGER)
    headquarters_city/country (VARCHAR 100/CHAR 2)
    primary_sector/sub_sector (VARCHAR 100)
    business_model (ENUM), revenue_model (VARCHAR[])
    employee_count (INTEGER), annual_revenue/ebitda (DECIMAL)
    ebitda_margin (DECIMAL 5,4 - auto-calculated)
    funding_stage (ENUM), total_funding/last_valuation (DECIMAL)
    ceo_name/cfo_name (VARCHAR 200), is_portfolio (BOOLEAN)
    data_classification (ENUM: INTERNAL|CONFIDENTIAL)

  Relationships:
    HAS_MANY: deals, kpis, milestones, employees, contacts

  Data Quality Rules:
    • company_name unique (case-insensitive)
    • Valid ISO country codes
    • Valid URL format for website
    • If is_portfolio=TRUE, must have active deal

ENTITY: FINANCIAL_MODEL
  Description: Financial model for deal valuation and analysis
  SSOT Status: CANONICAL

  Key Attributes:
    model_id (UUID PK), deal_id (UUID FK), model_name (VARCHAR 100)
    model_type (ENUM: LBO|DCF|COMPS|SUM_OF_PARTS|CUSTOM)
    version_number (INTEGER), is_baseline (BOOLEAN)
    model_file_url (VARCHAR 500), model_file_hash (VARCHAR 64)
    entry_ev/entry_equity/entry_multiple (DECIMAL)
    exit_ev/exit_equity/exit_multiple (DECIMAL)
    projected_moic/projected_irr (DECIMAL 5,2 - auto-calculated)
    investment_horizon (INTEGER), revenue_cagr (DECIMAL 5,4)
    ebitda_margin_target (DECIMAL 5,4), leverage_ratio (DECIMAL 5,2)
    created_by/reviewed_by (UUID FK), review_date (DATE)
    ic_approved (BOOLEAN), ic_approval_date (DATE)
    data_classification (ENUM: CONFIDENTIAL|SENSITIVE)

  Data Quality Rules:
    • Only one is_baseline=TRUE per deal
    • model_file_hash verified on every access
    • IC approval required before use for decisions

ENTITY: KPI
  Description: Portfolio company performance metrics
  SSOT Status: CANONICAL

  Key Attributes:
    kpi_id (UUID PK), company_id (UUID FK), kpi_name (VARCHAR 100)
    kpi_category (ENUM: FINANCIAL|OPERATIONAL|SALES|PRODUCT|HR|CUSTOM)
    kpi_type (ENUM: CURRENCY|NUMBER|PCT|RATIO)
    reporting_period (ENUM: MONTHLY|QUARTERLY|ANNUAL)
    period_date (DATE), actual_value/target_value (DECIMAL 18,4)
    prior_period_value/yoy_value (DECIMAL 18,4)
    variance_pct (DECIMAL 8,4 - auto-calculated)
    unit (VARCHAR 20), data_source (VARCHAR 100)
    confidence_score (DECIMAL 3,2), validated (BOOLEAN)
    validated_by (UUID FK), validated_at (TIMESTAMP)
    data_classification (ENUM: INTERNAL|CONFIDENTIAL)

  Data Quality Rules:
    • kpi_name from approved standard list
    • period_date aligns with reporting_period
    • If confidence_score < 0.8, requires validation
    • Duplicate check: company_id + kpi_name + period_date unique

================================================================================
SECTION 3: DATA QUALITY SCORECARD
================================================================================

3.1 DATA QUALITY DIMENSIONS

COMPLETENESS: (Populated required fields / Total required fields) × 100
  Target: ≥ 98% for all canonical entities

ACCURACY: (Validated records / Total records sampled) × 100
  Target: ≥ 99% for financial data, ≥ 95% for operational

CONSISTENCY: (Compliant records / Total records) × 100
  Target: ≥ 99% for all entities

TIMELINESS: (On-time updates / Total expected updates) × 100
  Target: ≥ 95% for KPIs, ≥ 90% for deal data

UNIQUENESS: (Unique records / Total records) × 100
  Target: 100% - zero duplicates allowed

VALIDITY: (Valid format records / Total records) × 100
  Target: ≥ 99.5% for all entities

3.2 ENTITY-SPECIFIC QUALITY SCORECARDS

FUND ENTITY:
  • Required field completeness: 20% weight, 100% target
  • Fund code uniqueness: 15% weight, 100% target
  • Size reconciliation: 20% weight, 100% target
  • Vintage year accuracy: 10% weight, 100% target
  • Currency validity: 10% weight, 100% target
  • Status transition validity: 15% weight, 100% target
  • Classification accuracy: 10% weight, 100% target
  Overall Target: ≥ 99%

DEAL ENTITY:
  • Required field completeness: 15% weight, ≥ 98% target
  • Deal code format: 10% weight, 100% target
  • Stage transition validity: 15% weight, 100% target
  • Valuation accuracy: 20% weight, ≥ 99% target
  • Team assignment: 10% weight, 100% target
  • Close date consistency: 10% weight, 100% target
  • Exit calculation: 15% weight, 100% target
  • Classification: 5% weight, 100% target
  Overall Target: ≥ 98%

KPI ENTITY:
  • On-time reporting: 25% weight, ≥ 95% target
  • Value accuracy: 20% weight, ≥ 99% target
  • Unit consistency: 15% weight, 100% target
  • Calculation accuracy: 15% weight, 100% target
  • AI confidence: 10% weight, ≥ 85% target
  • Validation rate: 10% weight, ≥ 90% target
  • Duplicate prevention: 5% weight, 100% target
  Overall Target: ≥ 95%

================================================================================
SECTION 4: STEP-BY-STEP SOP
================================================================================

SOP-11.1: ONBOARD NEW FUND TO VERTICA

Purpose: Establish a new fund in VERTICA with complete, accurate data

Prerequisites:
  • Fund formation documents received
  • LP agreements executed
  • Fund manager approval obtained
  • Fund code assigned by Finance

Procedure:
  Step 1: CREATE FUND RECORD (Data Steward)
    1.1 Navigate to Fund Management > Create New Fund
    1.2 Enter fund_code (format: VF[YY][NN])
    1.3 Enter fund_name, fund_type, vintage_year
    1.4 Enter fund_size_usd, currency, status
    1.5 Enter inception_date, target_irr, fees
    1.6 Select legal_structure, enter jurisdiction
    1.7 Click "Create Fund" - system validates
    1.8 Verify fund appears in Fund List

  Step 2: ONBOARD LPs (Fund Operations)
    2.1 Navigate to Fund > LP Management
    2.2 Import or add LPs manually
    2.3 Verify total commitments = fund_size_usd
    2.4 Generate LP onboarding letters

  Step 3: CONFIGURE ACCESS (Security Admin)
    3.1 Assign deal team members to fund
    3.2 Configure partner portal access
    3.3 Verify users can access fund data

  Step 4: VALIDATION (Data Quality Team)
    4.1 Run Fund Quality Report
    4.2 Verify completeness = 100%
    4.3 Verify fund_code uniqueness

Outputs:
  • Fund record created in VERTICA
  • LP records linked to fund
  • Access configured for fund team
  • Quality validation report completed

KPIs:
  • Time to onboard: < 2 business days
  • Data quality score: 100% on creation
  • Zero duplicate fund codes

SOP-11.2: REMEDIATE DATA QUALITY ISSUE

Purpose: Identify, investigate, and resolve data quality issues

Trigger: Data quality alert or manual identification

Procedure:
  Step 1: ACKNOWLEDGE (Data Steward - Within 4 hours)
    1.1 Review alert notification
    1.2 Log into Data Quality Dashboard
    1.3 Click alert to view details
    1.4 Acknowledge alert in system

  Step 2: INVESTIGATE (Within 24 hours)
    2.1 Identify affected records
    2.2 Determine root cause
    2.3 Assess impact scope
    2.4 Document findings

  Step 3: PLAN REMEDIATION
    3.1 Define remediation approach
    3.2 Estimate timeline
    3.3 Identify preventive measures
    3.4 Obtain approval

  Step 4: EXECUTE
    4.1 Implement correction
    4.2 Verify in test environment
    4.3 Apply to production
    4.4 Re-run quality check

  Step 5: CLOSE
    5.1 Update Data Quality Issue Log
    5.2 Mark alert as resolved
    5.3 Notify stakeholders

KPIs:
  • Mean time to acknowledge: < 4 hours
  • Mean time to resolve: < 72 hours (standard), < 24 hours (critical)
  • Recurrence rate: < 5%

================================================================================
SECTION 5: TEMPLATES
================================================================================

DATA QUALITY ISSUE LOG TEMPLATE:

Issue ID: DQI-YYYY-NNNN
Date Reported: YYYY-MM-DD
Entity Affected: [FUND|DEAL|COMPANY|KPI]
Severity: [LOW|MEDIUM|HIGH|CRITICAL]

Issue Description:
[Detailed description]

Affected Records:
• Record IDs: [List or count]
• Impact Scope: [Description]

Root Cause Analysis:
Primary Cause: [Source/Integration/Manual/AI/Rule]
Detailed Explanation: [Technical]

Remediation Plan:
Approach: [Method]
Timeline: [Expected date]
Owner: [Name]
Approval Required: [YES/NO]

Resolution:
Date Resolved: [Date]
Quality Score Before: [X%]
Quality Score After: [Y%]

Preventive Actions:
[Actions to prevent recurrence]

Status: [OPEN|IN PROGRESS|RESOLVED|CLOSED]

================================================================================
SECTION 6: OPEN QUESTIONS
================================================================================

1. ENTITY SCOPE
   □ Should we include LP capital call/distribution entities in SSOT?
   □ How should we model co-investment deals with multiple funds?
   OWNER: Chief Data Officer

2. DATA SOURCES
   □ Which external data providers should be integrated?
   □ What is the master for company data (internal vs. external)?
   OWNER: Data Engineering Lead

3. AI/ML INTEGRATION
   □ What confidence threshold triggers human validation?
   □ How should AI-generated insights be stored and versioned?
   OWNER: AI/ML Lead

4. RETENTION & ARCHIVAL
   □ What is the retention period for exited deal data?
   □ What legal hold capabilities are required?
   OWNER: Legal + Compliance

5. PERFORMANCE & SCALING
   □ What query performance SLAs are required?
   □ How should we partition data for multi-fund scale?
   OWNER: Data Engineering Lead

================================================================================
                           END OF DOCUMENT 11
================================================================================
