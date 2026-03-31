"use client";

import React from "react";
import {
  BarChart3,
  Users,
  Presentation,
  Target,
  Search,
} from "lucide-react";

interface CadenceItem {
  day: string;
  dayLabel: string;
  meeting: string;
  duration: string;
  time: string;
  attendees: string[];
}

interface OperatingCadenceProps {
  cadence: CadenceItem[];
}

const dayIcons: Record<string, React.ReactNode> = {
  mon: <BarChart3 className="w-4 h-4" />,
  tue: <Users className="w-4 h-4" />,
  wed: <Presentation className="w-4 h-4" />,
  thu: <Target className="w-4 h-4" />,
  fri: <Search className="w-4 h-4" />,
};

const dayColors: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  mon: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-400", dot: "bg-blue-400" },
  tue: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", dot: "bg-purple-400" },
  wed: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-400", dot: "bg-emerald-400" },
  thu: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-400", dot: "bg-amber-400" },
  fri: { bg: "bg-rose-500/10", border: "border-rose-500/30", text: "text-rose-400", dot: "bg-rose-400" },
};

export function OperatingCadence({ cadence }: OperatingCadenceProps) {
  return (
    <div className="glass-card shadow-premium rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)]">
      <div className="p-4 border-b border-[var(--card-border)]">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          Operating Cadence
        </h3>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          Weekly rhythm for value creation execution
        </p>
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-5 gap-3">
        {cadence.map((item) => {
          const colors = dayColors[item.day] || dayColors.mon;
          const icon = dayIcons[item.day];

          return (
            <div
              key={item.day}
              className={`rounded-lg border ${colors.border} ${colors.bg} p-3 transition-all hover:scale-[1.02]`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className={colors.text}>{icon}</div>
                <span className={`text-xs font-bold uppercase ${colors.text}`}>
                  {item.dayLabel}
                </span>
              </div>
              <h4 className="text-sm font-medium text-[var(--text-primary)] mb-1">
                {item.meeting}
              </h4>
              <div className="text-[10px] text-[var(--text-muted)] space-y-0.5">
                <div>{item.time} &middot; {item.duration}</div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {item.attendees.map((a) => (
                    <span
                      key={a}
                      className="inline-block px-1.5 py-0.5 rounded bg-white/5 text-[var(--text-secondary)] text-[9px]"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
