// TriageBreakdownCard.tsx - Priority score breakdown with staggered bars. Props: breakdown.
import { Gauge } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import type { PriorityBreakdown } from "@/types/ticket";

function barWidth(score: number) {
  return `${Math.max(4, Math.min(score, 100))}%`;
}

export function TriageBreakdownCard({ breakdown }: { breakdown: PriorityBreakdown }) {
  return (
    <section className="st-card rounded-lg bg-card p-6 shadow-soft md:p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
          <Gauge className="h-4 w-4 text-[#f6b73c]" aria-hidden="true" />
          Điểm ưu tiên được tính thế nào
        </h2>
        <span className="rounded-pill border border-line bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
          Tổng {breakdown.total_score}/100
        </span>
      </div>

      <ol className="mt-5 space-y-5">
        {breakdown.items.map((item, index) => (
          <li key={item.name} className="min-w-0">
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm font-bold text-ink">{item.name}</p>
              <span className="font-mono text-sm font-bold text-brand-700">
                {item.score > 0 ? `+${item.score}` : item.score}
              </span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-pill bg-neutral-100">
              <div
                className="st-bar-grow h-full rounded-pill bg-brand-600"
                style={{ width: barWidth(item.score), animationDelay: `${index * 90}ms` }}
              />
            </div>
            <p className="mt-2 text-sm leading-6 text-neutral-600">{item.reason}</p>
            {item.matched_terms && item.matched_terms.length > 0 ? (
              <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
                {item.matched_terms.map((term) => (
                  <Badge key={`${item.name}-${term}`} tone="amber">
                    “{term}”
                  </Badge>
                ))}
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
