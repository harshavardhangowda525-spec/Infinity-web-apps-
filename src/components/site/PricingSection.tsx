import Link from "next/link";
import { Check, Sparkles } from "lucide-react";
import { SectionHeader } from "@/components/site/SectionHeader";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import type { Pricing } from "@/lib/types";

export function PricingSection({ plans }: { plans: Pricing[] }) {
  return (
    <section id="pricing" className="section relative bg-mist-100">
      <div className="container-x">
        <SectionHeader
          eyebrow="Pricing"
          title="Simple, transparent pricing"
          subtitle="Straightforward starting prices — every project is scoped to your exact needs. Request a quote for a tailored proposal."
        />

        <RevealGroup className="mt-14 grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <RevealItem key={plan.id}>
              <div
                className={`relative flex h-full flex-col rounded-3xl border p-8 transition-all duration-300 hover:-translate-y-1.5 ${
                  plan.highlighted
                    ? "border-royal-500/40 bg-gradient-to-br from-ink-900 to-royal-800 text-white shadow-soft"
                    : "border-mist-300/70 bg-white text-ink-900 shadow-card hover:shadow-soft"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute right-6 top-6 inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                    <Sparkles className="h-3.5 w-3.5" /> Popular
                  </span>
                )}

                <h3
                  className={`text-lg font-semibold ${plan.highlighted ? "text-white" : "text-ink-900"}`}
                >
                  {plan.name}
                </h3>
                <div className="mt-4">
                  <div
                    className={`font-display text-2xl font-bold ${plan.highlighted ? "text-white" : "text-ink-900"}`}
                  >
                    {plan.price_label}
                  </div>
                  {plan.period && (
                    <span
                      className={`text-xs ${plan.highlighted ? "text-white/60" : "text-ink-900/50"}`}
                    >
                      {plan.period}
                    </span>
                  )}
                </div>

                {plan.description && (
                  <p
                    className={`mt-4 text-sm leading-relaxed ${plan.highlighted ? "text-white/70" : "text-ink-900/65"}`}
                  >
                    {plan.description}
                  </p>
                )}

                <ul className="mt-6 flex-1 space-y-3">
                  {(plan.features ?? []).map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check
                        className={`mt-0.5 h-4 w-4 shrink-0 ${plan.highlighted ? "text-royal-300" : "text-royal-600"}`}
                      />
                      <span
                        className={
                          plan.highlighted ? "text-white/85" : "text-ink-900/75"
                        }
                      >
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className={`mt-8 ${
                    plan.highlighted
                      ? "btn bg-white text-ink-900 hover:bg-mist-100"
                      : "btn-primary"
                  }`}
                >
                  Request a Quote
                </Link>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
