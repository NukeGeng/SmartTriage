"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, RefreshCcw } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { TicketFilters } from "@/components/tickets/TicketFilters";
import { TicketList } from "@/components/tickets/TicketList";
import { listTickets } from "@/features/tickets/api";
import type { Ticket, TicketFilters as TicketFiltersType } from "@/types/ticket";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<TicketFiltersType>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    listTickets(filters)
      .then((result) => {
        if (!active) return;
        setTickets(result.items);
        setTotal(result.total);
      })
      .catch((err) => {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Không tải được danh sách ticket");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [filters]);

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-brand-700">Ticket workflow</p>
            <h1 className="text-2xl font-semibold text-ink">Danh sách phản ánh</h1>
            <p className="mt-1 text-sm text-neutral-600">{total} phản ánh phù hợp bộ lọc hiện tại.</p>
          </div>
          <Link href="/tickets/new">
            <Button icon={<Plus className="h-4 w-4" aria-hidden="true" />}>Tạo phản ánh mới</Button>
          </Link>
        </div>

        <TicketFilters filters={filters} onChange={setFilters} onReset={() => setFilters({})} />

        {error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
            {error}
            <Button
              className="mt-3"
              variant="secondary"
              icon={<RefreshCcw className="h-4 w-4" aria-hidden="true" />}
              onClick={() => setFilters({ ...filters })}
            >
              Thử lại
            </Button>
          </div>
        ) : loading ? (
          <Loading />
        ) : (
          <TicketList tickets={tickets} />
        )}
      </div>
    </AppShell>
  );
}
