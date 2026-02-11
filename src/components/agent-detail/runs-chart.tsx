"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Run {
  started_at: number;
  status: string;
}

export function RunsChart({ runs }: { runs: Run[] }) {
  const chartData = useMemo(() => {
    const now = Date.now();
    const days: Record<string, number> = {};

    // Initialize last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now - i * 86400000);
      const key = date.toISOString().split("T")[0];
      days[key] = 0;
    }

    // Count runs per day
    for (const run of runs) {
      const date = new Date(run.started_at).toISOString().split("T")[0];
      if (date in days) {
        days[date]++;
      }
    }

    return Object.entries(days).map(([date, count]) => ({
      date: new Date(date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      runs: count,
    }));
  }, [runs]);

  const avgRuns = chartData.length > 0 ? (chartData.reduce((s, d) => s + d.runs, 0) / chartData.length).toFixed(1) : "0";

  return (
    <Card className="bg-[var(--card-bg)] border-[var(--card-border)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">Runs Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a24" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: "#52525b", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval={Math.floor(chartData.length / 6)}
              />
              <YAxis tick={{ fill: "#52525b", fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: "#111118", border: "1px solid #1a1a24", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "#a1a1aa" }}
                itemStyle={{ color: "#E63029" }}
              />
              <Bar dataKey="runs" fill="#E63029" radius={[3, 3, 0, 0]} maxBarSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-2">Avg {avgRuns} runs/day</p>
      </CardContent>
    </Card>
  );
}
