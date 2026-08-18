"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Loader2,
  Users,
  Trash2,
  Pencil,
  Plus,
  Phone,
  Mail,
  Calendar,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  type Client,
  type LeadStatus,
} from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { AdminHeader, Panel, StatusBadge, EmptyState } from "@/components/admin/ui";
import { Modal } from "@/components/admin/Modal";
import { useToast } from "@/components/admin/useToast";

const empty = {
  business_name: "",
  contact_person: "",
  phone: "",
  email: "",
  service: "",
  status: "new" as LeadStatus,
  notes: "",
  follow_up_date: "",
};

export function ClientsManager() {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setClients((data ?? []) as Client[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return clients.filter((c) => {
      const matchesStatus = filter === "all" || c.status === filter;
      const matchesQuery =
        !q ||
        [c.business_name, c.contact_person, c.email, c.phone, c.service]
          .filter(Boolean)
          .some((v) => v!.toLowerCase().includes(q));
      return matchesStatus && matchesQuery;
    });
  }, [clients, query, filter]);

  function openNew() {
    setEditingId(null);
    setForm(empty);
    setOpen(true);
  }
  function openEdit(c: Client) {
    setEditingId(c.id);
    setForm({
      business_name: c.business_name,
      contact_person: c.contact_person ?? "",
      phone: c.phone ?? "",
      email: c.email ?? "",
      service: c.service ?? "",
      status: c.status,
      notes: c.notes ?? "",
      follow_up_date: c.follow_up_date ?? "",
    });
    setOpen(true);
  }

  async function save() {
    if (!form.business_name.trim()) {
      toast("Business name is required.", "error");
      return;
    }
    setSaving(true);
    const supabase = createClient();
    const payload = {
      business_name: form.business_name,
      contact_person: form.contact_person || null,
      phone: form.phone || null,
      email: form.email || null,
      service: form.service || null,
      status: form.status,
      notes: form.notes || null,
      follow_up_date: form.follow_up_date || null,
    };

    if (editingId) {
      const { error } = await supabase
        .from("clients")
        .update(payload)
        .eq("id", editingId);
      setSaving(false);
      if (error) return toast(error.message, "error");
      toast("Client updated");
    } else {
      const { error } = await supabase.from("clients").insert(payload);
      setSaving(false);
      if (error) return toast(error.message, "error");
      toast("Client added");
    }
    setOpen(false);
    load();
  }

  async function remove(c: Client) {
    if (!confirm(`Delete client "${c.business_name}"?`)) return;
    const supabase = createClient();
    const { error } = await supabase.from("clients").delete().eq("id", c.id);
    if (error) return toast(error.message, "error");
    setClients((list) => list.filter((x) => x.id !== c.id));
    toast("Client deleted");
  }

  return (
    <>
      <AdminHeader
        title="Clients"
        subtitle="Manage client relationships, notes and follow-ups."
        action={
          <button onClick={openNew} className="btn-primary">
            <Plus className="h-4 w-4" /> Add client
          </button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:min-w-[220px] sm:flex-none">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-900/40" />
          <input
            className="input pl-10"
            placeholder="Search clients…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          className="input w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value as LeadStatus | "all")}
        >
          <option value="all">All statuses</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {LEAD_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

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
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Users className="h-10 w-10" />}
          title="No clients yet"
          hint="Add a client manually, or convert a lead from the Leads page."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {filtered.map((c) => (
            <Panel key={c.id} className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="font-semibold text-ink-900">
                    {c.business_name}
                  </div>
                  {c.contact_person && (
                    <div className="text-sm text-ink-900/55">
                      {c.contact_person}
                    </div>
                  )}
                </div>
                <StatusBadge status={c.status} />
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-900/60">
                {c.email && (
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" /> {c.email}
                  </span>
                )}
                {c.phone && (
                  <span className="inline-flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5" /> {c.phone}
                  </span>
                )}
                {c.service && <span>{c.service}</span>}
                {c.follow_up_date && (
                  <span className="inline-flex items-center gap-1 text-amber-600">
                    <Calendar className="h-3.5 w-3.5" /> {formatDate(c.follow_up_date)}
                  </span>
                )}
              </div>
              {c.notes && (
                <p className="line-clamp-2 rounded-lg bg-mist-100 px-3 py-2 text-xs text-ink-900/65">
                  {c.notes}
                </p>
              )}
              <div className="flex items-center justify-between border-t border-mist-200 pt-3">
                <span className="text-xs text-ink-900/40">
                  Added {formatDate(c.created_at)}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => openEdit(c)}
                    className="grid h-8 w-8 place-items-center rounded-lg border border-mist-300 text-ink-900/60 hover:border-royal-400 hover:text-royal-600"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => remove(c)}
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
        title={editingId ? "Edit client" : "Add client"}
        wide
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Business Name" required>
            <input
              className="input"
              value={form.business_name}
              onChange={(e) => setForm((f) => ({ ...f, business_name: e.target.value }))}
            />
          </Field>
          <Field label="Contact Person">
            <input
              className="input"
              value={form.contact_person}
              onChange={(e) => setForm((f) => ({ ...f, contact_person: e.target.value }))}
            />
          </Field>
          <Field label="Phone">
            <input
              className="input"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            />
          </Field>
          <Field label="Email">
            <input
              type="email"
              className="input"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            />
          </Field>
          <Field label="Service">
            <input
              className="input"
              value={form.service}
              onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
            />
          </Field>
          <Field label="Status">
            <select
              className="input"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as LeadStatus }))}
            >
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {LEAD_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Follow-up date" className="sm:col-span-2">
            <input
              type="date"
              className="input"
              value={form.follow_up_date}
              onChange={(e) => setForm((f) => ({ ...f, follow_up_date: e.target.value }))}
            />
          </Field>
          <Field label="Notes" className="sm:col-span-2">
            <textarea
              rows={3}
              className="input resize-none"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </Field>
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
