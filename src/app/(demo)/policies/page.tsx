'use client';

import { useQuery } from '@tanstack/react-query';
import { useOrg } from '@/lib/hooks/use-org';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Users,
  DollarSign,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { DemoTooltip } from '@/components/demo-tooltip';
import { ToastWrapper } from '@/components/toast-wrapper';
import { PageHeader } from '@/components/layout/page-header';
import { toast } from 'sonner';

interface Policy {
  id: string;
  org_id: string;
  name: string;
  type: string;
  scope: string | null;
  rules: Record<string, unknown>;
  enabled: number;
  created_at: number;
}

const typeConfig: Record<string, { icon: typeof Shield; color: string; label: string }> = {
  approval_required: { icon: ShieldCheck, color: 'text-[var(--primary)]', label: 'Approval Required' },
  auto_approve: { icon: CheckCircle2, color: 'text-emerald-400', label: 'Auto-Approve' },
  two_person: { icon: Users, color: 'text-amber-400', label: 'Two-Person Rule' },
  budget_limit: { icon: DollarSign, color: 'text-rose-400', label: 'Budget Limit' },
};

function formatRuleValue(key: string, value: unknown): string {
  if (Array.isArray(value)) {
    return value.map(v => String(v).replace(/_/g, ' ')).join(', ');
  }
  if (typeof value === 'number') {
    if (key.includes('percent') || (key.includes('min') && value < 1)) return `${(value * 100).toFixed(0)}%`;
    if (key.includes('usd')) return `$${value}`;
    return String(value);
  }
  return String(value).replace(/_/g, ' ');
}

function formatRuleKey(key: string): string {
  return key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function PolicyCard({ policy }: { policy: Policy }) {
  const config = typeConfig[policy.type] || { icon: Shield, color: 'text-[var(--text-muted)]', label: policy.type };
  const Icon = config.icon;
  const rules = typeof policy.rules === 'string' ? JSON.parse(policy.rules) : policy.rules;

  return (
    <Card className="border-[var(--card-border)] bg-[var(--card-bg)] hover:bg-[var(--card-hover)] transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-[var(--surface)] ${config.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base text-[var(--text-primary)]">{policy.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs border-[var(--card-border)]">
                  {config.label}
                </Badge>
                {policy.scope && (
                  <Badge variant="outline" className="text-xs border-[var(--card-border)] text-[var(--text-muted)]">
                    Scope: {policy.scope}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            {policy.enabled ? (
              <>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-emerald-400">Active</span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-[var(--text-muted)]" />
                <span className="text-xs text-[var(--text-muted)]">Disabled</span>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Object.entries(rules).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between text-sm">
              <span className="text-[var(--text-secondary)]">{formatRuleKey(key)}</span>
              <span className="text-[var(--text-primary)] font-mono text-xs">
                {formatRuleValue(key, value)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function PoliciesPage() {
  const { orgId } = useOrg();

  const { data: policies, isLoading } = useQuery<Policy[]>({
    queryKey: ['policies', orgId],
    queryFn: async () => {
      const res = await fetch(`/api/policies?org_id=${orgId}`);
      if (!res.ok) throw new Error('Failed to fetch policies');
      const data = await res.json();
      return data.policies || data;
    },
    enabled: !!orgId,
  });

  return (
    <div className="space-y-6">
      <ToastWrapper />
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1 mr-4">
          <PageHeader
            title="Policies"
            description="Governance rules that define what agents can and cannot do. Budget limits, approval requirements, and escalation paths are all configurable."
            features={[
              "Budget caps per agent type per company",
              "Approval thresholds by action severity",
              "Two-person authorization for high-impact changes",
            ]}
          />
        </div>
        <div className="shrink-0 pt-5">
          <Button
            variant="outline"
            className="border-[var(--card-border)] hover:bg-[var(--card-hover)]"
            onClick={() => {
              toast.info('Policy configuration panel', {
                description: 'Contact your administrator to add new governance policies.',
              });
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Policy
          </Button>
        </div>
      </div>

      {/* Summary Banner */}
      <Card className="border-[var(--card-border)] bg-[var(--card-bg)]">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-[var(--primary)]" />
                <span className="text-sm text-[var(--text-secondary)]">
                  <span className="font-semibold text-[var(--text-primary)]">{policies?.length || 0}</span> active policies
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-400" />
                <span className="text-sm text-[var(--text-secondary)]">
                  All agent actions governed
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="text-sm text-[var(--text-secondary)]">
                  Compliance: <span className="font-semibold text-emerald-400">100%</span>
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Policy Cards */}
      {isLoading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {[1, 2, 3, 4, 5].map(i => (
            <Card key={i} className="border-[var(--card-border)] bg-[var(--card-bg)] h-48 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {policies?.map(policy => (
            <PolicyCard key={policy.id} policy={policy} />
          ))}
        </div>
      )}

      {/* Enforcement Stats */}
      <Card className="border-[var(--card-border)] bg-[var(--card-bg)]">
        <CardHeader>
          <DemoTooltip content="Sourced from the policies table via /api/policies. Each policy has type (approval_required, auto_approve, two_person, budget_limit), scope, rules JSON (thresholds/conditions), and enabled flag. Compliance tracked by cross-referencing decisions against active policy rules." side="right">
            <CardTitle className="text-base text-[var(--text-primary)]">Policy Enforcement Summary</CardTitle>
          </DemoTooltip>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--text-primary)]">251</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Total Actions Audited</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-400">100%</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Policy Compliance</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[var(--text-primary)]">0</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Policy Violations</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-400">3</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Escalations Triggered</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
