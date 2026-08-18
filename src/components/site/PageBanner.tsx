import { AnimatedBackground } from "@/components/motion/AnimatedBackground";
import { Reveal } from "@/components/motion/Reveal";

export function PageBanner({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-20">
      <AnimatedBackground />
      <div className="container-x text-center">
        {eyebrow && (
          <Reveal>
            <span className="chip mb-4">{eyebrow}</span>
          </Reveal>
        )}
        <Reveal delay={0.05}>
          <h1 className="mx-auto max-w-3xl font-display text-4xl font-bold tracking-tight sm:text-5xl">
            <span className="heading-gradient">{title}</span>
          </h1>
        </Reveal>
        {subtitle && (
          <Reveal delay={0.1}>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-900/65">
              {subtitle}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
