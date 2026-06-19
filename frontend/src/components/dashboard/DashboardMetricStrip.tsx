// DashboardMetricStrip.tsx - Light system pulse ribbon; hover/focus drops the full metric table.
import { Activity, AlertTriangle, CheckCircle2, ChevronDown, ClipboardList } from "lucide-react";

import type { DashboardStats } from "@/types/dashboard";

type DashboardMetricStripProps = {
  stats: DashboardStats | null;
};

export function DashboardMetricStrip({ stats }: DashboardMetricStripProps) {
  const total = stats?.total_tickets ?? 0;
  const metrics = [
    {
      label: "Tổng phản ánh",
      value: total,
      helper: "toàn hệ thống",
      icon: ClipboardList,
      dot: "bg-brand-600",
      chip: "bg-brand-50 text-brand-700",
    },
    {
      label: "Đang mở",
      value: stats?.open_tickets ?? 0,
      helper: "cần theo dõi",
      icon: Activity,
      dot: "bg-cyan-600",
      chip: "bg-cyan-50 text-cyan-700",
    },
    {
      label: "Đã xử lý",
      value: stats?.resolved_tickets ?? 0,
      helper: "đóng vòng phản hồi",
      icon: CheckCircle2,
      dot: "bg-emerald-600",
      chip: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Ưu tiên cao",
      value: stats?.high_priority_tickets ?? 0,
      helper: "AI đánh dấu",
      icon: AlertTriangle,
      dot: "bg-rose-600",
      chip: "bg-rose-50 text-rose-700",
    },
  ];
  const [, ...pulseMetrics] = metrics;

  return (
    <section className="group relative z-30" aria-label="Dashboard metrics">
      <button
        type="button"
        className="st-card relative flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-3 overflow-hidden rounded-lg border border-line bg-card px-6 py-4 text-left text-ink shadow-command"
        aria-haspopup="true"
        aria-label="Xem bảng số liệu phản ánh"
      >
        <span className="absolute -right-10 -top-12 h-32 w-32 rounded-pill bg-brand-100/60" aria-hidden="true" />
        <span className="relative flex items-center gap-4">
          <span className="relative flex h-2.5 w-2.5 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-pill bg-emerald-600/35" aria-hidden="true" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-pill bg-emerald-600" aria-hidden="true" />
          </span>
          <span>
            <span className="block text-[11px] font-bold uppercase tracking-[0.18em] text-command-muted">
              Nhịp hệ thống
            </span>
            <span className="mt-0.5 flex items-baseline gap-2">
              <span className="font-display text-3xl font-black leading-none">{total}</span>
              <span className="text-sm font-semibold text-command-muted">phản ánh</span>
            </span>
          </span>
        </span>

        <span className="relative flex items-center gap-5">
          <span className="hidden items-center gap-4 text-xs font-bold md:flex">
            {pulseMetrics.map((metric) => (
              <span key={metric.label} className="inline-flex items-center gap-1.5 text-neutral-600">
                <span className={`h-1.5 w-1.5 rounded-pill ${metric.dot}`} aria-hidden="true" />
                {metric.value} {metric.label.toLowerCase()}
              </span>
            ))}
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-pill bg-brand-50 text-brand-700 transition-transform duration-300 ease-out-expo group-hover:rotate-180 group-focus-within:rotate-180">
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </span>
        </span>
      </button>

      <div className="st-drop-panel absolute inset-x-0 top-full pt-3">
        <div className="overflow-hidden rounded-lg bg-card shadow-command">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const share = total > 0 ? Math.round((metric.value / total) * 100) : 0;

            return (
              <div
                key={metric.label}
                className="st-drop-item grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-dashed border-line px-6 py-4 last:border-b-0"
                style={{ transitionDelay: `${index * 60}ms` }}
              >
                <span className={`grid h-10 w-10 place-items-center rounded-md ${metric.chip}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold text-ink">{metric.label}</span>
                  <span className="block text-xs text-neutral-500">{metric.helper}</span>
                </span>
                <span className="text-right">
                  <span className="block font-display text-2xl font-black leading-none text-ink">
                    {metric.value}
                  </span>
                  <span className="block text-[11px] font-bold uppercase tracking-[0.08em] text-neutral-400">
                    {share}% tổng
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
