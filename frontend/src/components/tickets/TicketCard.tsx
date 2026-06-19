"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import type { Ticket } from "@/types/ticket";

export function TicketCard({ ticket }: { ticket: Ticket }) {
  const category = ticket.category ?? ticket.analysis?.predicted_category ?? "Chưa phân loại";
  const priority = ticket.priority ?? ticket.analysis?.priority ?? null;

  return (
    <Link href={`/tickets/${ticket.id}`} className="block">
      <Card className="hover:bg-neutral-50 hover:shadow-none">
        <CardContent className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-ink">{ticket.title}</h3>
              <p className="mt-1 text-sm text-neutral-500">{formatDate(ticket.created_at)}</p>
            </div>
            <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-neutral-400" aria-hidden="true" />
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge status={ticket.status} />
            {priority ? <Badge priority={priority} /> : <Badge>Chưa có ưu tiên</Badge>}
            <Badge tone="cyan">{category}</Badge>
          </div>
          <div className="text-sm text-neutral-600">
            Phòng phụ trách:{" "}
            <span className="font-medium text-ink">{ticket.assigned_department ?? "Chưa gán"}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
