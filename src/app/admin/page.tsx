import Link from "next/link";
import {
  Users,
  Sparkles,
  Heart,
  Clock,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Target,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { computeStats } from "@/lib/analytics";
import { formatDateTime } from "@/lib/utils";
import { AdminHeader, Panel, StatusBadge } from "@/components/admin/ui";
import {
  LeadStatusPie,
  MonthlyLeadsBar,
  ConversionsLine,
} from "@/components/admin/Charts";
import type { Lead } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = createClient();
  const { data } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  const leads = (data ?? []) as Lead[];
  const stats = computeStats(leads);
  const recent = leads.slice(0, 6);

  const cards = [
    { label: "Total Contacted", value: stats.total, icon: Users, tone: "text-royal-600 bg-royal-50" },
    { label: "New Leads", value: stats.newLeads, icon: Sparkles, tone: "text-sky-600 bg-sky-50" },
    { label: "Interested", value: stats.interested, icon: Heart, tone: "text-violet-600 bg-violet-50" },
    { label: "Follow Ups", value: stats.followUps, icon: Clock, tone: "text-amber-600 bg-amber-50" },
    { label: "Converted", value: stats.converted, icon: CheckCircle2, tone: "text-emerald-600 bg-emerald-50" },
    { label: "Rejected", value: stats.rejected, icon: XCircle, tone: "text-rose-600 bg-rose-50" },
  ];

  const rates = [
    { label: "Conversion Rate", value: stats.conversionRate, icon: Target },
    { label: "Success %", value: stats.successPercentage, icon: TrendingUp },
    { label: "Follow-Up %", value: stats.followUpPercentage, icon: Clock },
    { label: "Rejection %", value: stats.rejectionPercentage, icon: XCircle },
  ];

  return (
    <>
      <AdminHeader
        title="Dashboard"
        subtitle="An overview of your leads, conversions and pipeline."
      />

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {cards.map((c) => (
          <Panel key={c.label} className="flex flex-col gap-3">
            <span className={`grid h-10 w-10 place-items-center rounded-xl ${c.tone}`}>
              <c.icon className="h-5 w-5" />
            </span>
            <div>
              <div className="font-display text-2xl font-bold text-ink-900">
                {c.value}
              </div>
              <div className="text-xs text-ink-900/55">{c.label}</div>
            </div>
          </Panel>
        ))}
      </div>

      {/* Rate cards */}
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {rates.map((r) => (
          <Panel key={r.label}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-900/60">{r.label}</span>
              <r.icon className="h-4 w-4 text-royal-500" />
            </div>
            <div className="mt-2 flex items-end gap-1">
              <span className="font-display text-3xl font-bold text-ink-900">
                {r.value}
              </span>
              <span className="mb-1 text-sm text-ink-900/50">%</span>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-mist-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-royal-500 to-royal-400"
                style={{ width: `${Math.min(r.value, 100)}%` }}
              />
            </div>
          </Panel>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Panel>
          <h3 className="mb-2 font-semibold text-ink-900">Lead status breakdown</h3>
          <LeadStatusPie data={stats.statusPie} />
        </Panel>
        <Panel>
          <h3 className="mb-2 font-semibold text-ink-900">Leads (last 6 months)</h3>
          <MonthlyLeadsBar data={stats.monthly} />
        </Panel>
        <Panel className="lg:col-span-2">
          <h3 className="mb-2 font-semibold text-ink-900">Conversions over time</h3>
          <ConversionsLine data={stats.conversions} />
        </Panel>
      </div>

      {/* Recent leads */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold text-ink-900">Recent leads</h3>
          <Link
            href="/admin/leads"
            className="inline-flex items-center gap-1 text-sm font-medium text-royal-600 hover:text-royal-700"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <Panel className="overflow-hidden p-0">
          {recent.length === 0 ? (
            <div className="p-10 text-center text-sm text-ink-900/50">
              No leads yet. Submissions from the contact form will appear here.
            </div>
          ) : (
            <div className="scroll-slim overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-mist-300/70 text-left text-xs uppercase tracking-wide text-ink-900/45">
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Service</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 font-medium">Received</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((l) => (
                    <tr
                      key={l.id}
                      className="border-b border-mist-200 last:border-0 hover:bg-mist-100/60"
                    >
                      <td className="px-5 py-3">
                        <div className="font-medium text-ink-900">{l.name}</div>
                        <div className="text-xs text-ink-900/50">{l.email}</div>
                      </td>
                      <td className="px-5 py-3 text-ink-900/70">
                        {l.service || "—"}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={l.status} />
                      </td>
                      <td className="px-5 py-3 text-ink-900/60">
                        {formatDateTime(l.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      </div>
    </>
  );
}
