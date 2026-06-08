// MetricCard.tsx - Compact operational metric primitive for dashboard and cockpit views.
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { Panel } from "@/components/ui/Panel";

type MetricTone = "accent" | "info" | "success" | "warning" | "danger";

interface MetricCardProps {
  label: string;
  value: string | number;
  helper?: string;
  icon?: ReactNode;
  tone?: MetricTone;
  className?: string;
}

const toneClasses: Record<MetricTone, string> = {
  accent: "border-brand-100 bg-brand-50 text-brand-700",
  info: "border-cyan-100 bg-cyan-50 text-cyan-700",
  success: "border-emerald-100 bg-emerald-50 text-emerald-700",
  warning: "border-amber-100 bg-amber-50 text-amber-700",
  danger: "border-rose-100 bg-rose-50 text-rose-700",
};

export function MetricCard({
  label,
  value,
  helper,
  icon,
  tone = "accent",
  className,
}: MetricCardProps) {
  return (
    <Panel interactive className={cn("p-4", className)}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-black uppercase tracking-[0.12em] text-neutral-500">{label}</p>
          <p className="mt-2 font-display text-3xl font-black tabular-nums text-ink">{value}</p>
          {helper ? <p className="mt-1 text-sm font-medium text-neutral-500">{helper}</p> : null}
        </div>
        {icon ? (
          <span className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-md border", toneClasses[tone])}>
            {icon}
          </span>
        ) : null}
      </div>
    </Panel>
  );
}
