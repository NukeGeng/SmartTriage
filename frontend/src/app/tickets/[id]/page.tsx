"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { RefreshCcw } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Loading } from "@/components/ui/Loading";
import { TicketDetailHero } from "@/components/tickets/detail/TicketDetailHero";
import { TicketStoryCard } from "@/components/tickets/detail/TicketStoryCard";
import { TriageReport } from "@/components/tickets/detail/TriageReport";
import { TriageSummaryRail } from "@/components/tickets/detail/TriageSummaryRail";
import { getTicket } from "@/features/tickets/api";
import { getStoredUser } from "@/lib/auth";
import type { Ticket } from "@/types/ticket";

export default function TicketDetailPage() {
  const params = useParams<{ id: string }>();
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = getStoredUser();
  const canManage = user?.role === "staff" || user?.role === "admin";

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError("");

    getTicket(params.id)
      .then((result) => {
        if (active) setTicket(result);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Không tải được ticket");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [params.id]);

  return (
    <AppShell>
      {loading ? (
        <Loading />
      ) : error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
          {error}
          <Button
            className="mt-3"
            variant="secondary"
            icon={<RefreshCcw className="h-4 w-4" aria-hidden="true" />}
            onClick={() => window.location.reload()}
          >
            Tải lại
          </Button>
        </div>
      ) : ticket ? (
        <div className="space-y-6">
          <TicketDetailHero ticket={ticket} />
          <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
            <div className="st-enter min-w-0 space-y-6" style={{ animationDelay: "120ms" }}>
              <TicketStoryCard ticket={ticket} />
              <TriageReport analysis={ticket.analysis} />
            </div>
            <div className="st-enter min-w-0" style={{ animationDelay: "220ms" }}>
              <TriageSummaryRail ticket={ticket} canManage={canManage} onSaved={setTicket} />
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
