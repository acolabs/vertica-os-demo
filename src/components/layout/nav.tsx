"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Bot,
  BarChart3,
  Plug,
  Lock,
  Shield,
  FileText,
  Layers,
  BookOpen,
  FlaskConical,
  Calculator,
  Briefcase,
  Activity,
  Rocket,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navSections = [
  {
    label: "PROPOSAL",
    items: [
      { name: "Proposal", href: "/documents", icon: FileText },
    ],
  },
  {
    label: "OPERATE",
    items: [
      { name: "Command Center", href: "/dashboard", icon: LayoutDashboard },
      { name: "Decision Inbox", href: "/decisions", icon: Inbox },
      { name: "Deal Room", href: "/deals", icon: Briefcase },
      { name: "Work Queues", href: "/queues", icon: Layers },
    ],
  },
  {
    label: "MONITOR",
    items: [
      { name: "Portfolio Pulse", href: "/portfolio", icon: Activity },
      { name: "Analytics", href: "/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "FLEET",
    items: [
      { name: "Agents", href: "/agents", icon: Bot },
      { name: "Playbooks", href: "/playbooks", icon: BookOpen },
      { name: "Evaluations", href: "/evaluations", icon: FlaskConical },
    ],
  },
  {
    label: "VALUE CREATION",
    items: [
      { name: "Value Creation Hub", href: "/value-creation", icon: Rocket },
      { name: "Comp Simulator", href: "/simulator", icon: Calculator },
    ],
  },
  {
    label: "GOVERNANCE",
    items: [
      { name: "Audit Log", href: "/audit", icon: Shield },
      { name: "Policies", href: "/policies", icon: Lock },
      { name: "Integrations", href: "/integrations", icon: Plug },
    ],
  },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed left-0 top-0 bottom-0 w-64 bg-[var(--nav-bg)] glass-nav border-r border-[var(--nav-border)] flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-[var(--nav-border)]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[var(--primary-10)] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 14L12 8L20 14" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 19L12 13L20 19" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <h1 className="text-base font-semibold text-[var(--text-primary)] tracking-tight">VERTICA OS</h1>
            <p className="text-[11px] text-[var(--text-muted)]">powered by Adapt Agents</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        {navSections.map((section) => (
          <div key={section.label} className="mb-6">
            <p className="text-[11px] font-medium text-[var(--text-muted)] uppercase tracking-wider px-3 mb-2">
              {section.label}
            </p>
            {section.items.map((item) => {
              const isActive =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    isActive
                      ? "bg-[var(--nav-active-bg)] text-[var(--nav-text-active)]"
                      : "text-[var(--nav-text)] hover:text-[var(--text-primary)] hover:bg-[var(--card-hover)]"
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
      <div className="p-4 border-t border-[var(--nav-border)]">
        <p className="text-[11px] text-[var(--text-muted)] text-center">VERTICA OS v1.0</p>
      </div>
    </nav>
  );
}
