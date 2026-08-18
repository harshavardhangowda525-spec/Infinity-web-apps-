"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2, Lock, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/env";
import { updatePasswordSchema } from "@/lib/validations";

// Landing page for the password-recovery link. Supabase sets a temporary
// session from the email link, allowing the user to set a new password.
export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = updatePasswordSchema.safeParse({ password, confirm });
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? "Please check your input.");
      return;
    }
    if (!isSupabaseConfigured) {
      setError("Authentication is not configured yet.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(
        error.message.toLowerCase().includes("session")
          ? "Your reset link has expired. Please request a new one."
          : error.message
      );
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-8 shadow-soft"
    >
      <h1 className="text-center font-display text-2xl font-bold text-ink-900">
        Set a new password
      </h1>
      <p className="mt-1.5 text-center text-sm text-ink-900/55">
        Choose a strong password for your account.
      </p>

      {error && (
        <div className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-900/40" />
          <input
            type="password"
            className="input pl-11"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-900/40" />
          <input
            type="password"
            className="input pl-11"
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            required
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Updating…
            </>
          ) : (
            "Update password"
          )}
        </button>
      </form>
    </motion.div>
  );
}
