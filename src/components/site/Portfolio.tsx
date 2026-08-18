"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/site/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import type { Project } from "@/lib/types";

export function Portfolio({
  projects,
  showFilters = true,
  heading = true,
}: {
  projects: Project[];
  showFilters?: boolean;
  heading?: boolean;
}) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.category && set.add(p.category));
    return ["All", ...Array.from(set)];
  }, [projects]);

  const [active, setActive] = useState("All");
  const filtered =
    active === "All"
      ? projects
      : projects.filter((p) => p.category === active);

  return (
    <section id="projects" className="section relative">
      <div className="container-x">
        {heading && (
          <SectionHeader
            eyebrow="Our work"
            title="Projects we're proud of"
            subtitle="A selection of websites, apps and business tools we've crafted for clients."
          />
        )}

        {showFilters && categories.length > 2 && (
          <div className="mt-10 flex flex-wrap justify-center gap-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  active === c
                    ? "bg-royal-500 text-white shadow-glow"
                    : "border border-mist-300 bg-white text-ink-900/70 hover:border-royal-500/40 hover:text-royal-600"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((p, i) => (
              <motion.div
                key={p.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.05 }}
              >
                <ProjectCard project={p} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filtered.length === 0 && (
          <Reveal className="mt-12 text-center text-ink-900/50">
            No projects to show yet — check back soon.
          </Reveal>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-mist-300/70 bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft">
      <div className="relative aspect-[16/10] overflow-hidden bg-mist-200">
        {project.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.image_url}
            alt={project.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-to-br from-royal-500/20 to-ink-900/10 text-royal-600">
            {project.title}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {project.category && (
          <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink-900 backdrop-blur">
            {project.category}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-ink-900">{project.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-900/65">
          {project.description}
        </p>

        <div className="mt-4 flex items-center justify-between">
          {project.tags && project.tags.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {project.tags.slice(0, 2).map((t) => (
                <span
                  key={t}
                  className="rounded-full bg-mist-200 px-2.5 py-0.5 text-xs text-ink-900/60"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : (
            <span />
          )}

          {project.live_url ? (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-semibold text-royal-600 hover:text-royal-700"
            >
              View Project <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-1 text-sm font-semibold text-ink-900/40">
              Case study <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
