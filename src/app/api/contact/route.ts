import { NextResponse } from "next/server";
import { leadSchema } from "@/lib/validations";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, SUPABASE_SERVICE_ROLE_KEY } from "@/lib/env";

export const runtime = "nodejs";

// Public contact endpoint: validates, rate-limits, and persists a lead.
export async function POST(req: Request) {
  // ---- Rate limit: 5 submissions / 10 min per IP -------------------------
  const ip = clientIp(req);
  const rl = rateLimit(`contact:${ip}`, { limit: 5, windowMs: 10 * 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again in a few minutes." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  // ---- Parse & validate ---------------------------------------------------
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Validation failed." },
      { status: 422 }
    );
  }

  // Honeypot check — silently accept but drop obvious bots.
  if (parsed.data.company_website) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  if (!isSupabaseConfigured) {
    return NextResponse.json(
      {
        error:
          "The site is not yet connected to a database. Add your Supabase credentials to enable submissions.",
      },
      { status: 503 }
    );
  }

  const { company_website, ...lead } = parsed.data;

  const record = {
    name: lead.name,
    business_name: lead.business_name || null,
    phone: lead.phone || null,
    email: lead.email,
    business_type: lead.business_type || null,
    service: lead.service || null,
    budget: lead.budget || null,
    message: lead.message || null,
    status: "new" as const,
    source: "website",
  };

  try {
    // Prefer the service-role client so anonymous submissions persist reliably;
    // fall back to the RLS-guarded anon client (policy allows status='new').
    const db = SUPABASE_SERVICE_ROLE_KEY
      ? createAdminClient()
      : createClient();

    const { error } = await db.from("leads").insert(record);
    if (error) {
      console.error("[contact] insert error:", error.message);
      return NextResponse.json(
        { error: "We couldn't save your message. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (e) {
    console.error("[contact] unexpected error:", e);
    return NextResponse.json(
      { error: "Unexpected server error. Please try again shortly." },
      { status: 500 }
    );
  }
}
