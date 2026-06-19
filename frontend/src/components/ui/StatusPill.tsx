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
  neutral: "border-line bg-card text-neutral-600",
  accent: "border-line bg-card text-brand-700",
  info: "border-line bg-card text-cyan-700",
  success: "border-line bg-card text-emerald-700",
  warning: "border-line bg-card text-amber-700",
  danger: "border-line bg-card text-rose-700",
};

export function StatusPill({ label, tone = "neutral", icon, className }: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.1em]",
        toneClasses[tone],
        className,
      )}
    >
      {icon}
      {label}
    </span>
  );
}
