"use client";

import { useState } from "react";
import { IndianRupee, MessageSquareQuote, Settings2 } from "lucide-react";
import { AdminHeader } from "@/components/admin/ui";
import { PricingEditor } from "@/components/admin/PricingEditor";
import { TestimonialsEditor } from "@/components/admin/TestimonialsEditor";
import { SettingsEditor } from "@/components/admin/SettingsEditor";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "pricing", label: "Pricing", icon: IndianRupee },
  { id: "testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { id: "content", label: "Site Content", icon: Settings2 },
] as const;

type TabId = (typeof tabs)[number]["id"];

export function ContentManager() {
  const [tab, setTab] = useState<TabId>("pricing");
  return (
    <>
      <AdminHeader
        title="Content & Pricing"
        subtitle="Edit prices, testimonials and site content — no code required."
      />

      <div className="mb-6 inline-flex rounded-xl border border-mist-300 bg-white p-1 shadow-sm">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
              tab === t.id
                ? "bg-royal-500 text-white shadow-glow"
                : "text-ink-900/60 hover:text-ink-900"
            )}
          >
            <t.icon className="h-4 w-4" /> {t.label}
          </button>
        ))}
      </div>

      {tab === "pricing" && <PricingEditor />}
      {tab === "testimonials" && <TestimonialsEditor />}
      {tab === "content" && <SettingsEditor />}
    </>
  );
}
