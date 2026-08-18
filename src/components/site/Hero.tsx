"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { AnimatedBackground } from "@/components/motion/AnimatedBackground";
import { HeroVisual } from "@/components/site/HeroVisual";
import type { HeroSettings } from "@/lib/types";

export function Hero({ hero }: { hero: HeroSettings }) {
  const reduce = useReducedMotion();

  const words = hero.title.split(" ");

  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      <AnimatedBackground />

      <div className="container-x grid items-center gap-14 lg:grid-cols-2">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="chip">
              <Sparkles className="h-3.5 w-3.5" />
              Digital development studio
            </span>
          </motion.div>

          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
            {words.map((w, i) => (
              <motion.span
                key={i}
                className="mr-[0.25em] inline-block heading-gradient"
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08, duration: 0.5 }}
              >
                {w}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="mt-4 text-xl font-semibold text-royal-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {hero.subtitle}
          </motion.p>

          <motion.p
            className="mt-5 max-w-xl text-base leading-relaxed text-ink-900/70"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {hero.body}
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="/contact" className="btn-primary group">
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/services" className="btn-secondary">
              View Our Services
            </Link>
          </motion.div>

          <motion.div
            className="mt-10 flex items-center gap-6 text-sm text-ink-900/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex -space-x-2">
              {["#2563EB", "#0A2540", "#60A5FA", "#1e40af"].map((c) => (
                <span
                  key={c}
                  className="h-8 w-8 rounded-full border-2 border-white"
                  style={{ background: c }}
                />
              ))}
            </div>
            <span>Trusted by growing businesses across India</span>
          </motion.div>
        </div>

        <div className="relative">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
