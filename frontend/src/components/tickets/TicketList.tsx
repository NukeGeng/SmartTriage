import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Ticket } from "@/types/ticket";
import { TicketShotCard } from "./TicketShotCard";

export function TicketList({ tickets }: { tickets: Ticket[] }) {
  if (tickets.length === 0) {
    return (
      <EmptyState
        title="Chưa có phản ánh phù hợp"
        description="Tạo phản ánh mới hoặc thử bỏ bớt bộ lọc để xem dữ liệu."
        action={
          <Link href="/tickets/new">
            <Button icon={<Plus className="h-4 w-4" aria-hidden="true" />}>Tạo phản ánh mới</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="st-hover-grid grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-x-6 gap-y-7">
      {tickets.map((ticket, index) => (
        <TicketShotCard key={ticket.id} ticket={ticket} index={index} />
      ))}
    </div>
  );
}
