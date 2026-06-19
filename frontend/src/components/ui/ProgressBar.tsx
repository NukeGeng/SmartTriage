// ProgressBar.tsx - Accessible progress indicator for confidence and priority scores.
import { cn } from "@/lib/utils";

type ProgressTone = "accent" | "success" | "warning" | "danger" | "info";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  tone?: ProgressTone;
  showValue?: boolean;
  className?: string;
}

const toneClasses: Record<ProgressTone, string> = {
  accent: "bg-brand-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
  info: "bg-cyan-500",
};

export function ProgressBar({
  value,
  max = 100,
  label = "Progress",
  tone = "accent",
  showValue = false,
  className,
}: ProgressBarProps) {
  const normalized = Math.min(Math.max(value, 0), max);
  const percent = max > 0 ? Math.round((normalized / max) * 100) : 0;

  return (
    <div className={cn("space-y-2", className)}>
      {(label || showValue) ? (
        <div className="flex items-center justify-between gap-3 text-xs font-bold text-neutral-500">
          <span>{label}</span>
          {showValue ? <span>{percent}%</span> : null}
        </div>
      ) : null}
      <div
        className="h-2 overflow-hidden rounded-sm bg-neutral-100"
        role="progressbar"
        aria-label={label}
        aria-valuenow={normalized}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn("h-full origin-left rounded-sm animate-[st-progress-grow_700ms_var(--ease-out-expo)_both]", toneClasses[tone])}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
