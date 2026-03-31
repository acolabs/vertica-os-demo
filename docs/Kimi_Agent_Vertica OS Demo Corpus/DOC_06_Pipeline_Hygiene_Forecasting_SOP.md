# DOC 06 — PIPELINE HYGIENE & FORECASTING SOP
## Standard Operating Procedures for Pipeline Management & Revenue Forecasting

---

### DOCUMENT METADATA

| Field | Value |
|-------|-------|
| **Document ID** | DOC-06-VERTICA-GTM |
| **Version** | 1.0 |
| **Classification** | Internal Use - Portfolio Company |
| **Last Updated** | [DATE] |
| **Owner** | CRO_X (Chief Revenue Officer) |
| **Review Cycle** | Quarterly |

---

### PURPOSE

This document establishes the standard operating procedures for pipeline hygiene, opportunity management, and revenue forecasting across Vertica portfolio companies. Clean data, consistent definitions, and rigorous inspection create predictable revenue outcomes.

**Core Principle:** *"Garbage in, garbage out. Pipeline hygiene is non-negotiable. Forecast accuracy is a competitive advantage."*

---

### AUDIENCE

| Role | Usage |
|------|-------|
| AEs (AE_A, AE_B, etc.) | Opportunity management, data entry |
| SDRs | Lead qualification, handoff |
| Sales Managers | Pipeline inspection, coaching |
| CRO_X / VP Sales | Forecast management, accountability |
| RevOps | Data governance, reporting, systems |
| Finance | Revenue planning, board reporting |
| CEO/Founder | Strategic visibility |

---

### INPUTS

- CRM opportunity data
- Activity logs (calls, emails, meetings)
- Prospect/customer interactions
- Competitive intelligence
- Market conditions
- Product roadmap updates

---

### OUTPUTS

- Clean, accurate pipeline data
- Weekly forecast submissions
- Monthly forecast calls
- Board-ready revenue projections
- Pipeline health reports
- Coaching action items

---

## SECTION 1: DEFINITIONS

### 1.1 Pipeline Stage Definitions

| Stage | Definition | Exit Criteria | Average Duration | Win Probability |
|-------|------------|---------------|------------------|-----------------|
| **0 - Lead** | Unqualified inbound/outbound | ICP fit confirmed, interest expressed | 3 days | 2% |
| **1 - Prospecting** | Initial outreach in progress | Meeting scheduled or completed | 7 days | 5% |
| **2 - Discovery** | Needs assessment active | Pain points documented, budget confirmed | 14 days | 15% |
| **3 - Demo** | Product demonstration completed | Technical fit confirmed, stakeholders mapped | 21 days | 35% |
| **4 - Proposal** | Formal proposal submitted | Pricing negotiated, legal engaged | 14 days | 55% |
| **5 - Negotiation** | Contract terms being finalized | Signature pending | 7 days | 75% |
| **6 - Closed Won** | Contract signed, revenue booked | - | - | 100% |
| **7 - Closed Lost** | Opportunity lost to competition/no decision | Loss reason documented | - | 0% |

### 1.2 Stage Exit Criteria (Detailed)

#### Stage 1 → Stage 2 (Prospecting → Discovery)

**Required Evidence:**
- [ ] Discovery meeting completed
- [ ] ICP fit confirmed (industry, size, use case)
- [ ] Business pain identified and documented
- [ ] Budget range confirmed (ballpark)
- [ ] Decision timeline established
- [ ] Next steps scheduled

**CRM Updates Required:**
- Primary contact role
- Estimated deal size (range)
- Expected close date (quarter)
- Lead source

#### Stage 2 → Stage 3 (Discovery → Demo)

**Required Evidence:**
- [ ] All stakeholders identified
- [ ] Technical requirements documented
- [ ] Demo scheduled with decision-makers
- [ ] Competitive landscape understood
- [ ] Champion identified

**CRM Updates Required:**
- All contacts added with roles
- Use case documented
- Technical requirements noted
- Competitive threats flagged

#### Stage 3 → Stage 4 (Demo → Proposal)

**Required Evidence:**
- [ ] Demo completed successfully
- [ ] Technical objections addressed
- [ ] Economic buyer engaged
- [ ] Formal evaluation process understood
- [ ] Proposal requested/approved

**CRM Updates Required:**
- Demo feedback captured
- Proposal due date
- Economic buyer contact added
- Procurement process documented

#### Stage 4 → Stage 5 (Proposal → Negotiation)

**Required Evidence:**
- [ ] Proposal submitted
- [ ] Pricing discussion initiated
- [ ] Legal review triggered
- [ ] Vendor paperwork initiated
- [ ] Contract terms discussed

**CRM Updates Required:**
- Proposal sent date
- Legal contact added
- Contract template identified
- Redline process understood

#### Stage 5 → Stage 6 (Negotiation → Closed Won)

**Required Evidence:**
- [ ] Contract fully executed
- [ ] Signature obtained
- [ ] Kickoff scheduled
- [ ] Handoff to CS documented

**CRM Updates Required:**
- Closed date
- Final contract value
- Win reason documented
- Competitor (if applicable)

### 1.3 Forecast Category Definitions

| Category | Definition | Probability Range | Use Case |
|----------|------------|-------------------|----------|
| **Closed** | Signed contract this period | 100% | Already booked |
| **Commit** | Will close this period (high confidence) | 80-90% | Manager will bet job on it |
| **Best Case** | Could close this period (medium confidence) | 40-60% | With some acceleration |
| **Pipeline** | Potential to close (low confidence) | 10-30% | Stretch possibility |
| **Upside** | Surprise wins possible | 5-15% | Dark horse opportunities |

### 1.4 Opportunity Health Indicators

| Indicator | Green | Yellow | Red |
|-----------|-------|--------|-----|
| **Days in Stage** | < 75% of avg | 75-100% of avg | > 100% of avg |
| **Last Activity** | < 7 days | 7-14 days | > 14 days |
| **Next Step** | Scheduled < 7 days | Scheduled 7-14 days | None or > 14 days |
| **Champion Strength** | 4-5/5 | 3/5 | 1-2/5 |
| **EB Engagement** | Met + active | Identified only | Unknown |

---

## SECTION 2: CRM RULES & DATA HYGIENE

### 2.1 Required Fields by Stage

| Field | Stage 0 | Stage 1 | Stage 2 | Stage 3 | Stage 4 | Stage 5 |
|-------|---------|---------|---------|---------|---------|---------|
| Account Name | R | R | R | R | R | R |
| Contact Name | R | R | R | R | R | R |
| Opportunity Name | O | R | R | R | R | R |
| Amount | - | R | R | R | R | R |
| Close Date | - | R | R | R | R | R |
| Stage | R | R | R | R | R | R |
| Lead Source | O | R | R | R | R | R |
| Next Step | - | R | R | R | R | R |
| Next Step Date | - | R | R | R | R | R |
| Competitor | - | O | O | R | R | R |
| Loss Reason | - | - | - | - | - | - |
| Primary Contact | O | R | R | R | R | R |
| Economic Buyer | - | - | O | R | R | R |
| Champion | - | - | O | R | R | R |
| Use Case | - | - | R | R | R | R |
| Pain Points | - | - | R | R | R | R |

*R = Required, O = Optional, - = Not applicable*

### 2.2 Data Entry SOP

#### SOP-01: Creating a New Opportunity

**Purpose:** Ensure consistent opportunity creation

**Steps:**

1. **Verify Account Exists**
   - Search CRM for existing account
   - If not found, create new account with complete information
   - Required: Company name, website, industry, employee count

2. **Create Opportunity Record**
   - Navigate to Account → New Opportunity
   - Name format: [Company] - [Use Case] - [Quarter]
   - Example: "ACME Corp - Data Analytics - Q2-2024"

3. **Populate Required Fields**
   - Amount: Enter best estimate (can be range)
   - Close Date: Enter expected close date
   - Stage: Select appropriate stage
   - Lead Source: Select from dropdown

4. **Add Primary Contact**
   - Search for existing contact
   - If not found, create new contact
   - Required: Name, title, email, phone

5. **Document Initial Notes**
   - How opportunity was sourced
   - Initial conversation summary
   - Known pain points
   - Next steps

6. **Set Next Step**
   - Specific action item
   - Date committed
   - Owner assigned

**Quality Check:**
- All required fields populated
- Naming convention followed
- Next step within 7 days
- Contact information complete

#### SOP-02: Updating Opportunity Stage

**Purpose:** Ensure accurate stage progression

**Steps:**

1. **Review Stage Exit Criteria**
   - Reference Section 1.2 for current stage
   - Verify ALL criteria met before advancing

2. **Update Stage in CRM**
   - Edit opportunity
   - Select new stage from dropdown
   - Save changes

3. **Update Close Date**
   - Review and adjust based on new information
   - Use calendar date, not month-end

4. **Update Amount**
   - Refine estimate based on new information
   - Document any changes in notes

5. **Update Next Step**
   - Define specific next action
   - Set realistic date
   - Assign owner

6. **Add Stage Progression Note**
   - Date of stage change
   - Key events that triggered advancement
   - Any concerns or blockers

**Quality Check:**
- Exit criteria met (document evidence)
- Close date realistic
- Amount reflects current understanding
- Next step specific and time-bound

#### SOP-03: Closing an Opportunity (Won/Lost)

**Purpose:** Accurate closed opportunity documentation

**Steps for Closed Won:**

1. **Verify Contract Execution**
   - Signed contract received
   - Legal review complete
   - Finance approval obtained

2. **Update Opportunity to Closed Won**
   - Change stage to "Closed Won"
   - Enter actual close date
   - Enter final contract value

3. **Document Win Details**
   - Win reason (dropdown + notes)
   - Primary decision factors
   - Champion who drove decision
   - Competitors considered

4. **Schedule Handoff to CS**
   - Create internal handoff task
   - Schedule kickoff call
   - Prepare implementation timeline

5. **Update Account Information**
   - Mark as customer
   - Update account tier
   - Set renewal date

**Steps for Closed Lost:**

1. **Document Loss Reason**
   - Select primary loss reason from dropdown:
     - No Decision / Project Delayed
     - Lost to Competitor [Name]
     - Pricing / Budget
     - Product Fit / Features
     - Timing
     - Other (specify)

2. **Update Opportunity to Closed Lost**
   - Change stage to "Closed Lost"
   - Enter actual close date
   - Enter final amount (if known)

3. **Document Loss Details**
   - Detailed loss reason
   - Competitor selected (if applicable)
   - What we could have done differently
   - Re-engagement opportunity

4. **Schedule Win/Loss Review**
   - Add to weekly team meeting agenda
   - Prepare lessons learned
   - Identify process improvements

5. **Set Follow-up Reminder**
   - If "No Decision," schedule 90-day follow-up
   - If lost to competitor, schedule 6-month check-in

**Quality Check:**
- Loss reason specific and actionable
- Competitor identified if applicable
- Lessons learned documented
- Follow-up scheduled if appropriate

### 2.3 Data Quality Standards

| Standard | Definition | Measurement |
|----------|------------|-------------|
| **Completeness** | All required fields populated | % of opportunities with all required fields |
| **Accuracy** | Data reflects reality | Spot-check vs. actual conversations |
| **Timeliness** | Updates within 24 hours of event | Age of last activity vs. actual last contact |
| **Consistency** | Standard formats and naming | Audit of naming conventions |
| **Currency** | Regular updates and maintenance | % of opportunities updated in last 7 days |

### 2.4 Data Quality Targets

| Metric | Target | Alert Threshold |
|--------|--------|-----------------|
| Opportunity Completeness | 95% | <90% |
| Contact Completeness | 98% | <95% |
| Account Completeness | 95% | <90% |
| Stage Accuracy | 90% | <85% |
| Close Date Accuracy | ±15 days avg | ±30 days |
| Amount Accuracy | ±20% at close | ±40% |
| Data Freshness | 90% updated in 7 days | <80% |

---

## SECTION 3: PIPELINE INSPECTION CADENCE

### 3.1 Inspection Schedule

| Inspection | Frequency | Inspector | Scope | Duration |
|------------|-----------|-----------|-------|----------|
| **Daily Hygiene Check** | Daily | AE | Own pipeline | 15 min |
| **Manager Pipeline Review** | Weekly | Sales Manager | Team pipeline | 60 min |
| **CRO Pipeline Inspection** | Weekly | CRO_X | Full pipeline | 30 min |
| **Monthly Deep Dive** | Monthly | CRO_X + RevOps | Stage analysis | 90 min |
| **Quarterly Audit** | Quarterly | RevOps | Data quality | 4 hours |

### 3.2 Daily Hygiene Check (AE Self-Inspection)

**Time:** Start of day (15 minutes)
**Owner:** Individual AE
**Purpose:** Ensure personal pipeline is clean and current

#### Daily Hygiene Checklist

```
DAILY PIPELINE HYGIENE CHECK - [DATE]
AE: [AE_NAME]

OPPORTUNITIES REQUIRING ATTENTION:
□ Stale opportunities (>14 days no activity)
□ Overdue next steps
□ Close dates in the past
□ Opportunities in stage > average duration
□ Missing required fields

QUICK FIXES (Do Now):
1. [OPPORTUNITY] - [ACTION NEEDED]
2. [OPPORTUNITY] - [ACTION NEEDED]
3. [OPPORTUNITY] - [ACTION NEEDED]

TODAY'S PRIORITIES:
1. [PRIORITY 1]
2. [PRIORITY 2]
3. [PRIORITY 3]

NOTES FOR MANAGER:
- [NOTE 1]
- [NOTE 2]
```

### 3.3 Weekly Manager Pipeline Review

**Time:** Weekly (Tuesday/Wednesday)
**Owner:** Sales Manager
**Purpose:** Team pipeline inspection and coaching

#### Pipeline Review Scorecard

```
WEEKLY PIPELINE REVIEW - Week of [DATE]
Manager: [MANAGER_NAME]
Team: [TEAM_NAME]

═══════════════════════════════════════════════════════════════════
PIPELINE SUMMARY
═══════════════════════════════════════════════════════════════════

┌─────────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│   Stage     │ Count   │ Amount  │ Avg Age │ Health  │ Action  │
├─────────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ Prospecting │   [##]  │ [$###K] │ [##]d   │ [🟢🟡🔴]│ [NOTES] │
│ Discovery   │   [##]  │ [$###K] │ [##]d   │ [🟢🟡🔴]│ [NOTES] │
│ Demo        │   [##]  │ [$###K] │ [##]d   │ [🟢🟡🔴]│ [NOTES] │
│ Proposal    │   [##]  │ [$###K] │ [##]d   │ [🟢🟡🔴]│ [NOTES] │
│ Negotiation │   [##]  │ [$###K] │ [##]d   │ [🟢🟡🔴]│ [NOTES] │
├─────────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ TOTAL       │   [##]  │ [$###K] │ [##]d   │ [🟢🟡🔴]│         │
└─────────────┴─────────┴─────────┴─────────┴─────────┴─────────┘

═══════════════════════════════════════════════════════════════════
INDIVIDUAL AE REVIEW
═══════════════════════════════════════════════════════════════════

AE: [AE_NAME]
┌────────────────────┬──────────┬──────────┬──────────┐
│ Metric             │ Current  │ Target   │ Status   │
├────────────────────┼──────────┼──────────┼──────────┤
│ Total Pipeline     │ [$###K]  │ [$###K]  │ [🟢🟡🔴] │
│ Coverage Ratio     │   [#.#x] │   [3.5x] │ [🟢🟡🔴] │
│ Avg Deal Size      │   [$##K] │   [$##K] │ [🟢🟡🔴] │
│ Stage Progression  │   [##%]  │   [25%]  │ [🟢🟡🔴] │
│ Data Quality Score │   [##%]  │   [95%]  │ [🟢🟡🔴] │
└────────────────────┴──────────┴──────────┴──────────┘

DEALS TO INSPECT (Select 3-4):
1. [OPP_NAME] - [STAGE] - [$###K] - [FOCUS AREA]
2. [OPP_NAME] - [STAGE] - [$###K] - [FOCUS AREA]
3. [OPP_NAME] - [STAGE] - [$###K] - [FOCUS AREA]
4. [OPP_NAME] - [STAGE] - [$###K] - [FOCUS AREA]

COACHING NOTES:
- [COACHING POINT 1]
- [COACHING POINT 2]

ACTION ITEMS:
1. [ACTION] - [OWNER] - [DUE DATE]
2. [ACTION] - [OWNER] - [DUE DATE]
```

### 3.4 Monthly Deep Dive Inspection

**Time:** Last week of month
**Owner:** CRO_X + RevOps
**Purpose:** Comprehensive pipeline analysis

#### Monthly Deep Dive Template

```
MONTHLY PIPELINE DEEP DIVE - [MONTH YEAR]
Inspector: [CRO_X]
Analyst: [REVOPS_NAME]

═══════════════════════════════════════════════════════════════════
SECTION 1: PIPELINE VELOCITY ANALYSIS
═══════════════════════════════════════════════════════════════════

┌─────────────┬──────────┬──────────┬──────────┬──────────┐
│   Stage     │ Avg Entry│ Avg Exit │ Velocity │ Benchmark│
├─────────────┼──────────┼──────────┼──────────┼──────────┤
│ Prospecting │   [##]   │   [##]   │  [##]d   │   7d     │
│ Discovery   │   [##]   │   [##]   │  [##]d   │  14d     │
│ Demo        │   [##]   │   [##]   │  [##]d   │  21d     │
│ Proposal    │   [##]   │   [##]   │  [##]d   │  14d     │
│ Negotiation │   [##]   │   [##]   │  [##]d   │   7d     │
├─────────────┼──────────┼──────────┼──────────┼──────────┤
│ TOTAL       │   [##]   │   [##]   │  [##]d   │  63d     │
└─────────────┴──────────┴──────────┴──────────┴──────────┘

VELOCITY INSIGHTS:
- [INSIGHT 1]
- [INSIGHT 2]

═══════════════════════════════════════════════════════════════════
SECTION 2: CONVERSION ANALYSIS
═══════════════════════════════════════════════════════════════════

┌──────────────────┬──────────┬──────────┬──────────┬──────────┐
│   Transition     │ Entered  │ Advanced │ Conversion│ Benchmark│
├──────────────────┼──────────┼──────────┼──────────┼──────────┤
│ Prospecting → Disc│   [##]   │   [##]   │   [##%]  │   30%    │
│ Discovery → Demo  │   [##]   │   [##]   │   [##%]  │   50%    │
│ Demo → Proposal   │   [##]   │   [##]   │   [##%]  │   60%    │
│ Proposal → Neg    │   [##]   │   [##]   │   [##%]  │   70%    │
│ Negotiation → Won │   [##]   │   [##]   │   [##%]  │   80%    │
├──────────────────┼──────────┼──────────┼──────────┼──────────┤
│ Overall Win Rate  │   [##]   │   [##]   │   [##%]  │   25%    │
└──────────────────┴──────────┴──────────┴──────────┴──────────┘

CONVERSION INSIGHTS:
- [INSIGHT 1]
- [INSIGHT 2]

═══════════════════════════════════════════════════════════════════
SECTION 3: DATA QUALITY AUDIT
═══════════════════════════════════════════════════════════════════

┌────────────────────┬──────────┬──────────┬──────────┐
│ Quality Metric     │ Score    │ Target   │ Status   │
├────────────────────┼──────────┼──────────┼──────────┤
│ Field Completeness │   [##%]  │   95%    │ [🟢🟡🔴] │
│ Stage Accuracy     │   [##%]  │   90%    │ [🟢🟡🔴] │
│ Close Date Accuracy│   [##%]  │   85%    │ [🟢🟡🔴] │
│ Amount Accuracy    │   [##%]  │   80%    │ [🟢🟡🔴] │
│ Activity Logging   │   [##%]  │   95%    │ [🟢🟡🔴] │
└────────────────────┴──────────┴──────────┴──────────┘

DATA QUALITY ISSUES:
1. [ISSUE 1] - [IMPACT] - [ACTION]
2. [ISSUE 2] - [IMPACT] - [ACTION]

═══════════════════════════════════════════════════════════════════
SECTION 4: PIPELINE RISK ASSESSMENT
═══════════════════════════════════════════════════════════════════

HIGH-RISK OPPORTUNITIES:
┌─────────────┬─────────┬─────────┬─────────┬──────────────────┐
│ Opportunity │ Amount  │ Risk    │ Reason  │ Mitigation       │
├─────────────┼─────────┼─────────┼─────────┼──────────────────┤
│ [OPP_1]     │ [$###K] │  HIGH   │ [REASON]│ [ACTION]         │
│ [OPP_2]     │ [$###K] │  HIGH   │ [REASON]│ [ACTION]         │
│ [OPP_3]     │ [$###K] │  MED    │ [REASON]│ [ACTION]         │
└─────────────┴─────────┴─────────┴─────────┴──────────────────┘

═══════════════════════════════════════════════════════════════════
SECTION 5: ACTION ITEMS
═══════════════════════════════════════════════════════════════════

1. [ACTION] - [OWNER] - [DUE DATE]
2. [ACTION] - [OWNER] - [DUE DATE]
3. [ACTION] - [OWNER] - [DUE DATE]
```

---

## SECTION 4: FORECASTING SOP

### 4.1 Forecasting Principles

1. **Evidence-Based:** Every forecast number must have supporting evidence
2. **Manager Accountability:** Managers "bet their jobs" on commit numbers
3. **Regular Refresh:** Forecasts updated weekly, locked monthly
4. **Variance Analysis:** Track and explain forecast vs. actual
5. **No Sandbagging:** Optimistic but realistic projections

### 4.2 Forecast Categories & Probabilities

| Category | Probability | Description | Example |
|----------|-------------|-------------|---------|
| **Closed** | 100% | Signed this period | Contract executed |
| **Commit** | 85% | Will close this period | All approvals, signature pending |
| **Best Case** | 50% | Could close this period | Active negotiation, some risk |
| **Pipeline** | 20% | Might close this period | Early stage, needs acceleration |
| **Upside** | 10% | Surprise possible | Long shot, monitor only |

### 4.3 Weekly Forecast Update SOP

#### SOP-04: Weekly Forecast Submission

**Purpose:** Provide accurate weekly forecast to leadership

**Frequency:** Every Friday by 5pm
**Owner:** Sales Manager (consolidating AE inputs)

**Steps:**

1. **AE Forecast Preparation (Thursday)**
   - Review all opportunities in current quarter
   - Categorize each opportunity:
     - Closed (already signed)
     - Commit (will sign this quarter)
     - Best Case (could sign this quarter)
     - Pipeline (might sign this quarter)
     - Upside (surprise possible)
   - Document rationale for each Commit/Best Case

2. **Manager Review (Friday AM)**
   - Review each AE's forecast submission
   - Challenge assumptions:
     - "What could prevent this from closing?"
     - "What's the next step and when?"
     - "Who else is involved in the decision?"
   - Adjust categories based on evidence
   - Document manager adjustments

3. **Forecast Submission (Friday 5pm)**
   - Submit consolidated forecast via template
   - Include:
     - Category breakdown by AE
     - Top 5 deals with detailed notes
     - Risks and mitigations
     - Upside opportunities

4. **Forecast Lock (Monday AM)**
   - CRO_X reviews and locks forecast
   - Communicates to Finance/CEO
   - Becomes official company forecast

**Quality Check:**
- All opportunities categorized
- Rationale documented for Commit/Best Case
- Risks identified
- Manager has reviewed and challenged

### 4.4 Monthly Forecast Call SOP

#### SOP-05: Monthly Forecast Call Preparation

**Purpose:** Comprehensive monthly forecast review

**Frequency:** Last Thursday of month
**Owner:** CRO_X

**Pre-Work (Due Tuesday):**

1. **RevOps Prepares:**
   - Month-to-date actuals
   - Pipeline coverage analysis
   - Historical forecast accuracy
   - Stage progression metrics

2. **Managers Prepare:**
   - Team forecast by category
   - Top 10 deals with MEDDPICC
   - Risk register
   - Upside register

3. **CRO_X Prepares:**
   - Company-level forecast
   - Board communication draft
   - Resource needs assessment

**Call Agenda:**

| Time | Topic | Owner | Output |
|------|-------|-------|--------|
| 0:00-0:15 | Month Performance | RevOps | Actuals vs. plan |
| 0:15-0:45 | Next Month Forecast | Managers | Locked forecast |
| 0:45-1:05 | Coverage Analysis | RevOps | Pipeline health |
| 1:05-1:20 | Risk/Upside | CRO_X | Action items |
| 1:20-1:30 | Commitments | All | Action log |

### 4.5 Forecast Accuracy Tracking

```
FORECAST ACCURACY REPORT - [QUARTER]
Prepared by: [REVOPS_NAME]
Date: [DATE]

═══════════════════════════════════════════════════════════════════
WEEKLY FORECAST ACCURACY
═══════════════════════════════════════════════════════════════════

┌─────────┬──────────┬──────────┬──────────┬──────────┐
│ Week    │ Forecast │  Actual  │ Variance │ Accuracy │
├─────────┼──────────┼──────────┼──────────┼──────────┤
│ Week 1  │ [$###K]  │ [$###K]  │ [±##%]   │ [##%]    │
│ Week 2  │ [$###K]  │ [$###K]  │ [±##%]   │ [##%]    │
│ Week 3  │ [$###K]  │ [$###K]  │ [±##%]   │ [##%]    │
│ Week 4  │ [$###K]  │ [$###K]  │ [±##%]   │ [##%]    │
│ Week 5  │ [$###K]  │ [$###K]  │ [±##%]   │ [##%]    │
├─────────┼──────────┼──────────┼──────────┼──────────┤
│ QUARTER │ [$###K]  │ [$###K]  │ [±##%]   │ [##%]    │
└─────────┴──────────┴──────────┴──────────┴──────────┘

═══════════════════════════════════════════════════════════════════
CATEGORY ACCURACY
═══════════════════════════════════════════════════════════════════

┌─────────────┬──────────┬──────────┬──────────┬──────────┐
│ Category    │ Forecast │  Actual  │ Variance │ Accuracy │
├─────────────┼──────────┼──────────┼──────────┼──────────┤
│ Commit      │ [$###K]  │ [$###K]  │ [±##%]   │ [##%]    │
│ Best Case   │ [$###K]  │ [$###K]  │ [±##%]   │ [##%]    │
│ Pipeline    │ [$###K]  │ [$###K]  │ [±##%]   │ [##%]    │
│ Upside      │ [$###K]  │ [$###K]  │ [±##%]   │ [##%]    │
├─────────────┼──────────┼──────────┼──────────┼──────────┤
│ WEIGHTED    │ [$###K]  │ [$###K]  │ [±##%]   │ [##%]    │
└─────────────┴──────────┴──────────┴──────────┴──────────┘

═══════════════════════════════════════════════════════════════════
FORECASTER PERFORMANCE
═══════════════════════════════════════════════════════════════════

┌─────────────┬──────────┬──────────┬──────────┬──────────┐
│ Forecaster  │ Forecast │  Actual  │ Variance │ Accuracy │
├─────────────┼──────────┼──────────┼──────────┼──────────┤
│ Manager_A   │ [$###K]  │ [$###K]  │ [±##%]   │ [##%]    │
│ Manager_B   │ [$###K]  │ [$###K]  │ [±##%]   │ [##%]    │
│ AE_A        │ [$###K]  │ [$###K]  │ [±##%]   │ [##%]    │
│ AE_B        │ [$###K]  │ [$###K]  │ [±##%]   │ [##%]    │
└─────────────┴──────────┴──────────┴──────────┴──────────┘

INSIGHTS:
- [INSIGHT 1]
- [INSIGHT 2]

IMPROVEMENT ACTIONS:
1. [ACTION] - [OWNER] - [DUE DATE]
2. [ACTION] - [OWNER] - [DUE DATE]
```

---

## SECTION 5: KPIs & SUCCESS METRICS

### 5.1 Pipeline Hygiene KPIs

| KPI | Definition | Target | Measurement |
|-----|------------|--------|-------------|
| **Data Completeness** | % of required fields populated | 95% | Weekly audit |
| **Stage Accuracy** | % of opportunities in correct stage | 90% | Manager review |
| **Close Date Accuracy** | Avg variance between forecast and actual close | ±15 days | Quarterly analysis |
| **Amount Accuracy** | Avg variance between forecast and actual amount | ±20% | Quarterly analysis |
| **Activity Currency** | % of opportunities with activity in last 7 days | 90% | Daily tracking |
| **Stale Opportunity Rate** | % of opportunities >30 days no activity | <10% | Weekly review |

### 5.2 Forecasting KPIs

| KPI | Definition | Target | Measurement |
|-----|------------|--------|-------------|
| **Forecast Accuracy (Commit)** | Variance between commit forecast and actual | ±10% | Monthly |
| **Forecast Accuracy (Weighted)** | Variance between weighted forecast and actual | ±15% | Monthly |
| **Forecast Submission Rate** | % of managers submitting on time | 100% | Weekly |
| **Commit Conversion Rate** | % of commit that actually closes | 80%+ | Monthly |
| **Sandbagging Index** | Pattern of consistent under-forecasting | <5% | Quarterly |
| **Optimism Index** | Pattern of consistent over-forecasting | <10% | Quarterly |

### 5.3 Pipeline Health KPIs

| KPI | Definition | Target | Measurement |
|-----|------------|--------|-------------|
| **Pipeline Coverage** | Total pipeline / Quota | 3.5x | Weekly |
| **Pipeline Velocity** | Avg days from stage entry to exit | Benchmark | Monthly |
| **Stage Conversion** | % advancing from each stage | Benchmark | Monthly |
| **Win Rate** | Closed Won / (Closed Won + Closed Lost) | 25% | Monthly |
| **Avg Deal Size** | Total closed won / Count | $60K | Monthly |
| **Sales Cycle** | Avg days from creation to close | 75 days | Monthly |

---

## SECTION 6: FAILURE MODES & MITIGATION

| Failure Mode | Root Cause | Impact | Mitigation |
|--------------|------------|--------|------------|
| **Opportunities stuck in stage** | Poor qualification, no next steps | Inflated pipeline, false optimism | Enforce exit criteria, weekly inspection |
| **Close dates constantly pushed** | Wishful thinking, no urgency | Inaccurate forecasting | Require evidence for date changes |
| **Amounts inflated** | Optimism, sandbagging | Poor resource allocation | Track accuracy, adjust in flight |
| **Missing required fields** | Laziness, unclear standards | Poor reporting, bad decisions | Daily hygiene checks, consequences |
| **No activity logged** | Poor habits, time pressure | No visibility, can't coach | Make it easy, inspect regularly |
| **Stage progression without evidence** | Pressure to show progress | False pipeline, missed signals | Enforce exit criteria checklist |
| **Forecast sandbagging** | Fear of missing, compensation | Missed opportunities, slow growth | Reward accuracy, not just results |
| **Forecast optimism** | Pressure to hit numbers | Missed expectations, trust erosion | Track accuracy, coach realism |
| **Stale opportunities not closed** | Hope, fear of admitting loss | Inflated pipeline, wasted effort | Auto-close after 90 days no activity |
| **Duplicate opportunities** | Poor process, multiple AEs | Double counting, confusion | Deduplication rules, regular audit |

---

## SECTION 7: TEMPLATES LIBRARY

### 7.1 Template Index

| Template | Section | Usage |
|----------|---------|-------|
| Daily Hygiene Checklist | 3.2 | AE self-inspection |
| Weekly Pipeline Review Scorecard | 3.3 | Manager pipeline review |
| Monthly Deep Dive Template | 3.4 | Comprehensive analysis |
| Forecast Accuracy Report | 4.5 | Forecast tracking |
| MEDDPICC Deal Scorecard | DOC-05 | Deal inspection |
| QBR Scorecard | DOC-05 | Quarterly review |

### 7.2 Quick Reference: Opportunity Health Check

```
OPPORTUNITY HEALTH CHECK
Opportunity: [NAME]
AE: [AE_NAME]
Date: [DATE]

HEALTH INDICATORS:
□ Days in Stage: [##] (Target: <[##]) [🟢🟡🔴]
□ Last Activity: [#] days ago (Target: <7) [🟢🟡🔴]
□ Next Step Scheduled: [YES/NO] [🟢🟡🔴]
□ Next Step Date: [DATE] (Target: <7 days) [🟢🟡🔴]
□ Champion Identified: [YES/NO] [🟢🟡🔴]
□ Champion Strength: [#/5] (Target: 4+) [🟢🟡🔴]
□ Economic Buyer Met: [YES/NO] [🟢🟡🔴]
□ Budget Confirmed: [YES/NO] [🟢🟡🔴]
□ Decision Process Known: [YES/NO] [🟢🟡🔴]
□ Timeline Confirmed: [YES/NO] [🟢🟡🔴]

OVERALL HEALTH: [🟢 HEALTHY / 🟡 ATTENTION / 🔴 AT RISK]

ACTIONS REQUIRED:
1. [ACTION]
2. [ACTION]
3. [ACTION]
```

### 7.3 Quick Reference: Forecast Submission Checklist

```
FORECAST SUBMISSION CHECKLIST
Manager: [NAME]
Period: [MONTH/QUARTER]
Date: [DATE]

BEFORE SUBMITTING, VERIFY:
□ All opportunities in period reviewed
□ Each opportunity categorized (Closed/Commit/Best Case/Pipeline/Upside)
□ Rationale documented for Commit/Best Case deals
□ Close dates realistic and evidence-based
□ Amounts reflect current understanding
□ Top 5 deals have MEDDPICC analysis
□ Risks identified with mitigations
□ Upside opportunities noted
□ Manager has challenged AE assumptions
□ Numbers reviewed for consistency

SUBMISSION:
□ Forecast template complete
□ Submitted by deadline (Friday 5pm)
□ Manager approval confirmed

POST-SUBMISSION:
□ CRO_X review completed
□ Adjustments documented
□ Final forecast locked
□ Communicated to stakeholders
```

---

## SECTION 8: OPEN QUESTIONS

1. **CRM Platform:** Will HubSpot or Salesforce be standardized across portfolio?
2. **Automation:** What level of pipeline hygiene automation is acceptable?
3. **Consequences:** What are the consequences for poor data hygiene?
4. **Compensation Link:** Should forecast accuracy impact variable compensation?
5. **Portfolio Variance:** How much customization allowed per company size/stage?
6. **RevOps Ratio:** What's the target RevOps-to-AE ratio?
7. **Tool Integration:** Which sales engagement tools will be integrated?
8. **AI/ML:** Will AI-powered forecasting be implemented?

---

### APPENDIX A: PIPELINE STAGE BENCHMARKS

| Metric | SMB (<$50K) | Mid-Market ($50-250K) | Enterprise (>$250K) |
|--------|-------------|----------------------|---------------------|
| Prospecting Duration | 5 days | 7 days | 10 days |
| Discovery Duration | 10 days | 14 days | 21 days |
| Demo Duration | 14 days | 21 days | 35 days |
| Proposal Duration | 7 days | 14 days | 21 days |
| Negotiation Duration | 5 days | 7 days | 14 days |
| **Total Sales Cycle** | **41 days** | **63 days** | **101 days** |
| Win Rate | 20% | 25% | 30% |
| Avg Deal Size | $25K | $100K | $400K |

### APPENDIX B: FORECAST PROBABILITY BY STAGE

| Stage | Closed | Commit | Best Case | Pipeline | Upside |
|-------|--------|--------|-----------|----------|--------|
| Prospecting | 0% | 0% | 5% | 15% | 5% |
| Discovery | 0% | 5% | 15% | 30% | 10% |
| Demo | 0% | 20% | 40% | 25% | 10% |
| Proposal | 0% | 60% | 30% | 8% | 2% |
| Negotiation | 0% | 85% | 12% | 2% | 1% |
| Closed Won | 100% | 0% | 0% | 0% | 0% |

---

*Document Version: 1.0 | Vertica Pipeline Hygiene & Forecasting SOP | Confidential*
