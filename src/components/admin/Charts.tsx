"use client";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { LEAD_STATUS_LABELS, type LeadStatus } from "@/lib/types";

const STATUS_COLORS: Record<LeadStatus, string> = {
  new: "#0ea5e9",
  contacted: "#6366f1",
  interested: "#8b5cf6",
  follow_up: "#f59e0b",
  converted: "#10b981",
  rejected: "#f43f5e",
};

export function LeadStatusPie({
  data,
}: {
  data: { status: LeadStatus; value: number }[];
}) {
  const chartData = data
    .filter((d) => d.value > 0)
    .map((d) => ({
      name: LEAD_STATUS_LABELS[d.status],
      value: d.value,
      color: STATUS_COLORS[d.status],
    }));

  if (chartData.length === 0) {
    return <ChartEmpty />;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={chartData}
          dataKey="value"
          nameKey="name"
          innerRadius={55}
          outerRadius={90}
          paddingAngle={3}
          stroke="none"
        >
          {chartData.map((d) => (
            <Cell key={d.name} fill={d.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={tooltipStyle}
          formatter={(v: number) => [v, "Leads"]}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          wrapperStyle={{ fontSize: 12 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function MonthlyLeadsBar({
  data,
}: {
  data: { month: string; leads: number }[];
}) {
  if (data.every((d) => d.leads === 0)) return <ChartEmpty />;
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#60A5FA" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="month" tick={axisTick} tickLine={false} axisLine={false} />
        <YAxis tick={axisTick} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(37,99,235,0.06)" }} />
        <Bar dataKey="leads" fill="url(#barGrad)" radius={[6, 6, 0, 0]} maxBarSize={44} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ConversionsLine({
  data,
}: {
  data: { month: string; conversions: number }[];
}) {
  if (data.every((d) => d.conversions === 0)) return <ChartEmpty />;
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data} margin={{ top: 10, right: 12, left: -18, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
        <XAxis dataKey="month" tick={axisTick} tickLine={false} axisLine={false} />
        <YAxis tick={axisTick} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Line
          type="monotone"
          dataKey="conversions"
          stroke="#10b981"
          strokeWidth={3}
          dot={{ r: 4, fill: "#10b981" }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

const axisTick = { fontSize: 12, fill: "#64748b" };
const tooltipStyle = {
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  boxShadow: "0 8px 30px -12px rgba(10,37,64,0.25)",
  fontSize: 13,
};

function ChartEmpty() {
  return (
    <div className="grid h-[260px] place-items-center text-sm text-ink-900/40">
      No data yet
    </div>
  );
}
