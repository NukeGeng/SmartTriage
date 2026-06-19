// TicketGalleryShell.tsx - Client ticket gallery with server-side pagination.
"use client";

import { useEffect, useMemo, useState } from "react";
import { RefreshCcw } from "lucide-react";

import { GalleryFilterBar } from "@/components/gallery/GalleryFilterBar";
import { GalleryPageHeader } from "@/components/gallery/GalleryPageHeader";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { CreateTicketAction } from "@/components/tickets/CreateTicketAction";
import { TicketFilterPanel } from "@/components/tickets/TicketFilterPanel";
import { TicketList } from "@/components/tickets/TicketList";
import { TicketPagination } from "@/components/tickets/TicketPagination";
import { ticketGalleryTabs, ticketSortOptions } from "@/data/ticketGalleryContent";
import { listTickets, TICKET_PAGE_SIZE } from "@/features/tickets/api";
import type { Ticket, TicketFilters as TicketFiltersType } from "@/types/ticket";

function getPriorityScore(ticket: Ticket) {
  return ticket.priority_score ?? ticket.analysis?.priority_score ?? 0;
}

export function TicketGalleryShell() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<TicketFiltersType>({});
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("discover");
  const [sortKey, setSortKey] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sortedTickets = useMemo(() => {
    const list = [...tickets];
    if (sortKey === "oldest") {
      list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sortKey === "priority") {
      list.sort((a, b) => getPriorityScore(b) - getPriorityScore(a));
    } else {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }
    return list;
  }, [tickets, sortKey]);

  const hasActiveFilters = Object.values(filters).some(Boolean);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    listTickets(filters, { page, page_size: TICKET_PAGE_SIZE })
      .then((result) => {
        if (!active) return;
        const lastPage = Math.max(1, Math.ceil(result.total / result.page_size));
        if (page > lastPage) {
          setPage(lastPage);
          return;
        }
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
  }, [filters, page]);

  function selectGalleryTab(key: string) {
    const tab = ticketGalleryTabs.find((item) => item.key === key) ?? ticketGalleryTabs[0];
    setActiveTab(tab.key);
    setFilters(tab.filters);
    setPage(1);
  }

  function resetFilters() {
    setActiveTab("discover");
    setFilters({});
    setPage(1);
  }

  function applyCustomFilters(next: TicketFiltersType) {
    const matchedTab = ticketGalleryTabs.find(
      (tab) => JSON.stringify(tab.filters) === JSON.stringify(next),
    );
    setActiveTab(matchedTab?.key ?? "custom");
    setFilters(next);
    setPage(1);
  }

  return (
    <div className="space-y-8">
      <GalleryPageHeader
        eyebrow="Ticket workflow"
        title="Danh sách phản ánh"
        description={`${total} phản ánh phù hợp bộ lọc hiện tại, chỉ load ${TICKET_PAGE_SIZE} ticket mỗi trang để tránh lag khi dữ liệu lớn.`}
        related={["AI priority", "open queue", "routing", "duplicate", "student feedback"]}
      />

      <GalleryFilterBar
        sortOptions={ticketSortOptions}
        sortKey={sortKey}
        onSortChange={setSortKey}
        tabs={ticketGalleryTabs}
        activeKey={activeTab}
        onSelect={selectGalleryTab}
        onReset={resetFilters}
        filterActive={hasActiveFilters}
        renderFilterPanel={(close) => (
          <TicketFilterPanel
            value={filters}
            onApply={(next) => {
              applyCustomFilters(next);
              close();
            }}
            onReset={() => {
              resetFilters();
              close();
            }}
          />
        )}
        action={<CreateTicketAction />}
      />

      {error ? (
        <div className="rounded-lg bg-rose-50 p-4 text-sm font-medium text-rose-700 shadow-sm">
          {error}
          <Button className="mt-3" variant="secondary" icon={<RefreshCcw className="h-4 w-4" aria-hidden="true" />} onClick={() => setFilters({ ...filters })}>
            Thu lai
          </Button>
        </div>
      ) : loading ? (
        <Loading />
      ) : (
        <>
          <TicketList tickets={sortedTickets} />
          {total > 0 ? <TicketPagination page={page} pageSize={TICKET_PAGE_SIZE} total={total} loading={loading} onPageChange={setPage} /> : null}
        </>
      )}
    </div>
  );
}
