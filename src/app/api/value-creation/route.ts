import { NextRequest, NextResponse } from 'next/server';

interface Milestone {
  id: string;
  name: string;
  owner: string;
  status: 'complete' | 'in-progress' | 'not-started';
  dueDay: number;
}

interface Phase {
  id: string;
  name: string;
  label: string;
  dayRange: [number, number];
  accent: string;
  progress: number;
  milestones: Milestone[];
  gate: string;
  gateStatus: 'passed' | 'in-progress' | 'locked';
}

interface KpiMetric {
  metric: string;
  baseline: string;
  current: string;
  target: string;
  status: 'on-track' | 'at-risk' | 'behind';
}

interface Intervention {
  id: string;
  name: string;
  type: string;
  owner: string;
  startDate: string;
  targetDate: string;
  progress: number;
  impactProjection: number;
  status: 'active' | 'paused' | 'complete';
}

interface CadenceItem {
  day: string;
  dayLabel: string;
  meeting: string;
  duration: string;
  time: string;
  attendees: string[];
}

interface CompanyPlan {
  companyId: string;
  companyName: string;
  status: 'on-track' | 'at-risk' | 'behind';
  currentDay: number;
  phases: Phase[];
  kpis: KpiMetric[];
  interventions: Intervention[];
  cadence: CadenceItem[];
}

const dsnPlan: CompanyPlan = {
  companyId: 'org_dsn',
  companyName: 'DSN Software',
  status: 'on-track',
  currentDay: 45,
  phases: [
    {
      id: 'assess',
      name: 'ASSESS',
      label: 'Phase 1',
      dayRange: [0, 30],
      accent: 'blue',
      progress: 100,
      gateStatus: 'passed',
      gate: '>=80% completion required to unlock Phase 2',
      milestones: [
        { id: 'm1', name: 'CRM audit & financial reconciliation', owner: 'Operating Partner', status: 'complete', dueDay: 7 },
        { id: 'm2', name: 'Stakeholder mapping (1:1s with leadership)', owner: 'VP Ops', status: 'complete', dueDay: 10 },
        { id: 'm3', name: 'Customer immersion (top 10 calls)', owner: 'VP CS', status: 'complete', dueDay: 14 },
        { id: 'm4', name: 'Sales process audit', owner: 'VP Sales', status: 'complete', dueDay: 18 },
        { id: 'm5', name: 'Talent assessment', owner: 'CHRO', status: 'complete', dueDay: 21 },
        { id: 'm6', name: 'Technical architecture review', owner: 'CTO', status: 'complete', dueDay: 25 },
        { id: 'm7', name: '30-day assessment report', owner: 'Operating Partner', status: 'complete', dueDay: 30 },
      ],
    },
    {
      id: 'intervene',
      name: 'INTERVENE',
      label: 'Phase 2',
      dayRange: [31, 60],
      accent: 'purple',
      progress: 52,
      gateStatus: 'in-progress',
      gate: 'Quick wins delivering, new comp in market, pipeline >70% confidence',
      milestones: [
        { id: 'm8', name: 'Quick wins execution — $500K+ impact targets', owner: 'VP Revenue', status: 'in-progress', dueDay: 40 },
        { id: 'm9', name: 'Comp plan redesign', owner: 'VP Sales + CHRO', status: 'in-progress', dueDay: 45 },
        { id: 'm10', name: 'Sales process redesign', owner: 'VP Sales', status: 'not-started', dueDay: 50 },
        { id: 'm11', name: 'Pipeline reset & data hygiene', owner: 'Rev Ops', status: 'in-progress', dueDay: 48 },
        { id: 'm12', name: 'Talent upgrades — hire 2 AEs', owner: 'CHRO', status: 'in-progress', dueDay: 55 },
        { id: 'm13', name: 'Systems/tools overhaul — CRM migration', owner: 'Rev Ops', status: 'not-started', dueDay: 58 },
      ],
    },
    {
      id: 'scale',
      name: 'SCALE',
      label: 'Phase 3',
      dayRange: [61, 90],
      accent: 'green',
      progress: 0,
      gateStatus: 'locked',
      gate: 'All KPIs trending positive, team >80% productivity',
      milestones: [
        { id: 'm14', name: 'Playbook development (5+ playbooks)', owner: 'Enablement', status: 'not-started', dueDay: 70 },
        { id: 'm15', name: 'Onboarding program launch', owner: 'Enablement', status: 'not-started', dueDay: 72 },
        { id: 'm16', name: 'Territory optimization', owner: 'Rev Ops', status: 'not-started', dueDay: 78 },
        { id: 'm17', name: 'Forecast discipline — 80%+ accuracy', owner: 'CRO', status: 'not-started', dueDay: 82 },
        { id: 'm18', name: 'Customer success integration', owner: 'VP CS', status: 'not-started', dueDay: 88 },
      ],
    },
  ],
  kpis: [
    { metric: 'Pipeline Coverage', baseline: '1.8x', current: '2.9x', target: '3.5x', status: 'on-track' },
    { metric: 'Win Rate', baseline: '15%', current: '19%', target: '25%', status: 'on-track' },
    { metric: 'Forecast Accuracy', baseline: '\u00b135%', current: '\u00b122%', target: '\u00b110%', status: 'on-track' },
    { metric: 'Sales Cycle', baseline: '95 days', current: '82 days', target: '75 days', status: 'on-track' },
    { metric: 'Rep Productivity', baseline: '45% quota', current: '58% quota', target: '80% quota', status: 'at-risk' },
    { metric: 'NRR', baseline: '102%', current: '108%', target: '115%', status: 'on-track' },
  ],
  interventions: [
    {
      id: 'int1',
      name: 'Pipeline Coverage Reset',
      type: 'Pipeline Reset',
      owner: 'VP Revenue',
      startDate: '2025-01-15',
      targetDate: '2025-02-28',
      progress: 68,
      impactProjection: 1200000,
      status: 'active',
    },
    {
      id: 'int2',
      name: 'Variable Comp Restructure',
      type: 'Comp Redesign',
      owner: 'VP Sales + CHRO',
      startDate: '2025-01-20',
      targetDate: '2025-02-15',
      progress: 45,
      impactProjection: 800000,
      status: 'active',
    },
    {
      id: 'int3',
      name: 'AE Hiring Sprint (2 hires)',
      type: 'Talent Upgrade',
      owner: 'CHRO',
      startDate: '2025-01-22',
      targetDate: '2025-03-01',
      progress: 35,
      impactProjection: 600000,
      status: 'active',
    },
    {
      id: 'int4',
      name: 'CRM Data Hygiene & Migration',
      type: 'Process Redesign',
      owner: 'Rev Ops',
      startDate: '2025-02-01',
      targetDate: '2025-03-15',
      progress: 20,
      impactProjection: 400000,
      status: 'active',
    },
    {
      id: 'int5',
      name: 'Discovery Call Framework',
      type: 'Process Redesign',
      owner: 'VP Sales',
      startDate: '2025-02-10',
      targetDate: '2025-03-10',
      progress: 0,
      impactProjection: 350000,
      status: 'paused',
    },
  ],
  cadence: [
    { day: 'mon', dayLabel: 'Monday', meeting: 'Pipeline Review', duration: '60 min', time: '9:00 AM', attendees: ['VP Sales', 'Rev Ops', 'AEs'] },
    { day: 'tue', dayLabel: 'Tuesday', meeting: '1:1s with Leadership', duration: '30 min each', time: '10:00 AM', attendees: ['Operating Partner', 'Each Direct Report'] },
    { day: 'wed', dayLabel: 'Wednesday', meeting: 'Team Standup + Enablement', duration: '45 min', time: '9:00 AM', attendees: ['Full GTM Team'] },
    { day: 'thu', dayLabel: 'Thursday', meeting: 'Forecast Call', duration: '60 min', time: '2:00 PM', attendees: ['CRO', 'VP Sales', 'Rev Ops', 'Finance'] },
    { day: 'fri', dayLabel: 'Friday', meeting: 'Deal Inspection + Week Closeout', duration: '60 min', time: '3:00 PM', attendees: ['VP Sales', 'AEs', 'Operating Partner'] },
  ],
};

const campspotPlan: CompanyPlan = {
  companyId: 'org_campspot',
  companyName: 'Campspot',
  status: 'on-track',
  currentDay: 20,
  phases: [
    {
      id: 'assess',
      name: 'ASSESS',
      label: 'Phase 1',
      dayRange: [0, 30],
      accent: 'blue',
      progress: 65,
      gateStatus: 'in-progress',
      gate: '>=80% completion required to unlock Phase 2',
      milestones: [
        { id: 'm1', name: 'CRM audit & financial reconciliation', owner: 'Operating Partner', status: 'complete', dueDay: 7 },
        { id: 'm2', name: 'Stakeholder mapping (1:1s with leadership)', owner: 'VP Ops', status: 'complete', dueDay: 10 },
        { id: 'm3', name: 'Customer immersion (top 10 calls)', owner: 'VP CS', status: 'in-progress', dueDay: 14 },
        { id: 'm4', name: 'Sales process audit', owner: 'VP Sales', status: 'complete', dueDay: 18 },
        { id: 'm5', name: 'Talent assessment', owner: 'CHRO', status: 'complete', dueDay: 21 },
        { id: 'm6', name: 'Technical architecture review', owner: 'CTO', status: 'in-progress', dueDay: 25 },
        { id: 'm7', name: '30-day assessment report', owner: 'Operating Partner', status: 'not-started', dueDay: 30 },
      ],
    },
    {
      id: 'intervene',
      name: 'INTERVENE',
      label: 'Phase 2',
      dayRange: [31, 60],
      accent: 'purple',
      progress: 0,
      gateStatus: 'locked',
      gate: 'Quick wins delivering, new comp in market, pipeline >70% confidence',
      milestones: [
        { id: 'm8', name: 'Quick wins execution — $500K+ impact targets', owner: 'VP Revenue', status: 'not-started', dueDay: 40 },
        { id: 'm9', name: 'Comp plan redesign', owner: 'VP Sales + CHRO', status: 'not-started', dueDay: 45 },
        { id: 'm10', name: 'Sales process redesign', owner: 'VP Sales', status: 'not-started', dueDay: 50 },
        { id: 'm11', name: 'Pipeline reset & data hygiene', owner: 'Rev Ops', status: 'not-started', dueDay: 48 },
        { id: 'm12', name: 'Talent upgrades — hire 2 AEs', owner: 'CHRO', status: 'not-started', dueDay: 55 },
        { id: 'm13', name: 'Systems/tools overhaul — CRM migration', owner: 'Rev Ops', status: 'not-started', dueDay: 58 },
      ],
    },
    {
      id: 'scale',
      name: 'SCALE',
      label: 'Phase 3',
      dayRange: [61, 90],
      accent: 'green',
      progress: 0,
      gateStatus: 'locked',
      gate: 'All KPIs trending positive, team >80% productivity',
      milestones: [
        { id: 'm14', name: 'Playbook development (5+ playbooks)', owner: 'Enablement', status: 'not-started', dueDay: 70 },
        { id: 'm15', name: 'Onboarding program launch', owner: 'Enablement', status: 'not-started', dueDay: 72 },
        { id: 'm16', name: 'Territory optimization', owner: 'Rev Ops', status: 'not-started', dueDay: 78 },
        { id: 'm17', name: 'Forecast discipline — 80%+ accuracy', owner: 'CRO', status: 'not-started', dueDay: 82 },
        { id: 'm18', name: 'Customer success integration', owner: 'VP CS', status: 'not-started', dueDay: 88 },
      ],
    },
  ],
  kpis: [
    { metric: 'Pipeline Coverage', baseline: '2.1x', current: '2.4x', target: '3.5x', status: 'on-track' },
    { metric: 'Win Rate', baseline: '18%', current: '19%', target: '28%', status: 'on-track' },
    { metric: 'Forecast Accuracy', baseline: '\u00b140%', current: '\u00b136%', target: '\u00b112%', status: 'on-track' },
    { metric: 'Sales Cycle', baseline: '110 days', current: '105 days', target: '80 days', status: 'on-track' },
    { metric: 'Rep Productivity', baseline: '40% quota', current: '43% quota', target: '75% quota', status: 'on-track' },
    { metric: 'NRR', baseline: '98%', current: '100%', target: '112%', status: 'on-track' },
  ],
  interventions: [
    {
      id: 'int1',
      name: 'Revenue Operations Assessment',
      type: 'Process Redesign',
      owner: 'Operating Partner',
      startDate: '2025-01-25',
      targetDate: '2025-02-10',
      progress: 60,
      impactProjection: 500000,
      status: 'active',
    },
    {
      id: 'int2',
      name: 'Customer Health Scoring',
      type: 'Pipeline Reset',
      owner: 'VP CS',
      startDate: '2025-01-28',
      targetDate: '2025-02-20',
      progress: 30,
      impactProjection: 350000,
      status: 'active',
    },
  ],
  cadence: [
    { day: 'mon', dayLabel: 'Monday', meeting: 'Pipeline Review', duration: '60 min', time: '9:00 AM', attendees: ['VP Sales', 'Rev Ops', 'AEs'] },
    { day: 'tue', dayLabel: 'Tuesday', meeting: '1:1s with Leadership', duration: '30 min each', time: '10:00 AM', attendees: ['Operating Partner', 'Each Direct Report'] },
    { day: 'wed', dayLabel: 'Wednesday', meeting: 'Team Standup + Enablement', duration: '45 min', time: '9:00 AM', attendees: ['Full GTM Team'] },
    { day: 'thu', dayLabel: 'Thursday', meeting: 'Forecast Call', duration: '60 min', time: '2:00 PM', attendees: ['CRO', 'VP Sales', 'Rev Ops', 'Finance'] },
    { day: 'fri', dayLabel: 'Friday', meeting: 'Deal Inspection + Week Closeout', duration: '60 min', time: '3:00 PM', attendees: ['VP Sales', 'AEs', 'Operating Partner'] },
  ],
};

const condoControlPlan: CompanyPlan = {
  companyId: 'org_condocontrol',
  companyName: 'Condo Control',
  status: 'at-risk',
  currentDay: 65,
  phases: [
    {
      id: 'assess',
      name: 'ASSESS',
      label: 'Phase 1',
      dayRange: [0, 30],
      accent: 'blue',
      progress: 100,
      gateStatus: 'passed',
      gate: '>=80% completion required to unlock Phase 2',
      milestones: [
        { id: 'm1', name: 'CRM audit & financial reconciliation', owner: 'Operating Partner', status: 'complete', dueDay: 7 },
        { id: 'm2', name: 'Stakeholder mapping (1:1s with leadership)', owner: 'VP Ops', status: 'complete', dueDay: 10 },
        { id: 'm3', name: 'Customer immersion (top 10 calls)', owner: 'VP CS', status: 'complete', dueDay: 14 },
        { id: 'm4', name: 'Sales process audit', owner: 'VP Sales', status: 'complete', dueDay: 18 },
        { id: 'm5', name: 'Talent assessment', owner: 'CHRO', status: 'complete', dueDay: 21 },
        { id: 'm6', name: 'Technical architecture review', owner: 'CTO', status: 'complete', dueDay: 25 },
        { id: 'm7', name: '30-day assessment report', owner: 'Operating Partner', status: 'complete', dueDay: 30 },
      ],
    },
    {
      id: 'intervene',
      name: 'INTERVENE',
      label: 'Phase 2',
      dayRange: [31, 60],
      accent: 'purple',
      progress: 78,
      gateStatus: 'passed',
      gate: 'Quick wins delivering, new comp in market, pipeline >70% confidence',
      milestones: [
        { id: 'm8', name: 'Quick wins execution — $500K+ impact targets', owner: 'VP Revenue', status: 'complete', dueDay: 40 },
        { id: 'm9', name: 'Comp plan redesign', owner: 'VP Sales + CHRO', status: 'complete', dueDay: 45 },
        { id: 'm10', name: 'Sales process redesign', owner: 'VP Sales', status: 'complete', dueDay: 50 },
        { id: 'm11', name: 'Pipeline reset & data hygiene', owner: 'Rev Ops', status: 'complete', dueDay: 48 },
        { id: 'm12', name: 'Talent upgrades — hire 2 AEs', owner: 'CHRO', status: 'in-progress', dueDay: 55 },
        { id: 'm13', name: 'Systems/tools overhaul — CRM migration', owner: 'Rev Ops', status: 'in-progress', dueDay: 58 },
      ],
    },
    {
      id: 'scale',
      name: 'SCALE',
      label: 'Phase 3',
      dayRange: [61, 90],
      accent: 'green',
      progress: 18,
      gateStatus: 'in-progress',
      gate: 'All KPIs trending positive, team >80% productivity',
      milestones: [
        { id: 'm14', name: 'Playbook development (5+ playbooks)', owner: 'Enablement', status: 'in-progress', dueDay: 70 },
        { id: 'm15', name: 'Onboarding program launch', owner: 'Enablement', status: 'not-started', dueDay: 72 },
        { id: 'm16', name: 'Territory optimization', owner: 'Rev Ops', status: 'not-started', dueDay: 78 },
        { id: 'm17', name: 'Forecast discipline — 80%+ accuracy', owner: 'CRO', status: 'not-started', dueDay: 82 },
        { id: 'm18', name: 'Customer success integration', owner: 'VP CS', status: 'not-started', dueDay: 88 },
      ],
    },
  ],
  kpis: [
    { metric: 'Pipeline Coverage', baseline: '1.5x', current: '2.8x', target: '3.2x', status: 'on-track' },
    { metric: 'Win Rate', baseline: '12%', current: '20%', target: '22%', status: 'on-track' },
    { metric: 'Forecast Accuracy', baseline: '\u00b142%', current: '\u00b118%', target: '\u00b110%', status: 'on-track' },
    { metric: 'Sales Cycle', baseline: '120 days', current: '88 days', target: '70 days', status: 'at-risk' },
    { metric: 'Rep Productivity', baseline: '38% quota', current: '55% quota', target: '80% quota', status: 'at-risk' },
    { metric: 'NRR', baseline: '96%', current: '107%', target: '118%', status: 'on-track' },
  ],
  interventions: [
    {
      id: 'int1',
      name: 'Pipeline Coverage Reset',
      type: 'Pipeline Reset',
      owner: 'VP Revenue',
      startDate: '2024-12-20',
      targetDate: '2025-02-15',
      progress: 92,
      impactProjection: 1500000,
      status: 'active',
    },
    {
      id: 'int2',
      name: 'Variable Comp Restructure',
      type: 'Comp Redesign',
      owner: 'VP Sales + CHRO',
      startDate: '2024-12-28',
      targetDate: '2025-01-30',
      progress: 100,
      impactProjection: 900000,
      status: 'complete',
    },
    {
      id: 'int3',
      name: 'AE Hiring Sprint (2 hires)',
      type: 'Talent Upgrade',
      owner: 'CHRO',
      startDate: '2025-01-05',
      targetDate: '2025-02-20',
      progress: 50,
      impactProjection: 700000,
      status: 'active',
    },
    {
      id: 'int4',
      name: 'CRM Data Hygiene & Migration',
      type: 'Process Redesign',
      owner: 'Rev Ops',
      startDate: '2025-01-15',
      targetDate: '2025-02-28',
      progress: 65,
      impactProjection: 450000,
      status: 'active',
    },
    {
      id: 'int5',
      name: 'Sales Playbook v1',
      type: 'Process Redesign',
      owner: 'Enablement',
      startDate: '2025-02-01',
      targetDate: '2025-03-01',
      progress: 25,
      impactProjection: 300000,
      status: 'active',
    },
    {
      id: 'int6',
      name: 'Customer Onboarding Revamp',
      type: 'Process Redesign',
      owner: 'VP CS',
      startDate: '2025-02-10',
      targetDate: '2025-03-15',
      progress: 10,
      impactProjection: 250000,
      status: 'paused',
    },
  ],
  cadence: [
    { day: 'mon', dayLabel: 'Monday', meeting: 'Pipeline Review', duration: '60 min', time: '9:00 AM', attendees: ['VP Sales', 'Rev Ops', 'AEs'] },
    { day: 'tue', dayLabel: 'Tuesday', meeting: '1:1s with Leadership', duration: '30 min each', time: '10:00 AM', attendees: ['Operating Partner', 'Each Direct Report'] },
    { day: 'wed', dayLabel: 'Wednesday', meeting: 'Team Standup + Enablement', duration: '45 min', time: '9:00 AM', attendees: ['Full GTM Team'] },
    { day: 'thu', dayLabel: 'Thursday', meeting: 'Forecast Call', duration: '60 min', time: '2:00 PM', attendees: ['CRO', 'VP Sales', 'Rev Ops', 'Finance'] },
    { day: 'fri', dayLabel: 'Friday', meeting: 'Deal Inspection + Week Closeout', duration: '60 min', time: '3:00 PM', attendees: ['VP Sales', 'AEs', 'Operating Partner'] },
  ],
};

const plans: Record<string, CompanyPlan> = {
  org_dsn: dsnPlan,
  org_campspot: campspotPlan,
  org_condocontrol: condoControlPlan,
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get('company_id');

  if (companyId && plans[companyId]) {
    return NextResponse.json({ plan: plans[companyId] });
  }

  return NextResponse.json({
    companies: Object.values(plans).map(p => ({
      companyId: p.companyId,
      companyName: p.companyName,
      status: p.status,
      currentDay: p.currentDay,
    })),
    plans: Object.values(plans),
  });
}
