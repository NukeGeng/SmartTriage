import { GitMerge } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { formatPercent } from "@/lib/utils";
import type { IncidentGroupSuggestion } from "@/types/triage";

export function IncidentSuggestionList({ groups }: { groups: IncidentGroupSuggestion[] }) {
  if (groups.length === 0) {
    return <p className="text-sm text-neutral-500">Chưa phát hiện nhóm phản ánh cùng chủ đề.</p>;
  }

  return (
    <div className="space-y-3">
      {groups.map((group) => (
        <div key={group.group_key} className="rounded-md border border-line bg-card p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
                <GitMerge className="h-4 w-4 text-brand-600" aria-hidden="true" />
                {group.title}
              </h3>
              <p className="mt-1 text-sm text-neutral-600">{group.recommendation}</p>
            </div>
            <Badge tone="amber">{formatPercent(group.average_similarity)}</Badge>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {group.category ? <Badge tone="cyan">{group.category}</Badge> : null}
            <Badge>{group.related_count} phản ánh</Badge>
          </div>
          <div className="mt-3 space-y-2">
            {group.related_tickets.map((ticket) => (
              <div key={ticket.ticket_id} className="rounded-md bg-panel px-3 py-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-sm font-medium text-ink">{ticket.title}</p>
                  <span className="text-xs font-semibold text-neutral-600">{formatPercent(ticket.similarity)}</span>
                </div>
                <p className="mt-1 text-xs text-neutral-500">{ticket.reason}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
