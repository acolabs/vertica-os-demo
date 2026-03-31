"use client";

import React from "react";

interface Company {
  companyId: string;
  companyName: string;
  status: "on-track" | "at-risk" | "behind";
  currentDay: number;
}

interface CompanyTabsProps {
  companies: Company[];
  activeCompanyId: string;
  onSelect: (companyId: string) => void;
}

const statusConfig = {
  "on-track": {
    label: "On Track",
    dot: "bg-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  "at-risk": {
    label: "At Risk",
    dot: "bg-amber-400",
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  behind: {
    label: "Behind",
    dot: "bg-red-400",
    badge: "bg-red-500/15 text-red-400 border-red-500/30",
  },
};

export function CompanyTabs({ companies, activeCompanyId, onSelect }: CompanyTabsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {companies.map((company) => {
        const isActive = company.companyId === activeCompanyId;
        const sc = statusConfig[company.status];

        return (
          <button
            key={company.companyId}
            onClick={() => onSelect(company.companyId)}
            className={`group flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${
              isActive
                ? "bg-[var(--card-bg)] border-[var(--primary)] shadow-[0_0_12px_rgba(45,179,74,0.15)]"
                : "bg-[var(--card-bg)] border-[var(--card-border)] hover:border-[var(--text-muted)] hover:bg-[var(--card-hover)]"
            }`}
          >
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold ${isActive ? "text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}`}>
                  {company.companyName}
                </span>
                <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border ${sc.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                  {sc.label}
                </span>
              </div>
              <span className="text-xs text-[var(--text-muted)]">
                Day {company.currentDay} of 90
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
