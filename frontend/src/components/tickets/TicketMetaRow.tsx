// TicketMetaRow.tsx - Compact key/value row used inside ticket hover reveal.
import { cn } from "@/lib/utils";

type TicketMetaRowProps = {
  label: string;
  value: string;
  dotClass: string;
  valueClass: string;
};

export function TicketMetaRow({ label, value, dotClass, valueClass }: TicketMetaRowProps) {
  return (
    <div className="flex min-w-0 items-center justify-between gap-3">
      <span className="inline-flex min-w-0 items-center gap-2 truncate text-[11px] font-bold uppercase tracking-[0.12em] text-command-muted">
        <span className={cn("h-2 w-2 shrink-0 rounded-pill", dotClass)} aria-hidden="true" />
        {label}
      </span>
      <span className={cn("max-w-[52%] truncate text-xs font-black", valueClass)}>{value}</span>
    </div>
  );
}
