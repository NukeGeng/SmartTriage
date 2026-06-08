import { Route } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import type { RoutingRecommendation } from "@/types/triage";
import { TriageTicketCard } from "./TriageTicketCard";

export function RoutingRecommendations({ recommendations }: { recommendations: RoutingRecommendation[] }) {
  if (recommendations.length === 0) {
    return <p className="text-sm text-neutral-500">Không có ticket cần điều phối lại phòng ban.</p>;
  }

  return (
    <div className="space-y-3">
      {recommendations.map((item) => (
        <div key={item.ticket.id} className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 rounded-md border border-cyan-100 bg-cyan-50 px-3 py-2 text-sm text-cyan-900">
            <Route className="h-4 w-4" aria-hidden="true" />
            <span>{item.reason}</span>
            <Badge tone="cyan">{item.recommended_department}</Badge>
          </div>
          <TriageTicketCard ticket={item.ticket} />
        </div>
      ))}
    </div>
  );
}
