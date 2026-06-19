// DashboardRecentTickets.tsx - Recent ticket gallery for the dashboard overview.
import { TicketShotCard } from "@/components/tickets/TicketShotCard";
import type { RecentTicket } from "@/types/dashboard";

type DashboardRecentTicketsProps = {
  tickets: RecentTicket[];
};

export function DashboardRecentTickets({ tickets }: DashboardRecentTicketsProps) {
  if (tickets.length === 0) {
    return (
      <section className="rounded-lg bg-card p-6 text-sm font-medium text-neutral-500 shadow-[0_14px_32px_rgba(23,23,37,0.08)]">
        Chưa có ticket gần đây. Khi có phản ánh mới, gallery sẽ xuất hiện tại đây.
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-500">Recent</p>
          <h2 className="font-display text-2xl font-black text-ink">Ticket gần đây</h2>
        </div>
        <p className="text-sm font-medium text-neutral-500">{tickets.length} phản ánh mới</p>
      </div>
      <div className="st-hover-grid grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),315px))] justify-start gap-x-6 gap-y-7">
        {tickets.map((ticket, index) => (
          <TicketShotCard key={ticket.id} ticket={ticket} index={index} />
        ))}
      </div>
    </section>
  );
}
