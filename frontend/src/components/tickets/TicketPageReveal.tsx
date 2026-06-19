// TicketPageReveal.tsx - Back layer revealed when a ticket sheet page flips open.
import { TicketMetaRow } from "@/components/tickets/TicketMetaRow";

type TicketPageRevealProps = {
  title: string;
  description: string;
  statusLabel: string;
  statusTone: string;
  statusDot: string;
  priorityLabel: string;
  priorityScore?: number | null;
  priorityTone: string;
  priorityDot: string;
};

export function TicketPageReveal({
  title,
  description,
  statusLabel,
  statusTone,
  statusDot,
  priorityLabel,
  priorityScore,
  priorityTone,
  priorityDot,
}: TicketPageRevealProps) {
  return (
    <section
      className="st-ticket-page-reveal absolute inset-0 flex min-h-0 flex-col overflow-hidden bg-white p-4 text-ink shadow-command ring-1 ring-line"
      aria-hidden="true"
    >
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand-700">Mô tả & trạng thái</p>
        <h3 className="mt-1.5 line-clamp-1 font-display text-lg font-black leading-tight text-ink">{title}</h3>
      </div>

      <p className="mt-3 line-clamp-3 min-h-0 text-xs font-semibold leading-5 text-command-muted">
        {description}
      </p>

      <div className="mt-auto grid gap-2 border-t border-line pt-3">
        <TicketMetaRow label="Trạng thái" value={statusLabel} dotClass={statusDot} valueClass={statusTone} />
        <TicketMetaRow
          label="Ưu tiên"
          value={`${priorityLabel}${priorityScore ? ` - ${priorityScore}/100` : ""}`}
          dotClass={priorityDot}
          valueClass={priorityTone}
        />
      </div>
    </section>
  );
}
