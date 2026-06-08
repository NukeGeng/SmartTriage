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
  neutral: "border-white/[0.12] bg-white/[0.06] text-command-muted",
  accent: "border-brand-500/30 bg-brand-500/15 text-brand-100",
  info: "border-cyan-400/30 bg-cyan-500/15 text-cyan-100",
  success: "border-emerald-400/30 bg-emerald-500/15 text-emerald-100",
  warning: "border-amber-400/30 bg-amber-500/15 text-amber-100",
  danger: "border-rose-400/30 bg-rose-500/15 text-rose-100",
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
