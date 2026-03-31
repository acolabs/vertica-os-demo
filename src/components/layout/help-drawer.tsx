"use client";

import React, { useState, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  HelpCircle,
  Database,
  Cpu,
  MessageSquareText,
  ChevronDown,
  ChevronRight,
  Lightbulb,
} from "lucide-react";
import type { PageHelpContent } from "@/lib/help-content";

interface HelpDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: PageHelpContent | null;
}

function dataSourceBadge(content: string): { label: string; color: string } {
  if (content.toLowerCase().includes("static mock") || content.toLowerCase().includes("hardcoded")) {
    return { label: "Static", color: "bg-zinc-500/15 text-zinc-400 border-zinc-500/20" };
  }
  if (content.toLowerCase().includes("client-side")) {
    return { label: "Client", color: "bg-purple-500/15 text-purple-400 border-purple-500/20" };
  }
  if (content.toLowerCase().includes("polling") || content.toLowerCase().includes("react query")) {
    return { label: "Polling", color: "bg-amber-500/15 text-amber-400 border-amber-500/20" };
  }
  return { label: "SQLite", color: "bg-[var(--primary-10)] text-[var(--primary)] border-[var(--primary)]/20" };
}

export function HelpDrawer({ open, onOpenChange, content }: HelpDrawerProps) {
  const [expandedFaqs, setExpandedFaqs] = useState<Set<number>>(new Set());

  const toggleFaq = useCallback((index: number) => {
    setExpandedFaqs((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  if (!content) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[480px] bg-[var(--surface)] border-[var(--card-border)] p-0 flex flex-col glass"
      >
        <SheetHeader className="px-5 pt-5 pb-4 border-b border-[var(--card-border)]/50">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 rounded-lg bg-[var(--card-bg)] text-[var(--primary)]">
              <HelpCircle className="w-4 h-4" />
            </div>
            <SheetTitle className="text-sm font-medium text-[var(--text-primary)] uppercase tracking-wider">
              {content.pageTitle}
            </SheetTitle>
          </div>
          <SheetDescription className="text-xs text-[var(--text-muted)] mt-1">
            Page guide &mdash; overview, technical details &amp; FAQs
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1">
          <div className="px-5 py-4 space-y-6">
            {/* Overview */}
            <section>
              <h3 className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-3 h-3" />
                Overview
              </h3>
              <div className="bg-[var(--card-bg)] border border-[var(--card-border)]/50 rounded-lg p-3">
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  {content.overview}
                </p>
              </div>
            </section>

            {/* How It Works */}
            <section>
              <h3 className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Cpu className="w-3 h-3" />
                How It Works
              </h3>
              <div className="space-y-2">
                {content.howItWorks.map((item) => (
                  <div
                    key={item.title}
                    className="bg-[var(--card-bg)] border border-[var(--card-border)]/50 rounded-lg p-3"
                  >
                    <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1">
                      {item.title}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Data Sources */}
            <section>
              <h3 className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Database className="w-3 h-3" />
                Data Sources
              </h3>
              <div className="space-y-2">
                {content.dataSources.map((item) => {
                  const badge = dataSourceBadge(item.content);
                  return (
                    <div
                      key={item.title}
                      className="bg-[var(--card-bg)] border border-[var(--card-border)]/50 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider flex-1">
                          {item.title}
                        </p>
                        <Badge
                          variant="outline"
                          className={`text-[9px] border px-1.5 py-0 ${badge.color}`}
                        >
                          {badge.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        {item.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Executive FAQs */}
            <section>
              <h3 className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <MessageSquareText className="w-3 h-3" />
                Executive FAQs
              </h3>
              <div className="space-y-1.5">
                {content.faqs.map((faq, index) => {
                  const isExpanded = expandedFaqs.has(index);
                  return (
                    <div
                      key={index}
                      className="bg-[var(--card-bg)] border border-[var(--card-border)]/50 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(index)}
                        className="w-full flex items-start gap-2 p-3 text-left hover:bg-[var(--card-border)]/20 transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[var(--primary)]" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[var(--text-muted)]" />
                        )}
                        <span className="text-xs font-medium text-[var(--text-primary)] leading-snug">
                          {faq.question}
                        </span>
                      </button>
                      {isExpanded && (
                        <div className="px-3 pb-3 pl-8">
                          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
