import { Counter } from "@/components/motion/Counter";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import type { StatsSettings } from "@/lib/types";

export function Stats({ stats }: { stats: StatsSettings }) {
  const items = [
    { value: stats.projects, suffix: "+", label: "Projects delivered" },
    { value: stats.clients, suffix: "+", label: "Happy clients" },
    { value: stats.years, suffix: "+", label: "Years of experience" },
    { value: stats.satisfaction, suffix: "%", label: "Client satisfaction" },
  ];

  return (
    <section className="relative overflow-hidden py-16">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 via-ink-900 to-royal-800 px-6 py-12 shadow-soft">
          <div className="pointer-events-none absolute inset-0 bg-grid-lines [background-size:36px_36px] opacity-20" />
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-royal-500/40 blur-3xl" />

          <RevealGroup className="relative grid grid-cols-2 gap-8 lg:grid-cols-4">
            {items.map((it) => (
              <RevealItem key={it.label} className="text-center">
                <div className="font-display text-4xl font-bold text-white sm:text-5xl">
                  <Counter to={it.value} suffix={it.suffix} />
                </div>
                <div className="mt-2 text-sm text-white/60">{it.label}</div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
