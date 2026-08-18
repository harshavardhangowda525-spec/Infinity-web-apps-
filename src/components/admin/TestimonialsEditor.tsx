"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, MessageSquareQuote, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Testimonial } from "@/lib/types";
import { Panel, EmptyState } from "@/components/admin/ui";
import { Modal } from "@/components/admin/Modal";
import { useToast } from "@/components/admin/useToast";

const empty = {
  author: "",
  role: "",
  company: "",
  quote: "",
  rating: 5,
  is_public: true,
};

export function TestimonialsEditor() {
  const { toast } = useToast();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .order("sort_order", { ascending: true });
    setItems((data ?? []) as Testimonial[]);
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
  function openEdit(t: Testimonial) {
    setEditingId(t.id);
    setForm({
      author: t.author,
      role: t.role ?? "",
      company: t.company ?? "",
      quote: t.quote,
      rating: t.rating ?? 5,
      is_public: t.is_public,
    });
    setOpen(true);
  }

  async function save() {
    if (!form.author.trim() || !form.quote.trim()) {
      toast("Author and quote are required.", "error");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const payload = {
      author: form.author,
      role: form.role || null,
      company: form.company || null,
      quote: form.quote,
      rating: form.rating,
      is_public: form.is_public,
    };
    const res = editingId
      ? await supabase.from("testimonials").update(payload).eq("id", editingId)
      : await supabase.from("testimonials").insert(payload);
    setSaving(false);
    if (res.error) return toast(res.error.message, "error");
    toast(editingId ? "Testimonial updated" : "Testimonial added");
    setOpen(false);
    load();
  }

  async function remove(t: Testimonial) {
    if (!confirm(`Delete testimonial from ${t.author}?`)) return;
    const supabase = createClient();
    const { error } = await supabase.from("testimonials").delete().eq("id", t.id);
    if (error) return toast(error.message, "error");
    setItems((list) => list.filter((x) => x.id !== t.id));
    toast("Testimonial deleted");
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
          <Plus className="h-4 w-4" /> Add testimonial
        </button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<MessageSquareQuote className="h-10 w-10" />}
          title="No testimonials yet"
          hint="Add client testimonials to build trust on your website."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((t) => (
            <Panel key={t.id} className="flex flex-col gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating ?? 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="line-clamp-3 text-sm text-ink-900/70">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-1 flex items-center justify-between border-t border-mist-200 pt-2">
                <div>
                  <div className="text-sm font-medium text-ink-900">{t.author}</div>
                  <div className="text-xs text-ink-900/50">
                    {[t.role, t.company].filter(Boolean).join(" · ")}
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => openEdit(t)}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-mist-300 text-ink-900/60 hover:border-royal-400 hover:text-royal-600"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => remove(t)}
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
        title={editingId ? "Edit testimonial" : "Add testimonial"}
        wide
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Author" required>
            <input
              className="input"
              value={form.author}
              onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
            />
          </Field>
          <Field label="Rating">
            <select
              className="input"
              value={form.rating}
              onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} star{r > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Role">
            <input
              className="input"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            />
          </Field>
          <Field label="Company">
            <input
              className="input"
              value={form.company}
              onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
            />
          </Field>
          <Field label="Quote" required className="sm:col-span-2">
            <textarea
              rows={4}
              className="input resize-none"
              value={form.quote}
              onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-ink-900/75">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-mist-300 text-royal-500"
              checked={form.is_public}
              onChange={(e) => setForm((f) => ({ ...f, is_public: e.target.checked }))}
            />
            Show on website
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
