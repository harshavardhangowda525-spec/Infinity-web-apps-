import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { PageBanner } from "@/components/site/PageBanner";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { resolveIcon } from "@/components/site/icons";
import { CTA } from "@/components/site/CTA";
import { getWhyReason, whyReasons } from "@/lib/content";

// Static content — pre-render every reason page.
export function generateStaticParams() {
  return whyReasons.map((r) => ({ slug: r.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const reason = getWhyReason(params.slug);
  if (!reason) return { title: "Why choose us" };
  return { title: reason.title, description: reason.body };
}

export default function WhyReasonPage({
  params,
}: {
  params: { slug: string };
}) {
  const reason = getWhyReason(params.slug);
  if (!reason) notFound();

  const Icon = resolveIcon(reason.icon);
  const others = whyReasons.filter((r) => r.slug !== reason.slug);

  return (
    <>
      <PageBanner eyebrow="Why choose us" title={reason.title} subtitle={reason.body} />

      <section className="section pt-2">
        <div className="container-x">
          <Reveal>
            <Link
              href="/#about"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-900/60 hover:text-royal-600"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          </Reveal>

          <div className="mx-auto mt-8 max-w-3xl">
            <Reveal>
              <div className="flex items-start gap-5 rounded-3xl border border-mist-300/70 bg-white p-8 shadow-card">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-royal-500 to-ink-900 text-white shadow-glow">
                  <Icon className="h-7 w-7" />
                </div>
                <p className="text-lg leading-relaxed text-ink-900/75">
                  {reason.intro}
                </p>
              </div>
            </Reveal>

            <RevealGroup className="mt-6 grid gap-4">
              {reason.points.map((p) => (
                <RevealItem key={p.title}>
                  <div className="rounded-2xl border border-mist-300/70 bg-white p-5 shadow-card">
                    <h3 className="font-semibold text-ink-900">{p.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-900/65">
                      {p.text}
                    </p>
                  </div>
                </RevealItem>
              ))}
            </RevealGroup>
          </div>

          <div className="mt-16">
            <h3 className="mb-6 font-semibold text-ink-900">More reasons to choose us</h3>
            <RevealGroup className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((r) => {
                const OtherIcon = resolveIcon(r.icon);
                return (
                  <RevealItem key={r.slug}>
                    <Link
                      href={`/why-choose-us/${r.slug}`}
                      className="group flex h-full items-center gap-3 rounded-2xl border border-mist-300/70 bg-white p-4 shadow-card transition-all hover:-translate-y-1 hover:border-royal-500/30 hover:shadow-soft"
                    >
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-royal-50 text-royal-600">
                        <OtherIcon className="h-5 w-5" />
                      </span>
                      <span className="text-sm font-medium text-ink-900">
                        {r.title}
                      </span>
                      <ArrowRight className="ml-auto h-4 w-4 text-royal-500 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  </RevealItem>
                );
              })}
            </RevealGroup>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
