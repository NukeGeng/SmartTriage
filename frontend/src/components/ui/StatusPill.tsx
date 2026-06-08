// StatusPill.tsx - Text-first status chip for workflow, priority, and review states.
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type StatusTone = "neutral" | "accent" | "info" | "success" | "warning" | "danger";

interface StatusPillProps {
  label: string;
  tone?: StatusTone;
  icon?: ReactNode;
  className?: string;
}

const toneClasses: Record<StatusTone, string> = {
  neutral: "border-line bg-white text-neutral-600",
  accent: "border-brand-100 bg-brand-50 text-brand-700",
  info: "border-cyan-100 bg-cyan-50 text-cyan-700",
  success: "border-emerald-100 bg-emerald-50 text-emerald-700",
  warning: "border-amber-100 bg-amber-50 text-amber-700",
  danger: "border-rose-100 bg-rose-50 text-rose-700",
};

export function StatusPill({ label, tone = "neutral", icon, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center gap-2 rounded-pill border px-3 py-1 text-xs font-black uppercase tracking-[0.12em]",
        toneClasses[tone],
        className,
      )}
    >
      {icon}
      {label}
    </span>
  );
}
