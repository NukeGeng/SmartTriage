// TicketStoryCard.tsx - Ticket description body + metadata strip. Props: ticket.
import { Building2, CalendarPlus, History, UserRound } from "lucide-react";

import { formatDate } from "@/lib/utils";
import type { Ticket } from "@/types/ticket";

export function TicketStoryCard({ ticket }: { ticket: Ticket }) {
  return (
    <section className="st-card rounded-lg bg-card p-6 shadow-soft md:p-7">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
          Nội dung phản ánh
        </h2>
        <span className="font-mono text-xs text-neutral-400">{ticket.id}</span>
      </div>

      <p className="mt-4 whitespace-pre-wrap border-l-4 border-[#2f4470] pl-4 text-[15px] leading-7 text-neutral-700">
        {ticket.description || "Phản ánh này không có mô tả chi tiết."}
      </p>

      <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-dashed border-line pt-5 md:grid-cols-4">
        <MetaItem icon={<UserRound className="h-4 w-4" aria-hidden="true" />} label="Người tạo" value={ticket.created_by_id ?? "Không rõ"} />
        <MetaItem icon={<CalendarPlus className="h-4 w-4" aria-hidden="true" />} label="Tạo lúc" value={formatDate(ticket.created_at)} />
        <MetaItem icon={<History className="h-4 w-4" aria-hidden="true" />} label="Cập nhật" value={formatDate(ticket.updated_at)} />
        <MetaItem icon={<Building2 className="h-4 w-4" aria-hidden="true" />} label="Phòng phụ trách" value={ticket.assigned_department ?? "Chưa gán"} />
      </dl>
    </section>
  );
}

function MetaItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-neutral-500">
        {icon}
        {label}
      </dt>
      <dd className="mt-1.5 truncate text-sm font-semibold text-ink">{value}</dd>
    </div>
  );
}
