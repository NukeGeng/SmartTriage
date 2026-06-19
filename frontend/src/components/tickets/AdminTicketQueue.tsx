// AdminTicketQueue.tsx - Admin ticket queue with paged loading and lightweight polling.
"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { GalleryFilterBar } from "@/components/gallery/GalleryFilterBar";
import { GalleryPageHeader } from "@/components/gallery/GalleryPageHeader";
import { TicketPagination } from "@/components/tickets/TicketPagination";
import { TicketShotCard } from "@/components/tickets/TicketShotCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loading } from "@/components/ui/Loading";
import { Toast } from "@/components/ui/Toast";
import { adminGalleryTabs, type AdminTicketSortKey, priorityRank } from "@/data/ticketGalleryContent";
import { listTickets, TICKET_PAGE_SIZE } from "@/features/tickets/api";
import { getStoredUser } from "@/lib/auth";
import type { Ticket, TicketFilters as TicketFiltersType } from "@/types/ticket";

export function AdminTicketQueue() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<TicketFiltersType>({});
  const [activeTab, setActiveTab] = useState("discover");
  const [sortBy, setSortBy] = useState<AdminTicketSortKey>("created_at");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const latestTicketIdRef = useRef<string | null>(null);

  const loadTickets = useCallback(
    async (showLoading = false) => {
      if (showLoading) setLoading(true);
      setError("");

      try {
        const result = await listTickets(filters, { page, page_size: TICKET_PAGE_SIZE });
        const lastPage = Math.max(1, Math.ceil(result.total / result.page_size));
        if (page > lastPage) {
          setPage(lastPage);
          return;
        }

        const latestTicketId = result.items[0]?.id ?? null;
        if (page === 1 && !showLoading && latestTicketId && latestTicketIdRef.current && latestTicketId !== latestTicketIdRef.current) {
          setNotification("Có ticket mới trong danh sách quản lý.");
        }

        latestTicketIdRef.current = latestTicketId;
        setTickets(result.items);
        setTotal(result.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Không tải được ticket");
      } finally {
        setLoading(false);
      }
    },
    [filters, page],
  );

  useEffect(() => {
    const user = getStoredUser();
    if (user?.role === "student") {
      router.replace("/tickets");
      return;
    }

    void loadTickets(true);
    const intervalId = window.setInterval(() => {
      void loadTickets(false);
    }, 10000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [loadTickets, router]);

  const sortedTickets = useMemo(() => {
    return [...tickets].sort((a, b) => {
      if (sortBy === "priority") {
        const aPriority = a.priority ?? a.analysis?.priority ?? "";
        const bPriority = b.priority ?? b.analysis?.priority ?? "";
        return (priorityRank[bPriority] ?? 0) - (priorityRank[aPriority] ?? 0);
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [sortBy, tickets]);

  function selectGalleryTab(key: string) {
    const tab = adminGalleryTabs.find((item) => item.key === key) ?? adminGalleryTabs[0];
    setActiveTab(tab.key);
    setSortBy(tab.sortBy ?? "created_at");
    setFilters(tab.filters);
    setPage(1);
  }

  function resetFilters() {
    setActiveTab("discover");
    setSortBy("created_at");
    setFilters({});
    setPage(1);
  }

  return (
    <>
      <Toast message={notification} onClose={() => setNotification("")} />
      <div className="space-y-8">
        <GalleryPageHeader
          eyebrow="Admin queue"
          title="Hàng đợi phân luồng AI"
          description={`${total} phản ánh phù hợp bộ lọc hiện tại, chỉ load ${TICKET_PAGE_SIZE} ticket mỗi page để tránh kéo quá nhiều dữ liệu lên trình duyệt.`}
          related={["triage cockpit", "AI category", "priority score", "routing", "review queue"]}
        />

        <GalleryFilterBar
          sortLabel={sortBy === "priority" ? "Ưu tiên" : "Mới nhất"}
          tabs={adminGalleryTabs}
          activeKey={activeTab}
          onSelect={selectGalleryTab}
          onReset={resetFilters}
        />

        {error ? <div className="rounded-lg bg-rose-50 p-4 text-sm font-medium text-rose-700 shadow-sm">{error}</div> : null}

        {loading ? (
          <Loading />
        ) : sortedTickets.length === 0 ? (
          <EmptyState title="Không có ticket phù hợp" description="Thử đổi filter hoặc kiểm tra dữ liệu demo." />
        ) : (
          <>
            <section className="st-hover-grid grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),315px))] justify-center gap-x-6 gap-y-7 lg:justify-start">
              {sortedTickets.map((ticket, index) => (
                <TicketShotCard key={ticket.id} ticket={ticket} index={index} />
              ))}
            </section>
            <TicketPagination page={page} pageSize={TICKET_PAGE_SIZE} total={total} loading={loading} onPageChange={setPage} />
          </>
        )}
      </div>
    </>
  );
}
