// TicketPageCover.tsx - Front layer of the rectangular ticket sheet with page-corner fold.
import { cn } from "@/lib/utils";

type TicketPageCoverProps = {
  title: string;
  categoryLabel: string;
  statusLabel: string;
  statusTone: string;
  statusDot: string;
  priorityRail: string;
};

export function TicketPageCover({
  title,
  categoryLabel,
  statusLabel,
  statusTone,
  statusDot,
  priorityRail,
}: TicketPageCoverProps) {
  return (
    <section className="st-ticket-page-cover st-ticket-cover-surface relative min-h-[230px] overflow-hidden border border-line p-6 text-ink shadow-command">
      <span className={cn("st-ticket-corner-fold", priorityRail)} aria-hidden="true" />

      <div className="flex items-start justify-between gap-4 pl-2">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-command-muted">Phiếu triage AI</p>
          <p className="mt-2 line-clamp-1 text-sm font-black text-brand-700">{categoryLabel}</p>
        </div>
        <span className={cn("inline-flex shrink-0 items-center gap-2 text-xs font-black", statusTone)}>
          <span className={cn("h-2 w-2 rounded-pill", statusDot)} aria-hidden="true" />
          {statusLabel}
        </span>
      </div>

      <h3 className="mt-9 pl-2 font-display text-[1.75rem] font-black leading-[1.15] tracking-[-0.02em] text-ink">
        {title}
      </h3>
    </section>
  );
}
