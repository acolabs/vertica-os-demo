"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Run {
  started_at: number;
  cost_usd: number;
}

export function CostTrendChart({ runs }: { runs: Run[] }) {
  const chartData = useMemo(() => {
    const now = Date.now();
    const days: Record<string, number> = {};

    // Initialize last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now - i * 86400000);
      const key = date.toISOString().split("T")[0];
      days[key] = 0;
    }

    // Sum cost per day
    for (const run of runs) {
      const date = new Date(run.started_at).toISOString().split("T")[0];
      if (date in days) {
        days[date] += run.cost_usd || 0;
      }
    }

    // Make cumulative
    let cumulative = 0;
    return Object.entries(days).map(([date, cost]) => {
      cumulative += cost;
      return {
        date: new Date(date + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        cost: Number(cumulative.toFixed(2)),
      };
    });
  }, [runs]);

  return (
    <Card className="bg-[#111118] border-[#1a1a24]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-zinc-300">Cumulative Cost (30 days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a24" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fill: "#52525b", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval={Math.floor(chartData.length / 6)}
              />
              <YAxis
                tick={{ fill: "#52525b", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `$${v.toFixed(0)}`}
              />
              <Tooltip
                contentStyle={{ backgroundColor: "#111118", border: "1px solid #1a1a24", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "#a1a1aa" }}
                formatter={(value) => [`$${Number(value).toFixed(2)}`, "Cumulative Cost"]}
              />
              <Area type="monotone" dataKey="cost" stroke="#3b82f6" fill="url(#costGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
