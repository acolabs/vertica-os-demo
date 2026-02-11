"use client";

import React, { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format, parseISO } from "date-fns";

interface KpiSnapshot {
  date: string;
  support_deflection_rate: number;
  support_cost_per_ticket: number;
  avg_handle_time_minutes: number;
  csat_score: number;
}

interface SupportMetricsChartProps {
  kpiData: KpiSnapshot[];
}

export function SupportMetricsChart({ kpiData }: SupportMetricsChartProps) {
  const chartData = useMemo(() => {
    return kpiData.map((snap) => ({
      date: format(parseISO(snap.date), "MMM d"),
      deflection: snap.support_deflection_rate,
      costPerTicket: snap.support_cost_per_ticket,
    }));
  }, [kpiData]);

  const latestSnap = kpiData[kpiData.length - 1];
  const avgHandleTime = latestSnap?.avg_handle_time_minutes?.toFixed(0) || "17";
  const csat = latestSnap?.csat_score?.toFixed(1) || "4.6";

  return (
    <Card className="border-[var(--card-border)] bg-[var(--card-bg)]">
      <CardHeader>
        <CardTitle className="text-[var(--text-primary)]">Support Efficiency</CardTitle>
        <CardDescription>Deflection rate and cost per ticket trend</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis
              dataKey="date"
              stroke="var(--chart-text)"
              tick={{ fill: "var(--chart-text)", fontSize: 12 }}
              interval={14}
            />
            <YAxis
              yAxisId="left"
              stroke="var(--chart-text)"
              tick={{ fill: "var(--chart-text)", fontSize: 12 }}
              tickFormatter={(v) => `${v}%`}
              domain={[0, 50]}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              stroke="var(--chart-text)"
              tick={{ fill: "var(--chart-text)", fontSize: 12 }}
              tickFormatter={(v) => `$${v}`}
              domain={[8, 24]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                borderRadius: "8px",
                color: "var(--text-primary)",
              }}
              formatter={(value, name) => {
                const v = Number(value);
                if (name === "deflection") return [`${v.toFixed(1)}%`, "Deflection Rate"];
                return [`$${v.toFixed(2)}`, "Cost per Ticket"];
              }}
            />
            <Legend
              wrapperStyle={{ color: "#a1a1aa", fontSize: 12 }}
              formatter={(value) =>
                value === "deflection" ? "Deflection Rate %" : "Cost per Ticket $"
              }
            />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="deflection"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#10b981" }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="costPerTicket"
              stroke="#f43f5e"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#f43f5e" }}
            />
          </LineChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-8 mt-4 pt-4 border-t border-[var(--card-border)]">
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-secondary)]">Avg Handle Time:</span>
            <span className="text-sm font-semibold text-[var(--text-primary)]">{avgHandleTime} min</span>
            <span className="text-xs text-emerald-400">↓39%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-secondary)]">CSAT:</span>
            <span className="text-sm font-semibold text-[var(--text-primary)]">{csat}</span>
            <span className="text-xs text-emerald-400">↑10%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
