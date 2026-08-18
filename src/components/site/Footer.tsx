import Link from "next/link";
import { Twitter, Linkedin, Instagram, Github, Mail, Phone } from "lucide-react";
import { Logo } from "@/components/site/Logo";
import type { CompanySettings } from "@/lib/types";

const cols = [
  {
    title: "Company",
    links: [
      { href: "/", label: "Home" },
      { href: "/services", label: "Services" },
      { href: "/projects", label: "Projects" },
      { href: "/about", label: "About" },
    ],
  },
  {
    title: "Explore",
    links: [
      { href: "/pricing", label: "Pricing" },
      { href: "/contact", label: "Contact" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms & Conditions" },
    ],
  },
];

export function Footer({ company }: { company: CompanySettings }) {
  const socials = [
    { href: company.socials.twitter, icon: Twitter, label: "Twitter" },
    { href: company.socials.linkedin, icon: Linkedin, label: "LinkedIn" },
    { href: company.socials.instagram, icon: Instagram, label: "Instagram" },
    { href: company.socials.github, icon: Github, label: "GitHub" },
  ].filter((s) => s.href);

  return (
    <footer className="relative overflow-hidden bg-ink-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-grid-lines [background-size:44px_44px] opacity-[0.15]" />
      <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-royal-600/30 blur-3xl" />

      <div className="container-x relative py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Logo className="[&_span.text-ink-900]:text-white" />
            <p className="mt-4 max-w-sm text-sm text-white/60">
              {company.tagline}
            </p>
            <p className="mt-4 max-w-sm text-sm text-white/50">
              Build a stronger digital presence with modern websites, powerful
              mobile applications, and digital solutions designed to help
              businesses grow.
            </p>
            <div className="mt-6 flex flex-col gap-2 text-sm text-white/60">
              <a
                href={`mailto:${company.email}`}
                className="inline-flex items-center gap-2 hover:text-white"
              >
                <Mail className="h-4 w-4" /> {company.email}
              </a>
              <a
                href={`tel:${company.phone}`}
                className="inline-flex items-center gap-2 hover:text-white"
              >
                <Phone className="h-4 w-4" /> {company.phone}
              </a>
            </div>
          </div>

          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-white">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/60 transition-colors hover:text-white"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-sm text-white/50">
            © {new Date().getFullYear()} {company.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 bg-white/5 text-white/70 transition-all hover:-translate-y-0.5 hover:border-royal-400/50 hover:text-white"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
