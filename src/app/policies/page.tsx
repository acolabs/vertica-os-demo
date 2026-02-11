'use client';

import { useQuery } from '@tanstack/react-query';
import { useOrg } from '@/lib/hooks/use-org';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Lock,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Users,
  DollarSign,
  CheckCircle2,
  XCircle,
  Plus,
} from 'lucide-react';

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
  approval_required: { icon: ShieldCheck, color: 'text-blue-400', label: 'Approval Required' },
  auto_approve: { icon: CheckCircle2, color: 'text-emerald-400', label: 'Auto-Approve' },
  two_person: { icon: Users, color: 'text-amber-400', label: 'Two-Person Rule' },
  budget_limit: { icon: DollarSign, color: 'text-rose-400', label: 'Budget Limit' },
};

function PolicyCard({ policy }: { policy: Policy }) {
  const config = typeConfig[policy.type] || { icon: Shield, color: 'text-zinc-400', label: policy.type };
  const Icon = config.icon;
  const rules = typeof policy.rules === 'string' ? JSON.parse(policy.rules) : policy.rules;

  return (
    <Card className="border-zinc-800 bg-zinc-900/50 hover:bg-zinc-900/80 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-zinc-800 ${config.color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base text-white">{policy.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs border-zinc-700">
                  {config.label}
                </Badge>
                {policy.scope && (
                  <Badge variant="outline" className="text-xs border-zinc-700 text-zinc-400">
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
                <span className="h-2 w-2 rounded-full bg-zinc-600" />
                <span className="text-xs text-zinc-500">Disabled</span>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {Object.entries(rules).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">{key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</span>
              <span className="text-zinc-200 font-mono text-xs">
                {typeof value === 'object' ? JSON.stringify(value) : String(value)}
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
            <Lock className="h-6 w-6 text-blue-400" />
            Policies
          </h1>
          <p className="text-zinc-400 mt-1">
            Governance rules and approval workflows
          </p>
        </div>
        <Button
          variant="outline"
          className="border-zinc-700 hover:bg-zinc-800"
          onClick={() => {
            // Demo placeholder
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Policy
        </Button>
      </div>

      {/* Summary Banner */}
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-zinc-300">
                  <span className="font-semibold text-white">{policies?.length || 0}</span> active policies
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-400" />
                <span className="text-sm text-zinc-300">
                  All agent actions governed
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span className="text-sm text-zinc-300">
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
            <Card key={i} className="border-zinc-800 bg-zinc-900/50 h-48 animate-pulse" />
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
      <Card className="border-zinc-800 bg-zinc-900/50">
        <CardHeader>
          <CardTitle className="text-base text-white">Policy Enforcement Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">251</p>
              <p className="text-xs text-zinc-400 mt-1">Total Actions Audited</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-400">100%</p>
              <p className="text-xs text-zinc-400 mt-1">Policy Compliance</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-white">0</p>
              <p className="text-xs text-zinc-400 mt-1">Policy Violations</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-400">3</p>
              <p className="text-xs text-zinc-400 mt-1">Escalations Triggered</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
