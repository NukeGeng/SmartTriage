"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Activity, AlertTriangle, CheckCircle2, ClipboardList } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import {
  getDashboardStats,
  getRecentTickets,
  getTicketsByCategory,
  getTicketsByPriority,
  getTicketsByStatus,
} from "@/features/dashboard/api";
import { getStoredUser } from "@/lib/auth";
import { formatDate, getPriorityLabel, getStatusLabel } from "@/lib/utils";
import type {
  CategoryStat,
  DashboardStats,
  PriorityStat,
  RecentTicket,
  StatusStat,
} from "@/types/dashboard";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [categories, setCategories] = useState<CategoryStat[]>([]);
  const [priorities, setPriorities] = useState<PriorityStat[]>([]);
  const [statuses, setStatuses] = useState<StatusStat[]>([]);
  const [recentTickets, setRecentTickets] = useState<RecentTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = getStoredUser();
    if (user?.role === "student") {
      router.replace("/tickets");
      return;
    }

    let active = true;
    setLoading(true);
    setError("");

    Promise.all([
      getDashboardStats(),
      getTicketsByCategory(),
      getTicketsByPriority(),
      getTicketsByStatus(),
      getRecentTickets(8),
    ])
      .then(([nextStats, nextCategories, nextPriorities, nextStatuses, nextRecent]) => {
        if (!active) return;
        setStats(nextStats);
        setCategories(nextCategories);
        setPriorities(nextPriorities);
        setStatuses(nextStatuses);
        setRecentTickets(nextRecent);
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : "Không tải được dashboard");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [router]);

  const cards = useMemo(
    () => [
      {
        label: "Tổng phản ánh",
        value: stats?.total_tickets ?? 0,
        icon: ClipboardList,
        tone: "text-brand-600",
      },
      {
        label: "Đang mở",
        value: stats?.open_tickets ?? 0,
        icon: Activity,
        tone: "text-cyan-700",
      },
      {
        label: "Đã xử lý",
        value: stats?.resolved_tickets ?? 0,
        icon: CheckCircle2,
        tone: "text-emerald-700",
      },
      {
        label: "Ưu tiên cao",
        value: stats?.high_priority_tickets ?? 0,
        icon: AlertTriangle,
        tone: "text-rose-700",
      },
    ],
    [stats],
  );

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold text-brand-700">Dashboard</p>
          <h1 className="text-2xl font-semibold text-ink">Tổng quan phản ánh</h1>
          <p className="mt-1 text-sm text-neutral-600">Theo dõi ticket, ưu tiên AI và luồng xử lý.</p>
        </div>

        {loading ? (
          <Loading />
        ) : error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
            {error}
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {cards.map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.label}>
                    <CardContent className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-neutral-500">{item.label}</p>
                        <p className="mt-1 text-3xl font-semibold text-ink">{item.value}</p>
                      </div>
                      <Icon className={`h-8 w-8 ${item.tone}`} aria-hidden="true" />
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
              <BarChart title="Ticket theo category" data={categories.map((item) => ({ label: item.category, count: item.count }))} />
              <BarChart
                title="Ticket theo priority"
                data={priorities.map((item) => ({ label: getPriorityLabel(item.priority), count: item.count }))}
              />
              <BarChart
                title="Ticket theo status"
                data={statuses.map((item) => ({ label: getStatusLabel(item.status), count: item.count }))}
              />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Ticket gần đây</CardTitle>
              </CardHeader>
              <CardContent>
                {recentTickets.length === 0 ? (
                  <p className="text-sm text-neutral-500">
                    Chưa có ticket gần đây. Khi có phản ánh mới, danh sách sẽ xuất hiện tại đây.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {recentTickets.map((ticket) => (
                      <Link
                        key={ticket.id}
                        href={`/tickets/${ticket.id}`}
                        className="grid gap-3 rounded-md border border-line px-3 py-3 transition hover:border-brand-500 md:grid-cols-[1fr_auto_auto]"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-ink">{ticket.title}</p>
                          <p className="text-xs text-neutral-500">{formatDate(ticket.created_at)}</p>
                        </div>
                        <Badge status={ticket.status} />
                        {ticket.priority ? <Badge priority={ticket.priority} /> : <Badge>Chưa ưu tiên</Badge>}
                      </Link>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </AppShell>
  );
}

function BarChart({ title, data }: { title: string; data: Array<{ label: string; count: number }> }) {
  const max = Math.max(...data.map((item) => item.count), 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-neutral-500">Chưa có dữ liệu.</p>
        ) : (
          <div className="space-y-3">
            {data.map((item) => {
              const width = max > 0 ? Math.max((item.count / max) * 100, 6) : 0;
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between gap-3 text-sm">
                    <span className="truncate font-medium text-ink">{item.label}</span>
                    <span className="text-neutral-500">{item.count}</span>
                  </div>
                  <div className="h-2 rounded-md bg-panel">
                    <div className="h-2 rounded-md bg-brand-600" style={{ width: `${width}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
