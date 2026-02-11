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
  Legend,
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
    <div className="bg-[#1a1a24] border border-zinc-800 rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-zinc-400 mb-1.5">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="text-xs flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-zinc-400">{entry.name}:</span>
          <span className="text-white font-medium">{entry.value.toFixed(1)}%</span>
        </p>
      ))}
    </div>
  );
}

export function KpiTrendChart({ data }: KpiTrendChartProps) {
  // Only show every 7th date label to avoid crowding
  const chartData = data.map((d, i) => ({
    ...d,
    displayDate: i % 7 === 0 ? d.date.slice(5) : "",
  }));

  return (
    <Card className="bg-[#111118] border-[#1a1a24]">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-white">
              90-Day KPI Trends
            </h3>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-zinc-500">NRR %</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="text-zinc-500">Churn Rate %</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 border-t border-dashed border-zinc-600" />
              <span className="text-zinc-600">Agent Deployed</span>
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
                stroke="#27272a"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: "#71717a" }}
                tickLine={false}
                axisLine={{ stroke: "#27272a" }}
                tickFormatter={(val: string) => val.slice(5)}
                interval={13}
              />
              <YAxis
                yAxisId="nrr"
                orientation="left"
                tick={{ fontSize: 10, fill: "#71717a" }}
                tickLine={false}
                axisLine={false}
                domain={["auto", "auto"]}
                tickFormatter={(val: number) => `${val}%`}
              />
              <YAxis
                yAxisId="churn"
                orientation="right"
                tick={{ fontSize: 10, fill: "#71717a" }}
                tickLine={false}
                axisLine={false}
                domain={["auto", "auto"]}
                tickFormatter={(val: number) => `${val}%`}
              />
              {/* Deployment inflection reference line at day 30 */}
              {data.length >= 30 && (
                <line
                  x1="33%"
                  y1="0"
                  x2="33%"
                  y2="100%"
                  stroke="#3f3f46"
                  strokeDasharray="4 4"
                  strokeWidth={1}
                />
              )}
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "#3f3f46", strokeDasharray: "4 4" }}
              />
              <Line
                yAxisId="nrr"
                type="monotone"
                dataKey="nrr_percent"
                stroke="#059669"
                strokeWidth={2}
                dot={false}
                name="NRR %"
                activeDot={{ r: 4, stroke: "#059669", strokeWidth: 2, fill: "#111118" }}
              />
              <Line
                yAxisId="churn"
                type="monotone"
                dataKey="churn_rate_percent"
                stroke="#e11d48"
                strokeWidth={2}
                dot={false}
                name="Churn Rate %"
                activeDot={{ r: 4, stroke: "#e11d48", strokeWidth: 2, fill: "#111118" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
