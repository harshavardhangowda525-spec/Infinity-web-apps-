import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { PageBanner } from "@/components/site/PageBanner";
import { Reveal } from "@/components/motion/Reveal";
import { CTA } from "@/components/site/CTA";
import { getPricingById, getPricing } from "@/lib/data";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const plan = await getPricingById(params.id);
  if (!plan) return { title: "Pricing" };
  return {
    title: `${plan.name} — ${plan.price_label}`,
    description: plan.description ?? undefined,
  };
}

export default async function PricingDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const plan = await getPricingById(params.id);
  if (!plan) notFound();

  const others = (await getPricing()).filter((p) => p.id !== plan.id);
  const features = plan.features ?? [];

  return (
    <>
      <PageBanner eyebrow="Pricing" title={plan.name} subtitle={plan.description ?? undefined} />

      <section className="section pt-2">
        <div className="container-x">
          <Reveal>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-900/60 hover:text-royal-600"
            >
              <ArrowLeft className="h-4 w-4" /> All pricing
            </Link>
          </Reveal>

          <div className="mx-auto mt-8 max-w-2xl">
            <Reveal>
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 to-royal-800 p-8 text-center text-white shadow-soft">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-royal-500/40 blur-3xl" />
                {plan.highlighted && (
                  <span className="relative inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold backdrop-blur">
                    <Sparkles className="h-3.5 w-3.5" /> Most popular
                  </span>
                )}
                <div className="relative mt-4 font-display text-3xl font-bold">
                  {plan.price_label}
                </div>
                {plan.period && (
                  <div className="relative mt-1 text-sm text-white/60">
                    {plan.period}
                  </div>
                )}
                <Link
                  href="/contact"
                  className="btn relative mt-6 bg-white text-ink-900 hover:bg-mist-100"
                >
                  Request a Quote <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>

            {features.length > 0 && (
              <Reveal className="mt-6">
                <div className="card p-7">
                  <h3 className="font-semibold text-ink-900">What&apos;s included</h3>
                  <ul className="mt-4 space-y-3">
                    {features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-ink-900/80">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-royal-600" /> {f}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 rounded-xl bg-mist-100 px-4 py-3 text-xs text-ink-900/60">
                    Prices shown are indicative starting prices. Your final quote
                    is tailored to your exact requirements — get in touch and
                    we&apos;ll put together a proposal.
                  </p>
                </div>
              </Reveal>
            )}
          </div>

          {others.length > 0 && (
            <div className="mx-auto mt-14 max-w-2xl">
              <h3 className="mb-4 text-center font-semibold text-ink-900">
                Compare other plans
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {others.map((p) => (
                  <Link
                    key={p.id}
                    href={`/pricing/${p.id}`}
                    className="group flex items-center justify-between rounded-2xl border border-mist-300/70 bg-white p-4 shadow-card transition-all hover:-translate-y-1 hover:border-royal-500/30 hover:shadow-soft"
                  >
                    <span>
                      <span className="block text-sm font-semibold text-ink-900">
                        {p.name}
                      </span>
                      <span className="block text-xs text-royal-600">
                        {p.price_label}
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-royal-500 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <CTA />
    </>
  );
}
