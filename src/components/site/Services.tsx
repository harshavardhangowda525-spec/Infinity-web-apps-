"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { SectionHeader } from "@/components/site/SectionHeader";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { resolveIcon } from "@/components/site/icons";
import type { Service } from "@/lib/types";

export function Services({
  services,
  showAll = false,
}: {
  services: Service[];
  showAll?: boolean;
}) {
  return (
    <section id="services" className="section relative">
      <div className="container-x">
        <SectionHeader
          eyebrow="What we do"
          title="Services built to grow your business"
          subtitle="From first pixel to launch and beyond — we design, build, and scale the digital products your business needs."
        />

        <RevealGroup className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <RevealItem key={s.id}>
              <ServiceCard service={s} showAll={showAll} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  showAll,
}: {
  service: Service;
  showAll: boolean;
}) {
  const [open, setOpen] = useState(false);
  const Icon = resolveIcon(service.icon);
  const features = service.features ?? [];

  return (
    <motion.div
      className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-mist-300/70 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:border-royal-500/30 hover:shadow-soft"
      whileHover={{ scale: 1.01 }}
    >
      {/* Hover glow */}
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-royal-500/10 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-royal-500 to-ink-900 text-white shadow-glow transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="text-lg font-semibold text-ink-900">{service.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-900/65">
        {service.description}
      </p>

      {(open || showAll) && features.length > 0 && (
        <motion.ul
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 space-y-2"
        >
          {features.map((f) => (
            <li
              key={f}
              className="flex items-center gap-2 text-sm text-ink-900/75"
            >
              <Check className="h-4 w-4 shrink-0 text-royal-600" /> {f}
            </li>
          ))}
        </motion.ul>
      )}

      {!showAll && (
        <button
          onClick={() => setOpen((v) => !v)}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-royal-600 transition-colors hover:text-royal-700"
        >
          {open ? "Show less" : "Learn More"}
          <ArrowRight
            className={`h-4 w-4 transition-transform ${open ? "rotate-90" : "group-hover:translate-x-1"}`}
          />
        </button>
      )}

      {showAll && (
        <Link
          href="/contact"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-royal-600 hover:text-royal-700"
        >
          Enquire now <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </motion.div>
  );
}
