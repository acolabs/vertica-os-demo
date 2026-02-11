'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Shield, Headphones, FileText, Rocket } from 'lucide-react';

interface DeployDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const templates = [
  {
    name: 'Renewal Guardian',
    type: 'NRR Agent',
    description: 'Monitors renewal pipeline, detects churn signals, and recommends save plays for at-risk accounts.',
    icon: Shield,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
  {
    name: 'Support Autopilot',
    type: 'Support Agent',
    description: 'Automatically triages and resolves L1 support tickets using knowledge base and historical resolutions.',
    icon: Headphones,
    color: 'text-[var(--primary)]',
    bg: 'bg-[var(--primary-10)]',
  },
  {
    name: 'Board Pack Generator',
    type: 'Reporting Agent',
    description: 'Compiles weekly board-ready reports from all connected data sources with executive summaries.',
    icon: FileText,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10',
  },
];

export function DeployDialog({ open, onOpenChange }: DeployDialogProps) {
  const handleDeploy = (name: string) => {
    toast.success('Agent deployment initiated', {
      description: `${name} will be active within 2 minutes.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[var(--surface)] border-[var(--card-border)] sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[var(--text-primary)]">Deploy New Agent</DialogTitle>
          <DialogDescription className="text-[var(--text-secondary)]">
            Choose an agent template to deploy to your organization.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 mt-2">
          {templates.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.name}
                className="flex items-start gap-3 p-3 rounded-lg border border-[var(--card-border)] bg-zinc-900/50 hover:bg-zinc-900/80 transition-colors"
              >
                <div className={`p-2 rounded-lg ${t.bg} flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${t.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[var(--text-primary)]">{t.name}</span>
                    <Badge variant="outline" className="text-[10px] border-zinc-700 text-[var(--text-secondary)]">
                      {t.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">{t.description}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleDeploy(t.name)}
                  className="flex-shrink-0 bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--text-primary)] text-xs"
                >
                  <Rocket className="w-3 h-3 mr-1" />
                  Deploy
                </Button>
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
