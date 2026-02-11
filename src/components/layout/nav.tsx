"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  Inbox,
  Bot,
  BarChart3,
  Plug,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navSections = [
  {
    label: "OVERVIEW",
    items: [
      { name: "Dashboard", href: "/", icon: LayoutDashboard },
      { name: "Decision Inbox", href: "/decisions", icon: Inbox },
    ],
  },
  {
    label: "FLEET",
    items: [
      { name: "Agents", href: "/agents", icon: Bot },
    ],
  },
  {
    label: "INTELLIGENCE",
    items: [
      { name: "Analytics", href: "/analytics", icon: BarChart3 },
      { name: "Audit Log", href: "/audit", icon: Shield },
    ],
  },
  {
    label: "PLATFORM",
    items: [
      { name: "Integrations", href: "/integrations", icon: Plug },
      { name: "Policies", href: "/policies", icon: Lock },
    ],
  },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 top-0 bottom-0 w-64 bg-[#111118] border-r border-[#1a1a24] flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-[#1a1a24]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h1 className="text-base font-semibold text-white tracking-tight">AGENT OS</h1>
            <p className="text-[11px] text-zinc-500">powered by Arc Agency</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        {navSections.map((section) => (
          <div key={section.label} className="mb-6">
            <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider px-3 mb-2">
              {section.label}
            </p>
            {section.items.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    isActive
                      ? "bg-blue-500/10 text-blue-400"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-[#1a1a24]">
        <p className="text-[11px] text-zinc-600 text-center">GenCap Agent OS v1.0</p>
      </div>
    </nav>
  );
}
