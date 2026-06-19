// TicketShotCard.tsx - Rectangular ticket sheet with left-corner page flip reveal.
"use client";

import Link from "next/link";

import { TicketPageCover } from "@/components/tickets/TicketPageCover";
import { TicketPageReveal } from "@/components/tickets/TicketPageReveal";
import type { Ticket, TicketPriority, TicketStatus } from "@/types/ticket";

type TicketShot = Pick<Ticket, "id" | "title" | "status"> &
  Partial<
    Pick<
      Ticket,
      | "description"
      | "category"
      | "category_label"
      | "priority"
      | "priority_score"
      | "analysis"
    >
  >;

type TicketShotCardProps = {
  ticket: TicketShot;
  index?: number;
};

const statusMeta: Record<TicketStatus, { label: string; tone: string; dot: string }> = {
  new: { label: "Mới", tone: "text-amber-700", dot: "bg-amber-500" },
  analyzing: { label: "Đang phân tích", tone: "text-cyan-700", dot: "bg-cyan-600" },
  open: { label: "Đang mở", tone: "text-amber-700", dot: "bg-amber-500" },
  in_progress: { label: "Đang xử lý", tone: "text-brand-700", dot: "bg-brand-600" },
  resolved: { label: "Đã xử lý", tone: "text-emerald-700", dot: "bg-emerald-600" },
  rejected: { label: "Từ chối", tone: "text-rose-700", dot: "bg-rose-600" },
};

const priorityMeta: Record<
  "high" | "medium" | "low" | "none",
  { label: string; tone: string; dot: string; fold: string }
> = {
  high: { label: "Cao", tone: "text-rose-700", dot: "bg-rose-600", fold: "st-fold-high" },
  medium: { label: "Trung bình", tone: "text-amber-700", dot: "bg-amber-500", fold: "st-fold-medium" },
  low: { label: "Thấp", tone: "text-emerald-700", dot: "bg-emerald-600", fold: "st-fold-low" },
  none: { label: "Chưa có", tone: "text-command-muted", dot: "bg-neutral-400", fold: "st-fold-none" },
};

function getTicketPriority(ticket: TicketShot) {
  return ticket.priority ?? ticket.analysis?.priority ?? null;
}

function getTicketPriorityScore(ticket: TicketShot) {
  return ticket.priority_score ?? ticket.analysis?.priority_score ?? null;
}

function getPriorityMeta(priority?: TicketPriority | null) {
  if (priority === "high" || priority === "medium" || priority === "low") {
    return priorityMeta[priority];
  }
  return priorityMeta.none;
}

function getCategoryLabel(ticket: TicketShot) {
  return ticket.category_label ?? ticket.analysis?.category_label ?? ticket.category ?? "Chưa phân loại";
}

export function TicketShotCard({ ticket }: TicketShotCardProps) {
  const priority = getTicketPriority(ticket);
  const priorityScore = getTicketPriorityScore(ticket);
  const priorityTone = getPriorityMeta(priority);
  const status = statusMeta[ticket.status];
  const description = ticket.description || "Ticket này chưa có mô tả chi tiết trong danh sách.";

  return (
    <Link
      href={`/tickets/${ticket.id}`}
      className="group block w-full max-w-[315px] min-w-0 focus-visible:outline-none"
      aria-label={`Mở ticket ${ticket.title}`}
    >
      <article className="st-ticket-page-card min-w-0">
        <div className="st-ticket-page-shell relative min-h-[230px]">
          <TicketPageReveal
            title={ticket.title}
            description={description}
            statusLabel={status.label}
            statusTone={status.tone}
            statusDot={status.dot}
            priorityLabel={priorityTone.label}
            priorityScore={priorityScore}
            priorityTone={priorityTone.tone}
            priorityDot={priorityTone.dot}
          />

          <TicketPageCover
            title={ticket.title}
            categoryLabel={getCategoryLabel(ticket)}
            statusLabel={status.label}
            statusTone={status.tone}
            statusDot={status.dot}
            priorityRail={priorityTone.fold}
          />
        </div>
      </article>
    </Link>
  );
}
