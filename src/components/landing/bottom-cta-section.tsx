"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Player, type PlayerRef } from "@remotion/player";
import DemoDoor from "@/remotion/compositions/DemoDoor";
import { FPS, DURATIONS, WIDTH, HEIGHT } from "@/remotion/lib/constants";
import { cn } from "@/lib/utils";
import { useReveal } from "@/components/landing/hooks/use-reveal";

export default function BottomCtaSection() {
  const { ref, revealed } = useReveal();
  const router = useRouter();
  const [showDemoDoor, setShowDemoDoor] = useState(false);
  const playerRef = useRef<PlayerRef>(null);

  const handleEnterDemo = useCallback(() => {
    setShowDemoDoor(true);
  }, []);

  // Listen for DemoDoor animation end via PlayerRef
  useEffect(() => {
    const player = playerRef.current;
    if (!player || !showDemoDoor) return;
    const onEnded = () => {
      router.push("/dashboard?welcome=true");
    };
    player.addEventListener("ended", onEnded);
    return () => {
      player.removeEventListener("ended", onEnded);
    };
  }, [showDemoDoor, router]);

  return (
    <section id="cta" className="relative overflow-hidden">
      {/* Background gradient orbs */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full opacity-20 blur-[120px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(45, 179, 74, 0.4) 0%, rgba(45, 179, 74, 0.1) 40%, transparent 70%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full opacity-10 blur-[100px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(45, 179, 74, 0.3) 0%, transparent 70%)",
        }}
      />

      <div
        ref={ref}
        className={cn(
          "section-reveal min-h-[60vh] flex items-center justify-center text-center px-4",
          revealed && "revealed"
        )}
      >
        <div className="relative z-10">
          {/* Headline */}
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold gradient-text">
            Enter the OS.
          </h2>

          {/* Subtext */}
          <p className="max-w-xl mx-auto mt-6 text-[var(--text-secondary)] text-base md:text-lg leading-relaxed">
            See what portfolio operations looks like when every agent is
            governed, every workflow is orchestrated, and every dollar of value
            is attributed.
          </p>

          {/* CTA button */}
          <div className="mt-8">
            <button
              onClick={handleEnterDemo}
              className="glow-green inline-flex items-center justify-center px-8 py-4 text-lg rounded-xl bg-[var(--primary)] text-white font-medium hover:bg-[var(--primary-hover)] transition-all duration-300 cursor-pointer"
            >
              Enter Demo
            </button>
          </div>

          {/* Sub-button text */}
          <p className="text-[var(--text-muted)] text-sm mt-4">
            No login required. Full interactive demo.
          </p>
        </div>
      </div>

      {/* DemoDoor overlay */}
      {showDemoDoor && (
        <div className="fixed inset-0 z-[9999] bg-[#0A0A0F]">
          <Player
            ref={playerRef}
            component={DemoDoor}
            compositionWidth={WIDTH}
            compositionHeight={HEIGHT}
            durationInFrames={DURATIONS.DEMO_DOOR}
            fps={FPS}
            autoPlay
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      )}
    </section>
  );
}

export { BottomCtaSection };
