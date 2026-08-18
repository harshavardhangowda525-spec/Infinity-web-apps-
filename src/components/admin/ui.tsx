import { cn } from "@/lib/utils";
import { LEAD_STATUS_LABELS, type LeadStatus } from "@/lib/types";

export function AdminHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold text-ink-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-900/55">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function Panel({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-mist-300/70 bg-white p-5 shadow-card",
        className
      )}
    >
      {children}
    </div>
  );
}

const statusStyles: Record<LeadStatus, string> = {
  new: "bg-sky-50 text-sky-700 border-sky-200",
  contacted: "bg-indigo-50 text-indigo-700 border-indigo-200",
  interested: "bg-violet-50 text-violet-700 border-violet-200",
  follow_up: "bg-amber-50 text-amber-700 border-amber-200",
  converted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected: "bg-rose-50 text-rose-700 border-rose-200",
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusStyles[status]
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {LEAD_STATUS_LABELS[status]}
    </span>
  );
}

export function EmptyState({
  title,
  hint,
  icon,
}: {
  title: string;
  hint?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-mist-300 bg-white/50 py-16 text-center">
      {icon && <div className="text-ink-900/30">{icon}</div>}
      <div className="text-sm font-medium text-ink-900/70">{title}</div>
      {hint && <div className="max-w-xs text-xs text-ink-900/45">{hint}</div>}
    </div>
  );
}
