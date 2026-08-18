"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  FolderKanban,
  Trash2,
  Pencil,
  Plus,
  Eye,
  EyeOff,
  Star,
  ExternalLink,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { AdminHeader, Panel, EmptyState } from "@/components/admin/ui";
import { Modal } from "@/components/admin/Modal";
import { useToast } from "@/components/admin/useToast";

const empty = {
  title: "",
  category: "",
  description: "",
  image_url: "",
  live_url: "",
  tags: "",
  is_public: true,
  featured: false,
};

export function ProjectsManager() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setProjects((data ?? []) as Project[]);
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
  function openEdit(p: Project) {
    setEditingId(p.id);
    setForm({
      title: p.title,
      category: p.category ?? "",
      description: p.description ?? "",
      image_url: p.image_url ?? "",
      live_url: p.live_url ?? "",
      tags: (p.tags ?? []).join(", "),
      is_public: p.is_public,
      featured: p.featured,
    });
    setOpen(true);
  }

  async function save() {
    if (!form.title.trim()) {
      toast("Title is required.", "error");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const payload = {
      title: form.title,
      slug: slugify(form.title) || null,
      category: form.category || null,
      description: form.description || null,
      image_url: form.image_url || null,
      live_url: form.live_url || null,
      tags: form.tags
        ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
        : [],
      is_public: form.is_public,
      featured: form.featured,
    };

    if (editingId) {
      const { error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", editingId);
      setSaving(false);
      if (error) return toast(error.message, "error");
      toast("Project updated");
    } else {
      const { error } = await supabase.from("projects").insert(payload);
      setSaving(false);
      if (error) return toast(error.message, "error");
      toast("Project added");
    }
    setOpen(false);
    load();
  }

  async function togglePublic(p: Project) {
    const supabase = createClient();
    const { error } = await supabase
      .from("projects")
      .update({ is_public: !p.is_public })
      .eq("id", p.id);
    if (error) return toast(error.message, "error");
    setProjects((list) =>
      list.map((x) => (x.id === p.id ? { ...x, is_public: !x.is_public } : x))
    );
    toast(p.is_public ? "Hidden from website" : "Now visible on website");
  }

  async function remove(p: Project) {
    if (!confirm(`Delete project "${p.title}"?`)) return;
    const supabase = createClient();
    const { error } = await supabase.from("projects").delete().eq("id", p.id);
    if (error) return toast(error.message, "error");
    setProjects((list) => list.filter((x) => x.id !== p.id));
    toast("Project deleted");
  }

  return (
    <>
      <AdminHeader
        title="Projects"
        subtitle="Manage your portfolio. Changes appear on the public site."
        action={
          <button onClick={openNew} className="btn-primary">
            <Plus className="h-4 w-4" /> Add project
          </button>
        }
      />

      {loading ? (
        <Panel className="grid place-items-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-royal-500" />
        </Panel>
      ) : error ? (
        <Panel className="py-10 text-center">
          <p className="text-sm text-rose-600">Failed to load: {error}</p>
          <button onClick={load} className="btn-secondary mt-4">
            Try again
          </button>
        </Panel>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="h-10 w-10" />}
          title="No projects yet"
          hint="Add your first portfolio item to showcase it on the website."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <Panel key={p.id} className="flex flex-col gap-3 p-0">
              <div className="relative aspect-[16/10] overflow-hidden rounded-t-2xl bg-mist-200">
                {p.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image_url}
                    alt={p.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-ink-900/30">
                    <FolderKanban className="h-8 w-8" />
                  </div>
                )}
                <div className="absolute left-2 top-2 flex gap-1.5">
                  {p.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                      <Star className="h-3 w-3" /> Featured
                    </span>
                  )}
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                      p.is_public
                        ? "bg-emerald-500 text-white"
                        : "bg-ink-900/60 text-white"
                    }`}
                  >
                    {p.is_public ? "Public" : "Hidden"}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col px-4 pb-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-ink-900">{p.title}</h3>
                  {p.category && (
                    <span className="shrink-0 text-xs text-ink-900/50">
                      {p.category}
                    </span>
                  )}
                </div>
                <p className="mt-1 line-clamp-2 flex-1 text-sm text-ink-900/60">
                  {p.description}
                </p>
                <div className="mt-3 flex items-center justify-between border-t border-mist-200 pt-3">
                  {p.live_url ? (
                    <a
                      href={p.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-medium text-royal-600 hover:text-royal-700"
                    >
                      Live <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-ink-900/30">No live URL</span>
                  )}
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => togglePublic(p)}
                      className="grid h-8 w-8 place-items-center rounded-lg border border-mist-300 text-ink-900/60 hover:border-royal-400 hover:text-royal-600"
                      title={p.is_public ? "Hide" : "Show"}
                    >
                      {p.is_public ? (
                        <Eye className="h-3.5 w-3.5" />
                      ) : (
                        <EyeOff className="h-3.5 w-3.5" />
                      )}
                    </button>
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
              </div>
            </Panel>
          ))}
        </div>
      )}

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editingId ? "Edit project" : "Add project"}
        wide
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" required className="sm:col-span-2">
            <input
              className="input"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </Field>
          <Field label="Category">
            <input
              className="input"
              placeholder="Website / Mobile App / …"
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            />
          </Field>
          <Field label="Tags (comma separated)">
            <input
              className="input"
              placeholder="Website, Booking"
              value={form.tags}
              onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
            />
          </Field>
          <Field label="Image URL" className="sm:col-span-2">
            <input
              className="input"
              placeholder="https://…"
              value={form.image_url}
              onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
            />
          </Field>
          <Field label="Live URL" className="sm:col-span-2">
            <input
              className="input"
              placeholder="https://…"
              value={form.live_url}
              onChange={(e) => setForm((f) => ({ ...f, live_url: e.target.value }))}
            />
          </Field>
          <Field label="Description" className="sm:col-span-2">
            <textarea
              rows={3}
              className="input resize-none"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-ink-900/75">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-mist-300 text-royal-500"
              checked={form.is_public}
              onChange={(e) => setForm((f) => ({ ...f, is_public: e.target.checked }))}
            />
            Show on public website
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-900/75">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-mist-300 text-royal-500"
              checked={form.featured}
              onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
            />
            Feature this project
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
