# WAVE 2 & 4: COMP & TALENT OPERATING MODEL + DOCS

## COMP & TALENT OPERATING MODEL

---

### SECTION 1: AE/SDR COMP PLAN FRAMEWORK

#### 1.1 Vertica Compensation Design Principles (Evidence-Based)

| Principle | Specification | Rationale |
|-----------|---------------|-----------|
| **OTE Split** | 50/50 (Base/Variable) | Cornerstone of SaaS comp design |
| **Quota:OTE Ratio** | 5x "Golden Ratio" | Single most indicative factor for success |
| **Commission Rate** | 10% at 100% attainment | Derived from 5x ratio (1/5 = 20% of variable = 10% of OTE) |
| **Quota Attainment Distribution** | 60-70% hit 100% quota | Validates plan achievability |
| **Accelerator Threshold** | Post-100% attainment | Rewards overperformance |
| **Accelerator Rate** | 1.5x base rate (e.g., 10% → 15%) | Meaningful upside without plan distortion |
| **Ramping Period** | 3-9 months | Aligned to sales cycle complexity |
| **Multi-Year Contract Incentive** | +2% on TCV | Encourages contract term optimization |

#### 1.2 Quota:OTE Validation Matrix

| Role Level | OTE | Quota (5x) | Base Salary | Variable | Commission Rate @ 100% | Commission Rate @ 150% |
|------------|-----|------------|-------------|----------|------------------------|------------------------|
| **SDR I** | $80K | $400K SQL Pipeline | $40K | $40K | 10% of pipe generated | 15% of pipe generated |
| **SDR II** | $100K | $500K SQL Pipeline | $50K | $50K | 10% of pipe generated | 15% of pipe generated |
| **AE I (Inbound)** | $120K | $600K ARR | $60K | $60K | 10% of ARR | 15% of ARR |
| **AE II (Mid-Market)** | $160K | $800K ARR | $80K | $80K | 10% of ARR | 15% of ARR |
| **AE III (Enterprise)** | $200K | $1.0M ARR | $100K | $100K | 10% of ARR | 15% of ARR |
| **Sr AE (Strategic)** | $250K | $1.25M ARR | $125K | $125K | 10% of ARR | 15% of ARR |
| **Principal AE** | $300K | $1.5M ARR | $150K | $150K | 10% of ARR | 15% of ARR |

#### 1.3 Commission Calculation Formula

```
BASE COMMISSION RATE = Variable Component / Quota
                     = (OTE × 0.50) / (OTE × 5)
                     = 0.50 / 5
                     = 10%

EXAMPLE (AE III - $200K OTE, $1M Quota):
┌─────────────────────────────────────────────────────────────┐
│ Base Salary:        $100,000 (50% of OTE)                   │
│ Variable/Target:    $100,000 (50% of OTE)                   │
│ Quota:              $1,000,000 ARR                          │
│ Base Commission:    10% ($100K / $1M)                       │
│                                                             │
│ AT 100% ATTAINMENT:                                         │
│   Commission = $1,000,000 × 10% = $100,000                  │
│   Total Comp = $100,000 (base) + $100,000 (comm) = $200,000 │
│                                                             │
│ AT 150% ATTAINMENT (with 1.5x accelerator):                 │
│   First $1M:     $1,000,000 × 10% = $100,000                │
│   Next $500K:    $500,000 × 15% = $75,000                   │
│   Total Commission = $175,000                               │
│   Total Comp = $100,000 + $175,000 = $275,000               │
│   Effective Rate = $275K / $1.5M = 18.3% of ARR             │
└─────────────────────────────────────────────────────────────┘
```

#### 1.4 Multi-Year Contract Incentive Structure

| Contract Term | Base Commission | TCV Bonus | Total Rate |
|---------------|-----------------|-----------|------------|
| 1-Year | 10% | 0% | 10% |
| 2-Year | 10% | +2% on TCV | ~11.8% effective |
| 3-Year | 10% | +2% on TCV | ~12.5% effective |

**Example (3-Year, $100K ACV):**
- TCV = $300K
- Base Commission = $100K × 10% = $10K
- TCV Bonus = $300K × 2% = $6K
- Total Commission = $16K (16% effective on first year)

#### 1.5 SDR Comp Plan Variants

**Option A: SQL-Based (Recommended for Early Stage)**
| Metric | Weight | Payout Trigger |
|--------|--------|----------------|
| Qualified SQLs | 60% | MQL → SQL conversion + BANT qualification |
| SQL-to-Meeting Held | 25% | Meeting completed within 14 days |
| Pipeline Influenced | 15% | Opps created from SQLs within 90 days |

**Option B: Sourced ARR (For Mature SDR Teams)**
| Metric | Weight | Payout Trigger |
|--------|--------|----------------|
| Sourced ARR | 70% | Closed-won deals from SDR-sourced opps |
| Qualified SQLs | 20% | Quality gate to prevent volume gaming |
| Activity Metrics | 10% | Calls, emails (minimum thresholds) |

**SDR Quota Calculation:**
```
If AE Quota = $1M ARR
And SDR:AE Ratio = 2:1
And SDR Sourcing Rate = 40% of AE pipeline

Then SDR Sourced ARR Quota = $1M × 40% / 2 = $200K per SDR
Or SQL Pipeline Quota = $400K (using 5x ratio)
```

---

### SECTION 2: HIRING PLAN STRUCTURE

#### 2.1 Role Progression Framework

```
                    PRINCIPAL AE ($300K OTE)
                           ↑
                    3-5 years enterprise exp
                           
                    SR AE - STRATEGIC ($250K OTE)
                           ↑
                    2-4 years + whale exp
                           
    AE III - ENTERPRISE ($200K OTE) ←── HIRE HERE FOR ENTERPRISE
                           ↑
                    2-3 years + $100K+ deals
                           
    AE II - MID-MARKET ($160K OTE) ←── HIRE HERE FOR GROWTH
                           ↑
                    1-2 years + consistent attainment
                           
    AE I - INBOUND/DR ($120K OTE) ←── HIRE HERE FOR VOLUME
                           ↑
                    0-1 years + SDR background
                           
    SDR II ($100K OTE) ←──── SDR I ($80K OTE)
```

#### 2.2 Hiring Timing & Triggers

| Trigger Event | Role to Hire | Timing | Rationale |
|---------------|--------------|--------|-----------|
| **Pipeline > 4x AE Capacity** | AE (any level) | Immediate | Capacity constraint |
| **AE at >80% Quota for 2+ Qtrs** | Promote + Backfill | Next quarter | Performance-based growth |
| **New Market/Geo Launch** | Sr AE + SDR Pair | 3 months pre-launch | Market development |
| **Product Line Expansion** | AE II/III + Solutions Engineer | 2 months pre-launch | Technical sales capacity |
| **SDR:AE Ratio > 3:1** | SDR | Immediate | Lead flow balance |
| **SDR Attrition > 20%** | SDR + Retention Review | Immediate | Capacity protection |

#### 2.3 Hiring Velocity Model

| Stage | Duration | Cumulative |
|-------|----------|------------|
| Req Approval | 3-5 days | 3-5 days |
| Sourcing & Screening | 2-3 weeks | 3-4 weeks |
| Phone Screen (Recruiter) | 30 min | - |
| Hiring Manager Screen | 45 min | 4-5 weeks |
| Panel Interview (3-4 people) | 2-3 hours | 5-6 weeks |
| Case Study/Presentation | 2-3 hours prep + 1 hour | 6-7 weeks |
| Final Interview (VP/CRO) | 45 min | 7-8 weeks |
| Reference Checks | 3-5 days | 8-9 weeks |
| Offer & Negotiation | 3-5 days | 9-10 weeks |
| Notice Period | 2-4 weeks | 11-14 weeks |
| **Total Time-to-Productivity** | | **3-4 months** |

#### 2.4 Headcount Planning Formula

```
REQUIRED AEs = (Target ARR - Existing AE Capacity) / Average AE Productivity

Where:
- Existing AE Capacity = Sum of (AE OTE × 5 × Expected Attainment %)
- Average AE Productivity = OTE × 5 × 0.65 (using 65% average attainment)

EXAMPLE:
Target ARR = $10M
Existing AE Capacity = $6M (from 5 AEs at various levels)
Gap = $4M
Average AE Productivity = $200K × 5 × 0.65 = $650K
Required New AEs = $4M / $650K = 6.15 → 6 new AEs

REQUIRED SDRs = Required AEs × SDR:AE Ratio × (1 + Attrition Buffer)
              = 6 × 2.5 × 1.15 = 17.25 → 18 SDRs
```

---

### SECTION 3: RAMP PLAN METHODOLOGY

#### 3.1 Ramp Period by Role & Sales Cycle

| Role | Sales Cycle | Ramp Duration | Full Quota Month |
|------|-------------|---------------|------------------|
| SDR | N/A (activity-based) | 3 months | Month 4 |
| AE I (Inbound/DR) | 30-60 days | 4 months | Month 5 |
| AE II (Mid-Market) | 60-90 days | 6 months | Month 7 |
| AE III (Enterprise) | 90-180 days | 9 months | Month 10 |
| Sr AE (Strategic) | 180+ days | 9 months | Month 10 |

#### 3.2 Progressive Quota Ramp Structure

**AE III Example (9-Month Ramp to $1M Quota):**

| Month | Ramp % | Quota | OTE Guarantee | Draw Available |
|-------|--------|-------|---------------|----------------|
| 1 | 0% | $0 | 100% OTE | Full salary |
| 2 | 0% | $0 | 100% OTE | Full salary |
| 3 | 10% | $100K | 100% OTE | Full salary |
| 4 | 25% | $250K | 100% OTE | Full salary |
| 5 | 40% | $400K | 100% OTE | Full salary |
| 6 | 60% | $600K | 90% OTE | 50% variable draw |
| 7 | 75% | $750K | 75% OTE | Commission only |
| 8 | 90% | $900K | 50% OTE | Commission only |
| 9 | 100% | $1M | 0% OTE | Commission only |
| 10+ | 100% | $1M | 0% OTE | Commission only |

#### 3.3 Ramp Compensation Mechanics

**Draw Structure Options:**

| Draw Type | Description | Best For |
|-----------|-------------|----------|
| **Non-Recoverable Draw** | Guaranteed pay, not clawed back | Early-stage, high-risk hires |
| **Recoverable Draw** | Advanced against future commissions | Established teams, lower risk |
| **Hybrid Draw** | Non-recoverable months 1-3, recoverable 4-6 | Balanced approach |

**Example Hybrid Draw (AE III - $200K OTE):**
```
Months 1-3:  $16,667/mo guaranteed (non-recoverable)
Months 4-6:  $15,000/mo draw (recoverable from future commissions)
Months 7-9:  Commission-only with 50% OTE floor
Month 10+:   Full commission, no guarantee
```

#### 3.4 Ramp Success Metrics

| Month | Leading Indicators | Lagging Indicators |
|-------|-------------------|-------------------|
| 1-2 | Training completion, activity volume | N/A |
| 3-4 | Pipeline created, meetings held | Early stage opps |
| 5-6 | Pipeline coverage (3x), stage progression | SQL→Opp conversion |
| 7-8 | Late-stage pipeline, proposal volume | Win rate trending |
| 9 | Full pipeline coverage, forecast accuracy | Attainment % vs ramp quota |

---

### SECTION 4: RETENTION FRAMEWORK

#### 4.1 Retention Risk Indicators

| Risk Level | Indicator | Action |
|------------|-----------|--------|
| **Low** | 80-100% quota, 2+ years tenure | Standard 1:1s, career pathing |
| **Medium** | 60-80% quota, 1-2 years tenure | Performance plan, coaching |
| **High** | <60% quota for 2+ quarters | PIP or exit planning |
| **Critical** | Top performer + market calls + LinkedIn active | Immediate retention conversation |

#### 4.2 Retention Intervention Playbook

| Trigger | Intervention | Owner | Timeline |
|---------|--------------|-------|----------|
| Missed quota 1 quarter | Performance coaching | Manager | 30 days |
| Missed quota 2 quarters | Formal PIP | Manager + HR | 60 days |
| Top 10% performer | Retention check-in | VP Sales | Quarterly |
| LinkedIn "Open to Work" | Immediate 1:1 | Manager | 48 hours |
| Comp below market 15%+ | Comp review | HR + Finance | 30 days |
| No promotion path 2+ years | Career discussion | Manager + VP | 30 days |

#### 4.3 Retention Economics

| Cost Item | Amount | Notes |
|-----------|--------|-------|
| Cost to replace AE | $150K-300K | 50-150% of OTE |
| Lost productivity (ramp) | $200K-400K | 6-9 months at 50% |
| Lost deals in flight | $100K-500K | Pipeline value at risk |
| Team morale impact | Immeasurable | Cascade effect |
| **Total Cost of Attrition** | **$450K-1.2M per AE** | |

**Retention Investment ROI:**
```
If $20K retention investment (comp adjustment, spot bonus, etc.)
Prevents 1 AE departure
Saves $450K-1.2M
ROI = 2,150% - 5,900%
```

#### 4.4 Career Pathing Framework

| Current Role | Next Role | Timeline | Requirements |
|--------------|-----------|----------|--------------|
| SDR I | SDR II | 12-18 months | 100% quota 2+ quarters |
| SDR II | AE I | 18-24 months | 120% quota, AE shadowing |
| AE I | AE II | 18-24 months | 100% quota, deal size progression |
| AE II | AE III | 24-36 months | 110% quota, enterprise exposure |
| AE III | Sr AE | 24-36 months | 100% quota, strategic wins |
| Sr AE | Sales Manager | 36-48 months | 120% quota, leadership aptitude |

---

### SECTION 5: QUOTA:OTE SANITY CHECKS & VALIDATION

#### 5.1 The 5x Golden Ratio Validation

```
VALIDATION CHECKLIST:
☐ Quota = 5x OTE (±10% tolerance)
☐ Commission rate = 10% at 100% (derived from 5x)
☐ 60-70% of team can realistically hit 100%
☐ Top performer can earn 1.5-2x OTE with accelerators
☐ Bottom performer still earns 0.5-0.75x OTE at 50% attainment
☐ Plan is mathematically sound (no negative scenarios)
```

#### 5.2 Common Quota:OTE Failure Modes

| Failure Mode | Symptom | Root Cause | Fix |
|--------------|---------|------------|-----|
| **Over-quota** | <40% hit rate | Quota >6x OTE | Reduce quota or increase OTE |
| **Under-quota** | >90% hit rate | Quota <4x OTE | Increase quota or reduce OTE |
| **Sandbagging** | Q4 spikes | Annual accelerators only | Add quarterly kicker |
| **Deal cherry-picking** | Small deals only | No deal size incentive | Add TCV bonus or tiered rates |
| **Territory gaming** | AE complaints | Unequal territory value | Territory balancing exercise |

#### 5.3 Market Benchmark Validation

| Metric | Your Plan | Market Range | Status |
|--------|-----------|--------------|--------|
| OTE:Quota Ratio | 1:5 | 1:4.5 - 1:6 | ✓ Valid |
| 50/50 Split | 50/50 | 50/50 - 60/40 | ✓ Valid |
| Accelerator Threshold | 100% | 100% - 110% | ✓ Valid |
| Accelerator Multiplier | 1.5x | 1.25x - 2x | ✓ Valid |
| Ramp Period | 6-9 months | 3-12 months | ✓ Valid |

---

## DOC 07 — AE/SDR COMP & QUOTA DESIGN TOOLKIT

---

### DOCUMENT HEADER

| Field | Value |
|-------|-------|
| **Document ID** | DOC 07 |
| **Title** | AE/SDR Comp & Quota Design Toolkit |
| **Version** | 1.0 |
| **Last Updated** | [Date] |
| **Owner** | VP Sales / RevOps |
| **Review Cycle** | Annual + Trigger-based |

---

### 1. PURPOSE

This toolkit provides a standardized methodology and set of templates for designing, validating, and implementing AE and SDR compensation plans that align with Vertica's proven compensation principles. It ensures:

- Mathematical soundness of all comp plans
- Consistent application of the 5x quota:OTE "golden ratio"
- Proper accelerator and ramp structures
- Defensible plans to candidates and existing team members
- Clear documentation for finance, HR, and executive approval

**Primary Use Cases:**
- New hire comp plan design
- Annual comp plan refresh
- Promotion comp adjustments
- Territory/realignment comp changes
- Market competitiveness reviews

---

### 2. AUDIENCE

| Role | Usage |
|------|-------|
| **VP Sales / CRO** | Final approval, executive communication |
| **Sales Managers** | Plan input, team communication, validation |
| **RevOps** | Plan modeling, system configuration, reporting |
| **Finance** | Budget validation, accrual modeling, variance analysis |
| **HR/People** | Offer creation, compliance, market benchmarking |
| **Hiring Managers** | Offer negotiation, candidate communication |

---

### 3. INPUTS

#### 3.1 Required Inputs

| Input | Source | Format |
|-------|--------|--------|
| Target OTE | Market data + budget | Dollar amount |
| Role level & expectations | Job architecture | Level definition |
| Sales cycle length | Historical data | Days/months |
| Average deal size | Historical data | Dollar amount |
| Territory/segment assignment | Territory planning | Assignment matrix |
| Company ARR target | Financial plan | Annual/quarterly |
| AE capacity model | Capacity planning | Headcount × productivity |

#### 3.2 Market Benchmark Inputs

| Source | Data Points |
|--------|-------------|
| SaaS comp surveys (Carta, Pave, etc.) | OTE by level, geo, segment |
| Peer company intelligence | Comp plan structures |
| Recruiter feedback | Candidate expectations |
| Exit interview data | Why people leave |

---

### 4. OUTPUTS

#### 4.1 Primary Outputs

| Output | Description | Distribution |
|--------|-------------|--------------|
| Comp Plan Summary | One-page plan overview | Candidate, AE, file |
| Quota Assignment Letter | Formal quota notification | AE, manager, HR |
| Commission Calculator | Spreadsheet for modeling | RevOps, Finance |
| Plan Approval Doc | Executive sign-off | Leadership, Board |
| Ramp Schedule | Month-by-month progression | AE, manager |

#### 4.2 System Outputs

| Output | System | Purpose |
|--------|--------|---------|
| Commission rules | CRM/Comp system | Automated calculation |
| Quota assignments | CRM/BI | Tracking & reporting |
| Attainment dashboards | BI tool | Real-time visibility |
| Payroll files | HRIS | Payment processing |

---

### 5. STEP-BY-STEP SOP

#### Step 1: Define Role & Level (Week 1, Day 1-2)

**Action:** Determine the appropriate role level based on:
- Expected deal size
- Sales cycle complexity
- Account count
- Experience requirements

**Decision Matrix:**
| Factor | SDR I/II | AE I | AE II | AE III | Sr AE |
|--------|----------|------|-------|--------|-------|
| Deal Size | N/A | <$25K | $25-75K | $75-250K | $250K+ |
| Sales Cycle | N/A | <60 days | 60-90 days | 90-180 days | 180+ days |
| Accounts | N/A | 50+ | 25-50 | 10-25 | <10 |
| Experience | 0-2 yrs | 0-2 yrs | 1-3 yrs | 2-5 yrs | 4+ yrs |

**Output:** Role level designation

---

#### Step 2: Set OTE (Week 1, Day 2-3)

**Action:** Determine target OTE using market data and internal equity

**Formula:**
```
OTE = Market 50th percentile × Geo adjustment × Company stage adjustment

Example:
Market 50th (AE III, SF) = $190K
Geo adjustment (SF = 1.0) = 1.0
Stage adjustment (Growth = +5%) = 1.05
Target OTE = $190K × 1.0 × 1.05 = $200K
```

**Validation:**
- [ ] Within budget
- [ ] Internally equitable (same level = same OTE)
- [ ] Market competitive (40th-60th percentile)

**Output:** OTE amount

---

#### Step 3: Calculate Quota (Week 1, Day 3-4)

**Action:** Apply the 5x golden ratio

**Formula:**
```
Quota = OTE × 5

Example:
OTE = $200,000
Quota = $200,000 × 5 = $1,000,000 ARR
```

**Validation Checks:**
| Check | Calculation | Target | Status |
|-------|-------------|--------|--------|
| Quota:OTE Ratio | $1M / $200K | 5.0x | ✓ Pass |
| Commission Rate | $100K / $1M | 10% | ✓ Pass |
| Historical Attainment | N/A | 60-70% @ 100% | Validate |

**Output:** Quota amount

---

#### Step 4: Design Commission Structure (Week 1, Day 4-5)

**Action:** Define base rate, accelerators, and modifiers

**Base Structure:**
```
Base Commission Rate = Variable / Quota
                     = $100,000 / $1,000,000
                     = 10%
```

**Accelerator Design:**
| Attainment Tier | Rate | Description |
|-----------------|------|-------------|
| 0-100% | 10% | Base rate |
| 100-125% | 15% | 1.5x accelerator |
| 125-150% | 20% | 2x accelerator |
| 150%+ | 25% | 2.5x accelerator (cap optional) |

**Modifiers:**
| Modifier | Application | Rate |
|----------|-------------|------|
| Multi-year (2+ years) | TCV | +2% |
| New logo | First-year ACV | +2% |
| Self-sourced | Sourced vs fed | +1% |

**Output:** Commission structure documentation

---

#### Step 5: Build Ramp Plan (Week 2, Day 1-2)

**Action:** Define progressive quota and guarantee structure

**Ramp Duration Formula:**
```
Ramp Months = Sales Cycle (days) / 30 × 1.5

Example:
Sales Cycle = 120 days
Ramp Months = 120 / 30 × 1.5 = 6 months
```

**Progressive Quota Table:**
| Month | Ramp % | Quota | Guarantee |
|-------|--------|-------|-----------|
| 1 | 0% | $0 | 100% |
| 2 | 0% | $0 | 100% |
| 3 | 25% | $250K | 100% |
| 4 | 50% | $500K | 75% |
| 5 | 75% | $750K | 50% |
| 6 | 100% | $1M | 0% |

**Output:** Ramp schedule

---

#### Step 6: Model Scenarios (Week 2, Day 2-3)

**Action:** Test plan across performance scenarios

**Scenario Model:**
| Scenario | Attainment | Commission | Total Comp | vs OTE |
|----------|------------|------------|------------|--------|
| Floor (termination) | 0% | $0 | $100,000 | 50% |
| Poor | 50% | $50,000 | $150,000 | 75% |
| Below Target | 75% | $75,000 | $175,000 | 88% |
| Target | 100% | $100,000 | $200,000 | 100% |
| Above Target | 125% | $143,750 | $243,750 | 122% |
| Star | 150% | $200,000 | $300,000 | 150% |
| Unicorn | 200% | $350,000 | $450,000 | 225% |

**Validation:**
- [ ] Floor is survivable (50% OTE minimum)
- [ ] Target is achievable (60-70% hit rate expected)
- [ ] Star is motivating (1.5x OTE possible)
- [ ] Unicorn doesn't break the bank

**Output:** Scenario model

---

#### Step 7: Executive Approval (Week 2, Day 4-5)

**Action:** Present for approval with supporting analysis

**Approval Package:**
1. Comp plan summary (1 page)
2. Scenario model
3. Budget impact (best/base/worst case)
4. Market benchmark comparison
5. Risk assessment

**Approval Signatures:**
| Role | Signature | Date |
|------|-----------|------|
| VP Sales | _____________ | _______ |
| CFO | _____________ | _______ |
| CEO | _____________ | _______ |

**Output:** Approved plan

---

#### Step 8: System Configuration (Week 3)

**Action:** Configure in CRM and commission systems

**Configuration Checklist:**
- [ ] Quota assignments loaded
- [ ] Commission rules programmed
- [ ] Accelerator tiers defined
- [ ] Modifier logic configured
- [ ] Attainment calculations tested
- [ ] Dashboards built
- [ ] Payroll integration verified

**Output:** Live system configuration

---

#### Step 9: Communication (Week 3-4)

**Action:** Roll out to team with clear documentation

**Communication Package:**
1. All-hands announcement (if plan change)
2. Individual comp plan meetings
3. Written plan documentation
4. Commission calculator access
5. FAQ document

**Output:** Informed and aligned team

---

### 6. KPIs

#### 6.1 Plan Health KPIs

| KPI | Target | Measurement |
|-----|--------|-------------|
| Quota Attainment Distribution | 60-70% @ 100%+ | % of team at each tier |
| Average Attainment | 75-85% | Weighted average |
| Median Attainment | 90-100% | Middle performer |
| Pay Mix Variance | <10% | Actual vs target pay mix |
| Commission Accuracy | >99% | Correct / Total payments |
| Dispute Rate | <5% | Disputes / Total payments |

#### 6.2 Business Impact KPIs

| KPI | Target | Measurement |
|-----|--------|-------------|
| CAC Payback | <12 months | Sales cost / New ARR |
| Sales Efficiency | >1.0 | New ARR / Sales cost |
| AE Productivity | 4-6x OTE | ARR / OTE |
| Ramp to Quota | Per plan | Months to 100% attainment |
| Attrition Rate | <15% annual | Departures / Average HC |

#### 6.3 Reporting Cadence

| Report | Frequency | Audience |
|--------|-----------|----------|
| Attainment Dashboard | Real-time | AEs, Managers |
| Commission Statements | Monthly | AEs, Finance |
| Plan Health Review | Quarterly | VP Sales, CFO |
| Market Benchmark | Annual | HR, Leadership |

---

### 7. FAILURE MODES

#### 7.1 Design Failures

| Failure | Symptom | Detection | Resolution |
|---------|---------|-----------|------------|
| **Over-quota** | <40% hit 100% | Monthly tracking | Reduce quota 10-15% |
| **Under-quota** | >90% hit 100% | Monthly tracking | Increase quota 10-15% |
| **Bad math** | Payouts don't match plan | Commission audit | Fix formula, true-up |
| **Gaming** | Behavioral distortions | Deal analysis | Add guardrails |

#### 7.2 Implementation Failures

| Failure | Symptom | Detection | Resolution |
|---------|---------|-----------|------------|
| **System error** | Wrong calculations | Commission disputes | Fix config, true-up |
| **Data quality** | Missing attributions | Attribution disputes | Data cleanup process |
| **Timing issue** | Late payments | Payment delays | Process improvement |
| **Communication gap** | Confusion, disputes | AE questions | Better documentation |

#### 7.3 Market Failures

| Failure | Symptom | Detection | Resolution |
|---------|---------|-----------|------------|
| **Below market** | Can't hire, high attrition | Recruiting data, exit ints | Market adjustment |
| **Above market** | Budget overrun | Cost analysis | Plan redesign |
| **Structurally misaligned** | Wrong behaviors | Performance patterns | Structure change |

---

### 8. TEMPLATES

#### Template 8.1: Comp Plan Summary (One-Pager)

```
╔══════════════════════════════════════════════════════════════════════╗
║                    COMPENSATION PLAN SUMMARY                         ║
║                         [Employee Name]                              ║
║                         [Date] | [Plan Year]                         ║
╠══════════════════════════════════════════════════════════════════════╣
║ ROLE INFORMATION                                                     ║
║ Role: [AE III - Enterprise]                                          ║
║ Level: [L3]                                                          ║
║ Territory: [West Enterprise]                                         ║
║ Manager: [Name]                                                      ║
╠══════════════════════════════════════════════════════════════════════╣
║ ON-TARGET EARNINGS (OTE)                                             ║
║ Base Salary:           $100,000                                      ║
║ Target Variable:       $100,000                                      ║
║ ─────────────────────────────────                                    ║
║ Total OTE:             $200,000                                      ║
║ Split:                 50% Base / 50% Variable                       ║
╠══════════════════════════════════════════════════════════════════════╣
║ QUOTA                                                                ║
║ Annual Quota:          $1,000,000 ARR                                ║
║ Quarterly Quota:       $250,000 ARR                                  ║
║ Quota:OTE Ratio:       5.0x                                          ║
╠══════════════════════════════════════════════════════════════════════╣
║ COMMISSION STRUCTURE                                                 ║
║ Base Rate (0-100%):    10% of ARR                                    ║
║ Accelerator 1 (100-125%): 15% of ARR                                 ║
║ Accelerator 2 (125-150%): 20% of ARR                                 ║
║ Accelerator 3 (150%+): 25% of ARR                                    ║
║ ─────────────────────────────────                                    ║
║ Modifiers:                                                           ║
║ • Multi-year (2+ yr): +2% on TCV                                     ║
║ • New Logo: +2% on first-year ACV                                    ║
╠══════════════════════════════════════════════════════════════════════╣
║ EARNINGS EXAMPLES                                                    ║
║ 50% Attainment:        $150,000 total ($100K base + $50K comm)       ║
║ 100% Attainment:       $200,000 total ($100K base + $100K comm)      ║
║ 150% Attainment:       $275,000 total ($100K base + $175K comm)      ║
║ 200% Attainment:       $362,500 total ($100K base + $262.5K comm)    ║
╠══════════════════════════════════════════════════════════════════════╣
║ RAMP SCHEDULE                                                        ║
║ Months 1-2: 0% quota, 100% OTE guarantee                             ║
║ Month 3: 25% quota ($250K), 100% OTE guarantee                       ║
║ Month 4: 50% quota ($500K), 75% OTE guarantee                        ║
║ Month 5: 75% quota ($750K), 50% OTE guarantee                        ║
║ Month 6+: 100% quota ($1M), commission only                          ║
╠══════════════════════════════════════════════════════════════════════╣
║ ACKNOWLEDGMENT                                                     ║
║ Employee: _________________ Date: _______                            ║
║ Manager:  _________________ Date: _______                            ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

#### Template 8.2: Commission Calculator

| Input Field | Value | Formula/Note |
|-------------|-------|--------------|
| OTE | $200,000 | Input |
| Base % | 50% | Standard |
| Variable | $100,000 | OTE × Base % |
| Quota Multiple | 5x | Golden ratio |
| Quota | $1,000,000 | OTE × Multiple |
| Base Rate | 10% | Variable / Quota |

| Attainment % | ARR Closed | Commission | Total Comp |
|--------------|------------|------------|------------|
| 0% | $0 | $0 | $100,000 |
| 25% | $250,000 | $25,000 | $125,000 |
| 50% | $500,000 | $50,000 | $150,000 |
| 75% | $750,000 | $75,000 | $175,000 |
| 100% | $1,000,000 | $100,000 | $200,000 |
| 125% | $1,250,000 | $143,750 | $243,750 |
| 150% | $1,500,000 | $200,000 | $300,000 |
| 175% | $1,750,000 | $268,750 | $368,750 |
| 200% | $2,000,000 | $350,000 | $450,000 |

---

#### Template 8.3: Quota Assignment Letter

```
[Date]

[Employee Name]
[Title]
[Company]

RE: Quota Assignment - [Plan Year]

Dear [Employee Name],

This letter confirms your quota assignment for [Plan Year]:

ANNUAL QUOTA: $1,000,000 ARR
QUARTERLY BREAKDOWN:
  Q1: $200,000 (20% - ramp quarter)
  Q2: $250,000 (25%)
  Q3: $275,000 (27.5%)
  Q4: $275,000 (27.5%)

Your quota is based on:
• OTE of $200,000
• 5x quota:OTE ratio (company standard)
• Territory potential assessment
• Historical performance (if applicable)

Quota attainment is measured by:
• Closed-won ARR booked in your name
• Credit split per deal desk approval
• Net of churn/downgrades (if applicable)

Quota modifications require written approval from your VP of Sales.

Please acknowledge receipt and understanding by signing below.

Sincerely,

[VP Sales Name]
VP of Sales

─────────────────────────────────────
Employee Acknowledgment:

I acknowledge and understand my quota assignment.

Signature: _________________ Date: _______
```

---

#### Template 8.4: Plan Approval Checklist

| # | Check Item | Pass/Fail | Notes |
|---|------------|-----------|-------|
| 1 | Quota = 5x OTE (±10%) | ☐ | |
| 2 | 50/50 split (±5%) | ☐ | |
| 3 | Commission rate = 10% @ 100% | ☐ | |
| 4 | Accelerator threshold ≥100% | ☐ | |
| 5 | Accelerator rate 1.25-2x base | ☐ | |
| 6 | 60-70% can hit 100% (validated) | ☐ | |
| 7 | Floor earnings ≥50% OTE | ☐ | |
| 8 | Top performer can earn 1.5-2x OTE | ☐ | |
| 9 | Ramp period appropriate for cycle | ☐ | |
| 10 | Budget impact approved by Finance | ☐ | |
| 11 | Market competitive (benchmarked) | ☐ | |
| 12 | Internally equitable | ☐ | |
| 13 | System can calculate accurately | ☐ | |
| 14 | Legal/HR has reviewed | ☐ | |

**Approval:**
| Role | Signature | Date |
|------|-----------|------|
| RevOps | _____________ | _______ |
| Finance | _____________ | _______ |
| HR | _____________ | _______ |
| VP Sales | _____________ | _______ |
| CFO | _____________ | _______ |

---

### 9. OPEN QUESTIONS

| # | Question | Impact | Owner | Status |
|---|----------|--------|-------|--------|
| 1 | Should we cap total earnings? | Unicorn scenario cost | CFO | Open |
| 2 | How to handle multi-year renewals? | Commission timing | RevOps | Open |
| 3 | What's the clawback policy for churn? | Risk management | Legal | Open |
| 4 | Should SDRs have team quotas? | Collaboration vs individual | VP Sales | Open |
| 5 | How to handle territory reassignments mid-year? | Fairness | RevOps | Open |
| 6 | What's the SPIFF budget and approval process? | Plan governance | Finance | Open |
| 7 | Should we have a President's Club threshold? | Culture/recognition | VP Sales | Open |
| 8 | How to handle deal disputes between AEs? | Conflict resolution | VP Sales | Open |

---

## APPENDIX: COMP PLAN MODEL SUMMARY TEMPLATE

### Model: AE III Enterprise Comp Plan

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    COMP PLAN MODEL SUMMARY                              │
│                         AE III - ENTERPRISE                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  OTE & BASE STRUCTURE                                                   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  On-Target Earnings (OTE):        $200,000                      │   │
│  │  ├─ Base Salary (50%):            $100,000                      │   │
│  │  └─ Target Variable (50%):        $100,000                      │   │
│  │  Pay Frequency:                   Semi-monthly base / Monthly   │   │
│  │                                   commission                    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  QUOTA ASSIGNMENT                                                       │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Annual Quota:                    $1,000,000 ARR                │   │
│  │  Quota:OTE Ratio:                 5.0x [GOLDEN RATIO]           │   │
│  │  Quarterly Breakdown:                                           │   │
│  │    Q1: $250,000 (25%)                                           │   │
│  │    Q2: $250,000 (25%)                                           │   │
│  │    Q3: $250,000 (25%)                                           │   │
│  │    Q4: $250,000 (25%)                                           │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  COMMISSION STRUCTURE                                                   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Base Commission Rate:            10% (at 100% attainment)      │   │
│  │  Formula: Variable / Quota = $100K / $1M = 10%                  │   │
│  │                                                                   │   │
│  │  ACCELERATOR TIERS:                                               │   │
│  │  ┌──────────────┬─────────────┬────────────────────────────────┐ │   │
│  │  │ Attainment   │ Rate        │ Calculation                    │ │   │
│  │  ├──────────────┼─────────────┼────────────────────────────────┤ │   │
│  │  │ 0% - 100%    │ 10%         │ ARR × 10%                      │ │   │
│  │  │ 100% - 125%  │ 15%         │ Excess × 15%                   │ │   │
│  │  │ 125% - 150%  │ 20%         │ Excess × 20%                   │ │   │
│  │  │ 150%+        │ 25%         │ Excess × 25%                   │ │   │
│  │  └──────────────┴─────────────┴────────────────────────────────┘ │   │
│  │                                                                   │   │
│  │  MODIFIERS:                                                       │   │
│  │  • Multi-year (2+ years):         +2% on TCV                    │   │
│  │  • New Logo:                      +2% on first-year ACV         │   │
│  │  • Self-sourced opportunity:      +1% on ACV                    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  EARNINGS SCENARIOS                                                     │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Scenario      │ Attain │ ARR       │ Commission │ Total Comp  │   │
│  │  ─────────────────────────────────────────────────────────────  │   │
│  │  Floor         │ 0%     │ $0        │ $0         │ $100,000    │   │
│  │  Poor          │ 50%    │ $500K     │ $50,000    │ $150,000    │   │
│  │  Below Target  │ 75%    │ $750K     │ $75,000    │ $175,000    │   │
│  │  TARGET        │ 100%   │ $1.0M     │ $100,000   │ $200,000    │   │
│  │  Above Target  │ 125%   │ $1.25M    │ $143,750   │ $243,750    │   │
│  │  Star          │ 150%   │ $1.5M     │ $200,000   │ $300,000    │   │
│  │  Unicorn       │ 200%   │ $2.0M     │ $350,000   │ $450,000    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  RAMP SCHEDULE                                                          │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Month │ Ramp % │ Quota    │ OTE Guarantee │ Draw Type          │   │
│  │  ─────────────────────────────────────────────────────────────  │   │
│  │  1-2   │ 0%     │ $0       │ 100%          │ Non-recoverable    │   │
│  │  3     │ 25%    │ $250K    │ 100%          │ Non-recoverable    │   │
│  │  4     │ 50%    │ $500K    │ 75%           │ Recoverable        │   │
│  │  5     │ 75%    │ $750K    │ 50%           │ Recoverable        │   │
│  │  6     │ 100%   │ $1M      │ 0%            │ Commission-only    │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  VALIDATION CHECKLIST                                                   │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  [X] Quota:OTE = 5.0x (Golden Ratio achieved)                   │   │
│  │  [X] 50/50 split maintained                                       │   │
│  │  [X] Commission rate = 10% @ 100%                                 │   │
│  │  [X] 60-70% expected to hit 100% (validated with historicals)   │   │
│  │  [X] Floor earnings = 50% OTE (survivable)                      │   │
│  │  [X] Star performer can earn 1.5x OTE                           │   │
│  │  [X] Plan mathematically sound (no negative scenarios)          │   │
│  │  [X] Budget impact approved                                       │   │
│  │  [X] Market competitive                                           │   │
│  │  [X] System can calculate accurately                              │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  APPROVAL                                                               │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  Prepared by:     ___________________  Date: ___________        │   │
│  │  RevOps Review:   ___________________  Date: ___________        │   │
│  │  Finance Review:  ___________________  Date: ___________        │   │
│  │  HR Review:       ___________________  Date: ___________        │   │
│  │  VP Sales Approve:___________________  Date: ___________        │   │
│  │  CFO Approve:     ___________________  Date: ___________        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

### QUOTA:OTE LOGIC REFERENCE

```
THE GOLDEN RATIO FORMULA:
═══════════════════════════════════════════════════════════════════════

                    Quota = OTE × 5

Therefore:
                    Quota
                    ───── = 5
                     OTE

And:
                    Variable    OTE × 0.5     0.5
    Base Rate =    ───────── = ────────── = ───── = 10%
                      Quota     OTE × 5       5

═══════════════════════════════════════════════════════════════════════

VALIDATION TABLE:
┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────────────┐
│ OTE     │ Quota   │ Ratio   │ Base    │ Variable│ Commission Rate │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────────────┤
│ $80K    │ $400K   │ 5.0x    │ $40K    │ $40K    │ 10%             │
│ $100K   │ $500K   │ 5.0x    │ $50K    │ $50K    │ 10%             │
│ $120K   │ $600K   │ 5.0x    │ $60K    │ $60K    │ 10%             │
│ $160K   │ $800K   │ 5.0x    │ $80K    │ $80K    │ 10%             │
│ $200K   │ $1.0M   │ 5.0x    │ $100K   │ $100K   │ 10%             │
│ $250K   │ $1.25M  │ 5.0x    │ $125K   │ $125K   │ 10%             │
│ $300K   │ $1.5M   │ 5.0x    │ $150K   │ $150K   │ 10%             │
└─────────┴─────────┴─────────┴─────────┴─────────┴─────────────────┘

═══════════════════════════════════════════════════════════════════════
```

---

## SUMMARY

This Comp & Talent Operating Model and DOC 07 Toolkit provide:

1. **Evidence-based comp design** aligned with Vertica's proven principles
2. **Mathematical validation** through the 5x quota:OTE golden ratio
3. **Comprehensive templates** for plan creation and communication
4. **Structured SOP** for consistent implementation
5. **Failure mode detection** and resolution guidance
6. **Retention framework** to protect talent investment

All comp plans should be validated against the 5x ratio, 50/50 split, and 60-70% attainment distribution targets.

---

*Document Classification: Internal Use*
*Last Updated: [Current Date]*
*Next Review: Annual or Trigger-Based*
