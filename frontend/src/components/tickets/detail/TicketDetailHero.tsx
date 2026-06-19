// TicketDetailHero.tsx - Gradient dossier header for ticket detail. Props: ticket.
import Link from "next/link";
import { ArrowLeft, Building2, CalendarPlus, History } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { cn, formatDate } from "@/lib/utils";
import type { Ticket, TicketPriority } from "@/types/ticket";

const heroTones: Record<string, { surface: string; strip: string; glow: string }> = {
  high: {
    surface: "from-rose-50 to-amber-50",
    strip: "bg-rose-600",
    glow: "bg-rose-200/60",
  },
  medium: {
    surface: "from-amber-50 to-brand-50",
    strip: "bg-amber-500",
    glow: "bg-amber-200/60",
  },
  low: {
    surface: "from-emerald-50 to-brand-50",
    strip: "bg-emerald-600",
    glow: "bg-emerald-200/60",
  },
  default: {
    surface: "from-brand-50 to-neutral-50",
    strip: "bg-brand-600",
    glow: "bg-brand-100",
  },
};

function getTicketPriority(ticket: Ticket): TicketPriority | null {
  return ticket.priority ?? ticket.analysis?.priority ?? null;
}

export function TicketDetailHero({ ticket }: { ticket: Ticket }) {
  const priority = getTicketPriority(ticket);
  const tone = heroTones[priority ?? "default"] ?? heroTones.default;
  const shortId = ticket.id.slice(0, 8).toUpperCase();

  return (
    <header
      className={cn(
        "st-enter relative overflow-hidden rounded-xl bg-gradient-to-br p-6 md:p-10",
        tone.surface,
      )}
    >
      <div className={cn("absolute left-6 top-0 h-2 w-24 rounded-pill md:left-10", tone.strip)} aria-hidden="true" />
      <div
        className={cn("st-idle-drift absolute -right-14 -top-14 h-44 w-44 rounded-pill", tone.glow)}
        aria-hidden="true"
      />

      <Link href="/tickets" className="st-link relative items-center gap-2 text-sm font-bold text-ink">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Danh sách phản ánh
      </Link>

      <p className="relative mt-6 text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
        AI Triage Analysis · #{shortId}
      </p>
      <h1 className="relative mt-2 max-w-3xl font-display text-[clamp(1.9rem,3.2vw,3rem)] font-black leading-[1.04] text-ink">
        {ticket.title}
      </h1>

      <div className="relative mt-5 flex flex-wrap items-center gap-2.5">
        <span className="inline-flex items-center rounded-pill bg-card/85 px-3 shadow-[0_8px_20px_rgba(23,23,37,0.08)]">
          <Badge status={ticket.status} />
        </span>
        {priority ? (
          <span className="inline-flex items-center rounded-pill bg-card/85 px-3 shadow-[0_8px_20px_rgba(23,23,37,0.08)]">
            <Badge priority={priority} />
          </span>
        ) : null}
        {ticket.analysis ? (
          <span className="inline-flex min-h-7 items-center rounded-pill border border-line bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
            {ticket.analysis.category_label}
          </span>
        ) : null}
      </div>

      <div className="relative mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs font-semibold text-neutral-600 md:text-sm">
        <span className="inline-flex items-center gap-1.5">
          <CalendarPlus className="h-4 w-4" aria-hidden="true" />
          Tạo {formatDate(ticket.created_at)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <History className="h-4 w-4" aria-hidden="true" />
          Cập nhật {formatDate(ticket.updated_at)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Building2 className="h-4 w-4" aria-hidden="true" />
          {ticket.assigned_department ?? "Chưa gán phòng phụ trách"}
        </span>
      </div>
    </header>
  );
}
