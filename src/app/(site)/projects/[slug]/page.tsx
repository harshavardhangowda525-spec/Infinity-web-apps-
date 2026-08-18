import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import { PageBanner } from "@/components/site/PageBanner";
import { Reveal } from "@/components/motion/Reveal";
import { CTA } from "@/components/site/CTA";
import { getProjectBySlug } from "@/lib/data";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: "Project" };
  return {
    title: project.title,
    description: project.description ?? undefined,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  return (
    <>
      <PageBanner eyebrow={project.category ?? "Project"} title={project.title} subtitle={project.description ?? undefined} />

      <section className="section pt-2">
        <div className="container-x">
          <Reveal>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-900/60 hover:text-royal-600"
            >
              <ArrowLeft className="h-4 w-4" /> All projects
            </Link>
          </Reveal>

          <Reveal className="mt-8">
            <div className="overflow-hidden rounded-3xl border border-mist-300/70 shadow-soft">
              {project.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="aspect-[16/9] w-full object-cover"
                />
              ) : (
                <div className="grid aspect-[16/9] w-full place-items-center bg-gradient-to-br from-royal-500/20 to-ink-900/10 font-display text-2xl font-bold text-royal-600">
                  {project.title}
                </div>
              )}
            </div>
          </Reveal>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
            <Reveal>
              <div>
                <h2 className="text-2xl font-bold text-ink-900">About this project</h2>
                <p className="mt-4 leading-relaxed text-ink-900/70">
                  {project.description}
                </p>
                <p className="mt-4 leading-relaxed text-ink-900/70">
                  We partnered closely with the client to shape{" "}
                  {project.title} — from planning and design through to build and
                  launch — delivering a polished{" "}
                  {(project.category ?? "digital").toLowerCase()} experience focused
                  on real business results.
                </p>
              </div>
            </Reveal>

            <Reveal direction="left">
              <div className="card p-7">
                <dl className="space-y-4 text-sm">
                  {project.category && (
                    <div className="flex justify-between gap-4">
                      <dt className="text-ink-900/50">Category</dt>
                      <dd className="font-medium text-ink-900">{project.category}</dd>
                    </div>
                  )}
                  {project.tags && project.tags.length > 0 && (
                    <div>
                      <dt className="text-ink-900/50">Tags</dt>
                      <dd className="mt-2 flex flex-wrap gap-1.5">
                        {project.tags.map((t) => (
                          <span
                            key={t}
                            className="rounded-full bg-mist-200 px-2.5 py-0.5 text-xs text-ink-900/70"
                          >
                            {t}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>

                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary mt-6 w-full"
                  >
                    Visit Live Site <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <Link href="/contact" className="btn-secondary mt-3 w-full">
                  Start a similar project <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <CTA />
    </>
  );
}
