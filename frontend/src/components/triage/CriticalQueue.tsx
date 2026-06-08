import { TriageTicketCard } from "./TriageTicketCard";
import type { TriageTicket } from "@/types/triage";

export function CriticalQueue({ tickets }: { tickets: TriageTicket[] }) {
  if (tickets.length === 0) {
    return <p className="text-sm text-neutral-500">Không có phản ánh ưu tiên cao trong hàng đợi hiện tại.</p>;
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => (
        <TriageTicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
