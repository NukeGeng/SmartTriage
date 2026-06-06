import type { ReactNode } from "react";

import type { TicketPriority, TicketStatus } from "@/types/ticket";
import { cn, getPriorityLabel, getStatusLabel } from "@/lib/utils";

type BadgeTone = "neutral" | "green" | "cyan" | "amber" | "rose" | "violet";

type BadgeProps = {
  children?: ReactNode;
  tone?: BadgeTone;
  priority?: TicketPriority | null;
  status?: TicketStatus | null;
  className?: string;
};

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-neutral-100 text-neutral-700 border-neutral-200",
  green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cyan: "bg-cyan-50 text-cyan-700 border-cyan-200",
  amber: "bg-amber-50 text-amber-800 border-amber-200",
  rose: "bg-rose-50 text-rose-700 border-rose-200",
  violet: "bg-violet-50 text-violet-700 border-violet-200",
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

  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center rounded-md border px-2.5 py-1 text-xs font-semibold",
        toneClasses[resolvedTone],
        className,
      )}
    >
      {label}
    </span>
  );
}
