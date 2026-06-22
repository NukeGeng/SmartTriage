"use client";

import { useEffect, useState } from "react";
import type { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { RefreshCcw } from "lucide-react";

import { CursorHoverHint, type CursorHoverHintData } from "@/components/incidents/CursorHoverHint";
import { IncidentGroupCard } from "@/components/incidents/IncidentGroupCard";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Loading } from "@/components/ui/Loading";
import { listIncidentGroups } from "@/features/incidents/api";
import { getStoredUser } from "@/lib/auth";
import type { IncidentGroup } from "@/types/incident";

export default function IncidentGroupsPage() {
  const router = useRouter();
  const [groups, setGroups] = useState<IncidentGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hoverHint, setHoverHint] = useState<CursorHoverHintData | null>(null);

  async function loadGroups() {
    setLoading(true);
    setError("");
    try {
      setGroups(await listIncidentGroups());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được nhóm sự cố");
    } finally {
      setLoading(false);
    }
  }

  function updateHoverHint(event: MouseEvent<HTMLAnchorElement>, title: string) {
    setHoverHint({
      x: event.clientX,
      y: event.clientY,
      title,
    });
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
            <p className="text-sm font-semibold text-brand-700">Nhóm sự cố</p>
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
            Làm mới
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
            title="Chưa có nhóm sự cố"
            description="Chạy seed demo hoặc tạo nhóm từ gợi ý để xem dữ liệu."
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {groups.map((group) => (
              <IncidentGroupCard
                key={group.id}
                group={group}
                onHoverMove={updateHoverHint}
                onHoverEnd={() => setHoverHint(null)}
              />
            ))}
          </div>
        )}
      </div>
      <CursorHoverHint hint={hoverHint} />
    </AppShell>
  );
}
