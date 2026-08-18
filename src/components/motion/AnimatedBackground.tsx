"use client";

import { motion, useReducedMotion } from "framer-motion";

// Performant animated hero background: layered radial glows, a subtle grid,
// floating orbs, and an SVG "digital connections" network of animated dots/lines.
// Uses transform/opacity only (GPU-friendly) and honours reduced-motion.
export function AnimatedBackground() {
  const reduce = useReducedMotion();

  const nodes = [
    { x: 12, y: 24 },
    { x: 30, y: 62 },
    { x: 48, y: 20 },
    { x: 68, y: 54 },
    { x: 84, y: 28 },
    { x: 58, y: 80 },
    { x: 22, y: 84 },
  ];
  const links: [number, number][] = [
    [0, 1],
    [1, 2],
    [2, 3],
    [3, 4],
    [1, 5],
    [5, 3],
    [0, 6],
    [6, 5],
  ];

  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-mist-100 to-white" />
      {/* Radial brand glow */}
      <div className="absolute inset-0 bg-hero-radial" />
      {/* Grid */}
      <div className="absolute inset-0 bg-grid-lines [background-size:40px_40px] [mask-image:radial-gradient(70%_60%_at_50%_30%,black,transparent)]" />

      {/* Floating orbs */}
      {!reduce && (
        <>
          <motion.div
            className="absolute -left-16 top-16 h-72 w-72 rounded-full bg-royal-400/25 blur-3xl"
            animate={{ y: [0, -30, 0], x: [0, 20, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-0 top-40 h-80 w-80 rounded-full bg-ink-900/10 blur-3xl"
            animate={{ y: [0, 24, 0], x: [0, -18, 0] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-royal-300/20 blur-3xl"
            animate={{ y: [0, -18, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      {/* Digital connections network */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden
      >
        {links.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={nodes[a].x}
            y1={nodes[a].y}
            x2={nodes[b].x}
            y2={nodes[b].y}
            stroke="rgba(37,99,235,0.18)"
            strokeWidth={0.15}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              reduce
                ? { pathLength: 1, opacity: 0.6 }
                : { pathLength: [0, 1], opacity: [0, 0.7, 0.3] }
            }
            transition={{
              duration: 4,
              delay: i * 0.3,
              repeat: reduce ? 0 : Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
        {nodes.map((n, i) => (
          <motion.circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={0.6}
            fill="#2563EB"
            animate={reduce ? {} : { r: [0.5, 0.9, 0.5], opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 3,
              delay: i * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </div>
  );
}
