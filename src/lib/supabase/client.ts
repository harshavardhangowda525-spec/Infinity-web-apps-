"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/env";

// Browser Supabase client (uses the public anon key; RLS enforces access).
// A fallback placeholder URL keeps the client from throwing when env is absent;
// any call will simply fail gracefully and the UI shows an error state.
export function createClient() {
  return createBrowserClient(
    SUPABASE_URL || "https://placeholder.supabase.co",
    SUPABASE_ANON_KEY || "placeholder-anon-key"
  );
}
