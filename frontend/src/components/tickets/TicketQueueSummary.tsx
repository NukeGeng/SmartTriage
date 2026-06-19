// TicketQueueSummary.tsx - Compact operational metrics for the admin ticket queue.
import { AlertTriangle, Bot, Inbox } from "lucide-react";

import type { Ticket } from "@/types/ticket";

type TicketQueueSummaryProps = {
  tickets: Ticket[];
};

const activeStatuses = new Set(["new", "analyzing", "open", "in_progress"]);

function getTicketPriority(ticket: Ticket) {
  return ticket.priority ?? ticket.analysis?.priority ?? null;
}

export function TicketQueueSummary({ tickets }: TicketQueueSummaryProps) {
  const activeCount = tickets.filter((ticket) => activeStatuses.has(ticket.status)).length;
  const highPriorityCount = tickets.filter((ticket) => getTicketPriority(ticket) === "high").length;
  const analyzedCount = tickets.filter((ticket) => Boolean(ticket.analysis)).length;

  const metrics = [
    {
      label: "đang mở",
      value: activeCount,
      helper: `${tickets.length} ticket trong bộ lọc`,
      icon: Inbox,
      color: "text-blue-700",
    },
    {
      label: "ưu tiên cao",
      value: highPriorityCount,
      helper: "cần scan trước",
      icon: AlertTriangle,
      color: "text-rose-700",
    },
    {
      label: "đã có AI analysis",
      value: analyzedCount,
      helper: "có category và routing",
      icon: Bot,
      color: "text-emerald-700",
    },
  ];

  return (
    <section className="grid gap-3 md:grid-cols-3" aria-label="Tóm tắt hàng đợi ticket">
      {metrics.map((metric) => {
        const Icon = metric.icon;

        return (
          <div key={metric.label} className="rounded-lg border border-line bg-card px-4 py-3 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-neutral-500">{metric.label}</p>
                <p className="mt-1 font-mono text-2xl font-semibold leading-none text-ink">{metric.value}</p>
                <p className="mt-1 text-xs text-neutral-500">{metric.helper}</p>
              </div>
              <span className={metric.color} aria-hidden="true">
                <Icon className="h-5 w-5" />
              </span>
            </div>
          </div>
        );
      })}
    </section>
  );
}
