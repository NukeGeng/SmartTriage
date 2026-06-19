// TriageScoreDial.tsx - Circular AI priority score gauge. Props: score, priority.
import { cn, getPriorityLabel } from "@/lib/utils";
import type { TicketPriority } from "@/types/ticket";

const strokeByPriority: Record<string, string> = {
  high: "stroke-[#ef4d5f]",
  medium: "stroke-[#f6b73c]",
  low: "stroke-[#20a67a]",
};

type TriageScoreDialProps = {
  score: number;
  priority?: TicketPriority | null;
};

export function TriageScoreDial({ score, priority }: TriageScoreDialProps) {
  const bounded = Math.max(0, Math.min(Math.round(score), 100));
  const stroke = strokeByPriority[priority ?? ""] ?? "stroke-[#2364d2]";

  return (
    <div className="relative h-36 w-36">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle
          cx="60"
          cy="60"
          r="50"
          pathLength={100}
          strokeWidth={10}
          className="fill-none stroke-[#2a2f44]"
        />
        <circle
          cx="60"
          cy="60"
          r="50"
          pathLength={100}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={100}
          strokeDashoffset={100 - bounded}
          className={cn("st-dial-value fill-none", stroke)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="font-display text-4xl font-black leading-none text-ink">{bounded}</span>
        <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.12em] text-neutral-500">
          /100 · {getPriorityLabel(priority)}
        </span>
      </div>
    </div>
  );
}
