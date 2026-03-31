"use client";

import { useState } from "react";
import { CheckCircle, AlertTriangle, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CompPlanBuilder } from "@/components/simulator/comp-plan-builder";
import { PageHeader } from "@/components/layout/page-header";
import { ScenarioOutput } from "@/components/simulator/scenario-output";
import { QuotaEconomicsCard } from "@/components/simulator/quota-economics-card";
import { cn } from "@/lib/utils";

function BestPracticesBar({
  baseSalary,
  ote,
  annualQuota,
  accelerator,
}: {
  baseSalary: number;
  ote: number;
  annualQuota: number;
  accelerator: number;
}) {
  const quotaToOte = ote > 0 ? annualQuota / ote : 0;
  const basePercent = ote > 0 ? (baseSalary / ote) * 100 : 0;

  const fiveXGood = quotaToOte >= 4 && quotaToOte <= 6;
  const fiftyFiftyGood = basePercent >= 45 && basePercent <= 55;
  const acceleratorGood = accelerator >= 1.5 && accelerator <= 2.0;

  const practices = [
    {
      isGood: fiveXGood,
      title: "The 5x Rule",
      value: `${quotaToOte.toFixed(1)}x`,
      description:
        "Set quota at 5x OTE for optimal balance of rep motivation and company economics",
    },
    {
      isGood: fiftyFiftyGood,
      title: "50/50 Split",
      value: `${Math.round(basePercent)}/${Math.round(100 - basePercent)}`,
      description:
        "Equal base/variable ratio attracts top talent while maintaining performance incentive",
    },
    {
      isGood: acceleratorGood,
      title: "Accelerator Range",
      value: `${accelerator.toFixed(1)}x`,
      description:
        "Accelerators above 100% attainment should be 1.5-2x to reward top performers without over-paying",
    },
  ];

  return (
    <Card className="glass-card shadow-premium border-l-4 border-l-[var(--primary)]">
      <CardContent className="py-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-[var(--primary)]" />
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            Vertica Best Practices
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {practices.map((p) => (
            <div key={p.title} className="flex items-start gap-2.5">
              {p.isGood ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-[var(--text-primary)]">
                    {p.title}
                  </span>
                  <span
                    className={cn(
                      "text-xs font-bold",
                      p.isGood ? "text-emerald-400" : "text-amber-400"
                    )}
                  >
                    {p.value}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-muted)] mt-0.5 leading-tight">
                  {p.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function SimulatorPage() {
  const [baseSalary, setBaseSalary] = useState(75000);
  const [ote, setOte] = useState(150000);
  const [annualQuota, setAnnualQuota] = useState(750000);
  const [rampPeriod, setRampPeriod] = useState("6");
  const [accelerator, setAccelerator] = useState(1.5);
  const [teamSize, setTeamSize] = useState(10);
  const [avgAttainment, setAvgAttainment] = useState(95);

  // Clamp base so it never exceeds OTE
  const effectiveBase = Math.min(baseSalary, ote);

  // Derived values for quota economics card
  const quotaToOteRatio = ote > 0 ? annualQuota / ote : 0;
  const basePercent = ote > 0 ? (effectiveBase / ote) * 100 : 0;
  const variablePercent = 100 - basePercent;
  const magicNumber = ote > 0 ? (annualQuota * (avgAttainment / 100)) / ote : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <PageHeader
        title="Comp Simulator"
        description="Interactive compensation modeling tool that encodes Vertica's proven sales economics framework. Validate plans against best practices in real time."
        features={[
          "7 adjustable inputs — base, OTE, quota, ramp, accelerator, team size, attainment",
          "5x Quota-to-OTE rule validation with sweet-spot indicators",
          "50/50 base/variable split analysis",
          "Three-scenario comparison — conservative, target, and stretch",
          "Cost of revenue and capital efficiency calculations",
        ]}
      />

      {/* Vertica Best Practices — top of page, full width */}
      <BestPracticesBar
        baseSalary={effectiveBase}
        ote={ote}
        annualQuota={annualQuota}
        accelerator={accelerator}
      />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Inputs */}
        <div>
          <CompPlanBuilder
            baseSalary={baseSalary}
            setBaseSalary={setBaseSalary}
            ote={ote}
            setOte={setOte}
            annualQuota={annualQuota}
            setAnnualQuota={setAnnualQuota}
            rampPeriod={rampPeriod}
            setRampPeriod={setRampPeriod}
            accelerator={accelerator}
            setAccelerator={setAccelerator}
            teamSize={teamSize}
            setTeamSize={setTeamSize}
            avgAttainment={avgAttainment}
            setAvgAttainment={setAvgAttainment}
          />
        </div>

        {/* Right Column: Outputs */}
        <div className="space-y-4">
          <QuotaEconomicsCard
            quotaToOteRatio={quotaToOteRatio}
            basePercent={basePercent}
            variablePercent={variablePercent}
            magicNumber={magicNumber}
          />
          <ScenarioOutput
            baseSalary={effectiveBase}
            ote={ote}
            annualQuota={annualQuota}
            accelerator={accelerator}
            teamSize={teamSize}
            avgAttainment={avgAttainment}
          />
        </div>
      </div>
    </div>
  );
}
