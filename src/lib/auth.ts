import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ADMIN_EMAILS, isSupabaseConfigured } from "@/lib/env";
import type { Profile } from "@/lib/types";

export interface AdminUser {
  id: string;
  email: string;
  profile: Profile | null;
}

// Server helper used by every /admin route. Redirects unauthenticated users to
// /login and non-admins to /login?error=unauthorized. Middleware guards the
// routes too — this is defence in depth at the data-access layer.
export async function requireAdmin(): Promise<AdminUser> {
  if (!isSupabaseConfigured) {
    redirect("/login");
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const isAdmin =
    ADMIN_EMAILS.includes((user.email ?? "").toLowerCase()) ||
    profile?.role === "admin";

  if (!isAdmin) {
    redirect("/login?error=unauthorized");
  }

  return {
    id: user.id,
    email: user.email ?? "",
    profile: (profile as Profile) ?? null,
  };
}
