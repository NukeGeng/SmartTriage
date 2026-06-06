"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpDown, Eye } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Input } from "@/components/ui/Input";
import { Loading } from "@/components/ui/Loading";
import { TicketFilters } from "@/components/tickets/TicketFilters";
import { listTickets, updateTicketStatus } from "@/features/tickets/api";
import { getStoredUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import type { Ticket, TicketFilters as TicketFiltersType, TicketStatus } from "@/types/ticket";

const statusOptions: Array<[TicketStatus, string]> = [
  ["new", "Mới"],
  ["analyzing", "Đang phân tích"],
  ["open", "Đang mở"],
  ["in_progress", "Đang xử lý"],
  ["resolved", "Đã xử lý"],
  ["rejected", "Từ chối"],
];

const priorityRank: Record<string, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

type SortKey = "created_at" | "priority";

export default function AdminTicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filters, setFilters] = useState<TicketFiltersType>({});
  const [department, setDepartment] = useState("");
  const [sortBy, setSortBy] = useState<SortKey>("created_at");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingTicketId, setSavingTicketId] = useState("");

  useEffect(() => {
    const user = getStoredUser();
    if (user?.role === "student") {
      router.replace("/tickets");
      return;
    }

    let active = true;
    setLoading(true);
    setError("");

    listTickets({ ...filters, assigned_department: department })
      .then((result) => {
        if (active) setTickets(result.items);
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
  }, [department, filters, router]);

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

  async function handleStatusChange(ticket: Ticket, nextStatus: TicketStatus) {
    setSavingTicketId(ticket.id);
    setError("");
    try {
      const updated = await updateTicketStatus(ticket.id, nextStatus);
      setTickets((current) => current.map((item) => (item.id === ticket.id ? updated : item)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không cập nhật được trạng thái");
    } finally {
      setSavingTicketId("");
    }
  }

  return (
    <AppShell>
      <div className="space-y-5">
        <div>
          <p className="text-sm font-semibold text-brand-700">Admin</p>
          <h1 className="text-2xl font-semibold text-ink">Quản lý ticket</h1>
          <p className="mt-1 text-sm text-neutral-600">Lọc, sắp xếp và đổi trạng thái nhanh cho quy trình xử lý.</p>
        </div>

        <TicketFilters filters={filters} onChange={setFilters} onReset={() => setFilters({})} />

        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <Input
            label="Lọc theo phòng phụ trách"
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
            placeholder="Phòng CNTT"
          />
          <label className="block space-y-1.5">
            <span className="text-sm font-medium text-ink">Sắp xếp</span>
            <select
              className="h-11 min-w-52 rounded-md border border-line bg-white px-3 text-sm text-ink outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortKey)}
            >
              <option value="created_at">Mới nhất</option>
              <option value="priority">Ưu tiên</option>
            </select>
          </label>
        </div>

        {error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <Loading />
        ) : sortedTickets.length === 0 ? (
          <EmptyState title="Không có ticket phù hợp" description="Thử đổi filter hoặc kiểm tra dữ liệu demo." />
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>Ticket table</CardTitle>
                <Button
                  variant="secondary"
                  icon={<ArrowUpDown className="h-4 w-4" aria-hidden="true" />}
                  onClick={() => setSortBy(sortBy === "created_at" ? "priority" : "created_at")}
                >
                  Đổi sort
                </Button>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-xs uppercase text-neutral-500">
                    <th className="py-3 pr-4 font-semibold">Title</th>
                    <th className="py-3 pr-4 font-semibold">Status</th>
                    <th className="py-3 pr-4 font-semibold">AI Category</th>
                    <th className="py-3 pr-4 font-semibold">Priority</th>
                    <th className="py-3 pr-4 font-semibold">Department</th>
                    <th className="py-3 pr-4 font-semibold">Created At</th>
                    <th className="py-3 pr-4 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedTickets.map((ticket) => {
                    const priority = ticket.priority ?? ticket.analysis?.priority ?? null;
                    const category = ticket.category ?? ticket.analysis?.predicted_category ?? "Chưa có";
                    return (
                      <tr key={ticket.id} className="border-b border-line last:border-0">
                        <td className="max-w-xs py-3 pr-4">
                          <p className="truncate font-semibold text-ink">{ticket.title}</p>
                        </td>
                        <td className="py-3 pr-4">
                          <select
                            className="h-9 rounded-md border border-line bg-white px-2 text-sm text-ink outline-none focus:border-brand-600"
                            value={ticket.status}
                            disabled={savingTicketId === ticket.id}
                            onChange={(event) => handleStatusChange(ticket, event.target.value as TicketStatus)}
                          >
                            {statusOptions.map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 pr-4">
                          <Badge tone="cyan">{category}</Badge>
                        </td>
                        <td className="py-3 pr-4">
                          {priority ? <Badge priority={priority} /> : <Badge>Chưa có</Badge>}
                        </td>
                        <td className="max-w-[180px] py-3 pr-4">
                          <span className="truncate text-neutral-700">{ticket.assigned_department ?? "Chưa gán"}</span>
                        </td>
                        <td className="py-3 pr-4 text-neutral-600">{formatDate(ticket.created_at)}</td>
                        <td className="py-3 pr-4">
                          <Link href={`/tickets/${ticket.id}`}>
                            <Button
                              variant="secondary"
                              icon={<Eye className="h-4 w-4" aria-hidden="true" />}
                              className="min-h-9 px-3 py-1.5"
                            >
                              Xem
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
