# DOC 09 — PORTFOLIO MONITORING & EARLY WARNING SOP

**Document Version:** 2.0  
**Effective Date:** [Current Date]  
**Owner:** Portfolio Operations Team  
**Review Cycle:** Quarterly  
**Classification:** Internal Use Only

---

## 1. PURPOSE

This Standard Operating Procedure (SOP) establishes the systematic framework for monitoring portfolio company performance, detecting anomalies, triggering early warnings, and executing escalation protocols for Vertica's growth-stage software investments ($2M-$40M ARR).

**Primary Objectives:**
- Enable proactive identification of portfolio company performance issues
- Standardize KPI monitoring across all portfolio companies
- Create clear escalation pathways for intervention decisions
- Minimize reaction time between anomaly detection and response
- Provide data-driven foundation for board discussions and strategic decisions

---

## 2. AUDIENCE

| Role | Usage Context |
|------|---------------|
| **Vertica Partners** | Strategic oversight, intervention decisions, board engagement |
| **Principals/VPs** | Day-to-day portfolio management, L2-L3 escalations |
| **Associates/Analysts** | KPI monitoring, anomaly detection, report generation |
| **Portfolio Company CEOs** | Performance transparency, early warning awareness |
| **Portfolio Company CFOs** | Financial data submission, variance explanations |
| **Board Members** | Risk awareness, decision support materials |

---

## 3. INPUTS

### 3.1 Data Sources

| Source System | Data Type | Frequency | Integration Method |
|--------------|-----------|-----------|-------------------|
| Portfolio Company ERP | Financial statements | Monthly | API + Manual upload |
| CRM (Salesforce/HubSpot) | Pipeline, bookings | Weekly | Direct API |
| Product Analytics | Usage, engagement | Daily | Event streaming |
| HRIS Systems | Headcount, hiring | Monthly | API or CSV |
| Banking Partners | Cash balances | Daily | Bank feed API |
| Manual Submissions | Commentary, context | As needed | Portal upload |

### 3.2 Required Data Points

**P0 (Critical) Metrics - Weekly:**
- Cash balance and runway calculation
- ARR (current and trailing 12-month)
- Net New ARR (month-to-date)
- Pipeline coverage ratio

**P0 (Critical) Metrics - Monthly:**
- Full P&L statement
- Balance sheet key items
- Cash flow statement
- Detailed ARR waterfall (New/Expansion/Contraction/Churn)
- NRR and GRR calculations
- Headcount by function

**P1 (Important) Metrics - Monthly:**
- Customer cohort data
- Sales efficiency metrics
- Product usage statistics
- Support ticket volumes

**P1 (Important) Metrics - Quarterly:**
- Full unit economics analysis
- Customer satisfaction scores (NPS/CSAT)
- Competitive win/loss analysis
- Employee engagement scores

---

## 4. OUTPUTS

### 4.1 Standard Deliverables

| Deliverable | Frequency | Audience | Format |
|------------|-----------|----------|--------|
| Weekly Flash Report | Friday 5pm ET | Internal Vertica Team | Email + Dashboard |
| Monthly KPI Scorecard | 5 days pre-board | Board + Management | PDF + Interactive |
| Quarterly Deep Dive | 10 days pre-board | Full Board | Comprehensive Pack |
| Anomaly Alert | Real-time | Assigned Partner | Slack + Email |
| Escalation Packet (VIEP) | Trigger-based | Decision Committee | Structured Document |
| Intervention Tracker | Weekly | Internal Team | Shared Spreadsheet |

### 4.2 Dashboard Outputs

- **Portfolio Health Dashboard:** At-a-glance status of all companies
- **Red/Yellow Watchlist:** Companies requiring attention
- **Trend Analysis Charts:** 12-month rolling KPI visualization
- **Peer Comparison Matrix:** Performance vs. portfolio benchmarks
- **Cash Runway Calendar:** Upcoming financing needs

---

## 5. STEP-BY-STEP SOP

### 5.1 KPI Data Collection Workflow

```
STEP 1: Data Request (Monthly - First Business Day)
├── Automated email sent to all portfolio CFOs
├── Data collection portal link provided
├── Deadline: 5th business day of month
└── Escalation: Auto-reminder on day 3, Partner call on day 6

STEP 2: Data Validation (Days 6-7)
├── Automated completeness check
├── Anomaly flagging (outliers vs. historical)
├── Missing data follow-up
└── Preliminary calculations

STEP 3: KPI Calculation (Days 7-8)
├── Standard metric computation
├── Peer benchmarking
├── Trend analysis
└── Threshold status assignment (Green/Yellow/Red)

STEP 4: Review & Commentary (Days 8-9)
├── Portfolio Analyst review
├── Variance explanation requests
├── Context gathering from CEOs
└── Draft commentary preparation

STEP 5: Finalization & Distribution (Days 9-10)
├── Partner review and approval
├── Board pack assembly
├── Distribution to stakeholders
└── Archive to document management system
```

### 5.2 Anomaly Detection Workflow

```
ANOMALY DETECTION PROCESS

PHASE 1: Automated Detection (Continuous)
├── Statistical Analysis Engine Runs Daily
│   ├── 3-Sigma calculation on all P0 KPIs
│   ├── Z-score computation vs. 6-month rolling
│   ├── CUSUM sequential analysis
│   └── Trend break detection
├── Business Logic Rules Evaluation
│   ├── Sequential decline patterns
│   ├── Threshold zone crossings
│   ├── Variance vs. plan analysis
│   └── Peer comparison ranking
└── Output: Flagged anomalies with confidence scores

PHASE 2: Anomaly Review (Within 24 hours of detection)
├── Portfolio Analyst reviews flagged items
├── False positive filtering
├── Severity assessment (Low/Medium/High/Critical)
├── Initial context research
└── Draft alert preparation

PHASE 3: Alert Distribution (Within 48 hours)
├── Low Severity: Dashboard update only
├── Medium Severity: Weekly flash inclusion
├── High Severity: Immediate email to Partner
├── Critical Severity: Slack alert + Partner call
└── All severities: Logged in anomaly tracker

PHASE 4: Response Tracking (Ongoing)
├── Acknowledgment required within 24 hours
├── Response plan due within 72 hours (High/Critical)
├── Weekly status updates until resolved
└── Resolution documentation
```

### 5.3 Early Warning Escalation Workflow

```
ESCALATION DECISION TREE

START: KPI Status Change Detected
│
├─► GREEN Zone (No Action Required)
│   ├── Standard monitoring continues
│   └── Monthly reporting as scheduled
│
├─► YELLOW Zone (Level 1 - Enhanced Monitoring)
│   ├── Trigger: Any P0 KPI enters YELLOW
│   ├── Action: Activate Level 1 Protocol
│   │   ├── Weekly CEO check-in scheduled
│   │   ├── Bi-weekly financial review
│   │   ├── Enhanced dashboard visibility
│   │   └── Document in monthly board pack
│   ├── Owner: Vertica Associate/Analyst
│   ├── Duration: Until 30 days green OR escalation
│   └── Escalation Trigger: Persists >30 days
│
├─► RED Zone Single P0 (Level 2 - Active Support)
│   ├── Trigger: Single P0 KPI enters RED
│   ├── Action: Activate Level 2 Protocol
│   │   ├── Weekly executive coaching calls
│   │   ├── Functional expert introduction
│   │   ├── Peer CEO introduction
│   │   ├── Enhanced reporting requirements
│   │   └── Board notification
│   ├── Owner: Vertica Principal/VP
│   ├── Duration: Until 45 days green OR escalation
│   └── Escalation Trigger: Persists >45 days
│
├─► Multiple RED / Runway <6mo (Level 3 - Formal Intervention)
│   ├── Trigger: Multiple P0 RED OR Cash <6mo
│   ├── Action: Activate Level 3 Protocol
│   │   ├── Generate VIEP Escalation Packet
│   │   ├── Dedicated Vertica resource assignment
│   │   ├── Formal performance improvement plan
│   │   ├── Board working group formation
│   │   ├── Leadership evaluation
│   │   └── Strategic alternatives assessment
│   ├── Owner: Vertica Partner
│   ├── Duration: 60-day improvement window
│   └── Escalation Trigger: No improvement in 60 days
│
└─► Crisis Conditions (Level 4 - Crisis Management)
    ├── Trigger: Runway <3mo OR Severe distress
    ├── Action: Activate Level 4 Protocol
    │   ├── Partner direct involvement
    │   ├── Potential interim leadership
    │   ├── Emergency financing exploration
    │   ├── M&A process if appropriate
    │   └── Wind-down preparation if necessary
    ├── Owner: Vertica Managing Partner
    └── Board: Weekly calls minimum
```

### 5.4 Escalation Packet (VIEP) Generation Workflow

```
VIEP GENERATION (48-Hour SLA)

HOUR 0: Trigger Event
├── Automated alert generated
├── Partner notified immediately
└── VIEP workflow initiated

HOURS 0-8: Data Assembly
├── Portfolio Analyst gathers:
│   ├── 12-month KPI history
│   ├── Peer comparison data
│   ├── Market context research
│   └── Previous board materials
└── Preliminary analysis complete

HOURS 8-24: Analysis & Drafting
├── Section 1: Executive Brief (Partner)
├── Section 2: KPI Forensics (Analyst)
├── Section 3: Context Gathering (Partner interview)
├── Section 4: Scenario Analysis (Analyst + CFO)
├── Section 5: Intervention Options (Partner)
└── Section 6: Decision Matrix (Partner)

HOURS 24-40: Review & Refinement
├── Internal Vertica review
├── Peer Partner feedback
├── Company management input (if appropriate)
└── Final editing

HOURS 40-48: Finalization & Distribution
├── Final Partner approval
├── Distribution to decision committee
├── Calendar invite for review meeting
└── Archive and tracking
```

---

## 6. KPI THRESHOLDS BY STAGE

### 6.1 Stage Definitions

| Stage | ARR Range | Code | Typical Characteristics |
|-------|-----------|------|------------------------|
| Seed+ | $2M-$5M | S+ | Product-market fit validation, early sales motion |
| Series A | $5M-$15M | A | Scaling sales, building teams, process development |
| Series B | $15M-$40M | B | Expansion stage, operational excellence, market leadership |

### 6.2 Threshold Matrix

#### ARR GROWTH (YoY %)

| Stage | GREEN | YELLOW | RED |
|-------|-------|--------|-----|
| Seed+ | >100% | 50-100% | <50% |
| Series A | >80% | 40-80% | <40% |
| Series B | >60% | 30-60% | <30% |

#### NET REVENUE RETENTION (NRR %)

| Stage | GREEN | YELLOW | RED |
|-------|-------|--------|-----|
| Seed+ | >110% | 100-110% | <100% |
| Series A | >115% | 105-115% | <105% |
| Series B | >120% | 110-120% | <110% |

#### GROSS REVENUE RETENTION (GRR %)

| Stage | GREEN | YELLOW | RED |
|-------|-------|--------|-----|
| Seed+ | >90% | 85-90% | <85% |
| Series A | >92% | 88-92% | <88% |
| Series B | >95% | 90-95% | <90% |

#### BURN MULTIPLE

| Stage | GREEN | YELLOW | RED |
|-------|-------|--------|-----|
| Seed+ | <1.5x | 1.5-2.5x | >2.5x |
| Series A | <1.0x | 1.0-2.0x | >2.0x |
| Series B | <0.75x | 0.75-1.5x | >1.5x |

#### CASH RUNWAY (Months)

| Stage | GREEN | YELLOW | RED |
|-------|-------|--------|-----|
| Seed+ | >18 | 12-18 | <12 |
| Series A | >18 | 12-18 | <12 |
| Series B | >24 | 18-24 | <18 |

#### LTV/CAC RATIO

| Stage | GREEN | YELLOW | RED |
|-------|-------|--------|-----|
| Seed+ | >3.0x | 2.0-3.0x | <2.0x |
| Series A | >3.5x | 2.5-3.5x | <2.5x |
| Series B | >4.0x | 3.0-4.0x | <3.0x |

#### CAC PAYBACK (Months)

| Stage | GREEN | YELLOW | RED |
|-------|-------|--------|-----|
| Seed+ | <18 | 18-24 | >24 |
| Series A | <15 | 15-20 | >20 |
| Series B | <12 | 12-18 | >18 |

#### MAGIC NUMBER

| Stage | GREEN | YELLOW | RED |
|-------|-------|--------|-----|
| Seed+ | >0.75 | 0.5-0.75 | <0.5 |
| Series A | >0.85 | 0.6-0.85 | <0.6 |
| Series B | >1.0 | 0.75-1.0 | <0.75 |

#### GROSS MARGIN

| Stage | GREEN | YELLOW | RED |
|-------|-------|--------|-----|
| Seed+ | >70% | 60-70% | <60% |
| Series A | >75% | 65-75% | <65% |
| Series B | >80% | 70-80% | <70% |

#### RULE OF 40

| Stage | GREEN | YELLOW | RED |
|-------|-------|--------|-----|
| Seed+ | >40% | 20-40% | <20% |
| Series A | >45% | 25-45% | <25% |
| Series B | >50% | 30-50% | <30% |

---

## 7. FAILURE MODES & MITIGATION

### 7.1 Common Failure Modes

| Failure Mode | Root Cause | Impact | Mitigation |
|--------------|------------|--------|------------|
| **Late Data Submission** | Portfolio company capacity constraints | Delayed analysis, rushed decisions | Automated reminders, phased deadlines, data quality scoring |
| **Incomplete Data** | Poor tracking systems, manual processes | Incomplete analysis, missed signals | Data templates, validation rules, completeness dashboards |
| **False Positive Alerts** | Overly sensitive thresholds | Alert fatigue, ignored warnings | Confidence scoring, multi-signal confirmation |
| **False Negative Alerts** | Insufficient monitoring coverage | Missed deterioration | Comprehensive KPI coverage, peer comparison |
| **Delayed Escalation** | Unclear ownership, wait-and-see mentality | Deterioration before intervention | Clear SLA definitions, automated escalation |
| **Inadequate Context** | Surface-level analysis | Poor intervention decisions | Structured context gathering, CEO interviews |
| **Intervention Failure** | Wrong intervention, poor execution | Continued decline | Intervention playbook, regular review, pivot criteria |

### 7.2 Quality Assurance Checklist

**Data Quality:**
- [ ] All P0 KPIs have current data
- [ ] Data passes validation rules
- [ ] Variance explanations provided for >10% changes
- [ ] Peer comparison completed
- [ ] Historical continuity verified

**Analysis Quality:**
- [ ] Root cause identified for all red flags
- [ ] Multiple hypotheses considered
- [ ] External factors documented
- [ ] Scenario analysis completed
- [ ] Intervention options evaluated

**Communication Quality:**
- [ ] Executive summary clear and actionable
- [ ] Technical details available for deep dives
- [ ] Next steps clearly defined
- [ ] Owners assigned with deadlines
- [ ] Follow-up scheduled

---

## 8. TEMPLATES

### 8.1 Weekly Flash Report Template

```
================================================================================
VERTICA PORTFOLIO FLASH REPORT - Week of [DATE]
================================================================================

EXECUTIVE SUMMARY
-----------------
Portfolio Health: [GREEN/YELLOW/RED]
Companies Requiring Attention: [#]
New Anomalies This Week: [#]
Critical Items: [#]

RED/YELLOW FLAG SUMMARY
-----------------------
| Company | Flag | KPI | Trend | Action Required |
|---------|------|-----|-------|-----------------|
| PORTCO_1 | RED | Cash Runway | ↓↓ | Immediate review |
| PORTCO_3 | YELLOW | NRR | ↓ | Enhanced monitoring |

CASH RUNWAY WATCHLIST (<12 MONTHS)
-----------------------------------
| Company | Runway | Next Financing | Status |
|---------|--------|----------------|--------|
| PORTCO_1 | 8.5 mo | Q2 2024 | In progress |
| PORTCO_5 | 10.2 mo | Q3 2024 | Planning |

NEW ANOMALIES DETECTED
----------------------
| Company | KPI | Current | Expected | Confidence | Status |
|---------|-----|---------|----------|------------|--------|
| PORTCO_2 | ARR Growth | 35% | 65% | High | Under review |

WEEK-OVER-WEEK CHANGES
----------------------
| Company | KPI | Last Week | This Week | Change |
|---------|-----|-----------|-----------|--------|
| PORTCO_4 | Pipeline | $2.1M | $1.8M | -14% |

UPCOMING ITEMS
--------------
- Board meetings this week: [List]
- Data collection deadlines: [List]
- Follow-up items: [List]

================================================================================
```

### 8.2 Anomaly Alert Template

```
================================================================================
VERTICA ANOMALY ALERT - [SEVERITY: HIGH/CRITICAL]
================================================================================

ALERT DETAILS
-------------
Company: [PORTCO_NAME]
KPI: [KPI_NAME]
Detected: [DATE/TIME]
Severity: [LOW/MEDIUM/HIGH/CRITICAL]
Confidence: [X%]

CURRENT STATUS
--------------
Current Value: [VALUE]
Expected Range: [RANGE]
Deviation: [X%] / [X std dev]
Threshold Zone: [GREEN/YELLOW/RED]

HISTORICAL CONTEXT
------------------
Previous Period: [VALUE]
3-Month Trend: [↑/↓/→]
6-Month Average: [VALUE]
Peer Comparison: [PERCENTILE]

POTENTIAL CAUSES
----------------
1. [Hypothesis 1 - Probability: X%]
2. [Hypothesis 2 - Probability: X%]
3. [Hypothesis 3 - Probability: X%]

RECOMMENDED ACTIONS
-------------------
Immediate (24h): [Action]
Short-term (1 week): [Action]
Medium-term (1 month): [Action]

NEXT STEPS
----------
Owner: [NAME]
Follow-up: [DATE/TIME]
Required Input: [FROM WHOM]

================================================================================
```

### 8.3 VIEP Escalation Packet Template

```
================================================================================
VERTICA INTERVENTION ESCALATION PACKET (VIEP)
Company: [PORTCO_NAME] | Date: [DATE] | Classification: [INTERNAL]
================================================================================

SECTION 1: EXECUTIVE BRIEF
---------------------------
ISSUE SUMMARY:
[2-3 sentence description of the core issue]

BUSINESS IMPACT:
- Financial: [Quantified impact]
- Operational: [Operational impact]
- Strategic: [Strategic implications]

RECOMMENDED ACTIONS:
1. [Primary recommendation]
2. [Secondary recommendation]
3. [Contingency]

DECISION REQUIRED:
[Clear statement of decision needed and timeline]

---

SECTION 2: KPI FORENSICS
-------------------------
[Detailed charts and analysis - max 3 pages]

TREND ANALYSIS:
- 12-month history table
- Visual trend charts
- Statistical analysis (Z-score, variance)

PEER COMPARISON:
- Portfolio percentile ranking
- Benchmark comparison
- Stage-appropriate expectations

ROOT CAUSE ANALYSIS:
- Contributing factors identified
- Correlation analysis
- Leading indicator review

---

SECTION 3: CONTEXT GATHERING
-----------------------------
MANAGEMENT PERSPECTIVE:
[Summary of CEO/CFO interview]

EXTERNAL FACTORS:
- Market conditions
- Competitive dynamics
- Macroeconomic factors

MITIGATING CIRCUMSTANCES:
[Factors that may explain or offset the issue]

---

SECTION 4: SCENARIO ANALYSIS
-----------------------------
| Scenario | Probability | ARR (12mo) | Cash Position | Outcome |
|----------|-------------|------------|---------------|---------|
| Upside | 20% | $XXM | $XM | [Description] |
| Base | 50% | $XXM | $XM | [Description] |
| Downside | 30% | $XXM | $XM | [Description] |

PROBABILITY-WEIGHTED EXPECTED VALUE: [CALCULATION]

---

SECTION 5: INTERVENTION OPTIONS
--------------------------------
OPTION A: [Name]
- Description: [Details]
- Pros: [List]
- Cons: [List]
- Resources Required: [List]
- Timeline: [Duration]
- Success Probability: [X%]

OPTION B: [Name]
[Same structure]

OPTION C: [Name]
[Same structure]

---

SECTION 6: DECISION MATRIX
---------------------------
| Criteria | Weight | Option A | Option B | Option C |
|----------|--------|----------|----------|----------|
| Speed of Impact | 25% | X/10 | X/10 | X/10 |
| Probability of Success | 30% | X/10 | X/10 | X/10 |
| Resource Requirements | 15% | X/10 | X/10 | X/10 |
| Alignment with Strategy | 20% | X/10 | X/10 | X/10 |
| Risk Level | 10% | X/10 | X/10 | X/10 |
| WEIGHTED SCORE | 100% | XX | XX | XX |

RECOMMENDATION: [Option X]
RATIONALE: [Explanation]

DECISION REQUIRED BY: [DATE]
IMPLEMENTATION START: [DATE]

================================================================================
```

### 8.4 Synthetic Portfolio Example Data

```
================================================================================
SYNTHETIC PORTFOLIO DATA - THRESHOLD DEMONSTRATION
================================================================================

PORTCO_1 (Series A, $8M ARR)
-----------------------------
| KPI | Current | Threshold | Status | Trend |
|-----|---------|-----------|--------|-------|
| ARR Growth YoY | 45% | 40% (RED) | YELLOW | ↓ |
| NRR | 108% | 105% (RED) | YELLOW | ↓ |
| GRR | 91% | 88% (RED) | GREEN | → |
| Burn Multiple | 1.8x | 2.0x (RED) | YELLOW | ↑ |
| Cash Runway | 14 mo | 12mo (RED) | YELLOW | ↓ |
| LTV/CAC | 3.2x | 2.5x (RED) | GREEN | → |
| Magic Number | 0.72 | 0.6 (RED) | YELLOW | ↓ |
| Gross Margin | 76% | 65% (RED) | GREEN | → |
| OVERALL STATUS: YELLOW (Enhanced Monitoring Activated)

PORTCO_2 (Series B, $28M ARR)
------------------------------
| KPI | Current | Threshold | Status | Trend |
|-----|---------|-----------|--------|-------|
| ARR Growth YoY | 22% | 30% (RED) | RED | ↓↓ |
| NRR | 118% | 110% (RED) | GREEN | → |
| GRR | 94% | 90% (RED) | GREEN | → |
| Burn Multiple | 1.2x | 1.5x (RED) | GREEN | → |
| Cash Runway | 16 mo | 18mo (RED) | YELLOW | ↓ |
| LTV/CAC | 3.5x | 3.0x (RED) | GREEN | → |
| Magic Number | 0.82 | 0.75 (RED) | GREEN | ↑ |
| Gross Margin | 78% | 70% (RED) | GREEN | → |
| OVERALL STATUS: RED (Active Support Activated - ARR Growth)

PORTCO_3 (Seed+, $3.5M ARR)
----------------------------
| KPI | Current | Threshold | Status | Trend |
|-----|---------|-----------|--------|-------|
| ARR Growth YoY | 125% | 50% (RED) | GREEN | ↑ |
| NRR | 112% | 100% (RED) | GREEN | ↑ |
| GRR | 88% | 85% (RED) | YELLOW | → |
| Burn Multiple | 1.3x | 2.5x (RED) | GREEN | → |
| Cash Runway | 11 mo | 12mo (RED) | RED | ↓ |
| LTV/CAC | 2.8x | 2.0x (RED) | GREEN | → |
| Magic Number | 0.68 | 0.5 (RED) | YELLOW | ↓ |
| Gross Margin | 72% | 60% (RED) | GREEN | → |
| OVERALL STATUS: YELLOW (Enhanced Monitoring - Cash Focus)

================================================================================
```

---

## 9. OPEN QUESTIONS

### 9.1 Framework Questions

1. **Threshold Calibration:** Should thresholds be adjusted based on sub-sector (e.g., infrastructure vs. application software)?

2. **Weighting System:** Should we implement a weighted scoring system for overall company health vs. individual KPI status?

3. **Leading Indicators:** What additional leading indicators should we incorporate (e.g., product engagement, employee satisfaction)?

4. **Frequency Optimization:** Is monthly sufficient for Series B+ companies, or should we move to bi-weekly?

5. **Automation Level:** What additional automation should we invest in to reduce manual effort?

### 9.2 Implementation Questions

1. **System Integration:** Which portfolio companies have API-accessible systems vs. manual data collection?

2. **Change Management:** How do we roll out enhanced monitoring requirements to existing portfolio companies?

3. **Resource Allocation:** What is the optimal analyst-to-company ratio for effective monitoring?

4. **Board Integration:** How do we align this framework with existing board reporting cadences?

5. **External Data:** Should we incorporate external data sources (market data, competitive intelligence)?

### 9.3 Decision-Making Questions

1. **Intervention Authority:** At what threshold does intervention require Managing Partner approval?

2. **Portfolio-Level Decisions:** How do we prioritize interventions when multiple companies need support?

3. **Success Metrics:** How do we measure the effectiveness of our monitoring and intervention processes?

4. **Learning Loop:** How do we incorporate learnings from interventions back into the framework?

5. **Exit Considerations:** How does monitoring inform hold/sell/add decisions?

---

## APPENDIX A: GLOSSARY

| Term | Definition |
|------|------------|
| **ARR** | Annual Recurring Revenue |
| **NRR** | Net Revenue Retention (includes expansion) |
| **GRR** | Gross Revenue Retention (excludes expansion) |
| **Burn Multiple** | Net Burn / Net New ARR |
| **LTV/CAC** | Lifetime Value to Customer Acquisition Cost ratio |
| **Magic Number** | (Current Quarter ARR - Prior Quarter ARR) * 4 / Prior Quarter S&M Spend |
| **Rule of 40** | Growth Rate % + Profit Margin % >= 40 |
| **VIEP** | Vertica Intervention Escalation Packet |
| **P0/P1/P2** | Priority levels (P0 = Critical, P1 = Important, P2 = Standard) |

---

## APPENDIX B: REVISION HISTORY

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [Date] | [Author] | Initial release |
| 2.0 | [Current Date] | Portfolio Ops | Added automation workflows, refined thresholds, expanded templates |

---

**END OF DOCUMENT**
