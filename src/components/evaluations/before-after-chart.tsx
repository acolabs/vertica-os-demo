"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface BeforeAfterRow {
  metric: string;
  before: number;
  after: number;
  unit: string;
  lowerBetter?: boolean;
}

export function BeforeAfterChart({ data }: { data: BeforeAfterRow[] }) {
  return (
    <Card className="border-[var(--card-border)] bg-[var(--card-bg)] glass-card shadow-premium">
      <CardHeader>
        <CardTitle className="text-[var(--text-primary)]">
          Before vs After Agent Deployment
        </CardTitle>
        <CardDescription className="text-[var(--text-secondary)]">
          Validated results from historical replay runs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={360}>
          <BarChart
            data={data}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#2A2A34" />
            <XAxis
              dataKey="metric"
              stroke="#71717A"
              tick={{ fill: "#71717A", fontSize: 12 }}
              interval={0}
              angle={-20}
              textAnchor="end"
              height={60}
            />
            <YAxis
              stroke="#71717A"
              tick={{ fill: "#71717A", fontSize: 12 }}
            />
            <RechartsTooltip
              contentStyle={{
                backgroundColor: "var(--card-bg)",
                border: "1px solid var(--card-border)",
                borderRadius: "8px",
                color: "var(--text-primary)",
              }}
              formatter={(value) => [`${value}`, ""]}
            />
            <Legend
              wrapperStyle={{ color: "#71717A", fontSize: 12 }}
            />
            <Bar
              dataKey="before"
              name="Before Agent"
              fill="#52525b"
              radius={[4, 4, 0, 0]}
              barSize={28}
            />
            <Bar
              dataKey="after"
              name="With Agent"
              fill="#2DB34A"
              radius={[4, 4, 0, 0]}
              barSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
