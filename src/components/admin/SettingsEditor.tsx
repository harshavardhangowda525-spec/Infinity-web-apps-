"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Panel } from "@/components/admin/ui";
import { useToast } from "@/components/admin/useToast";
import {
  fallbackCompany,
  fallbackHero,
  fallbackStats,
} from "@/lib/fallback";
import type { CompanySettings, HeroSettings, StatsSettings } from "@/lib/types";

export function SettingsEditor() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [company, setCompany] = useState<CompanySettings>(fallbackCompany);
  const [hero, setHero] = useState<HeroSettings>(fallbackHero);
  const [stats, setStats] = useState<StatsSettings>(fallbackStats);

  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("site_settings")
        .select("key,value")
        .in("key", ["company", "hero", "stats"]);
      for (const row of data ?? []) {
        if (row.key === "company")
          setCompany({ ...fallbackCompany, ...(row.value as object) });
        if (row.key === "hero")
          setHero({ ...fallbackHero, ...(row.value as object) });
        if (row.key === "stats")
          setStats({ ...fallbackStats, ...(row.value as object) });
      }
      setLoading(false);
    })();
  }, []);

  async function saveKey(key: string, value: object) {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key, value, is_public: true }, { onConflict: "key" });
    setSaving(false);
    if (error) return toast(error.message, "error");
    toast("Saved");
  }

  if (loading)
    return (
      <Panel className="grid place-items-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-royal-500" />
      </Panel>
    );

  return (
    <div className="space-y-6">
      {/* Company */}
      <Panel>
        <h3 className="mb-4 font-semibold text-ink-900">Company information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Company name">
            <input
              className="input"
              value={company.name}
              onChange={(e) => setCompany((c) => ({ ...c, name: e.target.value }))}
            />
          </Field>
          <Field label="Tagline">
            <input
              className="input"
              value={company.tagline}
              onChange={(e) => setCompany((c) => ({ ...c, tagline: e.target.value }))}
            />
          </Field>
          <Field label="Email">
            <input
              className="input"
              value={company.email}
              onChange={(e) => setCompany((c) => ({ ...c, email: e.target.value }))}
            />
          </Field>
          <Field label="Phone">
            <input
              className="input"
              value={company.phone}
              onChange={(e) => setCompany((c) => ({ ...c, phone: e.target.value }))}
            />
          </Field>
          <Field label="Address" className="sm:col-span-2">
            <input
              className="input"
              value={company.address}
              onChange={(e) => setCompany((c) => ({ ...c, address: e.target.value }))}
            />
          </Field>
          <Field label="Twitter URL">
            <input
              className="input"
              value={company.socials.twitter ?? ""}
              onChange={(e) =>
                setCompany((c) => ({
                  ...c,
                  socials: { ...c.socials, twitter: e.target.value },
                }))
              }
            />
          </Field>
          <Field label="LinkedIn URL">
            <input
              className="input"
              value={company.socials.linkedin ?? ""}
              onChange={(e) =>
                setCompany((c) => ({
                  ...c,
                  socials: { ...c.socials, linkedin: e.target.value },
                }))
              }
            />
          </Field>
          <Field label="Instagram URL">
            <input
              className="input"
              value={company.socials.instagram ?? ""}
              onChange={(e) =>
                setCompany((c) => ({
                  ...c,
                  socials: { ...c.socials, instagram: e.target.value },
                }))
              }
            />
          </Field>
          <Field label="GitHub URL">
            <input
              className="input"
              value={company.socials.github ?? ""}
              onChange={(e) =>
                setCompany((c) => ({
                  ...c,
                  socials: { ...c.socials, github: e.target.value },
                }))
              }
            />
          </Field>
        </div>
        <SaveBtn saving={saving} onClick={() => saveKey("company", company)} />
      </Panel>

      {/* Hero */}
      <Panel>
        <h3 className="mb-4 font-semibold text-ink-900">Homepage hero</h3>
        <div className="grid gap-4">
          <Field label="Title">
            <input
              className="input"
              value={hero.title}
              onChange={(e) => setHero((h) => ({ ...h, title: e.target.value }))}
            />
          </Field>
          <Field label="Subtitle">
            <input
              className="input"
              value={hero.subtitle}
              onChange={(e) => setHero((h) => ({ ...h, subtitle: e.target.value }))}
            />
          </Field>
          <Field label="Body">
            <textarea
              rows={3}
              className="input resize-none"
              value={hero.body}
              onChange={(e) => setHero((h) => ({ ...h, body: e.target.value }))}
            />
          </Field>
        </div>
        <SaveBtn saving={saving} onClick={() => saveKey("hero", hero)} />
      </Panel>

      {/* Stats */}
      <Panel>
        <h3 className="mb-4 font-semibold text-ink-900">Company statistics</h3>
        <div className="grid gap-4 sm:grid-cols-4">
          <Field label="Projects">
            <input
              type="number"
              className="input"
              value={stats.projects}
              onChange={(e) =>
                setStats((s) => ({ ...s, projects: Number(e.target.value) }))
              }
            />
          </Field>
          <Field label="Clients">
            <input
              type="number"
              className="input"
              value={stats.clients}
              onChange={(e) =>
                setStats((s) => ({ ...s, clients: Number(e.target.value) }))
              }
            />
          </Field>
          <Field label="Years">
            <input
              type="number"
              className="input"
              value={stats.years}
              onChange={(e) =>
                setStats((s) => ({ ...s, years: Number(e.target.value) }))
              }
            />
          </Field>
          <Field label="Satisfaction %">
            <input
              type="number"
              className="input"
              value={stats.satisfaction}
              onChange={(e) =>
                setStats((s) => ({ ...s, satisfaction: Number(e.target.value) }))
              }
            />
          </Field>
        </div>
        <SaveBtn saving={saving} onClick={() => saveKey("stats", stats)} />
      </Panel>
    </div>
  );
}

function SaveBtn({ saving, onClick }: { saving: boolean; onClick: () => void }) {
  return (
    <div className="mt-5 flex justify-end">
      <button onClick={onClick} disabled={saving} className="btn-primary">
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Save className="h-4 w-4" /> Save
          </>
        )}
      </button>
    </div>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
