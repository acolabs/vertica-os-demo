"use client";

import dynamic from "next/dynamic";
import LandingNav from "@/components/landing/landing-nav";
import PilotSection from "@/components/landing/pilot-section";
import FaqSection from "@/components/landing/faq-section";

// Dynamically import sections that use Remotion Player (browser-only APIs)
const HeroSection = dynamic(
  () => import("@/components/landing/hero-section"),
  { ssr: false }
);
const ProblemSection = dynamic(
  () => import("@/components/landing/problem-section"),
  { ssr: false }
);
const ControlPlaneSection = dynamic(
  () => import("@/components/landing/control-plane-section"),
  { ssr: false }
);
const WorkflowSection = dynamic(
  () => import("@/components/landing/workflow-section"),
  { ssr: false }
);
const GovernanceSection = dynamic(
  () => import("@/components/landing/governance-section"),
  { ssr: false }
);
const OutcomesSection = dynamic(
  () => import("@/components/landing/outcomes-section"),
  { ssr: false }
);
const BottomCtaSection = dynamic(
  () => import("@/components/landing/bottom-cta-section"),
  { ssr: false }
);

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <LandingNav />
      <HeroSection />
      <ProblemSection />
      <ControlPlaneSection />
      <WorkflowSection />
      <GovernanceSection />
      <OutcomesSection />
      <PilotSection />
      <FaqSection />
      <BottomCtaSection />
    </div>
  );
}
