// ModelMetricCard.tsx - Small model telemetry card used in the Model Info dashboard.
import type { ReactNode } from "react";

type ModelMetricCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: ReactNode;
};

export function ModelMetricCard({ label, value, detail, icon }: ModelMetricCardProps) {
  return (
    <article className="st-card rounded-xl bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-bold text-neutral-500">{label}</p>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-pill bg-brand-50 text-brand-700">
          {icon}
        </span>
      </div>
      <p className="mt-4 font-display text-3xl font-black text-ink">{value}</p>
      <p className="mt-2 text-sm font-semibold leading-6 text-neutral-500">{detail}</p>
    </article>
  );
}
