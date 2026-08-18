import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_SERVICE_ROLE_KEY, SUPABASE_URL } from "@/lib/env";

// ---------------------------------------------------------------------------
// Service-role client. Bypasses RLS. NEVER import this into a client component.
// The `server-only` import guarantees a build error if that is ever attempted.
//
// Used only from trusted server code — e.g. the rate-limited /api/contact
// route needs to insert leads for anonymous visitors reliably.
// ---------------------------------------------------------------------------
export function createAdminClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Supabase service-role credentials are not configured (SUPABASE_SERVICE_ROLE_KEY)."
    );
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
