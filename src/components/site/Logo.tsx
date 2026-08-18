import { cn } from "@/lib/utils";

// Original infinity wordmark — an animated gradient-stroked ∞ glyph.
// Not derived from any third-party brand asset.
export function InfinityMark({
  className,
  animate = true,
}: {
  className?: string;
  animate?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 64 32"
      className={cn("h-7 w-14", className)}
      role="img"
      aria-label="Infinity Web & Apps logo"
    >
      <defs>
        <linearGradient id="inf-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0A2540" />
          <stop offset="55%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#60A5FA" />
        </linearGradient>
      </defs>
      <path
        d="M16 6 C 6 6, 6 26, 16 26 C 26 26, 26 6, 32 16 C 38 26, 48 26, 48 16 C 48 6, 38 6, 32 16 C 26 26, 22 26, 16 26 Z"
        fill="none"
        stroke="url(#inf-grad)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        pathLength={100}
        className={animate ? "[stroke-dasharray:100] [stroke-dashoffset:0]" : ""}
      />
    </svg>
  );
}

export function Logo({
  className,
  showText = true,
}: {
  className?: string;
  showText?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-ink-900 to-royal-600 shadow-glow">
        <svg viewBox="0 0 64 32" className="h-4 w-8" aria-hidden>
          <path
            d="M16 6 C 6 6, 6 26, 16 26 C 26 26, 26 6, 32 16 C 38 26, 48 26, 48 16 C 48 6, 38 6, 32 16 C 26 26, 22 26, 16 26 Z"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {showText && (
        <span className="flex flex-col leading-none">
          <span className="font-display text-[15px] font-bold text-ink-900">
            Infinity
          </span>
          <span className="text-[11px] font-medium text-royal-600">
            Web &amp; Apps
          </span>
        </span>
      )}
    </span>
  );
}
