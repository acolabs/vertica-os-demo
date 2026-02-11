"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface BigNumberCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  color: "emerald" | "rose" | "amber" | "blue" | "red";
}

const colorMap = {
  emerald: {
    iconBg: "bg-emerald-500/10",
    iconText: "text-emerald-400",
    valueText: "text-emerald-400",
  },
  rose: {
    iconBg: "bg-rose-500/10",
    iconText: "text-rose-400",
    valueText: "text-rose-400",
  },
  amber: {
    iconBg: "bg-amber-500/10",
    iconText: "text-amber-400",
    valueText: "text-amber-400",
  },
  blue: {
    iconBg: "bg-[var(--primary-10)]",
    iconText: "text-[var(--primary)]",
    valueText: "text-[var(--primary)]",
  },
  red: {
    iconBg: "bg-[var(--primary-10)]",
    iconText: "text-[var(--primary)]",
    valueText: "text-[var(--primary)]",
  },
};

export function BigNumberCard({ title, value, subtitle, icon: Icon, color }: BigNumberCardProps) {
  const colors = colorMap[color];

  return (
    <Card className="border-[var(--card-border)] bg-[var(--card-bg)]">
      <CardContent className="pt-0">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-[var(--text-secondary)]">{title}</p>
            <p className={cn("text-3xl font-bold tracking-tight", colors.valueText)}>
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-[var(--text-muted)]">{subtitle}</p>
            )}
          </div>
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", colors.iconBg)}>
            <Icon className={cn("w-5 h-5", colors.iconText)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
