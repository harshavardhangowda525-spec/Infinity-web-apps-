import {
  Cpu,
  Wand2,
  Smartphone,
  Gauge,
  Rocket,
  LifeBuoy,
  type LucideIcon,
} from "lucide-react";
import { SectionHeader } from "@/components/site/SectionHeader";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

const reasons: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Cpu,
    title: "Modern Technology",
    body: "We build on a modern, production-ready stack for reliability and scale.",
  },
  {
    icon: Wand2,
    title: "Custom Solutions",
    body: "Every product is tailored to your goals — never a generic template.",
  },
  {
    icon: Smartphone,
    title: "Mobile-Friendly Design",
    body: "Pixel-perfect experiences that shine on every device and screen size.",
  },
  {
    icon: Gauge,
    title: "Fast Performance",
    body: "Optimised assets and clean code for lightning-fast load times.",
  },
  {
    icon: Rocket,
    title: "Business-Focused",
    body: "We build for outcomes — conversions, growth, and measurable results.",
  },
  {
    icon: LifeBuoy,
    title: "Ongoing Support",
    body: "We stick around after launch with dependable maintenance and support.",
  },
];

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
          {reasons.map((r) => (
            <RevealItem key={r.title}>
              <div className="group flex h-full gap-4 rounded-3xl border border-mist-300/70 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
                <div className="relative grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-royal-50 text-royal-600 transition-colors duration-300 group-hover:bg-royal-500 group-hover:text-white">
                  <span className="absolute inset-0 rounded-2xl bg-royal-500/30 opacity-0 blur-md transition-opacity group-hover:opacity-100" />
                  <r.icon className="relative h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-ink-900">{r.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-900/65">
                    {r.body}
                  </p>
                </div>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
