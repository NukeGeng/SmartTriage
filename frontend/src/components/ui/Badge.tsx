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
  neutral: "border-neutral-200 bg-white text-neutral-700",
  green: "border-neutral-200 bg-white text-emerald-700",
  cyan: "border-neutral-200 bg-white text-cyan-700",
  amber: "border-neutral-200 bg-white text-amber-700",
  rose: "border-neutral-200 bg-white text-rose-700",
  slate: "border-neutral-200 bg-white text-slate-700",
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
        "inline-flex min-h-7 items-center rounded-sm border px-2.5 py-1 text-xs font-semibold",
        toneClasses[resolvedTone],
        className,
      )}
    >
      {label}
    </span>
  );
}
