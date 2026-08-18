import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";

export function CTA() {
  return (
    <section className="section">
      <div className="container-x">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-ink-900 via-ink-900 to-royal-800 px-6 py-16 text-center shadow-soft sm:px-16">
            <div className="pointer-events-none absolute inset-0 bg-grid-lines [background-size:40px_40px] opacity-20" />
            <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-royal-500/40 blur-3xl" />
            <div className="pointer-events-none absolute -right-16 bottom-0 h-64 w-64 rounded-full bg-royal-400/30 blur-3xl" />

            <div className="relative mx-auto max-w-2xl">
              <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">
                Ready to build something great?
              </h2>
              <p className="mt-4 text-base text-white/70">
                Let&apos;s turn your idea into a modern website, a powerful app, or
                a smarter business tool. Get a free, no-obligation quote today.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Link href="/contact" className="btn bg-white text-ink-900 hover:bg-mist-100 group">
                  Get Started
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/pricing"
                  className="btn border border-white/25 text-white hover:bg-white/10"
                >
                  View Pricing
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
