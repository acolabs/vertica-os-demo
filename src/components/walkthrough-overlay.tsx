"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  BarChart3,
  CheckCircle,
  Shield,
  Zap,
  Bot,
  Clock,
  Target,
  ArrowRight,
  X,
  Inbox,
  ListTodo,
  BookOpen,
  FlaskConical,
  Calculator,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface WalkthroughStep {
  step: string;
  title: string;
  href: string;
  icon: LucideIcon;
  iconColor: string;
  summary: string;
  features: string[];
}

const steps: WalkthroughStep[] = [
  {
    step: "1",
    title: "Command Dashboard",
    href: "/dashboard",
    icon: Target,
    iconColor: "text-emerald-400",
    summary:
      "Real-time KPIs update continuously as agents process data from connected systems across your portfolio.",
    features: [
      "Live KPI cards with drill-down drawers",
      "90-day trend charts with agent deployment inflection",
      "Decision queue summary by severity",
      "Agent fleet status with activity sparklines",
    ],
  },
  {
    step: "2",
    title: "Decision Inbox",
    href: "/decisions",
    icon: Inbox,
    iconColor: "text-sky-400",
    summary:
      "The central hub where agent recommendations surface for human review. Every high-stakes action requires approval.",
    features: [
      "Prioritized queue with impact & confidence scores",
      "Evidence panel with linked CRM and support records",
      "Approve, reject, or escalate with full audit trail",
    ],
  },
  {
    step: "3",
    title: "Work Queues",
    href: "/queues",
    icon: ListTodo,
    iconColor: "text-amber-400",
    summary:
      "Operational queues organized by agent capability — each operator sees only what matters to them.",
    features: [
      "Revenue, Support, and Renewal queues",
      "Quick approve/reject from queue items",
      "Queue-level metrics and value at risk",
    ],
  },
  {
    step: "4",
    title: "Agent Fleet & Playbooks",
    href: "/playbooks",
    icon: Bot,
    iconColor: "text-purple-400",
    summary:
      "Monitor deployed agents and manage reusable templates that scale across the portfolio.",
    features: [
      "Live agent status with accuracy and value created",
      "Deployment stage indicators (shadow → auto)",
      "One-click deploy to any portfolio company",
    ],
  },
  {
    step: "5",
    title: "Evaluations & Replay",
    href: "/evaluations",
    icon: FlaskConical,
    iconColor: "text-pink-400",
    summary:
      "Validate agent accuracy on historical data before production deployment.",
    features: [
      "Precision, recall, and dollar value scorecards",
      "Before/after metric comparison",
      "Per-portfolio-company evaluation data",
    ],
  },
  {
    step: "6",
    title: "Governance & Audit",
    href: "/audit",
    icon: Shield,
    iconColor: "text-emerald-400",
    summary:
      "Immutable, hash-chained audit log for every agent action and approval.",
    features: [
      "SHA-256 hash-chained tamper-evident entries",
      "Policy gates with configurable approval rules",
      "CSV export for compliance review",
    ],
  },
  {
    step: "7",
    title: "Comp Simulator",
    href: "/simulator",
    icon: Calculator,
    iconColor: "text-orange-400",
    summary:
      "Interactive compensation modeling tool encoding proven sales economics frameworks.",
    features: [
      "7 adjustable inputs with real-time validation",
      "5x Quota-to-OTE rule with sweet-spot indicators",
      "Three-scenario comparison (conservative to stretch)",
    ],
  },
  {
    step: "8",
    title: "Analytics & Impact",
    href: "/analytics",
    icon: BarChart3,
    iconColor: "text-sky-400",
    summary:
      "Outcome dashboards attributing business impact directly to agent actions.",
    features: [
      "Total value created, agent cost, and ROI multiple",
      "Revenue impact and support efficiency charts",
      "Per-agent cost and acceptance rate table",
    ],
  },
];

export function WalkthroughOverlay() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (searchParams.get("welcome") === "true") {
      setVisible(true);
    }
  }, [searchParams]);

  const handleDismiss = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      setClosing(false);
      // Clean up the URL param
      router.replace("/dashboard", { scroll: false });
    }, 300);
  }, [router]);

  const handleNavigate = useCallback(
    (href: string) => {
      setVisible(false);
      router.push(href);
    },
    [router]
  );

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[9998] flex items-center justify-center transition-opacity duration-300",
        closing ? "opacity-0" : "opacity-100"
      )}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleDismiss}
      />

      {/* Modal */}
      <div
        className={cn(
          "relative z-10 w-full max-w-4xl max-h-[85vh] overflow-y-auto mx-4 rounded-2xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-2xl transition-all duration-300",
          closing ? "scale-95 opacity-0" : "scale-100 opacity-100"
        )}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-[var(--card-border)] bg-[var(--card-bg)]/95 backdrop-blur-md rounded-t-2xl">
          <div>
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              Welcome to Agent OS
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-0.5">
              A guided tour of the platform. Click any card to jump in.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[var(--surface)] transition-colors text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cards grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((step) => (
            <button
              key={step.step}
              onClick={() => handleNavigate(step.href)}
              className="group text-left p-4 rounded-xl border border-[var(--card-border)] bg-[var(--surface)] hover:border-[var(--primary)]/30 hover:bg-[var(--primary)]/[0.04] transition-all duration-200"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[var(--primary-10)] flex items-center justify-center shrink-0">
                  <step.icon className={cn("w-4 h-4", step.iconColor)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-[var(--text-muted)]">
                      {step.step}.
                    </span>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed mt-1.5">
                    {step.summary}
                  </p>
                  <div className="mt-2.5 space-y-1">
                    {step.features.map((f) => (
                      <div key={f} className="flex items-start gap-1.5">
                        <CheckCircle className="w-3 h-3 text-[var(--primary)] shrink-0 mt-0.5" />
                        <span className="text-[11px] text-[var(--text-muted)] leading-snug">
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--primary)] transition-colors shrink-0 mt-1" />
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex items-center justify-between px-6 py-4 border-t border-[var(--card-border)] bg-[var(--card-bg)]/95 backdrop-blur-md rounded-b-2xl">
          <p className="text-xs text-[var(--text-muted)]">
            Explore freely — every page is fully interactive
          </p>
          <button
            onClick={handleDismiss}
            className="inline-flex items-center justify-center h-9 px-5 rounded-lg bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-hover)] transition-colors"
          >
            Start Exploring
          </button>
        </div>
      </div>
    </div>
  );
}
