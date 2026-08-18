"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

// Branded first-paint loading animation. Shows briefly on the initial mount,
// then fades away. Disabled for reduced-motion users.
export function PageLoader() {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (reduce) {
      setDone(true);
      return;
    }
    // Only show on the very first visit of a session.
    if (sessionStorage.getItem("iwa_loaded")) {
      setDone(true);
      return;
    }
    const t = setTimeout(() => {
      sessionStorage.setItem("iwa_loaded", "1");
      setDone(true);
    }, 1500);
    return () => clearTimeout(t);
  }, [reduce]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[100] grid place-items-center bg-ink-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <div className="flex flex-col items-center gap-6">
            <motion.svg
              viewBox="0 0 64 32"
              className="h-16 w-32"
              initial="hidden"
              animate="visible"
            >
              <defs>
                <linearGradient id="loader-grad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#60A5FA" />
                  <stop offset="100%" stopColor="#2563EB" />
                </linearGradient>
              </defs>
              <motion.path
                d="M16 6 C 6 6, 6 26, 16 26 C 26 26, 26 6, 32 16 C 38 26, 48 26, 48 16 C 48 6, 38 6, 32 16 C 26 26, 22 26, 16 26 Z"
                fill="none"
                stroke="url(#loader-grad)"
                strokeWidth="3"
                strokeLinecap="round"
                variants={{
                  hidden: { pathLength: 0, opacity: 0.2 },
                  visible: {
                    pathLength: 1,
                    opacity: 1,
                    transition: { duration: 1.2, ease: "easeInOut" },
                  },
                }}
              />
            </motion.svg>
            <motion.div
              className="flex flex-col items-center gap-1"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <span className="font-display text-lg font-semibold text-white">
                Infinity Web &amp; Apps
              </span>
              <span className="text-xs text-royal-300">
                Websites. Mobile Apps. Digital Growth.
              </span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
