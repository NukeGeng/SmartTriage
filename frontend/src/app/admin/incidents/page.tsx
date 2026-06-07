"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GitMerge, RefreshCcw } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loading } from "@/components/ui/Loading";
import { listIncidentGroups } from "@/features/incidents/api";
import { getStoredUser } from "@/lib/auth";
import { formatDate } from "@/lib/utils";
import type { IncidentGroup } from "@/types/incident";

export default function IncidentGroupsPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<IncidentGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadGroups() {
    setLoading(true);
    setError("");
    try {
      setGroups(await listIncidentGroups());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được incident groups");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const user = getStoredUser();
    if (user?.role === "student") {
      router.replace("/tickets");
      return;
    }
    void loadGroups();
  }, [router]);

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-brand-700">Incident Groups</p>
            <h1 className="text-2xl font-semibold text-ink">Gợi ý nhóm phản ánh cùng chủ đề</h1>
            <p className="mt-1 text-sm text-neutral-600">
              Gom nhiều ticket liên quan thành một nhóm sự cố để xử lý tập trung.
            </p>
          </div>
          <Button
            variant="secondary"
            icon={<RefreshCcw className="h-4 w-4" aria-hidden="true" />}
            onClick={loadGroups}
          >
            Refresh
          </Button>
        </div>

        {error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
            {error}
          </div>
        ) : null}

        {loading ? (
          <Loading />
        ) : groups.length === 0 ? (
          <EmptyState
            title="Chưa có incident group"
            description="Chạy seed demo hoặc tạo nhóm từ suggestion để xem dữ liệu."
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {groups.map((group) => (
              <Card key={group.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <CardTitle>{group.title}</CardTitle>
                      <p className="mt-1 text-sm text-neutral-600">{group.description}</p>
                    </div>
                    <GitMerge className="h-5 w-5 shrink-0 text-brand-600" aria-hidden="true" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <Badge>{group.status}</Badge>
                    {group.priority ? <Badge priority={group.priority} /> : null}
                    {group.category ? <Badge tone="cyan">{group.category}</Badge> : null}
                    <Badge tone="amber">{group.related_count} ticket</Badge>
                  </div>
                  <div className="grid gap-2 text-sm text-neutral-600 md:grid-cols-2">
                    <span>Phòng ban: {group.suggested_department ?? "Chưa gán"}</span>
                    <span>Tạo lúc: {formatDate(group.created_at)}</span>
                  </div>
                  <Link href={`/admin/incidents/${group.id}`}>
                    <Button className="w-full">Xem nhóm sự cố</Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
