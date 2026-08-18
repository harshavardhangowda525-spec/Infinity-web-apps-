// ---------------------------------------------------------------------------
// Static marketing content that is the same for every deployment.
// Shared by the homepage "Why choose us" section and its detail pages so both
// read from a single source of truth.
// ---------------------------------------------------------------------------

export interface WhyReason {
  slug: string;
  icon: string; // lucide icon name (see components/site/icons.tsx)
  title: string;
  body: string; // short line used on the card
  intro: string; // lead paragraph on the detail page
  points: { title: string; text: string }[];
}

export const whyReasons: WhyReason[] = [
  {
    slug: "modern-technology",
    icon: "Cpu",
    title: "Modern Technology",
    body: "We build on a modern, production-ready stack for reliability and scale.",
    intro:
      "We build every product on a modern, production-ready technology stack — the same tools trusted by leading software companies — so your website or app is fast, secure, and ready to scale as you grow.",
    points: [
      { title: "Production-ready stack", text: "Battle-tested frameworks and tooling, not experimental shortcuts." },
      { title: "Built to scale", text: "Architecture that grows with your traffic and your business." },
      { title: "Secure by default", text: "Modern security practices baked in from day one." },
    ],
  },
  {
    slug: "custom-solutions",
    icon: "Wand2",
    title: "Custom Solutions",
    body: "Every product is tailored to your goals — never a generic template.",
    intro:
      "No two businesses are the same, so we never ship a one-size-fits-all template. Every solution is designed around your specific goals, workflows, and customers.",
    points: [
      { title: "Tailored to you", text: "We start from your goals, not a pre-made theme." },
      { title: "Your workflows", text: "Features and flows shaped around how you actually work." },
      { title: "Room to evolve", text: "Clean foundations that are easy to extend later." },
    ],
  },
  {
    slug: "mobile-friendly-design",
    icon: "Smartphone",
    title: "Mobile-Friendly Design",
    body: "Pixel-perfect experiences that shine on every device and screen size.",
    intro:
      "Most of your visitors are on their phones. We design mobile-first, so your product looks and feels flawless on every device — from small phones to large desktops.",
    points: [
      { title: "Mobile-first", text: "Designed for phones first, then scaled up beautifully." },
      { title: "Every screen size", text: "Tested across phones, tablets, and desktops." },
      { title: "Touch-friendly", text: "Controls and layouts that feel natural to tap and swipe." },
    ],
  },
  {
    slug: "fast-performance",
    icon: "Gauge",
    title: "Fast Performance",
    body: "Optimised assets and clean code for lightning-fast load times.",
    intro:
      "Speed wins customers. We optimise images, code, and delivery so your pages load in a blink — improving both your conversions and your search rankings.",
    points: [
      { title: "Lightning-fast loads", text: "Optimised assets and modern delivery for instant pages." },
      { title: "Better SEO", text: "Fast sites rank higher and keep visitors engaged." },
      { title: "Higher conversions", text: "Every saved second means more customers who stay." },
    ],
  },
  {
    slug: "business-focused",
    icon: "Rocket",
    title: "Business-Focused Development",
    body: "We build for outcomes — conversions, growth, and measurable results.",
    intro:
      "We don't build technology for its own sake. Every decision is measured against what matters to you: more leads, more sales, and measurable business growth.",
    points: [
      { title: "Outcome-driven", text: "We focus on results, not just features." },
      { title: "Conversion-focused", text: "Designs built to turn visitors into customers." },
      { title: "Measurable growth", text: "Clear analytics so you can see what's working." },
    ],
  },
  {
    slug: "ongoing-support",
    icon: "LifeBuoy",
    title: "Ongoing Support",
    body: "We stick around after launch with dependable maintenance and support.",
    intro:
      "Launch day is just the beginning. We provide dependable maintenance, updates, and support so your product keeps running smoothly long after it goes live.",
    points: [
      { title: "After-launch care", text: "We stay with you well beyond go-live." },
      { title: "Reliable maintenance", text: "Updates and fixes handled dependably." },
      { title: "A real partner", text: "Responsive help whenever you need it." },
    ],
  },
];

export function getWhyReason(slug: string): WhyReason | undefined {
  return whyReasons.find((r) => r.slug === slug);
}
