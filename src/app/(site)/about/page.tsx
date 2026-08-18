import type { Metadata } from "next";
import { Target, Eye, Heart } from "lucide-react";
import { PageBanner } from "@/components/site/PageBanner";
import { Stats } from "@/components/site/Stats";
import { Testimonials } from "@/components/site/Testimonials";
import { CTA } from "@/components/site/CTA";
import { SectionHeader } from "@/components/site/SectionHeader";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { getStats, getTestimonials } from "@/lib/data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Infinity Web & Apps is a digital development company helping businesses grow with modern websites, apps and digital solutions.",
};

export const revalidate = 60;

const values = [
  {
    icon: Target,
    title: "Our Mission",
    body: "To help businesses of every size build a strong, modern digital presence that drives real growth.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    body: "A world where great technology is accessible to every business — not just the biggest players.",
  },
  {
    icon: Heart,
    title: "Our Values",
    body: "Craft, honesty and partnership. We build products we're proud of and relationships that last.",
  },
];

export default async function AboutPage() {
  const [stats, testimonials] = await Promise.all([
    getStats(),
    getTestimonials(),
  ]);

  return (
    <>
      <PageBanner
        eyebrow="About us"
        title="We build digital products that grow businesses"
        subtitle="Infinity Web & Apps is a digital development company specialising in websites, mobile applications and digital growth."
      />

      <section className="section pt-4">
        <div className="container-x">
          <div className="mx-auto max-w-3xl space-y-5 text-center text-ink-900/70">
            <p className="text-lg leading-relaxed">
              We&apos;re a team of designers, developers and digital strategists
              on a simple mission: to help businesses build a stronger online
              presence. From modern, conversion-focused websites to powerful
              mobile apps and custom business tools, we deliver technology that
              works — and that works for you.
            </p>
            <p className="leading-relaxed">
              We combine premium design with clean, production-ready
              engineering and a genuine focus on your business outcomes. The
              result is digital products that look great, perform beautifully,
              and actually help you grow.
            </p>
          </div>

          <RevealGroup className="mt-16 grid gap-6 md:grid-cols-3">
            {values.map((v) => (
              <RevealItem key={v.title}>
                <div className="card h-full p-7 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-soft">
                  <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-royal-500 to-ink-900 text-white shadow-glow">
                    <v.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-ink-900">
                    {v.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-900/65">
                    {v.body}
                  </p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <Stats stats={stats} />
      <Testimonials items={testimonials} />
      <CTA />
    </>
  );
}
