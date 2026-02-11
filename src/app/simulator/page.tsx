"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";
import { DemoTooltip } from "@/components/demo-tooltip";
import { CompPlanBuilder } from "@/components/simulator/comp-plan-builder";
import { ScenarioOutput } from "@/components/simulator/scenario-output";
import { QuotaEconomicsCard } from "@/components/simulator/quota-economics-card";

export default function SimulatorPage() {
  const [baseSalary, setBaseSalary] = useState(75000);
  const [ote, setOte] = useState(150000);
  const [annualQuota, setAnnualQuota] = useState(750000);
  const [rampPeriod, setRampPeriod] = useState("6");
  const [accelerator, setAccelerator] = useState(1.5);
  const [teamSize, setTeamSize] = useState(10);
  const [avgAttainment, setAvgAttainment] = useState(95);

  // Derived values for quota economics card
  const quotaToOteRatio = ote > 0 ? annualQuota / ote : 0;
  const basePercent = ote > 0 ? (baseSalary / ote) * 100 : 0;
  const variablePercent = 100 - basePercent;
  const magicNumber = ote > 0 ? (annualQuota * (avgAttainment / 100)) / ote : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <DemoTooltip
          content="This simulator encodes Vertica's proven comp economics playbook. Every portfolio company gets access to battle-tested compensation modeling."
          side="right"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--primary-10)] flex items-center justify-center">
              <Calculator className="w-5 h-5 text-[var(--primary)]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">
                Sales Comp &amp; Quota Simulator
              </h1>
              <p className="text-sm text-[var(--text-secondary)]">
                Model compensation plans using Vertica&apos;s proven economics
                framework
              </p>
            </div>
          </div>
        </DemoTooltip>
      </div>

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
            baseSalary={baseSalary}
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
