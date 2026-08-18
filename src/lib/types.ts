// ---------------------------------------------------------------------------
// Shared domain types (mirror the Supabase schema in supabase/schema.sql)
// ---------------------------------------------------------------------------

export type LeadStatus =
  | "new"
  | "contacted"
  | "interested"
  | "follow_up"
  | "converted"
  | "rejected";

export const LEAD_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "interested",
  "follow_up",
  "converted",
  "rejected",
];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  interested: "Interested",
  follow_up: "Follow Up",
  converted: "Converted",
  rejected: "Rejected",
};

export type UserRole = "admin" | "staff" | "viewer";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  name: string;
  business_name: string | null;
  phone: string | null;
  email: string;
  business_type: string | null;
  service: string | null;
  budget: string | null;
  message: string | null;
  status: LeadStatus;
  source: string | null;
  notes: string | null;
  follow_up_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  business_name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  service: string | null;
  status: LeadStatus;
  notes: string | null;
  follow_up_date: string | null;
  lead_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string | null;
  category: string | null;
  description: string | null;
  image_url: string | null;
  live_url: string | null;
  tags: string[] | null;
  is_public: boolean;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string | null;
  description: string | null;
  icon: string | null;
  features: string[] | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Pricing {
  id: string;
  name: string;
  price_label: string;
  price_amount: number | null;
  currency: string | null;
  period: string | null;
  description: string | null;
  features: string[] | null;
  highlighted: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string | null;
  company: string | null;
  quote: string;
  avatar_url: string | null;
  rating: number | null;
  is_public: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SiteSetting {
  key: string;
  value: Record<string, unknown>;
  is_public: boolean;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  actor_id: string | null;
  actor_email: string | null;
  action: string;
  entity: string | null;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// Convenient shape for the settings we read on the site.
export interface CompanySettings {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  socials: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    github?: string;
  };
}

export interface HeroSettings {
  title: string;
  subtitle: string;
  body: string;
}

export interface StatsSettings {
  projects: number;
  clients: number;
  years: number;
  satisfaction: number;
}
