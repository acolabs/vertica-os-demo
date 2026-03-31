"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Solution", href: "#solution" },
  { label: "Workflows", href: "#workflows" },
  { label: "Governance", href: "#governance" },
  { label: "Outcomes", href: "#outcomes" },
  { label: "Pilot", href: "#pilot" },
];

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 h-16 flex items-center transition-all duration-300",
        scrolled
          ? "landing-glass bg-[rgba(10,10,15,0.8)] backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5">
          <div className="w-9 h-9 flex items-center justify-center relative">
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-lg opacity-30 blur-sm" style={{ background: "radial-gradient(circle at 50% 30%, rgba(100,210,230,0.6), transparent 70%)" }} />
            <svg width="32" height="32" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Hexagon outer shell */}
              <path d="M32 4L56 18V46L32 60L8 46V18L32 4Z" stroke="url(#hex-grad)" strokeWidth="2.5" fill="rgba(100,210,230,0.06)" />
              {/* Inner figure — stylized anchor/agent with circuit nodes */}
              <path d="M32 16V48" stroke="url(#line-grad)" strokeWidth="2" strokeLinecap="round" />
              <path d="M24 24L32 18L40 24" stroke="#5BC4D0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M22 38L32 44L42 38" stroke="#5BC4D0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {/* Circuit connector dots */}
              <circle cx="22" cy="38" r="2" fill="#5BC4D0" />
              <circle cx="42" cy="38" r="2" fill="#5BC4D0" />
              <circle cx="24" cy="24" r="2" fill="#5BC4D0" />
              <circle cx="40" cy="24" r="2" fill="#5BC4D0" />
              {/* Top glow point */}
              <circle cx="32" cy="16" r="3" fill="url(#glow-grad)" />
              <defs>
                <linearGradient id="hex-grad" x1="32" y1="4" x2="32" y2="60" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#7DD8E0" />
                  <stop offset="1" stopColor="#3A8A94" />
                </linearGradient>
                <linearGradient id="line-grad" x1="32" y1="16" x2="32" y2="48" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#A8E8F0" />
                  <stop offset="1" stopColor="#5BC4D0" />
                </linearGradient>
                <radialGradient id="glow-grad" cx="32" cy="16" r="3" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFFFFF" />
                  <stop offset="0.5" stopColor="#A8E8F0" />
                  <stop offset="1" stopColor="#5BC4D0" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </div>
          <span className="text-sm font-semibold text-[var(--text-primary)] tracking-tight">
            PORTFOLIO OS
          </span>
        </a>

        {/* Center nav links — hidden on mobile */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-md hover:bg-white/[0.04]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <Link
          href="/dashboard?welcome=true"
          className="glow-green inline-flex items-center justify-center h-9 px-4 rounded-md bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary-hover)] transition-all duration-300"
        >
          Enter Demo
        </Link>
      </div>
    </header>
  );
}

export { LandingNav };
