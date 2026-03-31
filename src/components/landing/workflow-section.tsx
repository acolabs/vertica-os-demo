"use client";

import { Check } from "lucide-react";
import { Player } from "@remotion/player";
import WorkflowMiniRun from "@/remotion/compositions/WorkflowMiniRun";
import { FPS, DURATIONS, WIDTH, HEIGHT } from "@/remotion/lib/constants";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const workflows = [
  {
    id: "churn",
    label: "Churn Prevention",
    features: [
      "Real-time usage & sentiment monitoring",
      "Predictive churn scoring with causal analysis",
      "Automated intervention playbooks",
      "Measurable save rate attribution",
    ],
  },
  {
    id: "support",
    label: "Support Automation",
    features: [
      "Intelligent ticket classification & routing",
      "Automated resolution for known issues",
      "Escalation with full context handoff",
      "Deflection rate tracking per category",
    ],
  },
  {
    id: "expansion",
    label: "Revenue Expansion",
    features: [
      "Usage pattern anomaly detection",
      "Upsell opportunity scoring",
      "Personalized expansion proposals",
      "Revenue attribution per campaign",
    ],
  },
  {
    id: "compliance",
    label: "Compliance",
    features: [
      "Continuous policy monitoring",
      "Automated audit trail generation",
      "Regulatory change impact analysis",
      "SOC 2 / SOX readiness scoring",
    ],
  },
];

export default function WorkflowSection() {
  return (
    <section id="workflows" className="landing-section">
      {/* Section label */}
      <p className="text-xs uppercase tracking-wider text-[var(--primary)] font-mono mb-4">
        WORKFLOWS
      </p>

      {/* Headline */}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text leading-tight">
        Agents That Actually Work
      </h2>

      {/* Subtext */}
      <p className="max-w-2xl mt-4 text-[var(--text-secondary)] text-base md:text-lg leading-relaxed">
        Four autonomous workflows that handle the work your team shouldn&apos;t
        be doing manually.
      </p>

      {/* Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="churn">
          <TabsList
            variant="line"
            className="w-full justify-start border-b border-[var(--border)] mb-8 flex-wrap"
          >
            {workflows.map((wf) => (
              <TabsTrigger
                key={wf.id}
                value={wf.id}
                className="text-sm data-[state=active]:text-[var(--primary)]"
              >
                {wf.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {workflows.map((wf) => (
            <TabsContent key={wf.id} value={wf.id}>
              {/* Full-width Remotion visual */}
              <div className="aspect-video landing-glass overflow-hidden rounded-2xl">
                <Player
                  component={WorkflowMiniRun}
                  inputProps={{ variant: wf.id as "churn" | "support" | "expansion" | "compliance" }}
                  compositionWidth={WIDTH}
                  compositionHeight={HEIGHT}
                  durationInFrames={DURATIONS.WORKFLOW_MINI_RUN}
                  fps={FPS}
                  loop
                  autoPlay
                  style={{ width: "100%", height: "100%" }}
                />
              </div>

              {/* Feature list below */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mt-8">
                {wf.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-[var(--primary)]" />
                    </div>
                    <span className="text-[var(--text-secondary)] text-sm leading-relaxed">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
}

export { WorkflowSection };
