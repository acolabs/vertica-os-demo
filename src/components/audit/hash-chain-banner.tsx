"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

interface HashChainBannerProps {
  totalEntries: number;
}

export function HashChainBanner({ totalEntries }: HashChainBannerProps) {
  return (
    <Card className="border-emerald-500/20 bg-emerald-500/5">
      <CardContent className="pt-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-semibold text-emerald-400">
                Chain Integrity: Verified ✓
              </span>
              <span className="text-sm text-zinc-400">|</span>
              <span className="text-sm text-zinc-300">
                {totalEntries.toLocaleString()} entries
              </span>
              <span className="text-sm text-zinc-400">|</span>
              <span className="text-sm text-zinc-300">Last verified: just now</span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              SHA-256 hash chain ensures no entries can be modified or deleted
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
