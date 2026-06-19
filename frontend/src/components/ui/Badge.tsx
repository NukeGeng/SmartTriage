// Badge.tsx - Compact semantic label atom. Props: tone, priority, status, children.
import type { ReactNode } from "react";

import type { TicketPriority, TicketStatus } from "@/types/ticket";
import { cn, getPriorityLabel, getStatusLabel } from "@/lib/utils";

type BadgeTone = "neutral" | "green" | "cyan" | "amber" | "rose" | "slate";

type BadgeProps = {
  children?: ReactNode;
  tone?: BadgeTone;
  priority?: TicketPriority | null;
  status?: TicketStatus | null;
  className?: string;
};

const toneClasses: Record<BadgeTone, string> = {
  neutral: "text-neutral-700",
  green: "text-emerald-700",
  cyan: "text-cyan-700",
  amber: "text-amber-700",
  rose: "text-rose-700",
  slate: "text-slate-700",
};

const dotClasses: Record<BadgeTone, string> = {
  neutral: "bg-neutral-300",
  green: "bg-emerald-600",
  cyan: "bg-cyan-600",
  amber: "bg-amber-500",
  rose: "bg-rose-600",
  slate: "bg-slate-500",
};

function getStatusTone(status?: TicketStatus | null): BadgeTone {
  if (status === "resolved") return "green";
  if (status === "in_progress" || status === "analyzing") return "cyan";
  if (status === "open" || status === "new") return "amber";
  if (status === "rejected") return "rose";
  return "neutral";
}

function getPriorityTone(priority?: TicketPriority | null): BadgeTone {
  if (priority === "high") return "rose";
  if (priority === "medium") return "amber";
  if (priority === "low") return "green";
  return "neutral";
}

export function Badge({ children, tone = "neutral", priority, status, className }: BadgeProps) {
  const resolvedTone = status ? getStatusTone(status) : priority ? getPriorityTone(priority) : tone;
  const label = status ? getStatusLabel(status) : priority ? getPriorityLabel(priority) : children;
  const showDot = Boolean(status || priority);

  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center gap-2 py-1 text-xs font-semibold",
        toneClasses[resolvedTone],
        className,
      )}
    >
      {showDot ? <span className={cn("h-2 w-2 shrink-0 rounded-pill", dotClasses[resolvedTone])} aria-hidden="true" /> : null}
      {label}
    </span>
  );
}
