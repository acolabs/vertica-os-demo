"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DemoTooltip } from "@/components/demo-tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, Users, TrendingUp, Target } from "lucide-react";
import { cn } from "@/lib/utils";

const fmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

interface CompPlanBuilderProps {
  baseSalary: number;
  setBaseSalary: (v: number) => void;
  ote: number;
  setOte: (v: number) => void;
  annualQuota: number;
  setAnnualQuota: (v: number) => void;
  rampPeriod: string;
  setRampPeriod: (v: string) => void;
  accelerator: number;
  setAccelerator: (v: number) => void;
  teamSize: number;
  setTeamSize: (v: number) => void;
  avgAttainment: number;
  setAvgAttainment: (v: number) => void;
}

export function CompPlanBuilder({
  baseSalary,
  setBaseSalary,
  ote,
  setOte,
  annualQuota,
  setAnnualQuota,
  rampPeriod,
  setRampPeriod,
  accelerator,
  setAccelerator,
  teamSize,
  setTeamSize,
  avgAttainment,
  setAvgAttainment,
}: CompPlanBuilderProps) {
  const variablePay = ote - baseSalary;
  const basePercent = ote > 0 ? (baseSalary / ote) * 100 : 0;
  const variablePercent = 100 - basePercent;
  const quotaToOteRatio = ote > 0 ? annualQuota / ote : 0;

  const ratioInSweetSpot = quotaToOteRatio >= 4 && quotaToOteRatio <= 6;
  const ratioColor = ratioInSweetSpot
    ? "text-emerald-400"
    : quotaToOteRatio < 4
      ? "text-amber-400"
      : "text-red-400";

  return (
    <Card className="glass-card shadow-premium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
          <DollarSign className="w-5 h-5 text-[var(--primary)]" />
          Comp Plan Builder
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Base Salary */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-[var(--text-secondary)]">
              Base Salary
            </Label>
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {fmt.format(baseSalary)}
            </span>
          </div>
          <Slider
            value={[baseSalary]}
            onValueChange={(val: number[]) => setBaseSalary(val[0])}
            min={40000}
            max={150000}
            step={5000}
          />
          <div className="flex justify-between text-xs text-[var(--text-muted)]">
            <span>$40K</span>
            <span>$150K</span>
          </div>
        </div>

        <Separator className="bg-[var(--card-border)]" />

        {/* OTE */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-[var(--text-secondary)]">
              OTE (On-Target Earnings)
            </Label>
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {fmt.format(ote)}
            </span>
          </div>
          <Slider
            value={[ote]}
            onValueChange={(val: number[]) => setOte(val[0])}
            min={80000}
            max={300000}
            step={5000}
          />
          <div className="flex justify-between text-xs text-[var(--text-muted)]">
            <span>$80K</span>
            <span>$300K</span>
          </div>
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--surface)]">
            <span className="text-xs text-[var(--text-muted)]">
              Variable Pay: {fmt.format(Math.max(0, variablePay))}
            </span>
            <span className={cn("text-xs font-medium", basePercent >= 45 && basePercent <= 55 ? "text-emerald-400" : "text-amber-400")}>
              Split: {Math.round(basePercent)}/{Math.round(variablePercent)}
            </span>
          </div>
        </div>

        <Separator className="bg-[var(--card-border)]" />

        {/* Annual Quota */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-[var(--text-secondary)]">
              Annual Quota
            </Label>
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {fmt.format(annualQuota)}
            </span>
          </div>
          <Slider
            value={[annualQuota]}
            onValueChange={(val: number[]) => setAnnualQuota(val[0])}
            min={400000}
            max={3000000}
            step={50000}
          />
          <div className="flex justify-between text-xs text-[var(--text-muted)]">
            <span>$400K</span>
            <span>$3M</span>
          </div>
          <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--surface)]">
            <span className="text-xs text-[var(--text-muted)]">
              Quota-to-OTE Ratio
            </span>
            <span className={cn("text-xs font-bold", ratioColor)}>
              {quotaToOteRatio.toFixed(1)}x
              {ratioInSweetSpot ? " ✅" : quotaToOteRatio < 4 ? " ⚠️" : " ❌"}
            </span>
          </div>
        </div>

        <Separator className="bg-[var(--card-border)]" />

        {/* Ramp Period */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-[var(--text-secondary)]">
              Ramp Period
            </Label>
          </div>
          <Select value={rampPeriod} onValueChange={setRampPeriod}>
            <SelectTrigger className="w-full bg-[var(--input-bg)] border-[var(--input-border)]">
              <SelectValue placeholder="Select ramp period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 months</SelectItem>
              <SelectItem value="6">6 months</SelectItem>
              <SelectItem value="9">9 months</SelectItem>
              <SelectItem value="12">12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator className="bg-[var(--card-border)]" />

        {/* Accelerator */}
        <div className="space-y-3">
          <DemoTooltip
            content="Properly structured accelerators are the difference between keeping top performers and losing them to competitors."
            side="right"
          >
            <div className="flex items-center justify-between w-full">
              <Label className="text-sm font-medium text-[var(--text-secondary)]">
                Accelerator Multiplier
              </Label>
              <span className="text-sm font-semibold text-[var(--text-primary)]">
                {accelerator.toFixed(1)}x
              </span>
            </div>
          </DemoTooltip>
          <Slider
            value={[accelerator * 10]}
            onValueChange={(val: number[]) => setAccelerator(val[0] / 10)}
            min={10}
            max={30}
            step={1}
          />
          <div className="flex justify-between text-xs text-[var(--text-muted)]">
            <span>1.0x</span>
            <span>3.0x</span>
          </div>
        </div>

        <Separator className="bg-[var(--card-border)]" />

        {/* Team Size */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Team Size
              </span>
            </Label>
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {teamSize} reps
            </span>
          </div>
          <Slider
            value={[teamSize]}
            onValueChange={(val: number[]) => setTeamSize(val[0])}
            min={1}
            max={50}
            step={1}
          />
          <div className="flex justify-between text-xs text-[var(--text-muted)]">
            <span>1</span>
            <span>50</span>
          </div>
        </div>

        <Separator className="bg-[var(--card-border)]" />

        {/* Average Attainment */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-[var(--text-secondary)]">
              <span className="flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                Average Attainment
              </span>
            </Label>
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {avgAttainment}%
            </span>
          </div>
          <Slider
            value={[avgAttainment]}
            onValueChange={(val: number[]) => setAvgAttainment(val[0])}
            min={60}
            max={140}
            step={1}
          />
          <div className="flex justify-between text-xs text-[var(--text-muted)]">
            <span>60%</span>
            <span>140%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
