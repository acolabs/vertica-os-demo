"use client";

import { useRef, useEffect } from "react";
import { Shield, Layers, BarChart3 } from "lucide-react";
import { Player, type PlayerRef } from "@remotion/player";
import OSExplodedView from "@/remotion/compositions/OSExplodedView";
import { FPS, DURATIONS, WIDTH, HEIGHT } from "@/remotion/lib/constants";
import { cn } from "@/lib/utils";
import { useScrollSync } from "@/components/landing/hooks/use-scroll-sync";

const features = [
  {
    icon: Shield,
    iconBg: "bg-purple-500/20",
    iconColor: "text-purple-400",
    title: "Govern",
    description:
      "Policy engine, approval gates, audit trails. Every agent action is governed.",
  },
  {
    icon: Layers,
    iconBg: "bg-green-500/20",
    iconColor: "text-green-400",
    title: "Operate",
    description:
      "Automated workflows, decision routing, cross-portfolio orchestration.",
  },
  {
    icon: BarChart3,
    iconBg: "bg-amber-500/20",
    iconColor: "text-amber-400",
    title: "Measure",
    description:
      "Value attribution, ROI tracking, causal chain analysis.",
  },
];

export default function ControlPlaneSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<PlayerRef>(null);
  const progress = useScrollSync(containerRef);

  // Sync scroll progress to player frame (in effect to avoid setState-in-render)
  useEffect(() => {
    const targetFrame = Math.round(progress * (DURATIONS.OS_EXPLODED_VIEW - 1));
    playerRef.current?.seekTo(targetFrame);
  }, [progress]);

  return (
    <section id="solution" className="landing-section">
      {/* Section label */}
      <p className="text-xs uppercase tracking-wider text-[var(--primary)] font-mono mb-4">
        THE SOLUTION
      </p>

      {/* Headline */}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text leading-tight">
        One Control Plane. Total Visibility.
      </h2>

      {/* Subtext */}
      <p className="max-w-2xl mt-4 text-[var(--text-secondary)] text-base md:text-lg leading-relaxed">
        Agent OS unifies governance, execution, and measurement into a single
        operating system for your portfolio.
      </p>

      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="landing-glass p-8"
          >
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                feature.iconBg
              )}
            >
              <feature.icon className={cn("w-5 h-5", feature.iconColor)} />
            </div>
            <h3 className="text-lg font-semibold text-white mt-4">
              {feature.title}
            </h3>
            <p className="text-[var(--text-secondary)] text-sm mt-2">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* OSExplodedView Player — scroll-synced */}
      <div ref={containerRef} className="w-full mt-16" style={{ minHeight: "200vh", position: "relative" }}>
        <div className="sticky top-20">
          <div className="aspect-video landing-glass overflow-hidden rounded-2xl">
            <Player
              ref={playerRef}
              component={OSExplodedView}
              compositionWidth={WIDTH}
              compositionHeight={HEIGHT}
              durationInFrames={DURATIONS.OS_EXPLODED_VIEW}
              fps={FPS}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export { ControlPlaneSection };
