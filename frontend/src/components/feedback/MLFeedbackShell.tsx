// MLFeedbackShell.tsx - Client workflow for inspecting paginated retraining feedback.
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { FeedbackExportPanel } from "@/components/feedback/FeedbackExportPanel";
import { FeedbackReadinessBoard } from "@/components/feedback/FeedbackReadinessBoard";
import { FeedbackSampleTable } from "@/components/feedback/FeedbackSampleTable";
import { MLFeedbackHero } from "@/components/feedback/MLFeedbackHero";
import { TicketPagination } from "@/components/tickets/TicketPagination";
import { Loading } from "@/components/ui/Loading";
import { listTickets, TICKET_PAGE_SIZE } from "@/features/tickets/api";
import { getStoredUser } from "@/lib/auth";
import { getTicketConfidence, isCorrectedTicket } from "@/lib/feedback";
import type { Ticket } from "@/types/ticket";

export function MLFeedbackShell() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTickets = useCallback(async () => {
    setError("");
    setLoading(true);
    try {
      const result = await listTickets({}, { page, page_size: TICKET_PAGE_SIZE });
      const lastPage = Math.max(1, Math.ceil(result.total / result.page_size));
      if (page > lastPage) {
        setPage(lastPage);
        return;
      }
      setTickets(result.items);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được mẫu ML feedback");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    const user = getStoredUser();
    if (user?.role === "student") {
      router.replace("/tickets");
      return;
    }
    void loadTickets();
  }, [loadTickets, router]);

  const correctedTickets = useMemo(() => tickets.filter(isCorrectedTicket), [tickets]);
  const lowConfidenceCount = useMemo(
    () => tickets.filter((ticket) => (getTicketConfidence(ticket) ?? 1) < 0.65).length,
    [tickets],
  );

  return (
    <div className="space-y-6">
      <MLFeedbackHero />

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-700">
          {error}
        </div>
      ) : null}
      {loading ? <Loading label="Đang tổng hợp mẫu feedback..." /> : null}

      {!loading ? (
        <>
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
            <FeedbackReadinessBoard
              tickets={tickets}
              correctedTickets={correctedTickets}
              lowConfidenceCount={lowConfidenceCount}
            />
            <FeedbackExportPanel
              correctedTickets={correctedTickets}
              totalCount={total}
              lowConfidenceCount={lowConfidenceCount}
            />
          </div>
          <FeedbackSampleTable tickets={correctedTickets} />
          {total > 0 ? (
            <TicketPagination
              page={page}
              pageSize={TICKET_PAGE_SIZE}
              total={total}
              loading={loading}
              onPageChange={setPage}
            />
          ) : null}
        </>
      ) : null}
    </div>
  );
}
