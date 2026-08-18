import "server-only";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import {
  fallbackCompany,
  fallbackHero,
  fallbackPricing,
  fallbackProjects,
  fallbackServices,
  fallbackStats,
  fallbackTestimonials,
} from "@/lib/fallback";
import type {
  CompanySettings,
  HeroSettings,
  Pricing,
  Project,
  Service,
  StatsSettings,
  Testimonial,
} from "@/lib/types";

// ---------------------------------------------------------------------------
// Public data-access layer for Server Components. Every function returns live
// Supabase data when configured, and falls back to seeded content otherwise so
// the marketing site always renders.
// ---------------------------------------------------------------------------

export async function getServices(): Promise<Service[]> {
  if (!isSupabaseConfigured) return fallbackServices;
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return fallbackServices;
    return data as Service[];
  } catch {
    return fallbackServices;
  }
}

export async function getPricing(): Promise<Pricing[]> {
  if (!isSupabaseConfigured) return fallbackPricing;
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("pricing")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return fallbackPricing;
    return data as Pricing[];
  } catch {
    return fallbackPricing;
  }
}

export async function getProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured) return fallbackProjects;
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_public", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return fallbackProjects;
    return data as Project[];
  } catch {
    return fallbackProjects;
  }
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (!isSupabaseConfigured) return fallbackTestimonials;
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_public", true)
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return fallbackTestimonials;
    return data as Testimonial[];
  } catch {
    return fallbackTestimonials;
  }
}

async function getSetting<T>(key: string, fallback: T): Promise<T> {
  if (!isSupabaseConfigured) return fallback;
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", key)
      .single();
    if (error || !data?.value) return fallback;
    return { ...fallback, ...(data.value as object) } as T;
  } catch {
    return fallback;
  }
}

export function getCompany(): Promise<CompanySettings> {
  return getSetting<CompanySettings>("company", fallbackCompany);
}

export function getHero(): Promise<HeroSettings> {
  return getSetting<HeroSettings>("hero", fallbackHero);
}

export function getStats(): Promise<StatsSettings> {
  return getSetting<StatsSettings>("stats", fallbackStats);
}

// ---- Single-record lookups (for detail pages) ------------------------------

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const all = await getServices();
  return all.find((s) => s.slug === slug) ?? null;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const all = await getProjects();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getPricingById(id: string): Promise<Pricing | null> {
  const all = await getPricing();
  return all.find((p) => p.id === id) ?? null;
}
