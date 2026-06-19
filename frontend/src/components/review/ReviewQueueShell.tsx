// ReviewQueueShell.tsx - Client workflow for loading and correcting low-confidence AI predictions.
"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { ReviewCaseQueue } from "@/components/review/ReviewCaseQueue";
import { ReviewDecisionPanel } from "@/components/review/ReviewDecisionPanel";
import { ReviewQueueHero } from "@/components/review/ReviewQueueHero";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loading } from "@/components/ui/Loading";
import { reviewEmptyState } from "@/data/reviewQueueContent";
import { getTriageOverview } from "@/features/triage/api";
import { updateTicket } from "@/features/tickets/api";
import { getStoredUser } from "@/lib/auth";
import type { TriageOverview, TriageTicket } from "@/types/triage";

export function ReviewQueueShell() {
  const router = useRouter();
  const [overview, setOverview] = useState<TriageOverview | null>(null);
  const [tickets, setTickets] = useState<TriageTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingId, setSavingId] = useState("");
  const [reviewed, setReviewed] = useState(0);
  const [selectedId, setSelectedId] = useState("");

  const loadOverview = useCallback(async () => {
    setError("");
    try {
      const result = await getTriageOverview();
      setOverview(result);
      setTickets(result.low_confidence_cases);
      setSelectedId(result.low_confidence_cases[0]?.id ?? "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được AI Review Queue");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const user = getStoredUser();
    if (user?.role === "student") {
      router.replace("/tickets");
      return;
    }
    void loadOverview();
  }, [loadOverview, router]);

  async function handleSave(ticketId: string, category: string, priority: string) {
    setSavingId(ticketId);
    setError("");
    try {
      await updateTicket(ticketId, {
        manual_category: category || null,
        manual_priority: priority || null,
      });
      const nextTickets = tickets.filter((ticket) => ticket.id !== ticketId);
      setTickets(nextTickets);
      setSelectedId(nextTickets[0]?.id ?? "");
      setReviewed((value) => value + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không lưu được correction");
    } finally {
      setSavingId("");
    }
  }

  const selectedTicket = tickets.find((ticket) => ticket.id === selectedId) ?? tickets[0] ?? null;

  return (
    <div className="space-y-6">
      <ReviewQueueHero />

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-bold text-rose-700">
          {error}
        </div>
      ) : null}
      {loading ? <Loading label="Đang tải các dự đoán cần review..." /> : null}

      {!loading && tickets.length === 0 ? (
        <EmptyState title={reviewEmptyState.title} description={reviewEmptyState.description} />
      ) : null}

      {!loading && tickets.length > 0 ? (
        <section className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)]">
          <ReviewCaseQueue
            tickets={tickets}
            selectedId={selectedTicket?.id ?? ""}
            totalOpen={overview?.summary.total_open ?? tickets.length}
            reviewed={reviewed}
            onSelect={setSelectedId}
          />
          <ReviewDecisionPanel
            ticket={selectedTicket}
            saving={savingId === selectedTicket?.id}
            onSave={handleSave}
          />
        </section>
      ) : null}
    </div>
  );
}
