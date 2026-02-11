"use client";

import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Activity } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface KpiSnapshot {
  date: string;
  nrr_percent: number;
  churn_rate_percent: number;
}

interface KpiTrendChartProps {
  data: KpiSnapshot[];
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-[var(--surface-elevated)] border border-[var(--card-border)] rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-[var(--text-muted)] mb-1.5">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-xs flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-[var(--text-secondary)]">{entry.name}:</span>
          <span className="text-[var(--text-primary)] font-medium">{entry.value.toFixed(1)}%</span>
        </p>
      ))}
    </div>
  );
}

export function KpiTrendChart({ data }: KpiTrendChartProps) {
  const chartData = data.map((d, i) => ({
    ...d,
    displayDate: i % 7 === 0 ? d.date.slice(5) : "",
  }));

  return (
    <Card className="bg-[var(--card-bg)] border-[var(--card-border)]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[var(--primary)]" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              90-Day KPI Trends
            </h3>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[var(--text-muted)]">NRR %</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-[var(--text-muted)]">Churn Rate %</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 border-t border-dashed border-[var(--text-muted)]" />
              <span className="text-[var(--text-muted)]">Agent Deployed</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="var(--chart-grid)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "var(--chart-text)" }}
                tickLine={false}
                axisLine={{ stroke: "var(--chart-grid)" }}
                tickFormatter={(val: string) => val.slice(5)}
                interval={13}
              />
              <YAxis
                yAxisId="nrr"
                orientation="left"
                tick={{ fontSize: 10, fill: "var(--chart-text)" }}
                tickLine={false}
                axisLine={false}
                domain={["auto", "auto"]}
                tickFormatter={(val: number) => `${val}%`}
              />
              <YAxis
                yAxisId="churn"
                orientation="right"
                tick={{ fontSize: 10, fill: "var(--chart-text)" }}
                tickLine={false}
                axisLine={false}
                domain={["auto", "auto"]}
                tickFormatter={(val: number) => `${val}%`}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "var(--chart-grid)", strokeDasharray: "4 4" }}
              />
              <Line
                yAxisId="nrr"
                type="monotone"
                dataKey="nrr_percent"
                stroke="#059669"
                strokeWidth={2}
                dot={false}
                name="NRR %"
                activeDot={{ r: 4, stroke: "#059669", strokeWidth: 2, fill: "var(--card-bg)" }}
              />
              <Line
                yAxisId="churn"
                type="monotone"
                dataKey="churn_rate_percent"
                stroke="#e11d48"
                strokeWidth={2}
                dot={false}
                name="Churn Rate %"
                activeDot={{ r: 4, stroke: "#e11d48", strokeWidth: 2, fill: "var(--card-bg)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
