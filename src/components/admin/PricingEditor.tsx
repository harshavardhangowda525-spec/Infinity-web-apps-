"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, IndianRupee, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Pricing } from "@/lib/types";
import { Panel, EmptyState } from "@/components/admin/ui";
import { Modal } from "@/components/admin/Modal";
import { useToast } from "@/components/admin/useToast";

const empty = {
  name: "",
  price_label: "",
  price_amount: "",
  currency: "INR",
  period: "",
  description: "",
  features: "",
  highlighted: false,
  is_active: true,
};

export function PricingEditor() {
  const { toast } = useToast();
  const [plans, setPlans] = useState<Pricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("pricing")
      .select("*")
      .order("sort_order", { ascending: true });
    setPlans((data ?? []) as Pricing[]);
    setLoading(false);
  }
  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setEditingId(null);
    setForm(empty);
    setOpen(true);
  }
  function openEdit(p: Pricing) {
    setEditingId(p.id);
    setForm({
      name: p.name,
      price_label: p.price_label,
      price_amount: p.price_amount?.toString() ?? "",
      currency: p.currency ?? "INR",
      period: p.period ?? "",
      description: p.description ?? "",
      features: (p.features ?? []).join("\n"),
      highlighted: p.highlighted,
      is_active: p.is_active,
    });
    setOpen(true);
  }

  async function save() {
    if (!form.name.trim() || !form.price_label.trim()) {
      toast("Name and price label are required.", "error");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const payload = {
      name: form.name,
      price_label: form.price_label,
      price_amount: form.price_amount ? Number(form.price_amount) : null,
      currency: form.currency || "INR",
      period: form.period || null,
      description: form.description || null,
      features: form.features
        ? form.features.split("\n").map((f) => f.trim()).filter(Boolean)
        : [],
      highlighted: form.highlighted,
      is_active: form.is_active,
    };
    const res = editingId
      ? await supabase.from("pricing").update(payload).eq("id", editingId)
      : await supabase.from("pricing").insert(payload);
    setSaving(false);
    if (res.error) return toast(res.error.message, "error");
    toast(editingId ? "Pricing updated" : "Plan added");
    setOpen(false);
    load();
  }

  async function remove(p: Pricing) {
    if (!confirm(`Delete plan "${p.name}"?`)) return;
    const supabase = createClient();
    const { error } = await supabase.from("pricing").delete().eq("id", p.id);
    if (error) return toast(error.message, "error");
    setPlans((list) => list.filter((x) => x.id !== p.id));
    toast("Plan deleted");
  }

  if (loading)
    return (
      <Panel className="grid place-items-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-royal-500" />
      </Panel>
    );

  return (
    <>
      <div className="mb-4 flex justify-end">
        <button onClick={openNew} className="btn-primary">
          <Plus className="h-4 w-4" /> Add plan
        </button>
      </div>

      {plans.length === 0 ? (
        <EmptyState
          icon={<IndianRupee className="h-10 w-10" />}
          title="No pricing plans"
          hint="Add plans to display them on the public pricing section."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((p) => (
            <Panel key={p.id} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-ink-900">{p.name}</span>
                {p.highlighted && (
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                )}
              </div>
              <div className="font-display text-lg font-bold text-royal-600">
                {p.price_label}
              </div>
              {p.period && (
                <span className="text-xs text-ink-900/50">{p.period}</span>
              )}
              <p className="line-clamp-2 text-xs text-ink-900/55">
                {p.description}
              </p>
              <div className="mt-1 flex items-center justify-between border-t border-mist-200 pt-2">
                <span
                  className={`text-xs ${p.is_active ? "text-emerald-600" : "text-ink-900/40"}`}
                >
                  {p.is_active ? "Active" : "Hidden"}
                </span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => openEdit(p)}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-mist-300 text-ink-900/60 hover:border-royal-400 hover:text-royal-600"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => remove(p)}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-mist-300 text-ink-900/60 hover:border-rose-400 hover:text-rose-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editingId ? "Edit plan" : "Add plan"}
        wide
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" required>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </Field>
          <Field label="Price label" required>
            <input
              className="input"
              placeholder="Starting from ₹4,999"
              value={form.price_label}
              onChange={(e) => setForm((f) => ({ ...f, price_label: e.target.value }))}
            />
          </Field>
          <Field label="Amount (number, optional)">
            <input
              type="number"
              className="input"
              value={form.price_amount}
              onChange={(e) => setForm((f) => ({ ...f, price_amount: e.target.value }))}
            />
          </Field>
          <Field label="Period">
            <input
              className="input"
              placeholder="one-time / monthly"
              value={form.period}
              onChange={(e) => setForm((f) => ({ ...f, period: e.target.value }))}
            />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <input
              className="input"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </Field>
          <Field label="Features (one per line)" className="sm:col-span-2">
            <textarea
              rows={5}
              className="input resize-none"
              value={form.features}
              onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-ink-900/75">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-mist-300 text-royal-500"
              checked={form.highlighted}
              onChange={(e) => setForm((f) => ({ ...f, highlighted: e.target.checked }))}
            />
            Highlight as popular
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-900/75">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-mist-300 text-royal-500"
              checked={form.is_active}
              onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
            />
            Active (visible on site)
          </label>
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button onClick={() => setOpen(false)} className="btn-ghost">
            Cancel
          </button>
          <button onClick={save} disabled={saving} className="btn-primary">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
          </button>
        </div>
      </Modal>
    </>
  );
}

function Field({
  label,
  required,
  className,
  children,
}: {
  label: string;
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
    </div>
  );
}
