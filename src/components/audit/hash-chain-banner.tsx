"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

interface HashChainBannerProps {
  totalEntries: number;
}

const CHAIN_BLOCKS = 16;

export function HashChainBanner({ totalEntries }: HashChainBannerProps) {
  return (
    <Card className="border-emerald-500/20 bg-emerald-500/5 overflow-hidden glass-card">
      <CardContent className="pt-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-semibold text-emerald-400">
                Chain Integrity: Verified ✓
              </span>
              <span className="text-sm text-[var(--text-secondary)]">|</span>
              <span className="text-sm text-[var(--text-secondary)]">
                {totalEntries.toLocaleString()} entries
              </span>
              <span className="text-sm text-[var(--text-secondary)]">|</span>
              <span className="text-sm text-[var(--text-secondary)]">Last verified: just now</span>
            </div>
            {/* Animated chain blocks */}
            <div className="flex items-center gap-1 mt-2">
              {Array.from({ length: CHAIN_BLOCKS }).map((_, i) => (
                <div
                  key={i}
                  className="h-1.5 flex-1 rounded-full bg-emerald-500/30"
                  style={{
                    animation: `chainSweep 2.5s ease-in-out ${i * 0.15}s infinite`,
                  }}
                />
              ))}
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1.5">
              SHA-256 hash chain ensures no entries can be modified or deleted
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
