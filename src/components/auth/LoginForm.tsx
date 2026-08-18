"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle, Mail, Lock, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured, SITE_URL } from "@/lib/env";
import { loginSchema, signupSchema } from "@/lib/validations";

type Mode = "login" | "signup";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/admin";

  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (params.get("error") === "unauthorized") {
      setError("Your account doesn't have admin access.");
    } else if (params.get("error") === "auth") {
      setError("Authentication failed. Please try signing in again.");
    }
  }, [params]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);

    if (!isSupabaseConfigured) {
      setError(
        "Authentication is not configured yet. Add your Supabase credentials to enable login."
      );
      return;
    }

    const schema = mode === "login" ? loginSchema : signupSchema;
    const parsed = schema.safeParse(
      mode === "login" ? { email, password } : { email, password, full_name: fullName }
    );
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? "Please check your details.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          setError(friendlyError(error.message));
          return;
        }
        router.push(redirect);
        router.refresh();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${SITE_URL}/auth/callback?next=${redirect}`,
          },
        });
        if (error) {
          setError(friendlyError(error.message));
          return;
        }
        if (data.session) {
          router.push(redirect);
          router.refresh();
        } else {
          setNotice(
            "Account created! Check your email to confirm your address, then sign in."
          );
          setMode("login");
        }
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    if (!isSupabaseConfigured) {
      setError("Authentication is not configured yet.");
      return;
    }
    setError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${SITE_URL}/auth/callback?next=${redirect}` },
    });
    if (error) setError(friendlyError(error.message));
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-8 shadow-soft"
    >
      <h1 className="text-center font-display text-2xl font-bold text-ink-900">
        {mode === "login" ? "Welcome back" : "Create your account"}
      </h1>
      <p className="mt-1.5 text-center text-sm text-ink-900/55">
        {mode === "login"
          ? "Sign in to access your dashboard."
          : "Get started with Infinity Web & Apps."}
      </p>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </motion.div>
        )}
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
          >
            {notice}
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
        {mode === "signup" && (
          <IconField icon={User}>
            <input
              className="input pl-11"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
            />
          </IconField>
        )}
        <IconField icon={Mail}>
          <input
            type="email"
            className="input pl-11"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </IconField>
        <IconField icon={Lock}>
          <input
            type="password"
            className="input pl-11"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
          />
        </IconField>

        {mode === "login" && (
          <div className="text-right">
            <Link
              href="/reset-password"
              className="text-sm font-medium text-royal-600 hover:text-royal-700"
            >
              Forgot password?
            </Link>
          </div>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />{" "}
              {mode === "login" ? "Signing in…" : "Creating account…"}
            </>
          ) : mode === "login" ? (
            "Sign in"
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-mist-300" />
        <span className="text-xs uppercase tracking-wide text-ink-900/40">or</span>
        <span className="h-px flex-1 bg-mist-300" />
      </div>

      <button onClick={handleGoogle} className="btn-secondary w-full">
        <GoogleIcon /> Continue with Google
      </button>

      <p className="mt-6 text-center text-sm text-ink-900/60">
        {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          onClick={() => {
            setMode(mode === "login" ? "signup" : "login");
            setError(null);
            setNotice(null);
          }}
          className="font-semibold text-royal-600 hover:text-royal-700"
        >
          {mode === "login" ? "Sign up" : "Sign in"}
        </button>
      </p>
    </motion.div>
  );
}

function IconField({
  icon: Icon,
  children,
}: {
  icon: typeof Mail;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-900/40" />
      {children}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

function friendlyError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "Incorrect email or password.";
  if (m.includes("email not confirmed"))
    return "Please confirm your email before signing in.";
  if (m.includes("already registered"))
    return "An account with this email already exists. Try signing in.";
  if (m.includes("rate limit")) return "Too many attempts. Please wait a moment.";
  return message;
}
