"use client";

import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface Decision {
  status: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  approved: "#10b981",
  rejected: "#f43f5e",
  auto_resolved: "#E63029",
  escalated: "#8b5cf6",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  rejected: "Rejected",
  auto_resolved: "Auto-Resolved",
  escalated: "Escalated",
};

export function DecisionsPie({ decisions }: { decisions: Decision[] }) {
  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const d of decisions) {
      counts[d.status] = (counts[d.status] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({
      name: STATUS_LABELS[status] || status,
      value: count,
      color: STATUS_COLORS[status] || "#71717a",
    }));
  }, [decisions]);

  const approved = decisions.filter((d) => d.status === "approved" || d.status === "auto_resolved").length;
  const acceptanceRate = decisions.length > 0 ? ((approved / decisions.length) * 100).toFixed(1) : "0";

  return (
    <Card className="bg-[var(--card-bg)] border-[var(--card-border)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-[var(--text-secondary)]">Decision Outcomes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {chartData.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#111118", border: "1px solid #1a1a24", borderRadius: 8, fontSize: 12 }}
              />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(value: string) => <span className="text-xs text-[var(--text-secondary)]">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-2">Acceptance rate: {acceptanceRate}%</p>
      </CardContent>
    </Card>
  );
}
