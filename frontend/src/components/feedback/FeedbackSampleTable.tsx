// FeedbackSampleTable.tsx - Table of corrected samples ready for ML feedback export.
import { Badge } from "@/components/ui/Badge";
import { getAiCategoryLabel, getAiPriority, getManualLabel, getTicketConfidence } from "@/lib/feedback";
import { formatPercent } from "@/lib/utils";
import type { Ticket } from "@/types/ticket";

type FeedbackSampleTableProps = {
  tickets: Ticket[];
};

export function FeedbackSampleTable({ tickets }: FeedbackSampleTableProps) {
  if (tickets.length === 0) {
    return (
      <div className="rounded-xl border border-line bg-card p-6 text-sm font-semibold text-neutral-500 shadow-soft">
        Chưa có sample đã chỉnh nhãn. Hãy xử lý ticket trong AI Review Queue trước.
      </div>
    );
  }

  return (
    <section className="overflow-hidden rounded-xl border border-line bg-card shadow-command">
      <div className="border-b border-line bg-command-elevated px-4 py-3">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-700">
          Feedback samples
        </p>
        <h2 className="mt-1 font-display text-2xl font-black text-ink">
          Nhãn thủ công sẽ đi vào dataset export
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-panel text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">
            <tr>
              <th className="px-4 py-3">Ticket</th>
              <th className="px-4 py-3">Manual label</th>
              <th className="px-4 py-3">AI prediction</th>
              <th className="px-4 py-3">Confidence</th>
              <th className="px-4 py-3">Training priority</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className="st-row border-t border-line">
                <td className="px-4 py-3">
                  <p className="line-clamp-1 font-black text-ink">{ticket.title}</p>
                  <p className="mt-1 text-xs font-semibold text-neutral-500">{ticket.id}</p>
                </td>
                <td className="px-4 py-3">
                  <Badge tone="green" className="rounded-pill bg-panel px-3">
                    {getManualLabel(ticket) || "corrected"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-neutral-600">{getAiCategoryLabel(ticket)}</td>
                <td className="px-4 py-3 font-bold text-ink">
                  {formatPercent(getTicketConfidence(ticket))}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    priority={ticket.manual_priority ?? getAiPriority(ticket) ?? ticket.priority}
                    className="rounded-pill bg-panel px-3"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
