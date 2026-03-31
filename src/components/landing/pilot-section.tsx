"use client";

import { cn } from "@/lib/utils";
import { useReveal } from "@/components/landing/hooks/use-reveal";

const phases = [
  {
    week: "Week 1",
    title: "Connect & Configure",
    description:
      "Connect your CRM, support, and billing systems. Configure policy gates and approval workflows.",
  },
  {
    week: "Week 2",
    title: "Deploy First Agents",
    description:
      "Launch churn prevention and support automation agents on your highest-priority portfolio company.",
  },
  {
    week: "Week 3",
    title: "Validate & Tune",
    description:
      "Review agent decisions, tune confidence thresholds, validate ROI attribution methodology.",
  },
  {
    week: "Week 4",
    title: "Full Portfolio Rollout",
    description:
      "Expand to full portfolio. Enable remaining agent types. Go live with executive dashboards.",
  },
];

export default function PilotSection() {
  const { ref, revealed } = useReveal();

  return (
    <section id="pilot" className="landing-section">
      <div ref={ref} className={cn("section-reveal", revealed && "revealed")}>
        {/* Section label */}
        <p className="text-xs uppercase tracking-wider text-[var(--primary)] font-mono mb-4">
          GET STARTED
        </p>

        {/* Headline */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text leading-tight">
          Live in 30 Days
        </h2>

        {/* Subtext */}
        <p className="max-w-2xl mt-4 text-[var(--text-secondary)] text-base md:text-lg leading-relaxed">
          We don&apos;t do 18-month implementations. Agent OS deploys
          alongside your existing stack.
        </p>

        {/* Timeline */}
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6 mt-12">
          {/* Connecting line on desktop */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-10 left-[calc(12.5%+16px)] right-[calc(12.5%+16px)] border-t-2 border-dashed border-[var(--primary)]/30"
          />

          {phases.map((phase, index) => (
            <div key={phase.title} className="landing-glass p-6 relative">
              {/* Phase number circle */}
              <div className="w-8 h-8 rounded-full bg-[var(--primary)]/20 text-[var(--primary)] flex items-center justify-center text-sm font-bold">
                {index + 1}
              </div>

              {/* Week label */}
              <p className="text-sm font-medium text-white mt-3">
                {phase.week}
              </p>

              {/* Title */}
              <h3 className="text-base font-bold text-white mt-1">
                {phase.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-[var(--text-secondary)] mt-2">
                {phase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { PilotSection };
