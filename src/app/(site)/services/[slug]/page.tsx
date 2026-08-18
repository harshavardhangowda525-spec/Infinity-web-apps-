import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { PageBanner } from "@/components/site/PageBanner";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { resolveIcon } from "@/components/site/icons";
import { CTA } from "@/components/site/CTA";
import { getServiceBySlug, getServices } from "@/lib/data";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const service = await getServiceBySlug(params.slug);
  if (!service) return { title: "Service" };
  return {
    title: service.title,
    description: service.description ?? undefined,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = await getServiceBySlug(params.slug);
  if (!service) notFound();

  const Icon = resolveIcon(service.icon);
  const features = service.features ?? [];
  const others = (await getServices()).filter((s) => s.id !== service.id);

  return (
    <>
      <PageBanner eyebrow="Service" title={service.title} subtitle={service.description ?? undefined} />

      <section className="section pt-2">
        <div className="container-x">
          <Reveal>
            <Link
              href="/services"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-900/60 hover:text-royal-600"
            >
              <ArrowLeft className="h-4 w-4" /> All services
            </Link>
          </Reveal>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
            <Reveal>
              <div className="card p-8">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-royal-500 to-ink-900 text-white shadow-glow">
                  <Icon className="h-7 w-7" />
                </div>
                <h2 className="mt-6 text-2xl font-bold text-ink-900">
                  What we deliver
                </h2>
                <p className="mt-3 leading-relaxed text-ink-900/70">
                  {service.description} Our {service.title.toLowerCase()} service is
                  built around your business goals — combining premium design with
                  clean, production-ready engineering so you get a result that
                  looks great, performs beautifully, and actually helps you grow.
                </p>

                {features.length > 0 && (
                  <>
                    <h3 className="mt-8 font-semibold text-ink-900">
                      What&apos;s included
                    </h3>
                    <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                      {features.map((f) => (
                        <li
                          key={f}
                          className="flex items-center gap-2.5 rounded-xl bg-mist-100 px-4 py-3 text-sm text-ink-900/80"
                        >
                          <Check className="h-4 w-4 shrink-0 text-royal-600" /> {f}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </Reveal>

            <Reveal direction="left">
              <div className="sticky top-24 flex flex-col gap-4 rounded-3xl bg-gradient-to-br from-ink-900 to-royal-800 p-8 text-white shadow-soft">
                <h3 className="font-display text-xl font-semibold">
                  Interested in {service.title}?
                </h3>
                <p className="text-sm text-white/70">
                  Tell us about your project and we&apos;ll send a tailored, no-obligation quote within one business day.
                </p>
                <Link href="/contact" className="btn bg-white text-ink-900 hover:bg-mist-100">
                  Request a Quote <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/pricing" className="btn border border-white/25 text-white hover:bg-white/10">
                  View Pricing
                </Link>
              </div>
            </Reveal>
          </div>

          {others.length > 0 && (
            <div className="mt-16">
              <h3 className="mb-6 font-semibold text-ink-900">Other services</h3>
              <RevealGroup className="grid gap-4 sm:grid-cols-3">
                {others.map((s) => {
                  const OtherIcon = resolveIcon(s.icon);
                  return (
                    <RevealItem key={s.id}>
                      <Link
                        href={`/services/${s.slug}`}
                        className="group flex h-full items-center gap-3 rounded-2xl border border-mist-300/70 bg-white p-4 shadow-card transition-all hover:-translate-y-1 hover:border-royal-500/30 hover:shadow-soft"
                      >
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-royal-50 text-royal-600">
                          <OtherIcon className="h-5 w-5" />
                        </span>
                        <span className="text-sm font-medium text-ink-900">
                          {s.title}
                        </span>
                        <ArrowRight className="ml-auto h-4 w-4 text-royal-500 opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    </RevealItem>
                  );
                })}
              </RevealGroup>
            </div>
          )}
        </div>
      </section>

      <CTA />
    </>
  );
}
