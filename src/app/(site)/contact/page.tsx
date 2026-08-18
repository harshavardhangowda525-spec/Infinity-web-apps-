import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { PageBanner } from "@/components/site/PageBanner";
import { ContactForm } from "@/components/site/ContactForm";
import { Reveal } from "@/components/motion/Reveal";
import { getCompany } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Infinity Web & Apps for a free quote on your next website, app or digital project.",
};

export default async function ContactPage() {
  const company = await getCompany();

  const info = [
    { icon: Mail, label: "Email", value: company.email, href: `mailto:${company.email}` },
    { icon: Phone, label: "Phone", value: company.phone, href: `tel:${company.phone}` },
    { icon: MapPin, label: "Location", value: company.address },
    { icon: Clock, label: "Hours", value: "Mon – Sat, 10am – 7pm IST" },
  ];

  return (
    <>
      <PageBanner
        eyebrow="Contact"
        title="Let's build something together"
        subtitle="Tell us about your project and we'll get back to you within one business day."
      />

      <section className="section pt-0">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <Reveal direction="right">
            <div className="flex flex-col gap-6">
              <div className="card p-7">
                <h2 className="text-lg font-semibold text-ink-900">
                  Get in touch
                </h2>
                <p className="mt-2 text-sm text-ink-900/65">
                  Prefer to reach out directly? Here&apos;s how to find us.
                </p>
                <ul className="mt-6 space-y-5">
                  {info.map((i) => (
                    <li key={i.label} className="flex items-start gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-royal-50 text-royal-600">
                        <i.icon className="h-5 w-5" />
                      </span>
                      <div>
                        <div className="text-xs font-medium uppercase tracking-wide text-ink-900/45">
                          {i.label}
                        </div>
                        {i.href ? (
                          <a
                            href={i.href}
                            className="text-sm font-medium text-ink-900 hover:text-royal-600"
                          >
                            {i.value}
                          </a>
                        ) : (
                          <div className="text-sm font-medium text-ink-900">
                            {i.value}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-ink-900 to-royal-800 p-7 text-white shadow-soft">
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-royal-500/40 blur-2xl" />
                <h3 className="relative font-display text-lg font-semibold">
                  Fast, friendly responses
                </h3>
                <p className="relative mt-2 text-sm text-white/70">
                  Every enquiry is stored securely and reviewed by our team. No
                  bots, no spam — just a real conversation about your goals.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal direction="left">
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
