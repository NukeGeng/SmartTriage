"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import { getIncidentGroup, updateIncidentGroupStatus } from "@/features/incidents/api";
import { getStoredUser } from "@/lib/auth";
import { formatDate, formatPercent } from "@/lib/utils";
import type { IncidentGroupDetail, IncidentGroupStatus } from "@/types/incident";

const statusOptions: IncidentGroupStatus[] = ["open", "in_progress", "resolved", "closed"];

export default function IncidentGroupDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [group, setGroup] = useState<IncidentGroupDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadGroup = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setGroup(await getIncidentGroup(params.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được incident group");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  async function handleStatusChange(status: IncidentGroupStatus) {
    setSaving(true);
    setError("");
    try {
      setGroup(await updateIncidentGroupStatus(params.id, status));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không cập nhật được trạng thái");
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    const user = getStoredUser();
    if (user?.role === "student") {
      router.replace("/tickets");
      return;
    }
    void loadGroup();
  }, [loadGroup, router]);

  return (
    <AppShell>
      {loading || !group ? (
        <Loading />
      ) : (
        <div className="space-y-5">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
            <div>
              <p className="text-sm font-semibold text-brand-700">Incident Group</p>
              <h1 className="text-2xl font-semibold text-ink">{group.title}</h1>
              <p className="mt-1 max-w-3xl text-sm text-neutral-600">{group.description}</p>
            </div>
            <label className="block space-y-1.5">
              <span className="text-sm font-medium text-ink">Status</span>
              <select
                className="h-11 min-w-48 rounded-md border border-line bg-card px-3 text-sm text-ink outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                value={group.status}
                disabled={saving}
                onChange={(event) => handleStatusChange(event.target.value as IncidentGroupStatus)}
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {error ? (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="grid gap-3 md:grid-cols-4">
            <Card>
              <CardContent>
                <p className="text-xs font-semibold uppercase text-neutral-500">Category</p>
                <p className="mt-1 text-lg font-semibold text-ink">{group.category ?? "Chưa có"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-xs font-semibold uppercase text-neutral-500">Priority</p>
                <p className="mt-1">{group.priority ? <Badge priority={group.priority} /> : <Badge>Chưa có</Badge>}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-xs font-semibold uppercase text-neutral-500">Department</p>
                <p className="mt-1 text-lg font-semibold text-ink">{group.suggested_department ?? "Chưa gán"}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-xs font-semibold uppercase text-neutral-500">Related tickets</p>
                <p className="mt-1 text-lg font-semibold text-ink">{group.related_count}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Related Tickets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {group.tickets.map((ticket) => (
                <div key={ticket.id} className="rounded-md border border-line bg-panel p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-ink">{ticket.title}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <Badge status={ticket.status} />
                        {ticket.similarity_score !== null ? (
                          <Badge tone="amber">{formatPercent(ticket.similarity_score)}</Badge>
                        ) : null}
                      </div>
                      {ticket.reason ? <p className="mt-2 text-sm text-neutral-600">{ticket.reason}</p> : null}
                      <p className="mt-1 text-xs text-neutral-500">{formatDate(ticket.created_at)}</p>
                    </div>
                    <Link href={`/tickets/${ticket.ticket_id}`}>
                      <Button
                        variant="secondary"
                        className="min-h-9 px-3 py-1.5"
                        icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
                      >
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </AppShell>
  );
}
