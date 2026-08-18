import { z } from "zod";
import { LEAD_STATUSES } from "@/lib/types";

// ---- Contact / Lead form ---------------------------------------------------
export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  business_name: z.string().trim().max(160).optional().or(z.literal("")),
  phone: z
    .string()
    .trim()
    .min(6, "Please enter a valid phone number.")
    .max(30)
    .regex(/^[0-9+\-\s()]+$/, "Phone can only contain digits and + - ( )."),
  email: z.string().trim().email("Please enter a valid email address.").max(160),
  business_type: z.string().trim().max(120).optional().or(z.literal("")),
  service: z.string().trim().max(120).optional().or(z.literal("")),
  budget: z.string().trim().max(120).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  // Honeypot — must be empty. Bots tend to fill every field.
  company_website: z.string().max(0).optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof leadSchema>;

// ---- Auth ------------------------------------------------------------------
export const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const signupSchema = loginSchema.extend({
  full_name: z.string().trim().min(2, "Please enter your name.").max(120),
});

export const resetSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
});

export const updatePasswordSchema = z
  .object({
    password: z.string().min(8, "Use at least 8 characters."),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match.",
    path: ["confirm"],
  });

// ---- Admin: client ---------------------------------------------------------
export const clientSchema = z.object({
  business_name: z.string().trim().min(2, "Business name is required.").max(160),
  contact_person: z.string().trim().max(120).optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  email: z
    .string()
    .trim()
    .email("Enter a valid email.")
    .max(160)
    .optional()
    .or(z.literal("")),
  service: z.string().trim().max(120).optional().or(z.literal("")),
  status: z.enum(LEAD_STATUSES as [string, ...string[]]),
  notes: z.string().trim().max(4000).optional().or(z.literal("")),
  follow_up_date: z.string().optional().or(z.literal("")),
});

// ---- Admin: project --------------------------------------------------------
export const projectSchema = z.object({
  title: z.string().trim().min(2, "Title is required.").max(160),
  category: z.string().trim().max(80).optional().or(z.literal("")),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  image_url: z
    .string()
    .trim()
    .url("Enter a valid image URL.")
    .optional()
    .or(z.literal("")),
  live_url: z
    .string()
    .trim()
    .url("Enter a valid URL.")
    .optional()
    .or(z.literal("")),
  tags: z.string().trim().optional().or(z.literal("")),
  is_public: z.boolean().default(true),
  featured: z.boolean().default(false),
});

// ---- Admin: pricing --------------------------------------------------------
export const pricingSchema = z.object({
  name: z.string().trim().min(2, "Name is required.").max(120),
  price_label: z.string().trim().min(1, "Price label is required.").max(120),
  price_amount: z.coerce.number().nonnegative().optional().or(z.nan()),
  currency: z.string().trim().max(8).optional().or(z.literal("")),
  period: z.string().trim().max(40).optional().or(z.literal("")),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
  features: z.string().trim().optional().or(z.literal("")),
  highlighted: z.boolean().default(false),
  is_active: z.boolean().default(true),
});
