"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string;
  subtitle: string;
  trend?: "up" | "down" | "flat";
  trendLabel?: string;
  icon: React.ReactNode;
  accentColor?: string;
}

export function KpiCard({
  title,
  value,
  subtitle,
  trend,
  trendLabel,
  icon,
  accentColor = "text-emerald-400",
}: KpiCardProps) {
  return (
    <Card className="bg-[#111118] border-[#1a1a24] hover:border-[#2a2a34] transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            {title}
          </p>
          <div className="text-zinc-600">{icon}</div>
        </div>
        <div className="space-y-1">
          <p className={cn("text-2xl font-bold tracking-tight", accentColor)}>
            {value}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-xs text-zinc-500">{subtitle}</p>
            {trend && (
              <span
                className={cn(
                  "flex items-center gap-0.5 text-[11px] font-medium",
                  trend === "up" && "text-emerald-400",
                  trend === "down" && "text-rose-400",
                  trend === "flat" && "text-zinc-500"
                )}
              >
                {trend === "up" && <TrendingUp className="w-3 h-3" />}
                {trend === "down" && <TrendingDown className="w-3 h-3" />}
                {trend === "flat" && <Minus className="w-3 h-3" />}
                {trendLabel}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
