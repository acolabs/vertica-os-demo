"use client";

import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { parseISO, getISOWeek } from "date-fns";

interface KpiSnapshot {
  date: string;
  operator_hours_saved: number;
  board_pack_hours: number;
}

interface OperatorHoursChartProps {
  kpiData: KpiSnapshot[];
}

export function OperatorHoursChart({ kpiData }: OperatorHoursChartProps) {
  const weeklyData = useMemo(() => {
    const byWeek: Record<string, number> = {};
    for (const snap of kpiData) {
      const week = `W${getISOWeek(parseISO(snap.date))}`;
      byWeek[week] = (byWeek[week] || 0) + (snap.operator_hours_saved || 0);
    }
    return Object.entries(byWeek).map(([week, hours]) => ({
      week,
      hours: Math.round(hours * 10) / 10,
    }));
  }, [kpiData]);

  const latestSnap = kpiData[kpiData.length - 1];
  const boardPackHours = latestSnap?.board_pack_hours?.toFixed(0) || "8";

  return (
    <Card className="border-[#1a1a24] bg-[#111118]">
      <CardHeader>
        <CardTitle className="text-white">Operator Hours Saved</CardTitle>
        <CardDescription>Weekly hours reclaimed by agent automation</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis
              dataKey="week"
              stroke="#71717a"
              tick={{ fill: "#a1a1aa", fontSize: 12 }}
            />
            <YAxis
              stroke="#71717a"
              tick={{ fill: "#a1a1aa", fontSize: 12 }}
              tickFormatter={(v) => `${v}h`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#18181b",
                border: "1px solid #27272a",
                borderRadius: "8px",
                color: "#fafafa",
              }}
              formatter={(value) => [`${Number(value).toFixed(1)} hours`, "Hours Saved"]}
            />
            <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#1a1a24]">
          <span className="text-sm text-zinc-400">Board Pack Generation:</span>
          <span className="text-sm font-semibold text-white">{boardPackHours} hours</span>
          <span className="text-xs text-emerald-400">↓79% from 38 hours</span>
        </div>
      </CardContent>
    </Card>
  );
}
