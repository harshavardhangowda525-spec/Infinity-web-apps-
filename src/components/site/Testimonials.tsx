import { Star, Quote } from "lucide-react";
import { SectionHeader } from "@/components/site/SectionHeader";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { initials } from "@/lib/utils";
import type { Testimonial } from "@/lib/types";

export function Testimonials({ items }: { items: Testimonial[] }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="section relative">
      <div className="container-x">
        <SectionHeader
          eyebrow="Testimonials"
          title="Loved by the businesses we build for"
          subtitle="Don't just take our word for it — here's what our clients say."
        />

        <RevealGroup className="mt-14 grid gap-6 md:grid-cols-3">
          {items.map((t) => (
            <RevealItem key={t.id}>
              <figure className="flex h-full flex-col rounded-3xl border border-mist-300/70 bg-white p-7 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
                <Quote className="h-8 w-8 text-royal-500/25" />
                <div className="mt-2 flex gap-0.5">
                  {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-ink-900/75">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-royal-500 to-ink-900 text-sm font-bold text-white">
                    {initials(t.author)}
                  </span>
                  <div>
                    <div className="text-sm font-semibold text-ink-900">
                      {t.author}
                    </div>
                    <div className="text-xs text-ink-900/55">
                      {[t.role, t.company].filter(Boolean).join(" · ")}
                    </div>
                  </div>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
