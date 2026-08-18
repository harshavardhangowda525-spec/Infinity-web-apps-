"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured, SITE_URL } from "@/lib/env";
import { resetSchema } from "@/lib/validations";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = resetSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? "Enter a valid email.");
      return;
    }
    if (!isSupabaseConfigured) {
      setError("Authentication is not configured yet.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${SITE_URL}/update-password`,
    });
    setLoading(false);

    // Always show success to avoid leaking which emails are registered.
    if (error && !error.message.toLowerCase().includes("rate")) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-8 text-center shadow-soft"
      >
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h1 className="mt-4 font-display text-xl font-bold text-ink-900">
          Check your inbox
        </h1>
        <p className="mt-2 text-sm text-ink-900/65">
          If an account exists for <strong>{email}</strong>, we&apos;ve sent a
          link to reset your password.
        </p>
        <Link href="/login" className="btn-secondary mt-6">
          Back to sign in
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-8 shadow-soft"
    >
      <h1 className="text-center font-display text-2xl font-bold text-ink-900">
        Reset your password
      </h1>
      <p className="mt-1.5 text-center text-sm text-ink-900/55">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      {error && (
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-900/40" />
          <input
            type="email"
            className="input pl-11"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending…
            </>
          ) : (
            "Send reset link"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-900/60">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-royal-600 hover:text-royal-700">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
