import { AlertTriangle, Layers3, ListChecks, ShieldAlert } from "lucide-react";

import { Card, CardContent } from "@/components/ui/Card";
import type { TriageSummary } from "@/types/triage";

const summaryItems = [
  { key: "total_open", label: "Open tickets", icon: ListChecks },
  { key: "high_priority", label: "High priority", icon: ShieldAlert },
  { key: "low_confidence", label: "Need review", icon: AlertTriangle },
  { key: "possible_incidents", label: "Possible incidents", icon: Layers3 },
] as const;

export function TriageSummaryCards({ summary }: { summary: TriageSummary }) {
  return (
    <div className="grid gap-3 md:grid-cols-4">
      {summaryItems.map((item) => {
        const Icon = item.icon;
        return (
          <Card key={item.key}>
            <CardContent className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-neutral-500">{item.label}</p>
                <p className="mt-1 text-2xl font-semibold text-ink">{summary[item.key]}</p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-md border border-line bg-white text-brand-700">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
