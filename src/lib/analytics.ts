import { LEAD_STATUSES, type Lead, type LeadStatus } from "@/lib/types";
import { pct } from "@/lib/utils";

export interface DashboardStats {
  total: number;
  byStatus: Record<LeadStatus, number>;
  newLeads: number;
  interested: number;
  followUps: number;
  converted: number;
  rejected: number;
  contacted: number;
  conversionRate: number; // converted / total
  successPercentage: number; // (interested + converted) / total
  followUpPercentage: number;
  rejectionPercentage: number;
  statusPie: { status: LeadStatus; value: number }[];
  monthly: { month: string; leads: number }[];
  conversions: { month: string; conversions: number }[];
}

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function computeStats(leads: Lead[]): DashboardStats {
  const byStatus = LEAD_STATUSES.reduce(
    (acc, s) => ({ ...acc, [s]: 0 }),
    {} as Record<LeadStatus, number>
  );
  for (const l of leads) {
    if (byStatus[l.status] !== undefined) byStatus[l.status] += 1;
  }

  const total = leads.length;

  // Last 6 months buckets.
  const now = new Date();
  const buckets: { key: string; label: string; leads: number; conversions: number }[] =
    [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    buckets.push({
      key: `${d.getFullYear()}-${d.getMonth()}`,
      label: MONTHS[d.getMonth()],
      leads: 0,
      conversions: 0,
    });
  }
  const index = new Map(buckets.map((b, i) => [b.key, i]));

  for (const l of leads) {
    const d = new Date(l.created_at);
    const key = `${d.getFullYear()}-${d.getMonth()}`;
    const idx = index.get(key);
    if (idx !== undefined) {
      buckets[idx].leads += 1;
      if (l.status === "converted") buckets[idx].conversions += 1;
    }
  }

  return {
    total,
    byStatus,
    newLeads: byStatus.new,
    contacted: byStatus.contacted,
    interested: byStatus.interested,
    followUps: byStatus.follow_up,
    converted: byStatus.converted,
    rejected: byStatus.rejected,
    conversionRate: pct(byStatus.converted, total),
    successPercentage: pct(byStatus.interested + byStatus.converted, total),
    followUpPercentage: pct(byStatus.follow_up, total),
    rejectionPercentage: pct(byStatus.rejected, total),
    statusPie: LEAD_STATUSES.map((s) => ({ status: s, value: byStatus[s] })),
    monthly: buckets.map((b) => ({ month: b.label, leads: b.leads })),
    conversions: buckets.map((b) => ({
      month: b.label,
      conversions: b.conversions,
    })),
  };
}
