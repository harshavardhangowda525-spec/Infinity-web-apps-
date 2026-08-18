// ---------------------------------------------------------------------------
// Fallback / seed content used when Supabase is not yet configured (so the
// public marketing site renders fully during `next build` and previews).
// Once the DB is connected, live data from Supabase replaces all of this.
// ---------------------------------------------------------------------------

import type {
  CompanySettings,
  HeroSettings,
  Pricing,
  Project,
  Service,
  StatsSettings,
  Testimonial,
} from "@/lib/types";

export const fallbackCompany: CompanySettings = {
  name: "Infinity Web & Apps",
  tagline: "Websites. Mobile Apps. Digital Growth.",
  email: "hello@infinitywebapps.com",
  phone: "+91 00000 00000",
  address: "India",
  socials: {
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    instagram: "https://instagram.com",
    github: "https://github.com",
  },
};

export const fallbackHero: HeroSettings = {
  title: "Infinity Web & Apps",
  subtitle: "Websites. Mobile Apps. Digital Growth.",
  body: "Build a stronger digital presence with modern websites, powerful mobile applications, and digital solutions designed to help businesses grow.",
};

export const fallbackStats: StatsSettings = {
  projects: 120,
  clients: 80,
  years: 6,
  satisfaction: 98,
};

const now = new Date().toISOString();

export const fallbackServices: Service[] = [
  {
    id: "s1",
    title: "Website Development",
    slug: "website-development",
    description:
      "Modern, responsive and conversion-focused websites for businesses.",
    icon: "Globe",
    features: ["Responsive design", "SEO ready", "CMS integration", "Blazing fast"],
    is_active: true,
    sort_order: 1,
    created_at: now,
    updated_at: now,
  },
  {
    id: "s2",
    title: "Mobile App Development",
    slug: "mobile-app-development",
    description:
      "Custom Android / iOS applications designed around business requirements.",
    icon: "Smartphone",
    features: ["Native & cross-platform", "Push notifications", "App store launch", "Offline support"],
    is_active: true,
    sort_order: 2,
    created_at: now,
    updated_at: now,
  },
  {
    id: "s3",
    title: "Digital Growth",
    slug: "digital-growth",
    description: "Digital marketing, SEO, social media and online growth solutions.",
    icon: "TrendingUp",
    features: ["SEO strategy", "Social media", "Paid campaigns", "Analytics"],
    is_active: true,
    sort_order: 3,
    created_at: now,
    updated_at: now,
  },
  {
    id: "s4",
    title: "Business Solutions",
    slug: "business-solutions",
    description:
      "Custom dashboards, booking systems, CRM systems and other business tools.",
    icon: "LayoutDashboard",
    features: ["Custom dashboards", "Booking systems", "CRM tools", "Automations"],
    is_active: true,
    sort_order: 4,
    created_at: now,
    updated_at: now,
  },
];

export const fallbackPricing: Pricing[] = [
  {
    id: "p1",
    name: "Websites",
    price_label: "Starting from ₹4,999",
    price_amount: 4999,
    currency: "INR",
    period: "one-time",
    description: "Modern, responsive websites that convert visitors into customers.",
    features: ["Up to 5 pages", "Responsive design", "Contact form", "Basic SEO", "1 month support"],
    highlighted: false,
    is_active: true,
    sort_order: 1,
    created_at: now,
    updated_at: now,
  },
  {
    id: "p2",
    name: "Mobile Apps",
    price_label: "Starting from ₹55,000",
    price_amount: 55000,
    currency: "INR",
    period: "one-time",
    description: "Custom Android & iOS apps built around your business.",
    features: ["Native experience", "Custom features", "App store launch", "Push notifications", "3 months support"],
    highlighted: true,
    is_active: true,
    sort_order: 2,
    created_at: now,
    updated_at: now,
  },
  {
    id: "p3",
    name: "Digital Growth",
    price_label: "Custom pricing",
    price_amount: null,
    currency: "INR",
    period: "monthly",
    description: "Tailored digital marketing and growth engagements.",
    features: ["SEO & content", "Social media", "Paid ads", "Monthly reporting", "Dedicated manager"],
    highlighted: false,
    is_active: true,
    sort_order: 3,
    created_at: now,
    updated_at: now,
  },
];

export const fallbackProjects: Project[] = [
  {
    id: "pr1",
    title: "Aurora Cafe Website",
    slug: "aurora-cafe",
    category: "Website",
    description: "A warm, modern website with online reservations for a boutique cafe.",
    image_url:
      "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=1200&q=80",
    live_url: "https://example.com",
    tags: ["Website", "Booking"],
    is_public: true,
    featured: true,
    sort_order: 1,
    created_at: now,
    updated_at: now,
  },
  {
    id: "pr2",
    title: "FitPulse Mobile App",
    slug: "fitpulse-app",
    category: "Mobile App",
    description: "A cross-platform fitness app with workout tracking and reminders.",
    image_url:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
    live_url: null,
    tags: ["Mobile App", "iOS", "Android"],
    is_public: true,
    featured: true,
    sort_order: 2,
    created_at: now,
    updated_at: now,
  },
  {
    id: "pr3",
    title: "LedgerFlow CRM",
    slug: "ledgerflow-crm",
    category: "Business Solution",
    description: "A custom CRM dashboard for a growing services company.",
    image_url:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    live_url: "https://example.com",
    tags: ["Dashboard", "CRM"],
    is_public: true,
    featured: false,
    sort_order: 3,
    created_at: now,
    updated_at: now,
  },
  {
    id: "pr4",
    title: "BloomMart Store",
    slug: "bloommart-store",
    category: "Website",
    description: "A conversion-focused e-commerce storefront for a local retailer.",
    image_url:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
    live_url: "https://example.com",
    tags: ["Website", "E-commerce"],
    is_public: true,
    featured: false,
    sort_order: 4,
    created_at: now,
    updated_at: now,
  },
];

export const fallbackTestimonials: Testimonial[] = [
  {
    id: "t1",
    author: "Priya Sharma",
    role: "Founder",
    company: "Aurora Cafe",
    quote:
      "Infinity Web & Apps rebuilt our online presence beautifully. Reservations doubled within a month.",
    avatar_url: null,
    rating: 5,
    is_public: true,
    sort_order: 1,
    created_at: now,
    updated_at: now,
  },
  {
    id: "t2",
    author: "Rahul Verma",
    role: "CEO",
    company: "FitPulse",
    quote:
      "They delivered a polished mobile app on time and understood exactly what our users needed.",
    avatar_url: null,
    rating: 5,
    is_public: true,
    sort_order: 2,
    created_at: now,
    updated_at: now,
  },
  {
    id: "t3",
    author: "Ananya Iyer",
    role: "Operations Lead",
    company: "LedgerFlow",
    quote:
      "The custom CRM dashboard saved our team hours every week. Fantastic, responsive support.",
    avatar_url: null,
    rating: 5,
    is_public: true,
    sort_order: 3,
    created_at: now,
    updated_at: now,
  },
];
