"use client";

import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { format, parseISO } from "date-fns";

interface KpiSnapshot {
  date: string;
  nrr_percent: number;
  churn_prevented_dollars: number;
}

interface RevenueImpactChartProps {
  kpiData: KpiSnapshot[];
}

export function RevenueImpactChart({ kpiData }: RevenueImpactChartProps) {
  const monthlyChurn = useMemo(() => {
    const byMonth: Record<string, number> = {};
    for (const snap of kpiData) {
      const month = format(parseISO(snap.date), "MMM yyyy");
      byMonth[month] = (byMonth[month] || 0) + (snap.churn_prevented_dollars || 0);
    }
    return Object.entries(byMonth).map(([month, value]) => ({ month, value }));
  }, [kpiData]);

  const nrrTrend = useMemo(() => {
    return kpiData.map((snap, i) => ({
      day: i + 1,
      date: format(parseISO(snap.date), "MMM d"),
      nrr: snap.nrr_percent,
    }));
  }, [kpiData]);

  const deploymentDay = 30;

  return (
    <Card className="border-[#1a1a24] bg-[#111118]">
      <CardHeader>
        <CardTitle className="text-white">Revenue Impact — Churn Prevention</CardTitle>
        <CardDescription>Monthly churn prevented and NRR trend over 90 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Churn Prevented by Month */}
          <div>
            <p className="text-sm text-zinc-400 mb-4">Churn Prevented by Month</p>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyChurn}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis
                  dataKey="month"
                  stroke="#71717a"
                  tick={{ fill: "#a1a1aa", fontSize: 12 }}
                />
                <YAxis
                  stroke="#71717a"
                  tick={{ fill: "#a1a1aa", fontSize: 12 }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                    color: "#fafafa",
                  }}
                  formatter={(value) => [`$${Number(value).toLocaleString()}`, "Churn Prevented"]}
                />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* NRR Trend */}
          <div>
            <p className="text-sm text-zinc-400 mb-4">Net Revenue Retention (NRR) Trend</p>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={nrrTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis
                  dataKey="date"
                  stroke="#71717a"
                  tick={{ fill: "#a1a1aa", fontSize: 12 }}
                  interval={14}
                />
                <YAxis
                  stroke="#71717a"
                  tick={{ fill: "#a1a1aa", fontSize: 12 }}
                  domain={[100, 115]}
                  tickFormatter={(v) => `${v}%`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "8px",
                    color: "#fafafa",
                  }}
                  formatter={(value) => [`${Number(value).toFixed(1)}%`, "NRR"]}
                />
                <ReferenceLine
                  x={nrrTrend[deploymentDay]?.date || ""}
                  stroke="#f59e0b"
                  strokeDasharray="5 5"
                  label={{
                    value: "Agent Deployed",
                    fill: "#f59e0b",
                    fontSize: 11,
                    position: "top",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="nrr"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, fill: "#10b981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
