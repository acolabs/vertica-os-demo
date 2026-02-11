"use client";

import React from "react";
import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OrgSelector } from "./org-selector";

export function TopBar() {
  return (
    <header className="h-14 border-b border-[#1a1a24] bg-[#0a0a0f] flex items-center justify-between px-6">
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

      {/* Right: Budget + Notifications */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-24 h-1.5 bg-[#1a1a24] rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: "9.4%" }} />
          </div>
          <span className="text-zinc-400 text-xs">$47 / $500 today</span>
        </div>
        <button className="relative p-2 text-zinc-400 hover:text-white transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
        </button>
      </div>
    </header>
  );
}
