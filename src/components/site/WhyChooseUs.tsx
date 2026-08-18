import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/site/SectionHeader";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { resolveIcon } from "@/components/site/icons";
import { whyReasons } from "@/lib/content";

export function WhyChooseUs() {
  return (
    <section className="section relative bg-mist-100">
      <div className="container-x">
        <SectionHeader
          eyebrow="Why choose us"
          title="A partner invested in your growth"
          subtitle="We combine craft, technology and business thinking to build digital products that actually move the needle."
        />

        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {whyReasons.map((r) => {
            const Icon = resolveIcon(r.icon);
            return (
              <RevealItem key={r.slug}>
                <Link
                  href={`/why-choose-us/${r.slug}`}
                  className="group flex h-full gap-4 rounded-3xl border border-mist-300/70 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-royal-500/30 hover:shadow-soft"
                >
                  <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-royal-50 text-royal-600 transition-colors duration-300 group-hover:bg-royal-500 group-hover:text-white">
                    <span className="absolute inset-0 rounded-2xl bg-royal-500/30 opacity-0 blur-md transition-opacity group-hover:opacity-100" />
                    <Icon className="relative h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="flex items-center justify-between font-semibold text-ink-900">
                      {r.title}
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-royal-500 opacity-0 transition-opacity group-hover:opacity-100" />
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-900/65">
                      {r.body}
                    </p>
                  </div>
                </Link>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
