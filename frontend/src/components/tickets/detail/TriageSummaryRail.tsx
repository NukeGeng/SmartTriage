// TriageSummaryRail.tsx - Sticky right rail: TriageBot note, score dial, routing, status form.
import { Building2 } from "lucide-react";

import { ConfidenceMeter } from "@/components/ai/ConfidenceMeter";
import { TicketStatusForm } from "@/components/tickets/TicketStatusForm";
import { TriageBotNote } from "./TriageBotNote";
import { TriageScoreDial } from "./TriageScoreDial";
import type { Ticket } from "@/types/ticket";

type TriageSummaryRailProps = {
  ticket: Ticket;
  canManage: boolean;
  onSaved: (ticket: Ticket) => void;
};

export function TriageSummaryRail({ ticket, canManage, onSaved }: TriageSummaryRailProps) {
  const analysis = ticket.analysis;

  return (
    <div className="min-w-0 space-y-6 xl:sticky xl:top-6">
      <TriageBotNote ticket={ticket} />

      {analysis ? (
        <section className="st-card rounded-lg bg-card p-6 shadow-soft">
          <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">
            Điểm ưu tiên AI
          </h2>
          <div className="mt-4 flex justify-center">
            <TriageScoreDial score={analysis.priority_score} priority={analysis.priority} />
          </div>

          <div className="mt-5 space-y-1.5">
            <div className="flex items-baseline justify-between gap-2 text-sm">
              <span className="font-semibold text-neutral-600">Nhóm phản ánh</span>
              <span className="truncate font-bold text-ink">{analysis.category_label}</span>
            </div>
            <ConfidenceMeter value={analysis.category_confidence} />
          </div>

          <div className="mt-5 rounded-md border border-line bg-brand-50 p-4">
            <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-brand-700">
              <Building2 className="h-4 w-4" aria-hidden="true" />
              Phòng ban đề xuất
            </p>
            <p className="mt-1.5 font-display text-lg font-black text-ink">{analysis.suggested_department}</p>
          </div>

          <p className="mt-4 text-right font-mono text-[11px] text-neutral-400">
            model {analysis.model_version}
          </p>
        </section>
      ) : null}

      {canManage ? <TicketStatusForm ticket={ticket} onSaved={onSaved} /> : null}
    </div>
  );
}
