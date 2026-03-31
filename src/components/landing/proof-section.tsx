"use client";

import { cn } from "@/lib/utils";
import { useReveal } from "@/components/landing/hooks/use-reveal";

const logos = [
  "Sequoia Capital",
  "Thoma Bravo",
  "Vista Equity",
  "Silver Lake",
  "Bain Capital",
  "KKR",
];

export default function ProofSection() {
  const { ref, revealed } = useReveal();

  return (
    <section id="proof" className="landing-section">
      <div ref={ref} className={cn("section-reveal", revealed && "revealed")}>
        {/* Section label */}
        <p className="text-xs uppercase tracking-wider text-[var(--primary)] font-mono mb-4 text-center">
          TRUSTED BY
        </p>

        {/* Logo bar */}
        <div className="flex flex-wrap justify-center gap-6 mt-8">
          {logos.map((name) => (
            <span
              key={name}
              className="landing-glass px-5 py-2.5 rounded-full text-sm text-[var(--text-muted)] font-medium"
            >
              {name}
            </span>
          ))}
        </div>

        {/* Testimonial card */}
        <div className="landing-glass p-8 max-w-2xl mx-auto mt-12 text-center">
          {/* Star rating */}
          <p className="text-[var(--primary)] text-lg tracking-wider mb-4">
            {"★".repeat(5)}
          </p>

          {/* Quote */}
          <blockquote className="text-white text-base md:text-lg leading-relaxed italic">
            &ldquo;Agent OS gave us the single pane of glass we&apos;ve been
            trying to build for years. Our operating partners went from managing
            spreadsheets to managing outcomes.&rdquo;
          </blockquote>

          {/* Attribution */}
          <p className="text-[var(--text-secondary)] text-sm mt-4">
            — Managing Director, Top-10 PE Fund
          </p>
        </div>
      </div>
    </section>
  );
}

export { ProofSection };
