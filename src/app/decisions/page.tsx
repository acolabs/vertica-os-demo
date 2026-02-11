"use client";

import React from "react";
import { Inbox } from "lucide-react";
import { DecisionTable } from "@/components/inbox/decision-table";

export default function DecisionInboxPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-rose-500/10 flex items-center justify-center">
            <Inbox className="w-5 h-5 text-rose-400" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Decision Inbox
            </h1>
            <p className="text-zinc-400 text-sm mt-0.5">
              Agent findings requiring your review
            </p>
          </div>
        </div>
      </div>

      {/* Decision Table with inline filters */}
      <DecisionTable />
    </div>
  );
}
