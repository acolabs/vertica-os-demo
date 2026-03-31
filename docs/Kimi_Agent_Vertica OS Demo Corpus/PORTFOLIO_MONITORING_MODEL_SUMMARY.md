# VERTICA PORTFOLIO MONITORING MODEL - EXECUTIVE SUMMARY

**Version:** 2.0  
**Date:** [Current Date]  
**Context:** Growth-Stage Software ($2M-$40M ARR)  
**Classification:** Internal Use Only

---

## DELIVERABLES OVERVIEW

This package contains the complete Portfolio Monitoring Operating Model for Vertica, including:

| Document | Filename | Purpose |
|----------|----------|---------|
| **DOC 09** | `DOC_09_Portfolio_Monitoring_Early_Warning_SOP.md` | KPI thresholds, anomaly workflows, escalation protocols |
| **DOC 10** | `DOC_10_Board_Pack_Generator_Standard.md` | Board pack automation standards and templates |
| **Summary** | `PORTFOLIO_MONITORING_MODEL_SUMMARY.md` | This executive overview document |

---

## KEY FRAMEWORK COMPONENTS

### 1. KPI MONITORING FRAMEWORK (VPMF v2.0)

**KPI Categories:**
- **Financial Health:** ARR, NRR, GRR, Burn Multiple, Cash Runway, Gross Margin, Rule of 40
- **Growth Velocity:** YoY ARR Growth, Net New ARR, New Logo ARR, Expansion ARR, Sales Velocity
- **Unit Economics:** CAC, LTV/CAC Ratio, CAC Payback, Magic Number
- **Operational Efficiency:** Headcount Efficiency, R&D/S&M/G&A Spend %

**Priority Levels:**
- **P0 (Critical):** Weekly/Monthly monitoring, automatic escalation triggers
- **P1 (Important):** Monthly/Quarterly monitoring, review required for red flags
- **P2 (Standard):** Monthly monitoring, informational

### 2. ANOMALY DETECTION METHODS

**Statistical Methods:**
- 3-Sigma Rule: Flag values >3 std dev from 6-month rolling mean
- Z-Score Tracking: |z| > 2.5 triggers review
- Sequential Analysis: CUSUM for cumulative deviation detection
- Trend Break Detection: Linear regression slope change >30%

**Business Logic Rules:**
- Sequential Decline: 3+ months of negative growth
- Threshold Breach: KPI crosses stage-appropriate red/yellow thresholds
- Variance Analysis: Actual vs. Plan variance >15%
- Peer Comparison: Bottom quartile vs. portfolio benchmark

### 3. EARLY WARNING THRESHOLDS BY STAGE

| KPI | Seed+ ($2M-$5M) | Series A ($5M-$15M) | Series B ($15M-$40M) |
|-----|-----------------|---------------------|----------------------|
| ARR Growth YoY | >100% / 50-100% / <50% | >80% / 40-80% / <40% | >60% / 30-60% / <30% |
| NRR | >110% / 100-110% / <100% | >115% / 105-115% / <105% | >120% / 110-120% / <110% |
| GRR | >90% / 85-90% / <85% | >92% / 88-92% / <88% | >95% / 90-95% / <90% |
| Burn Multiple | <1.5x / 1.5-2.5x / >2.5x | <1.0x / 1.0-2.0x / >2.0x | <0.75x / 0.75-1.5x / >1.5x |
| Cash Runway | >18mo / 12-18mo / <12mo | >18mo / 12-18mo / <12mo | >24mo / 18-24mo / <18mo |
| LTV/CAC | >3.0x / 2.0-3.0x / <2.0x | >3.5x / 2.5-3.5x / <2.5x | >4.0x / 3.0-4.0x / <3.0x |
| Magic Number | >0.75 / 0.5-0.75 / <0.5 | >0.85 / 0.6-0.85 / <0.6 | >1.0 / 0.75-1.0 / <0.75 |

### 4. BOARD PACK AUTOMATION

| Pack Type | Frequency | Automation | Generation Time | Distribution |
|-----------|-----------|------------|-----------------|--------------|
| **Weekly Flash** | Friday 5pm ET | 100% | <5 min | Internal Vertica only |
| **Monthly Board Pack** | T-5 days | 70% | 6 hours | Board + Management |
| **Quarterly Deep Dive** | T-10 days | 60% | 16 hours | Full Board + Extended |

### 5. INTERVENTION WORKFLOW LEVELS

| Level | Trigger | Response | Owner | Escalation |
|-------|---------|----------|-------|------------|
| **L1: Monitoring** | YELLOW P0 KPI | Enhanced monitoring | Associate/Analyst | 30 days |
| **L2: Active Support** | RED P0 KPI | Coaching, resources | Principal/VP | 45 days |
| **L3: Formal Intervention** | Multiple RED / Runway <6mo | VIEP, improvement plan | Partner | 60 days |
| **L4: Crisis Management** | Runway <3mo / Severe distress | Direct involvement | Managing Partner | Weekly board calls |

### 6. ESCALATION PACKET (VIEP) STRUCTURE

| Section | Content | Owner | Length |
|---------|---------|-------|--------|
| 1. Executive Brief | Issue, impact, recommendations | Partner | 1 page |
| 2. KPI Forensics | Detailed analysis, trends, root cause | Analyst | 3 pages |
| 3. Context Gathering | Management perspective, external factors | Partner | 2 pages |
| 4. Scenario Analysis | Base/Downside/Upside scenarios | Analyst + CFO | 2 pages |
| 5. Intervention Options | Menu with pros/cons | Partner | 2 pages |
| 6. Decision Matrix | Criteria-weighted options | Partner | 1 page |

**SLA Requirements:**
- Packet Generation: 48 hours from trigger
- Initial Review: 72 hours from trigger
- Decision Meeting: 5 business days from trigger
- Action Implementation: 10 business days from decision

---

## SYNTHETIC PORTFOLIO EXAMPLES

### PORTCO_1 (Series A, $8M ARR) - YELLOW Status
- ARR Growth: 45% (YELLOW - declining trend)
- NRR: 108% (YELLOW)
- Cash Runway: 10.3 months (YELLOW)
- Action: Enhanced monitoring activated

### PORTCO_2 (Series B, $28M ARR) - RED Status
- ARR Growth: 22% (RED - below 30% threshold)
- NRR: 118% (GREEN)
- Cash Runway: 16 months (YELLOW)
- Action: Active support activated for ARR growth

### PORTCO_3 (Seed+, $3.5M ARR) - YELLOW Status
- ARR Growth: 125% (GREEN)
- Cash Runway: 11 months (RED)
- Action: Enhanced monitoring with cash focus

---

## IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Weeks 1-4)
- [ ] Deploy KPI tracking infrastructure
- [ ] Configure threshold monitoring engine
- [ ] Train team on SOPs
- [ ] Pilot with 3 portfolio companies

### Phase 2: Automation (Weeks 5-8)
- [ ] Implement automated data collection
- [ ] Deploy anomaly detection algorithms
- [ ] Generate first automated weekly flash reports
- [ ] Refine thresholds based on initial data

### Phase 3: Scale (Weeks 9-12)
- [ ] Roll out to full portfolio
- [ ] Implement board pack automation
- [ ] Train portfolio companies on data submission
- [ ] Establish regular review cadence

### Phase 4: Optimization (Ongoing)
- [ ] Refine thresholds based on performance
- [ ] Enhance automation coverage
- [ ] Incorporate machine learning for anomaly detection
- [ ] Continuous improvement of intervention playbooks

---

## SUCCESS METRICS

| Category | Metric | Target |
|----------|--------|--------|
| **Detection** | Time to anomaly detection | <24 hours |
| **Detection** | False positive rate | <10% |
| **Response** | Escalation packet generation | <48 hours |
| **Response** | Intervention decision time | <5 days |
| **Quality** | Board pack error rate | <1% |
| **Quality** | Board satisfaction score | >4.0/5.0 |
| **Efficiency** | Weekly flash generation | <5 minutes |
| **Efficiency** | Monthly pack generation | <6 hours |

---

## KEY DIFFERENTIATORS

1. **Stage-Appropriate Thresholds:** Tailored KPI expectations for Seed+, Series A, and Series B companies
2. **Multi-Signal Anomaly Detection:** Statistical + business logic rules for robust detection
3. **Graduated Intervention Framework:** Four levels of response matched to severity
4. **High Automation:** 60-100% automation depending on pack type
5. **Structured Escalation:** Clear VIEP format with SLA requirements
6. **Synthetic Data Examples:** Concrete illustrations for training and reference

---

## DOCUMENT CROSS-REFERENCES

| Topic | DOC 09 Section | DOC 10 Section |
|-------|----------------|----------------|
| KPI Thresholds | Section 6 | Section 6 |
| Anomaly Detection | Section 5.2 | N/A |
| Escalation Workflows | Section 5.3 | N/A |
| VIEP Structure | Section 5.4, 8.3 | N/A |
| Board Pack Contents | N/A | Section 6 |
| Automation Framework | Section 5.1 | Section 5 |
| Templates | Section 8 | Section 9 |

---

**END OF SUMMARY**
