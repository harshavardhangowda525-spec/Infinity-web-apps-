// ---------------------------------------------------------------------------
// Centralised, typed access to environment variables.
//
// `isSupabaseConfigured` lets the app render gracefully (with seeded fallback
// content) even before a Supabase project is connected — so `next build` and
// local preview never crash on missing env. Real data flows the moment the
// env vars are present.
// ---------------------------------------------------------------------------

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const isSupabaseConfigured =
  SUPABASE_URL.length > 0 && SUPABASE_ANON_KEY.length > 0;

// Server-only ----------------------------------------------------------------
export const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);
