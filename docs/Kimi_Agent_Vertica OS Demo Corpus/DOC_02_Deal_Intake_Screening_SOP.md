# DOC 02 — DEAL INTAKE & SCREENING SOP
## Vertica Capital Partners | Growth-Stage Software Investments

---

## DOCUMENT CONTROL

| Field | Value |
|-------|-------|
| **Document ID** | VERT-SOP-002 |
| **Version** | 1.0 |
| **Effective Date** | [DATE] |
| **Review Cycle** | Quarterly |
| **Owner** | Deal Operations |
| **Approver** | Managing Partner |

---

## 1. PURPOSE

This Standard Operating Procedure (SOP) establishes the unified process for:
- **Intake**: Capturing all inbound deal flow systematically
- **Triage**: Applying thesis-based criteria to prioritize opportunities
- **Screening**: Conducting rapid initial evaluation
- **Routing**: Directing opportunities to appropriate deal team members
- **Red Flag Detection**: Identifying disqualifying factors early

**Primary Objective**: Ensure no viable deal falls through cracks while maintaining disciplined thesis adherence and efficient resource allocation.

---

## 2. AUDIENCE

| Role | Responsibility |
|------|----------------|
| Managing Partners | Final thesis fit decisions, IC sponsorship |
| Principals | Lead screening calls, thesis validation |
| Associates | Initial intake, CRM logging, preliminary analysis |
| Analysts | Data entry, document organization, comp research |
| Operating Partners | Thesis expertise input, preliminary VCP sketch |
| Deal Operations | Process oversight, metrics tracking, template maintenance |

---

## 3. INPUTS

### 3.1 Deal Sources

| Source Category | Examples | Expected Volume | Priority |
|-----------------|----------|-----------------|----------|
| **Investment Banks** | BANKER_A, BANKER_B, BANKER_C | 40% of flow | HIGH |
| **Operating Partners** | OP_NETWORK referrals | 25% of flow | HIGH |
| **Portfolio Companies** | PORTCO_1, PORTCO_2, PORTCO_3 | 15% of flow | HIGH |
| **Direct Outreach** | CEO_A, CEO_B inbound | 10% of flow | MEDIUM |
| **Co-Investors** | PE_FIRM_X, PE_FIRM_Y | 8% of flow | MEDIUM |
| **Other** | Conferences, press, etc. | 2% of flow | LOW |

### 3.2 Required Intake Information

```
MINIMUM VIABLE INTAKE DATA:
├── Company Information
│   ├── Legal name and DBA
│   ├── Website URL
│   ├── Headquarters location
│   └── Year founded
├── Financial Snapshot
│   ├── Last twelve months (LTM) ARR
│   ├── YoY growth rate
│   ├── Gross margin %
│   └── Rule of 40 score (if applicable)
├── Transaction Parameters
│   ├── Check size sought
│   ├── Deal type (growth buyout/recap/growth capital)
│   ├── Ownership % available
│   └── Expected timeline
├── Contact Information
│   ├── Primary contact name/role
│   ├── Email and phone
│   └── Who referred/how sourced
└── Confidentiality Status
    ├── NDA executed? (Y/N)
    └── Data room available? (Y/N)
```

---

## 4. OUTPUTS

### 4.1 Primary Outputs

| Output | Format | Owner | Distribution |
|--------|--------|-------|--------------|
| CRM Deal Record | Affinity | Associate | All deal team |
| Screening Scorecard | Spreadsheet/Notion | Principal | Deal team, OPs |
| Thesis Fit Memo | 1-pager | Principal | Managing Partners |
| Routing Decision | CRM status update | Managing Partner | Deal team |
| Pass Letter (if applicable) | Email template | Associate | Originator |

### 4.2 Decision Outcomes

```
ROUTING DECISIONS:
├── PASS (60-70% of intake)
│   ├── Outside thesis → Archive with note
│   ├── Too early → Nurture for future
│   └── Red flags → Archive with reason
├── NURTURE (15-20% of intake)
│   ├── Timing not right → Quarterly check-ins
│   ├── Thesis adjacent → Monitor for evolution
│   └── Competitive dynamics → Watch list
└── ACTIVE (15-20% of intake)
    ├── SCREEN → Proceed to screening call
    └── FAST-TRACK → Direct to Managing Partner
```

---

## 5. STEP-BY-STEP SOP

### PHASE 1: INTAKE (T+0 to T+1 Day)

#### Step 1.1: Receive Inbound

**Trigger**: Any deal flow enters organization

**Actions**:
1. Acknowledge receipt within 24 hours to originator
2. Log in CRM immediately (do not delay)
3. Tag with source, date, and initial owner

**CRM Fields Required**:
```
- Company Name: [TEXT]
- Source: [DROPDOWN: Banker/OP/PortCo/Direct/Co-Investor/Other]
- Source Contact: [TEXT]
- Date Received: [DATE]
- Initial Owner: [USER]
- Status: [DROPDOWN: New/Intake Complete/Screening/Active/Pass/Nurture]
- Priority: [DROPDOWN: P0/P1/P2/P3]
```

#### Step 1.2: Complete Intake Data

**Owner**: Associate assigned

**Actions**:
1. Request minimum viable data (see Section 3.2)
2. Research public information (Crunchbase, LinkedIn, company website)
3. Complete CRM record with available data
4. Upload any received materials to data room placeholder

**Time Budget**: 30-60 minutes per deal

---

### PHASE 2: THESIS-BASED TRIAGE (T+1 to T+3 Days)

#### Step 2.1: Apply Thesis Filters

**Vertica Investment Thesis (2024)**:

```
THESIS VERTICALS:
├── VERTICAL A: Inside Sales Excellence
│   ├── Target: B2B software with inside sales motion
│   ├── Sweet spot: 20-100 person sales teams
│   └── Value creation: Sales process optimization
├── VERTICAL B: Customer Success Cadence
│   ├── Target: Subscription businesses with CS teams
│   ├── Sweet spot: $10K-$100K ACV products
│   └── Value creation: Retention and expansion playbooks
├── VERTICAL C: Product-Led Growth Transition
│   ├── Target: PLG companies adding sales layer
│   ├── Sweet spot: 10M+ users, <5% paying
│   └── Value creation: Sales-assist motion
└── VERTICAL D: Vertical SaaS Expansion
    ├── Target: Industry-specific software
    ├── Sweet spot: $5M-$30M ARR, 30%+ margins
    └── Value creation: Market expansion, M&A

UNIVERSAL CRITERIA:
├── ARR: $2M - $40M
├── Check Size: $10M - $100M
├── Deal Types: Growth buyout, recap, growth capital
├── Geography: North America (primary), UK/EU (selective)
└── No minimum growth or profitability requirement
```

#### Step 2.2: Complete Triage Scorecard

| Criteria | Weight | Score (1-5) | Notes |
|----------|--------|-------------|-------|
| **Thesis Alignment** | 25% | | Which vertical? How strong? |
| **ARR Range Fit** | 20% | | Within $2M-$40M? |
| **Check Size Fit** | 15% | | Within $10M-$100M? |
| **Deal Type Fit** | 15% | | Growth buyout/recap/capital? |
| **Geography Fit** | 10% | | North America/UK/EU? |
| **Timing/Process** | 10% | | Real process? Competitive? |
| **Source Quality** | 5% | | Trusted source? |

**Scoring Interpretation**:
- 4.0-5.0: Fast-track to Managing Partner
- 3.0-3.9: Standard screening process
- 2.0-2.9: Nurture or secondary review
- <2.0: Pass with note

#### Step 2.3: Red Flag Review

**AUTOMATIC DISQUALIFIERS (Hard Pass)**:

| Red Flag Category | Specific Trigger | Disposition |
|-------------------|------------------|-------------|
| **Financial** | ARR <$2M or >$40M | Pass - Outside range |
| **Financial** | Check <$10M or >$100M | Pass - Outside range |
| **Legal** | Active litigation (material) | Pass - Pending resolution |
| **Legal** | Regulatory enforcement action | Pass - Compliance risk |
| **Team** | Key person dependency (no succession) | Pass - Concentration risk |
| **Market** | Declining TAM with no pivot | Pass - Structural decline |
| **Technology** | Single point of failure (tech) | Pass - Technical risk |
| **Customer** | >50% revenue from single customer | Pass - Concentration risk |

**YELLOW FLAGS (Requires Deeper Review)**:

| Yellow Flag | Investigation Required |
|-------------|----------------------|
| Customer concentration >30% | Detailed churn analysis |
| Founder/CEO never scaled past $10M | Operating Partner assessment |
| Recent senior departures | Exit interview requests |
| Declining net revenue retention | Root cause analysis |
| Complex cap table (>10 investors) | Governance review |
| Bootstrapped (no external validation) | Market reference calls |
| Recent pricing changes | Customer impact analysis |

---

### PHASE 3: SCREENING (T+3 to T+10 Days)

#### Step 3.1: Assign Screening Owner

**Routing Logic**:

```
IF Triage Score >= 4.0:
    → Managing Partner takes lead
    → Fast-track to IC preview
    
IF Triage Score 3.0-3.9:
    → Principal assigned based on vertical expertise
    → Standard 2-week screening process
    
IF Triage Score 2.0-2.9:
    → Associate preliminary work
    → Principal review before proceeding
    
IF Triage Score < 2.0:
    → Pass letter sent
    → Archive with reason
```

#### Step 3.2: Conduct Screening Call

**Screening Call Agenda** (60 minutes):

```
1. COMPANY OVERVIEW (10 min)
   • Founding story and evolution
   • Product/service description
   • Competitive positioning

2. FINANCIAL SNAPSHOT (15 min)
   • ARR trajectory (last 3 years)
   • Growth drivers and sustainability
   • Unit economics (CAC, LTV, payback)
   • Path to profitability (if applicable)

3. MARKET & CUSTOMERS (15 min)
   • TAM/SAM/SOM analysis
   • Customer segmentation
   • Win/loss patterns
   • Competitive dynamics

4. TEAM & ORGANIZATION (10 min)
   • Leadership background
   • Key hires planned
   • Culture and values

5. TRANSACTION (10 min)
   • Use of proceeds
   • Timeline and process
   • Other parties involved
   • Seller motivations
```

**Screening Call Output**: Completed screening scorecard + call notes

#### Step 3.3: Operating Partner Input

**For Active Deals**:
1. Share screening materials with relevant Operating Partner
2. Request preliminary VCP sketch (2-3 bullet points)
3. Assess OP availability and interest
4. Include OP in next steps decision

**VCP Sketch Template**:
```
PRELIMINARY VALUE CREATION THESIS:
├── Primary Value Driver: [e.g., Sales efficiency improvement]
├── Estimated Impact: [e.g., 20-30% productivity gain]
├── Key Interventions: [2-3 specific actions]
├── Timeline to Value: [e.g., 6-12 months]
└── OP Confidence: [High/Medium/Low]
```

---

### PHASE 4: ROUTING DECISION (T+10 to T+14 Days)

#### Step 4.1: Screening Committee Review

**Attendees**: Screening Principal, Managing Partner, relevant OP
**Duration**: 30 minutes
**Materials**: Screening scorecard, VCP sketch, preliminary model

**Decision Framework**:

```
PROCEED TO DILIGENCE requires:
├── Triage score >= 3.0
├── No red flags (or mitigated)
├── OP interest and availability
├── Managing Partner sponsorship
└── Capacity in pipeline

NURTURE requires:
├── Triage score 2.5-2.9
├── Timing or thesis concerns
├── Potential for future fit
└── Quarterly check-in scheduled

PASS requires:
├── Triage score < 2.5
├── Unmitigated red flags
├── No OP interest
└── Pass letter within 48 hours
```

#### Step 4.2: Update CRM & Communicate

**CRM Updates**:
- Status change
- Decision date
- Next steps (if applicable)
- Pass reason (if applicable)

**Communications**:
- Originator: Decision within 48 hours
- Internal: Slack notification to deal team
- PortCo/OP: Direct conversation

---

## 6. KPIs

### 6.1 Process KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Intake to Triage Complete | <3 days | CRM timestamp analysis |
| Triage to Screening Decision | <7 days | CRM timestamp analysis |
| Screening to Routing Decision | <7 days | CRM timestamp analysis |
| Total Intake to Active/Pass | <14 days | CRM timestamp analysis |
| Pass Letter Response Time | <48 hours | Email tracking |
| CRM Data Completeness | >95% | Field validation audit |

### 6.2 Quality KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Pass Rate | 60-70% | Deal volume analysis |
| Nurture Conversion Rate | 15-20% | 12-month tracking |
| Active to IC Rate | 30-40% | Pipeline conversion |
| Thesis Alignment (Active) | >90% | Post-hoc review |
| Source Attribution Accuracy | >95% | CRM validation |

### 6.3 Efficiency KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| Associate Hours per Intake | <1 hour | Time tracking |
| Principal Hours per Screen | <4 hours | Time tracking |
| Duplicate Deal Detection | >95% | CRM matching |
| NDA Turnaround Time | <24 hours | Email tracking |

---

## 7. FAILURE MODES

### 7.1 Process Failures

| Failure Mode | Symptom | Root Cause | Mitigation |
|--------------|---------|------------|------------|
| **Deal Leakage** | Good deals not logged | Email-only intake | Mandatory CRM logging |
| **Slow Triage** | >5 days to decision | Unclear ownership | Assigned triage queue |
| **Thesis Drift** | Off-strategy deals advance | FOMO, weak criteria | Scorecard discipline |
| **OP Bottleneck** | No OP input on active deals | Capacity constraints | OP capacity dashboard |
| **Ghost Deals** | Active status, no activity | Poor pipeline hygiene | Weekly pipeline review |

### 7.2 Decision Failures

| Failure Mode | Symptom | Root Cause | Mitigation |
|--------------|---------|------------|------------|
| **False Positive** | Bad deal gets to IC | Inadequate screening | Red flag checklist |
| **False Negative** | Good deal passed | Overly rigid criteria | Nurture tracking |
| **Slow No** | Pass takes >30 days | Avoidance, hope | 14-day decision SLA |
| **Zombie Deals** | Nurture never closed | No nurture process | Quarterly nurture review |

---

## 8. TEMPLATES

### 8.1 Intake Form (CRM)

```
VERTICA DEAL INTAKE FORM
═══════════════════════════════════════════════════════════

SECTION 1: SOURCE INFORMATION
Source Type: [ ] Banker [ ] Operating Partner [ ] Portfolio Company
             [ ] Direct [ ] Co-Investor [ ] Other
Source Contact: _________________________
Referral Context: _________________________
Date Received: ___________

SECTION 2: COMPANY INFORMATION
Legal Name: _________________________
Website: _________________________
Headquarters: _________________________
Year Founded: _______
Employees: _______

SECTION 3: FINANCIAL SNAPSHOT
LTM ARR: $_________
YoY Growth: _______%
Gross Margin: _______%
Net Revenue Retention: _______%
Rule of 40: _______

SECTION 4: TRANSACTION
Check Size Sought: $_________
Deal Type: [ ] Growth Buyout [ ] Recap [ ] Growth Capital
Ownership %: _______%
Expected Timeline: ___________
Use of Proceeds: _________________________

SECTION 5: CONTACT
Primary Contact: _________________________
Title: _________________________
Email: _________________________
Phone: _________________________

SECTION 6: STATUS
NDA Executed: [ ] Yes [ ] No [ ] Pending
Data Room Access: [ ] Yes [ ] No [ ] Pending
Initial Priority: [ ] P0 [ ] P1 [ ] P2 [ ] P3

Assigned To: _________________________
Intake Complete Date: ___________
═══════════════════════════════════════════════════════════
```

### 8.2 Triage Scorecard

```
VERTICA THESIS TRIAGE SCORECARD
Company: _________________ Date: _______ Owner: _________________

THE VERTICAL FIT (Select primary):
[ ] Inside Sales Excellence (VERTICAL A)
[ ] Customer Success Cadence (VERTICAL B)
[ ] Product-Led Growth Transition (VERTICAL C)
[ ] Vertical SaaS Expansion (VERTICAL D)
[ ] None / Other (explain): _________________________

SCORING (1=Poor, 5=Excellent):

1. Thesis Alignment (25%): ___/5
   Notes: _________________________

2. ARR Range Fit (20%): ___/5
   Target: $2M-$40M | Actual: $_____

3. Check Size Fit (15%): ___/5
   Target: $10M-$100M | Sought: $_____

4. Deal Type Fit (15%): ___/5
   Target: GB/Recap/Growth | Type: ___________

5. Geography Fit (10%): ___/5
   Target: NA/UK/EU | Location: ___________

6. Timing/Process (10%): ___/5
   Notes: _________________________

7. Source Quality (5%): ___/5
   Source: ___________

WEIGHTED SCORE: _____/5.0

RED FLAGS (Check all that apply):
[ ] ARR outside range
[ ] Check size outside range
[ ] Active litigation
[ ] Regulatory issues
[ ] Key person risk
[ ] Declining TAM
[ ] Single point of failure
[ ] >50% customer concentration
[ ] Other: ___________

YELLOW FLAGS (Check all that apply):
[ ] >30% customer concentration
[ ] CEO never scaled past $10M
[ ] Recent senior departures
[ ] Declining NRR
[ ] Complex cap table
[ ] Bootstrapped only
[ ] Recent pricing changes
[ ] Other: ___________

RECOMMENDATION:
[ ] FAST-TRACK (Score 4.0+) → Managing Partner
[ ] SCREEN (Score 3.0-3.9) → Principal assignment
[ ] NURTURE (Score 2.0-2.9) → Quarterly check-in
[ ] PASS (Score <2.0 or red flags) → Archive

NEXT STEPS: _________________________
═══════════════════════════════════════════════════════════
```

### 8.3 Screening Call Guide

```
VERTICA SCREENING CALL GUIDE
Company: _________________ Date: _______ Principal: _________________

PRE-CALL PREP (15 min):
□ Review website, Crunchbase, LinkedIn
□ Check for existing CRM records
□ Prepare 3-5 tailored questions
□ Confirm call logistics

OPENING (5 min):
"Thanks for taking the time. Before we dive in, I'd love to hear 
in your own words what [Company] does and what prompted you to 
reach out to Vertica specifically."

SECTION 1: COMPANY OVERVIEW (10 min)
□ Founding story and key milestones
□ Product/service description
□ Key differentiators vs. competition
□ Current team size and structure

SECTION 2: FINANCIALS (15 min)
□ ARR: $_____ (LTM) | $_____ (Prior Year) | $_____ (2 Years Ago)
□ Growth rate: _____% YoY
□ Gross margin: _____%
□ Net revenue retention: _____%
□ CAC and payback period
□ Cash burn and runway (if applicable)

SECTION 3: MARKET & CUSTOMERS (15 min)
□ TAM/SAM/SOM estimates
□ Customer segmentation
□ Average ACV: $_____
□ Win rate: _____%
□ Top 3 competitors

SECTION 4: TEAM (10 min)
□ Founder/CEO background
□ Key leadership team
□ Planned hires
□ Culture assessment

SECTION 5: TRANSACTION (10 min)
□ Use of proceeds
□ Timeline
□ Other parties involved
□ Seller motivations
□ Valuation expectations

CLOSING (5 min):
"Thank you for the overview. Based on what we've discussed, here's 
what happens next..."

POST-CALL (30 min):
□ Complete scorecard
□ Write summary notes
□ Update CRM
□ Share with relevant OP
□ Schedule internal discussion

═══════════════════════════════════════════════════════════
```

### 8.4 Pass Letter Template

```
Subject: Vertica Capital - [Company Name]

Dear [Contact Name],

Thank you for taking the time to share information about [Company Name] 
with the Vertica Capital Partners team. We appreciate the opportunity 
to learn about your business.

After careful consideration, we have decided not to pursue this 
opportunity at this time. [SELECT ONE:]:

[Thesis version]: While [Company Name] is an interesting business, 
it falls outside our current investment thesis focused on [specific 
vertical/criteria].

[Timing version]: The current stage of [Company Name]'s development 
does not align with our target investment profile at this time.

[Capacity version]: Given our current pipeline and portfolio 
commitments, we do not have the bandwidth to give this opportunity 
the attention it deserves.

[Specific version]: [Custom explanation].

We wish you and the [Company Name] team continued success. Please 
feel free to keep us updated on your progress, and don't hesitate 
to reach out if circumstances change.

Best regards,

[Name]
Vertica Capital Partners
```

---

## 9. OPEN QUESTIONS

| Question | Owner | Due Date | Status |
|----------|-------|----------|--------|
| Should we implement an automated scoring algorithm? | Deal Ops | [DATE] | OPEN |
| How do we better track nurture deal conversion? | Deal Ops | [DATE] | OPEN |
| Should we create vertical-specific screening criteria? | Managing Partner | [DATE] | OPEN |
| What's the optimal screening call frequency per Principal? | Managing Partner | [DATE] | OPEN |
| How do we improve banker relationship tracking? | Principals | [DATE] | OPEN |

---

## APPENDIX A: THESIS DECISION TREE

```
                    ┌─────────────────┐
                    │  NEW DEAL       │
                    │  RECEIVED       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ ARR $2M-$40M?   │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │ NO                          │ YES
              ▼                             ▼
        ┌───────────┐               ┌─────────────────┐
        │ PASS      │               │ Check $10M-$100M?│
        │ (Range)   │               └────────┬────────┘
        └───────────┘                        │
                              ┌──────────────┴──────────────┐
                              │ NO                          │ YES
                              ▼                             ▼
                        ┌───────────┐               ┌─────────────────┐
                        │ PASS      │               │ NA/UK/EU?       │
                        │ (Range)   │               └────────┬────────┘
                        └───────────┘                        │
                                          ┌──────────────┴──────────────┐
                                          │ NO                          │ YES
                                          ▼                             ▼
                                    ┌───────────┐               ┌─────────────────┐
                                    │ PASS      │               │ Fits vertical?  │
                                    │ (Geo)     │               └────────┬────────┘
                                    └───────────┘                        │
                                                      ┌──────────────┴──────────────┐
                                                      │ NO                          │ YES
                                                      ▼                             ▼
                                                ┌───────────┐               ┌─────────────────┐
                                                │ PASS      │               │ Red flags?      │
                                                │ (Thesis)  │               └────────┬────────┘
                                                └───────────┘                        │
                                                                  ┌──────────────┴──────────────┐
                                                                  │ YES                         │ NO
                                                                  ▼                             ▼
                                                            ┌───────────┐               ┌─────────────────┐
                                                            │ PASS      │               │ OP available?   │
                                                            │ (Flags)   │               └────────┬────────┘
                                                            └───────────┘                        │
                                                                                  ┌──────────────┴──────────────┐
                                                                                  │ NO                          │ YES
                                                                                  ▼                             ▼
                                                                            ┌───────────┐               ┌─────────────────┐
                                                                            │ NURTURE   │               │ ACTIVE        │
                                                                            │ (Capacity)│               │ (Proceed)     │
                                                                            └───────────┘               └─────────────────┘
```

---

*Document Version: 1.0 | Last Updated: [DATE] | Next Review: [DATE+90]*
