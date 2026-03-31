"use client";

import { Player } from "@remotion/player";
import AttributionThread from "@/remotion/compositions/AttributionThread";
import { FPS, DURATIONS, WIDTH, HEIGHT } from "@/remotion/lib/constants";
import { cn } from "@/lib/utils";
import { useReveal } from "@/components/landing/hooks/use-reveal";

const metrics = [
  { value: "12.4x", label: "Average Agent ROI" },
  { value: "$4.7M", label: "Value Created Per Fund" },
  { value: "847", label: "Hours Saved Monthly" },
  { value: "94%", label: "Decision Accuracy" },
];

export default function OutcomesSection() {
  const { ref, revealed } = useReveal();

  return (
    <section id="outcomes" className="landing-section">
      <div ref={ref} className={cn("section-reveal", revealed && "revealed")}>
        {/* Section label */}
        <p className="text-xs uppercase tracking-wider text-[var(--primary)] font-mono mb-4">
          OUTCOMES
        </p>

        {/* Headline */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text leading-tight">
          From Activity to Attribution
        </h2>

        {/* Subtext */}
        <p className="max-w-2xl mt-4 text-[var(--text-secondary)] text-base md:text-lg leading-relaxed">
          Agent OS doesn&apos;t just run workflows — it proves what worked and
          why. Every dollar of value creation is traced back to the agent,
          action, and decision that caused it.
        </p>

        {/* Full-width Attribution Thread Player */}
        <div className="mt-12">
          <div className="aspect-video landing-glass overflow-hidden rounded-2xl">
            {revealed ? (
              <Player
                component={AttributionThread}
                compositionWidth={WIDTH}
                compositionHeight={HEIGHT}
                durationInFrames={DURATIONS.ATTRIBUTION_THREAD}
                fps={FPS}
                autoPlay
                loop
                style={{ width: "100%", height: "100%" }}
              />
            ) : null}
          </div>
        </div>

        {/* Metric tiles below */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {metrics.map((metric) => (
            <div key={metric.value} className="gradient-border p-6">
              <p className="text-2xl font-bold text-white">{metric.value}</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                {metric.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { OutcomesSection };
