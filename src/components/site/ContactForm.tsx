"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, AlertCircle, Send } from "lucide-react";
import { leadSchema, type LeadInput } from "@/lib/validations";

const businessTypes = [
  "Startup",
  "Small Business",
  "E-commerce",
  "Agency",
  "Enterprise",
  "Individual / Freelancer",
  "Other",
];
const serviceOptions = [
  "Website Development",
  "Mobile App Development",
  "Digital Growth",
  "Business Solutions",
  "Not sure yet",
];
const budgetOptions = [
  "Under ₹10,000",
  "₹10,000 – ₹50,000",
  "₹50,000 – ₹1,00,000",
  "₹1,00,000+",
  "Let's discuss",
];

type Status = "idle" | "loading" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadInput>();

  async function onSubmit(values: LeadInput) {
    setStatus("loading");
    setServerError(null);

    // Client-side validation with the shared zod schema.
    const parsed = leadSchema.safeParse(values);
    if (!parsed.success) {
      setStatus("error");
      setServerError(parsed.error.errors[0]?.message ?? "Please check the form.");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus("error");
        setServerError(
          json?.error ?? "Something went wrong. Please try again shortly."
        );
        return;
      }

      setStatus("success");
      reset();
    } catch {
      setStatus("error");
      setServerError("Network error. Please check your connection and retry.");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card flex flex-col items-center gap-4 p-10 text-center"
      >
        <div className="grid h-16 w-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-semibold text-ink-900">
          Thank you — we&apos;ve got your message!
        </h3>
        <p className="max-w-sm text-sm text-ink-900/65">
          Our team will review your enquiry and get back to you within one
          business day. Your submission has been saved securely.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="btn-secondary mt-2"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card p-6 sm:p-8" noValidate>
      {/* Honeypot (hidden from users) */}
      <div className="hidden" aria-hidden>
        <label>
          Company website
          <input tabIndex={-1} autoComplete="off" {...register("company_website")} />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" error={errors.name?.message} required>
          <input
            className="input"
            placeholder="Your full name"
            {...register("name")}
          />
        </Field>
        <Field label="Business Name" error={errors.business_name?.message}>
          <input
            className="input"
            placeholder="Your company"
            {...register("business_name")}
          />
        </Field>
        <Field label="Phone Number" error={errors.phone?.message} required>
          <input
            className="input"
            placeholder="+91 00000 00000"
            {...register("phone")}
          />
        </Field>
        <Field label="Email" error={errors.email?.message} required>
          <input
            type="email"
            className="input"
            placeholder="you@example.com"
            {...register("email")}
          />
        </Field>
        <Field label="Business Type" error={errors.business_type?.message}>
          <select className="input" defaultValue="" {...register("business_type")}>
            <option value="" disabled>
              Select…
            </option>
            {businessTypes.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Service Required" error={errors.service?.message}>
          <select className="input" defaultValue="" {...register("service")}>
            <option value="" disabled>
              Select…
            </option>
            {serviceOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Budget" error={errors.budget?.message} className="sm:col-span-2">
          <select className="input" defaultValue="" {...register("budget")}>
            <option value="" disabled>
              Select a range…
            </option>
            {budgetOptions.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>
        <Field
          label="Message"
          error={errors.message?.message}
          className="sm:col-span-2"
        >
          <textarea
            rows={4}
            className="input resize-none"
            placeholder="Tell us about your project…"
            {...register("message")}
          />
        </Field>
      </div>

      <AnimatePresence>
        {status === "error" && serverError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-5 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertCircle className="h-4 w-4 shrink-0" /> {serverError}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary mt-6 w-full"
      >
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> Send message
          </>
        )}
      </button>
      <p className="mt-3 text-center text-xs text-ink-900/45">
        Your information is stored securely and never shared.
      </p>
    </form>
  );
}

function Field({
  label,
  error,
  required,
  className,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="label">
        {label} {required && <span className="text-royal-600">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
