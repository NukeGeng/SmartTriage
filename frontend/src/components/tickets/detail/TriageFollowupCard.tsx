// TriageFollowupCard.tsx - Suggested actions + similar tickets side by side. Props: analysis.
import { CopyCheck, ListChecks } from "lucide-react";

import { SuggestedActions } from "@/components/ai/SuggestedActions";
import { DuplicateCandidates } from "@/components/tickets/DuplicateCandidates";
import type { TicketAnalysis } from "@/types/ticket";

export function TriageFollowupCard({ analysis }: { analysis: TicketAnalysis }) {
  return (
    <section className="st-card rounded-lg bg-card p-6 shadow-soft md:p-7">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
            <ListChecks className="h-4 w-4 text-emerald-700" aria-hidden="true" />
            Kế hoạch xử lý đề xuất
          </h2>
          <div className="mt-3">
            <SuggestedActions actions={analysis.suggested_actions} />
          </div>
        </div>
        <div className="min-w-0 border-t border-dashed border-line pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <h2 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
            <CopyCheck className="h-4 w-4 text-brand-700" aria-hidden="true" />
            Phản ánh tương tự
          </h2>
          <div className="mt-3">
            <DuplicateCandidates candidates={analysis.duplicate_candidates} />
          </div>
        </div>
      </div>
    </section>
  );
}
