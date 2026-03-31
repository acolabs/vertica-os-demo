"use client";

import React, { useState } from "react";
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description: string;
  features: string[];
}

export function PageHeader({ title, description, features }: PageHeaderProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-card shadow-premium rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-5">
      <h1 className="text-2xl font-semibold text-[var(--text-primary)]">
        {title}
      </h1>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed mt-1.5">
        {description}
      </p>

      {features.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 mt-3 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
          >
            {expanded ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
            {expanded ? "Hide details" : "Show details"}
          </button>

          {expanded && (
            <ul className="mt-3 space-y-2 border-t border-[var(--card-border)] pt-3">
              {features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <CheckCircle
                    className="w-4 h-4 shrink-0 mt-0.5"
                    style={{ color: "var(--primary)" }}
                  />
                  <span className="text-sm text-[var(--text-secondary)] leading-snug">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
