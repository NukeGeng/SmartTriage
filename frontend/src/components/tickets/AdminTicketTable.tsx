// AdminTicketTable.tsx - Read-first table for the admin AI triage queue.
import Link from "next/link";
import { Eye } from "lucide-react";

import { CategoryBadge } from "@/components/tickets/CategoryBadge";
import { PrioritySignal } from "@/components/tickets/PrioritySignal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import type { Ticket } from "@/types/ticket";

type AdminTicketTableProps = {
  tickets: Ticket[];
};

export function AdminTicketTable({ tickets }: AdminTicketTableProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <CardTitle>Ticket queue</CardTitle>
          <p className="text-sm text-neutral-500">{tickets.length} ticket đang hiển thị</p>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line text-[11px] tracking-[0.02em] text-neutral-500">
              <th className="py-3 pr-4 font-semibold">phản ánh</th>
              <th className="py-3 pr-4 font-semibold">trạng thái</th>
              <th className="py-3 pr-4 font-semibold">AI category</th>
              <th className="py-3 pr-4 font-semibold">ưu tiên</th>
              <th className="py-3 pr-4 font-semibold">phòng xử lý</th>
              <th className="py-3 pr-4 font-semibold">thời điểm tạo</th>
              <th className="py-3 pr-4 font-semibold">hành động</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => {
              const priority = ticket.priority ?? ticket.analysis?.priority ?? null;
              const priorityScore = ticket.priority_score ?? ticket.analysis?.priority_score ?? null;
              const category = ticket.category ?? ticket.analysis?.predicted_category ?? null;
              const categoryLabel = ticket.manual_category ?? ticket.analysis?.category_label ?? category;

              return (
                <tr key={ticket.id} className="st-row border-b border-line hover:bg-neutral-50 last:border-0">
                  <td className="max-w-sm py-3 pr-4">
                    <p className="truncate font-semibold text-ink">{ticket.title}</p>
                    {ticket.description ? (
                      <p className="mt-1 truncate text-xs text-neutral-500">{ticket.description}</p>
                    ) : null}
                  </td>
                  <td className="py-3 pr-4">
                    <Badge status={ticket.status} />
                  </td>
                  <td className="py-3 pr-4">
                    <CategoryBadge category={category} label={categoryLabel} />
                  </td>
                  <td className="py-3 pr-4">
                    <PrioritySignal priority={priority} score={priorityScore} />
                  </td>
                  <td className="max-w-[180px] py-3 pr-4">
                    <span className="block truncate text-neutral-700">{ticket.assigned_department ?? "Chưa gán"}</span>
                  </td>
                  <td className="py-3 pr-4 text-neutral-600">{formatDate(ticket.created_at)}</td>
                  <td className="py-3 pr-4">
                    <Link href={`/tickets/${ticket.id}`}>
                      <Button
                        variant="secondary"
                        icon={<Eye className="h-4 w-4" aria-hidden="true" />}
                        className="min-h-9 px-3 py-1.5"
                      >
                        Xem
                      </Button>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
