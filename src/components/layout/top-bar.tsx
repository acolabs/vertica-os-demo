"use client";

import React from "react";
import { Bell, Sun, Moon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OrgSelector } from "./org-selector";
import { useTheme } from "next-themes";

export function TopBar() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="h-14 border-b border-[var(--topbar-border)] bg-[var(--topbar-bg)] flex items-center justify-between px-6">
      {/* Left: Org Selector */}
      <div className="flex items-center gap-4">
        <OrgSelector />
      </div>

      {/* Center: Environment Badge */}
      <div>
        <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/5 text-xs">
          Demo Environment
        </Badge>
      </div>

      {/* Right: Budget + Theme Toggle + Notifications */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-24 h-1.5 bg-[var(--surface)] rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: "9.4%" }} />
          </div>
          <span className="text-[var(--text-secondary)] text-xs">$47 / $500 today</span>
        </div>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-[var(--card-hover)]"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
        <button className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--primary)] rounded-full" />
        </button>
      </div>
    </header>
  );
}
