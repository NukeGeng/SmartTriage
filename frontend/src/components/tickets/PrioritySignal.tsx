// PrioritySignal.tsx - Dot-led priority indicator for scan-friendly ticket rows.
import type { TicketPriority } from "@/types/ticket";
import { cn, getPriorityLabel } from "@/lib/utils";

type PrioritySignalProps = {
  priority?: TicketPriority | null;
  score?: number | null;
  className?: string;
};

type PriorityTone = {
  dot: string;
  text: string;
  score: string;
};

const priorityTones: Record<"high" | "medium" | "low" | "none", PriorityTone> = {
  high: {
    dot: "bg-rose-600",
    text: "text-rose-700",
    score: "text-rose-600",
  },
  medium: {
    dot: "bg-amber-500",
    text: "text-amber-700",
    score: "text-amber-600",
  },
  low: {
    dot: "bg-emerald-600",
    text: "text-emerald-700",
    score: "text-emerald-600",
  },
  none: {
    dot: "bg-neutral-300",
    text: "text-neutral-500",
    score: "text-neutral-400",
  },
};

function resolvePriorityTone(priority?: TicketPriority | null) {
  if (priority === "high" || priority === "medium" || priority === "low") {
    return priorityTones[priority];
  }
  return priorityTones.none;
}

export function PrioritySignal({ priority, score, className }: PrioritySignalProps) {
  const tone = resolvePriorityTone(priority);

  return (
    <span className={cn("inline-flex items-center gap-2 text-sm font-semibold", tone.text, className)}>
      <span className={cn("h-2.5 w-2.5 shrink-0 rounded-pill", tone.dot)} aria-hidden="true" />
      <span>{getPriorityLabel(priority)}</span>
      {typeof score === "number" ? <span className={cn("text-xs font-medium", tone.score)}>{score}/100</span> : null}
    </span>
  );
}
