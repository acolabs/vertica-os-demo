"use client";

import { Player } from "@remotion/player";
import EntropyToSystem from "@/remotion/compositions/EntropyToSystem";
import { FPS, DURATIONS, WIDTH, HEIGHT } from "@/remotion/lib/constants";
import { cn } from "@/lib/utils";
import { useReveal } from "@/components/landing/hooks/use-reveal";

const stats = [
  {
    value: "73%",
    description: "of PE ops teams use 6+ disconnected tools",
    source: "BDO Private Equity Survey, 2024",
  },
  {
    value: "40hrs",
    description: "per week per partner spent on manual processes",
    source: "McKinsey PE Operations Survey, 2023",
  },
  {
    value: "$2.3M",
    description: "average value leakage per portfolio company per year",
    source: "EY Value Creation Index, 2024",
  },
];

export default function ProblemSection() {
  const { ref, revealed } = useReveal();

  return (
    <section id="problem" className="landing-section">
      {/* Section label */}
      <p className="text-xs uppercase tracking-wider text-[var(--primary)] font-mono mb-4">
        THE PROBLEM
      </p>

      {/* Headline */}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text leading-tight">
        Every Portfolio Runs on Entropy
      </h2>

      {/* Subtext */}
      <p className="max-w-2xl mt-4 text-[var(--text-secondary)] text-base md:text-lg leading-relaxed">
        Disconnected tools. Manual processes. No single source of truth. Your
        operating team spends more time wrangling systems than creating value.
      </p>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {stats.map((stat) => (
          <div
            key={stat.value}
            className="group landing-glass p-8 text-center relative"
          >
            <p className="text-4xl font-bold gradient-text">{stat.value}</p>
            <p className="text-[var(--text-secondary)] text-sm mt-2">
              {stat.description}
            </p>
            <p className="text-[10px] text-[var(--text-muted)] mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {stat.source}
            </p>
          </div>
        ))}
      </div>

      {/* EntropyToSystem Player */}
      <div ref={ref} className="max-w-3xl mx-auto mt-12">
        <div className="aspect-video landing-glass overflow-hidden rounded-2xl">
          {revealed ? (
            <Player
              component={EntropyToSystem}
              compositionWidth={WIDTH}
              compositionHeight={HEIGHT}
              durationInFrames={DURATIONS.ENTROPY_TO_SYSTEM}
              fps={FPS}
              autoPlay
              loop
              style={{ width: "100%", height: "100%" }}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}

export { ProblemSection };
