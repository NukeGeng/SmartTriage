"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { RefreshCcw } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import { TicketAnalysisPanel } from "@/components/tickets/TicketAnalysisPanel";
import { TicketStatusForm } from "@/components/tickets/TicketStatusForm";
import { getTicket } from "@/features/tickets/api";
import { formatDate } from "@/lib/utils";
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
        <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            <Card>
              <CardHeader>
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                  <div>
                    <p className="text-sm font-semibold text-brand-700">Ticket detail</p>
                    <CardTitle>{ticket.title}</CardTitle>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge status={ticket.status} />
                    {ticket.analysis ? <Badge priority={ticket.analysis.priority} /> : null}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="whitespace-pre-wrap text-sm leading-6 text-neutral-700">{ticket.description}</p>
                <div className="grid gap-3 rounded-md border border-line bg-panel p-4 text-sm md:grid-cols-2">
                  <Info label="Created by" value={ticket.created_by_id ?? "Không rõ"} />
                  <Info label="Created at" value={formatDate(ticket.created_at)} />
                  <Info label="Updated at" value={formatDate(ticket.updated_at)} />
                  <Info label="Assigned department" value={ticket.assigned_department ?? "Chưa gán"} />
                </div>
              </CardContent>
            </Card>
            <TicketAnalysisPanel analysis={ticket.analysis} />
          </div>
          {canManage ? <TicketStatusForm ticket={ticket} onSaved={setTicket} /> : null}
        </div>
      ) : null}
    </AppShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold uppercase text-neutral-500">{label}</p>
      <p className="truncate font-medium text-ink">{value}</p>
    </div>
  );
}
