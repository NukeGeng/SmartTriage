// IncidentGroupCard.tsx - Clickable incident group summary card for the admin queue.
import type { MouseEvent } from "react";
import Link from "next/link";
import { GitMerge } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import type { IncidentGroup, IncidentGroupStatus } from "@/types/incident";

type IncidentGroupCardProps = {
  group: IncidentGroup;
  onHoverMove: (event: MouseEvent<HTMLAnchorElement>, title: string) => void;
  onHoverEnd: () => void;
};

const statusLabels: Record<IncidentGroupStatus, string> = {
  open: "Đang mở",
  in_progress: "Đang xử lý",
  resolved: "Đã xử lý",
  closed: "Đã đóng",
};

export function IncidentGroupCard({ group, onHoverMove, onHoverEnd }: IncidentGroupCardProps) {
  return (
    <Link
      href={`/admin/incidents/${group.id}`}
      aria-label={`Xem nhóm sự cố: ${group.title}`}
      className="group block min-w-0 rounded-lg outline-none"
      onMouseMove={(event) => onHoverMove(event, group.title)}
      onMouseLeave={onHoverEnd}
      onFocus={onHoverEnd}
    >
      <Card className="h-full cursor-pointer border border-transparent transition duration-300 ease-out group-hover:-translate-y-1 group-hover:border-brand-200 group-hover:shadow-[0_18px_55px_rgba(37,99,235,0.13)] group-focus-visible:border-brand-400 group-focus-visible:ring-2 group-focus-visible:ring-brand-500/25">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <CardTitle>{group.title}</CardTitle>
              <p className="mt-1 line-clamp-2 text-sm text-neutral-600">{group.description}</p>
            </div>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-brand-50 text-brand-600 transition duration-300 ease-out group-hover:rotate-3 group-hover:bg-brand-600 group-hover:text-white">
              <GitMerge className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge>{statusLabels[group.status]}</Badge>
            {group.priority ? <Badge priority={group.priority} /> : null}
            {group.category ? <Badge tone="cyan">{group.category}</Badge> : null}
            <Badge tone="amber">{group.related_count} phản ánh</Badge>
          </div>
          <div className="grid gap-2 text-sm text-neutral-600 md:grid-cols-2">
            <span className="min-w-0">Phòng ban: {group.suggested_department ?? "Chưa gán"}</span>
            <span className="min-w-0 md:text-right">Tạo lúc: {formatDate(group.created_at)}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
