"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Loader2,
  Inbox,
  Trash2,
  Pencil,
  UserPlus,
  Phone,
  Mail,
  RefreshCw,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  type Lead,
  type LeadStatus,
} from "@/lib/types";
import { formatDateTime } from "@/lib/utils";
import { AdminHeader, Panel, StatusBadge, EmptyState } from "@/components/admin/ui";
import { Modal } from "@/components/admin/Modal";
import { useToast } from "@/components/admin/useToast";

export function LeadsManager() {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<LeadStatus | "all">("all");
  const [editing, setEditing] = useState<Lead | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ status: "new" as LeadStatus, notes: "", follow_up_date: "" });

  async function load() {
    setLoading(true);
    setError(null);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) setError(error.message);
    else setLeads((data ?? []) as Lead[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((l) => {
      const matchesStatus = filter === "all" || l.status === filter;
      const matchesQuery =
        !q ||
        [l.name, l.email, l.business_name, l.phone, l.service]
          .filter(Boolean)
          .some((v) => v!.toLowerCase().includes(q));
      return matchesStatus && matchesQuery;
    });
  }, [leads, query, filter]);

  function openEdit(lead: Lead) {
    setEditing(lead);
    setForm({
      status: lead.status,
      notes: lead.notes ?? "",
      follow_up_date: lead.follow_up_date ?? "",
    });
  }

  async function saveEdit() {
    if (!editing) return;
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("leads")
      .update({
        status: form.status,
        notes: form.notes || null,
        follow_up_date: form.follow_up_date || null,
      })
      .eq("id", editing.id);
    setSaving(false);
    if (error) {
      toast(error.message, "error");
      return;
    }
    setLeads((prev) =>
      prev.map((l) =>
        l.id === editing.id
          ? { ...l, status: form.status, notes: form.notes, follow_up_date: form.follow_up_date }
          : l
      )
    );
    toast("Lead updated");
    setEditing(null);
  }

  async function quickStatus(lead: Lead, status: LeadStatus) {
    const supabase = createClient();
    const prev = lead.status;
    setLeads((list) =>
      list.map((l) => (l.id === lead.id ? { ...l, status } : l))
    );
    const { error } = await supabase
      .from("leads")
      .update({ status })
      .eq("id", lead.id);
    if (error) {
      toast(error.message, "error");
      setLeads((list) =>
        list.map((l) => (l.id === lead.id ? { ...l, status: prev } : l))
      );
    } else {
      toast(`Marked as ${LEAD_STATUS_LABELS[status]}`);
    }
  }

  async function convertToClient(lead: Lead) {
    const supabase = createClient();
    const { error } = await supabase.from("clients").insert({
      business_name: lead.business_name || lead.name,
      contact_person: lead.name,
      phone: lead.phone,
      email: lead.email,
      service: lead.service,
      status: lead.status,
      notes: lead.notes,
      lead_id: lead.id,
    });
    if (error) {
      toast(error.message, "error");
      return;
    }
    toast("Added to clients");
  }

  async function remove(lead: Lead) {
    if (!confirm(`Delete lead from ${lead.name}? This cannot be undone.`)) return;
    const supabase = createClient();
    const { error } = await supabase.from("leads").delete().eq("id", lead.id);
    if (error) {
      toast(error.message, "error");
      return;
    }
    setLeads((list) => list.filter((l) => l.id !== lead.id));
    toast("Lead deleted");
  }

  return (
    <>
      <AdminHeader
        title="Leads"
        subtitle="Every contact-form submission, saved permanently."
        action={
          <button onClick={load} className="btn-secondary">
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 sm:min-w-[220px] sm:flex-none">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-900/40" />
          <input
            className="input pl-10"
            placeholder="Search name, email, phone…"
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
        <span className="text-sm text-ink-900/50">
          {filtered.length} of {leads.length}
        </span>
      </div>

      {loading ? (
        <Panel className="grid place-items-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-royal-500" />
        </Panel>
      ) : error ? (
        <Panel className="py-10 text-center">
          <p className="text-sm text-rose-600">Failed to load leads: {error}</p>
          <button onClick={load} className="btn-secondary mt-4">
            Try again
          </button>
        </Panel>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Inbox className="h-10 w-10" />}
          title="No leads found"
          hint="Submissions from your website contact form will appear here."
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => (
            <Panel key={lead.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-semibold text-ink-900">{lead.name}</span>
                  {lead.business_name && (
                    <span className="text-sm text-ink-900/50">
                      · {lead.business_name}
                    </span>
                  )}
                  <StatusBadge status={lead.status} />
                </div>
                <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-900/60">
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5" /> {lead.email}
                  </span>
                  {lead.phone && (
                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" /> {lead.phone}
                    </span>
                  )}
                  {lead.service && <span>{lead.service}</span>}
                  {lead.budget && <span>Budget: {lead.budget}</span>}
                  <span>{formatDateTime(lead.created_at)}</span>
                </div>
                {lead.message && (
                  <p className="mt-2 line-clamp-2 text-sm text-ink-900/70">
                    {lead.message}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <select
                  className="input w-auto py-2 text-xs"
                  value={lead.status}
                  onChange={(e) => quickStatus(lead, e.target.value as LeadStatus)}
                  aria-label="Change status"
                >
                  {LEAD_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {LEAD_STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => openEdit(lead)}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-mist-300 text-ink-900/60 hover:border-royal-400 hover:text-royal-600"
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => convertToClient(lead)}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-mist-300 text-ink-900/60 hover:border-emerald-400 hover:text-emerald-600"
                  title="Add to clients"
                >
                  <UserPlus className="h-4 w-4" />
                </button>
                <button
                  onClick={() => remove(lead)}
                  className="grid h-9 w-9 place-items-center rounded-lg border border-mist-300 text-ink-900/60 hover:border-rose-400 hover:text-rose-600"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </Panel>
          ))}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing ? `Edit lead — ${editing.name}` : "Edit lead"}
      >
        <div className="space-y-4">
          <div>
            <label className="label">Status</label>
            <select
              className="input"
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({ ...f, status: e.target.value as LeadStatus }))
              }
            >
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {LEAD_STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Follow-up date</label>
            <input
              type="date"
              className="input"
              value={form.follow_up_date}
              onChange={(e) =>
                setForm((f) => ({ ...f, follow_up_date: e.target.value }))
              }
            />
          </div>
          <div>
            <label className="label">Notes</label>
            <textarea
              rows={4}
              className="input resize-none"
              placeholder="Add internal notes about this lead…"
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setEditing(null)} className="btn-ghost">
              Cancel
            </button>
            <button onClick={saveEdit} disabled={saving} className="btn-primary">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save changes"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
