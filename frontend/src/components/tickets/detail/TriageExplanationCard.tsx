// TriageExplanationCard.tsx - AI explanation summary + reason tiles + detected signals. Props: analysis.
import { Radar, Sparkles } from "lucide-react";

import { DetectedSignals } from "@/components/ai/DetectedSignals";
import { cn } from "@/lib/utils";
import type { TicketAnalysis } from "@/types/ticket";

const reasonTiles = [
  { key: "category_reason", label: "Vì sao nhóm này", accent: "text-brand-700", surface: "bg-brand-50" },
  { key: "priority_reason", label: "Vì sao ưu tiên này", accent: "text-amber-700", surface: "bg-amber-50" },
  { key: "department_reason", label: "Vì sao phòng này", accent: "text-emerald-700", surface: "bg-emerald-50" },
] as const;

export function TriageExplanationCard({ analysis }: { analysis: TicketAnalysis }) {
  const explanation = analysis.explanation;
  if (!explanation) return null;

  return (
    <section className="st-card rounded-lg bg-card p-6 shadow-soft md:p-7">
      <div className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-brand-700" aria-hidden="true" />
        <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
          Vì sao AI phân loại như vậy?
        </h2>
      </div>

      <p className="mt-4 font-display text-lg font-bold leading-7 text-ink md:text-xl md:leading-8">
        {explanation.summary}
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {reasonTiles.map((tile) => (
          <div key={tile.key} className={cn("min-w-0 rounded-md p-4", tile.surface)}>
            <p className={cn("text-[11px] font-bold uppercase tracking-[0.1em]", tile.accent)}>{tile.label}</p>
            <p className="mt-1.5 text-sm leading-6 text-neutral-700">{explanation[tile.key]}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t border-dashed border-line pt-5">
        <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
          <Radar className="h-4 w-4 text-brand-700" aria-hidden="true" />
          Tín hiệu phát hiện trong nội dung
        </h3>
        <div className="mt-3">
          <DetectedSignals signals={explanation.detected_signals ?? []} />
        </div>
      </div>
    </section>
  );
}
