"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Code2, Smartphone, Rocket, Wand2 } from "lucide-react";

// Animated visual of a website + mobile app being "built".
// A browser window assembles its layout while a phone slides in, with floating
// technology chips orbiting around them.
export function HeroVisual() {
  const reduce = useReducedMotion();

  const bar = (w: string, delay: number, tone = "bg-mist-300") => (
    <motion.div
      className={`h-2.5 rounded-full ${tone}`}
      style={{ width: w }}
      initial={{ scaleX: 0, originX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      transition={{ delay: reduce ? 0 : delay, duration: 0.5 }}
    />
  );

  const floaters = [
    { icon: Code2, className: "-left-6 top-6", label: "Web" },
    { icon: Smartphone, className: "-right-4 top-24", label: "Apps" },
    { icon: Rocket, className: "-left-4 bottom-10", label: "Growth" },
    { icon: Wand2, className: "right-8 -bottom-4", label: "Design" },
  ];

  return (
    <div className="relative mx-auto w-full max-w-md">
      {/* Glow */}
      <div className="absolute inset-0 -z-10 rounded-[2rem] bg-royal-500/20 blur-3xl" />

      {/* Browser window */}
      <motion.div
        className="card overflow-hidden"
        initial={{ opacity: 0, y: 30, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-1.5 border-b border-mist-300/70 bg-mist-100 px-4 py-3">
          <span className="h-3 w-3 rounded-full bg-red-400" />
          <span className="h-3 w-3 rounded-full bg-amber-400" />
          <span className="h-3 w-3 rounded-full bg-emerald-400" />
          <div className="ml-3 h-5 flex-1 rounded-md bg-white/70" />
        </div>
        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            {bar("40%", 0.2, "bg-royal-500")}
            <div className="flex gap-1.5">
              {bar("18px", 0.3)}
              {bar("18px", 0.35)}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <motion.div
              className="col-span-2 h-24 rounded-xl bg-gradient-to-br from-royal-500/90 to-ink-900"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: reduce ? 0 : 0.5, duration: 0.5 }}
            />
            <div className="space-y-2">
              {bar("100%", 0.6)}
              {bar("80%", 0.7)}
              {bar("90%", 0.8)}
              {bar("60%", 0.9)}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-14 rounded-xl bg-mist-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: reduce ? 0 : 0.9 + i * 0.1 }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Phone */}
      <motion.div
        className="absolute -bottom-8 -right-2 w-28 rounded-[1.6rem] border-4 border-ink-900 bg-white shadow-soft sm:w-32"
        initial={{ opacity: 0, x: 40, y: 20 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ delay: reduce ? 0 : 0.8, duration: 0.6 }}
      >
        <div className="mx-auto mt-1.5 h-1.5 w-8 rounded-full bg-ink-900/20" />
        <div className="space-y-2 p-3">
          <div className="h-16 rounded-lg bg-gradient-to-br from-royal-500 to-royal-700" />
          {bar("100%", 1.1)}
          {bar("70%", 1.2)}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="h-8 rounded-lg bg-mist-200" />
            <div className="h-8 rounded-lg bg-mist-200" />
          </div>
        </div>
      </motion.div>

      {/* Floating tech chips */}
      {floaters.map((f, i) => (
        <motion.div
          key={f.label}
          className={`absolute ${f.className} glass flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-ink-900 shadow-card`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={
            reduce
              ? { opacity: 1, scale: 1 }
              : { opacity: 1, scale: 1, y: [0, -8, 0] }
          }
          transition={{
            opacity: { delay: 1 + i * 0.15 },
            scale: { delay: 1 + i * 0.15 },
            y: {
              duration: 3 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            },
          }}
        >
          <f.icon className="h-3.5 w-3.5 text-royal-600" />
          {f.label}
        </motion.div>
      ))}
    </div>
  );
}
