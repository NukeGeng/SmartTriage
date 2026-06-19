// ReviewCaseQueue.tsx - Selectable queue of low-confidence tickets for human review.
"use client";

import { AlertTriangle, CheckCircle2, ListChecks } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { cn, formatPercent } from "@/lib/utils";
import type { TriageTicket } from "@/types/triage";

type ReviewCaseQueueProps = {
  tickets: TriageTicket[];
  selectedId: string;
  totalOpen: number;
  reviewed: number;
  onSelect: (ticketId: string) => void;
};

export function ReviewCaseQueue({
  tickets,
  selectedId,
  totalOpen,
  reviewed,
  onSelect,
}: ReviewCaseQueueProps) {
  const highPriority = tickets.filter((ticket) => ticket.priority === "high").length;

  return (
    <aside className="rounded-xl border border-line bg-card p-4 shadow-command">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-700">
            Case queue
          </p>
          <h2 className="mt-1 font-display text-2xl font-black text-ink">
            {tickets.length} cần kiểm định
          </h2>
        </div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-pill border border-line bg-brand-50 text-brand-700">
          <ListChecks className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg border border-line bg-panel px-3 py-2">
          <p className="font-mono text-lg font-black text-ink">{totalOpen}</p>
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-command-muted">
            Open
          </p>
        </div>
        <div className="rounded-lg border border-line bg-panel px-3 py-2">
          <p className="font-mono text-lg font-black text-signal-amber">{highPriority}</p>
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-command-muted">
            High
          </p>
        </div>
        <div className="rounded-lg border border-line bg-panel px-3 py-2">
          <p className="font-mono text-lg font-black text-emerald-700">{reviewed}</p>
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-command-muted">
            Saved
          </p>
        </div>
      </div>

      <div className="mt-4 max-h-[620px] space-y-3 overflow-y-auto pr-1 triage-scrollbar">
        {tickets.map((ticket) => {
          const confidence = Math.round((ticket.category_confidence ?? 0) * 100);
          const selected = ticket.id === selectedId;

          return (
            <button
              key={ticket.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onSelect(ticket.id)}
              className={cn(
                "st-row w-full rounded-lg border p-3 text-left",
                selected
                  ? "border-brand-500 bg-brand-50"
                  : "border-line bg-command-elevated hover:border-brand-100",
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="line-clamp-1 text-sm font-black text-ink">{ticket.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-command-muted">
                    {ticket.description}
                  </p>
                </div>
                {confidence < 45 ? (
                  <AlertTriangle className="h-4 w-4 shrink-0 text-signal-amber" aria-hidden="true" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {ticket.priority ? (
                  <Badge priority={ticket.priority} className="rounded-pill bg-panel px-3" />
                ) : null}
                {ticket.category_label ? (
                  <Badge tone="cyan" className="rounded-pill bg-panel px-3">
                    {ticket.category_label}
                  </Badge>
                ) : null}
              </div>

              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.08em] text-command-muted">
                  <span>AI confidence</span>
                  <span>{formatPercent(ticket.category_confidence)}</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-pill bg-panel">
                  <span
                    className="st-bar-grow block h-full rounded-pill bg-signal-amber"
                    style={{ width: `${confidence}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
