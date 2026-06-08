import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate, formatPercent } from "@/lib/utils";
import type { TriageTicket } from "@/types/triage";

export function TriageTicketCard({ ticket }: { ticket: TriageTicket }) {
  return (
    <div className="rounded-md border border-line bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-semibold text-ink">{ticket.title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-neutral-600">{ticket.description}</p>
        </div>
        <Link href={`/tickets/${ticket.id}`}>
          <Button
            variant="secondary"
            className="min-h-9 px-3 py-1.5"
            icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
          >
            View
          </Button>
        </Link>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge status={ticket.status} />
        {ticket.priority ? <Badge priority={ticket.priority} /> : <Badge>Chưa ưu tiên</Badge>}
        {ticket.category_label ? <Badge tone="cyan">{ticket.category_label}</Badge> : null}
      </div>
      <div className="mt-3 grid gap-2 text-xs text-neutral-600 md:grid-cols-3">
        <span>Score: {ticket.priority_score ?? 0}/100</span>
        <span>Confidence: {formatPercent(ticket.category_confidence ?? 0)}</span>
        <span>Dept: {ticket.suggested_department ?? ticket.assigned_department ?? "Chưa gán"}</span>
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-neutral-500">
        <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
        {formatDate(ticket.created_at)}
      </p>
    </div>
  );
}
