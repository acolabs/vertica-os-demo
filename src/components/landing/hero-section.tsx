"use client";

import Link from "next/link";
import { Player } from "@remotion/player";
import HeroLoop from "@/remotion/compositions/HeroLoop";
import { FPS, DURATIONS, WIDTH, HEIGHT } from "@/remotion/lib/constants";
import { cn } from "@/lib/utils";

export default function HeroSection() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center text-center relative overflow-hidden px-4 pt-24">
      {/* Background gradient orb */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full opacity-20 blur-[120px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(45, 179, 74, 0.4) 0%, rgba(45, 179, 74, 0.1) 40%, transparent 70%)",
        }}
      />

      {/* Badge pill */}
      <span className="landing-glass inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium text-[var(--primary)] border border-[var(--primary)]/20 mb-8 mt-4">
        Value Creation Control Plane
      </span>

      {/* Headline */}
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight gradient-text leading-[1.1]">
        The Operating System for
        <br />
        Portfolio Value Creation
      </h1>

      {/* Subhead */}
      <p className="max-w-2xl mx-auto mt-6 text-lg md:text-xl text-[var(--text-secondary)] leading-relaxed">
        Portfolio OS gives PE operating teams a single control plane to govern
        agents, orchestrate workflows, and measure attribution — across every
        portfolio company.
      </p>

      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link
          href="/dashboard?welcome=true"
          className="glow-green inline-flex items-center justify-center h-11 px-6 rounded-md bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-hover)] transition-all duration-300"
        >
          Enter Demo
        </Link>
        <a
          href="#solution"
          className="inline-flex items-center justify-center h-11 px-6 rounded-md border border-[var(--border)] text-[var(--text-secondary)] text-sm font-medium hover:text-[var(--text-primary)] hover:bg-white/[0.04] transition-all duration-300"
        >
          See How It Works
        </a>
      </div>

      {/* HeroLoop Player Placeholder */}
      <div className="w-full max-w-[800px] mt-16 relative z-10">
        <div className="aspect-video landing-glass overflow-hidden rounded-2xl">
          <Player
            component={HeroLoop}
            compositionWidth={WIDTH}
            compositionHeight={HEIGHT}
            durationInFrames={DURATIONS.HERO_LOOP}
            fps={FPS}
            loop
            autoPlay
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </section>
  );
}

export { HeroSection };
