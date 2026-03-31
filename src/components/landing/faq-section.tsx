"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useReveal } from "@/components/landing/hooks/use-reveal";

const faqItems = [
  {
    question: "How does Agent OS integrate with our existing tools?",
    answer:
      "Agent OS connects via API to your CRM (Salesforce, HubSpot), support platforms (Zendesk, Intercom), billing systems (Stripe, Chargebee), and data warehouses. Setup takes hours, not months.",
  },
  {
    question: "What happens when an agent makes a mistake?",
    answer:
      "Every agent action passes through configurable policy gates. High-impact decisions require human approval. All actions are logged with full context for review and rollback.",
  },
  {
    question: "How is ROI calculated and attributed?",
    answer:
      "Attribution uses causal chain analysis \u2014 tracing each dollar of value back through the specific agent action, workflow trigger, and data signal that created it. No black boxes.",
  },
  {
    question: "Is our portfolio company data secure?",
    answer:
      "SOC 2 Type II compliant. All data is encrypted at rest and in transit. Multi-tenant isolation ensures portfolio companies never see each other\u2019s data. Full audit trail with SHA-256 hash chain.",
  },
  {
    question: "Can we customize agent behavior per portfolio company?",
    answer:
      "Yes. Each portfolio company gets its own policy configuration, confidence thresholds, and approval workflows. Agents adapt to company-specific contexts.",
  },
  {
    question: "What\u2019s the pricing model?",
    answer:
      "Usage-based pricing tied to agent actions and portfolio company count. Typical PE fund with 10 portfolio companies: $15-25K/month. ROI payback within the first month.",
  },
  {
    question: "Do we need a data team to implement this?",
    answer:
      "No. Agent OS is designed for operating partners, not data engineers. Our team handles integration and configuration during the 30-day pilot.",
  },
  {
    question: "What if we want to build custom agents?",
    answer:
      "The Agent OS SDK allows your team to build custom agents using our governance framework. Custom agents get the same policy gates, audit trails, and attribution as built-in agents.",
  },
];

function FaqItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="landing-glass mb-3 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left cursor-pointer"
      >
        <span className="text-white text-sm md:text-base font-medium pr-4">
          {question}
        </span>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-[var(--text-muted)] shrink-0 transition-transform duration-300",
            open && "rotate-180"
          )}
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          open ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <p className="px-5 pb-5 text-sm text-[var(--text-secondary)] leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function FaqSection() {
  const { ref, revealed } = useReveal();

  return (
    <section id="faq" className="landing-section">
      <div ref={ref} className={cn("section-reveal", revealed && "revealed")}>
        {/* Section label */}
        <p className="text-xs uppercase tracking-wider text-[var(--primary)] font-mono mb-4">
          FAQ
        </p>

        {/* Headline */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold gradient-text leading-tight mb-12">
          Common Questions
        </h2>

        {/* Accordion */}
        <div className="max-w-3xl">
          {faqItems.map((item) => (
            <FaqItem
              key={item.question}
              question={item.question}
              answer={item.answer}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export { FaqSection };
