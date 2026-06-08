import { TriageTicketCard } from "./TriageTicketCard";
import type { TriageTicket } from "@/types/triage";

export function LowConfidenceCases({ tickets }: { tickets: TriageTicket[] }) {
  if (tickets.length === 0) {
    return <p className="text-sm text-neutral-500">Chưa có phản ánh AI confidence thấp.</p>;
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => (
        <TriageTicketCard key={ticket.id} ticket={ticket} />
      ))}
    </div>
  );
}
