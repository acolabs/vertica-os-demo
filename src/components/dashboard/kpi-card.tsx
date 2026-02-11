"use client";

import React, { useEffect, useState, useRef } from "react";
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

function useCountUp(value: string, duration = 1000) {
  const [display, setDisplay] = useState(value);
  const prevValue = useRef(value);

  useEffect(() => {
    // If value hasn't changed, skip
    if (prevValue.current === value) return;
    prevValue.current = value;

    // Extract numeric part
    const match = value.match(/([^0-9]*?)([\d,]+\.?\d*)(.*)/);
    if (!match) {
      setDisplay(value);
      return;
    }

    const prefix = match[1];
    const numStr = match[2].replace(/,/g, "");
    const suffix = match[3];
    const target = parseFloat(numStr);

    if (isNaN(target) || target === 0) {
      setDisplay(value);
      return;
    }

    const hasDecimals = numStr.includes(".");
    const decimalPlaces = hasDecimals ? (numStr.split(".")[1]?.length || 0) : 0;
    const hasCommas = match[2].includes(",");
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      let formatted = hasDecimals ? current.toFixed(decimalPlaces) : Math.round(current).toString();
      if (hasCommas) {
        const parts = formatted.split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        formatted = parts.join(".");
      }

      setDisplay(`${prefix}${formatted}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    }

    requestAnimationFrame(animate);
  }, [value, duration]);

  return display;
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
  const animatedValue = useCountUp(value);

  return (
    <Card className="bg-[var(--card-bg)] border-[var(--card-border)] glass-card shadow-premium card-hover-lift transition-colors">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <p className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
            {title}
          </p>
          <div className="text-[var(--text-muted)]">{icon}</div>
        </div>
        <div className="space-y-1">
          <p className={cn("text-2xl font-bold tracking-tight", accentColor)}>
            {animatedValue}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-xs text-[var(--text-muted)]">{subtitle}</p>
            {trend && (
              <span
                className={cn(
                  "flex items-center gap-0.5 text-[11px] font-medium",
                  trend === "up" && "text-emerald-400",
                  trend === "down" && "text-rose-400",
                  trend === "flat" && "text-[var(--text-muted)]"
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
