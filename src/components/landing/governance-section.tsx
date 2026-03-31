"use client";

import { Player } from "@remotion/player";
import PolicyGate from "@/remotion/compositions/PolicyGate";
import { FPS, DURATIONS, WIDTH, HEIGHT } from "@/remotion/lib/constants";
import { cn } from "@/lib/utils";
import { useReveal } from "@/components/landing/hooks/use-reveal";

const stats = [
  {
    value: "100%",
    label: "Audit Coverage",
    description: "Every agent action logged with full context",
  },
  {
    value: "SHA-256",
    label: "Hash Chain",
    description: "Tamper-proof audit trail with cryptographic verification",
  },
  {
    value: "SOC 2",
    label: "Ready",
    description: "Built-in controls mapped to SOC 2 Type II requirements",
  },
];

export default function GovernanceSection() {
  const { ref, revealed } = useReveal();

  return (
    <section id="governance" className="landing-section">
      {/* Section label */}
      <p className="text-xs uppercase tracking-wider text-[var(--primary)] font-mono mb-4">
        GOVERNANCE
      </p>

      {/* Headline */}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text leading-tight">
        Trust Through Transparency
      </h2>

      {/* Subtext */}
      <p className="max-w-2xl mt-4 text-[var(--text-secondary)] text-base md:text-lg leading-relaxed">
        Every agent action is policy-checked, human-approved when needed, and
        cryptographically audited.
      </p>

      {/* Full-width PolicyGate Player */}
      <div ref={ref} className="mt-12">
        <div className="aspect-video landing-glass overflow-hidden rounded-2xl">
          {revealed ? (
            <Player
              component={PolicyGate}
              compositionWidth={WIDTH}
              compositionHeight={HEIGHT}
              durationInFrames={DURATIONS.POLICY_GATE}
              fps={FPS}
              autoPlay
              loop
              style={{ width: "100%", height: "100%" }}
            />
          ) : null}
        </div>
      </div>

      {/* Stat cards below */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
        {stats.map((stat) => (
          <div key={stat.value} className="landing-glass p-6">
            <p className="text-sm text-[var(--primary)] font-medium">
              {stat.label}
            </p>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {stat.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

export { GovernanceSection };
