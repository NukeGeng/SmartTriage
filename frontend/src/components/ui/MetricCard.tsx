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
  accent: "text-brand-100 bg-brand-500/15 border-brand-500/30",
  info: "text-cyan-100 bg-cyan-500/15 border-cyan-400/30",
  success: "text-emerald-100 bg-emerald-500/15 border-emerald-400/30",
  warning: "text-amber-100 bg-amber-500/15 border-amber-400/30",
  danger: "text-rose-100 bg-rose-500/15 border-rose-400/30",
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
          <p className="text-xs font-black uppercase tracking-[0.14em] text-command-muted">{label}</p>
          <p className="mt-2 font-display text-3xl font-black tabular-nums text-command-text">{value}</p>
          {helper ? <p className="mt-1 text-sm font-medium text-command-muted">{helper}</p> : null}
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
