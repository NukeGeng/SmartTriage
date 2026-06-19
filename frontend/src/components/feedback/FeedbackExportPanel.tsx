// FeedbackExportPanel.tsx - Export controls and retraining loop explanation.
import Link from "next/link";
import { ArrowRight, Database, Download } from "lucide-react";

import { ExportFeedbackButton } from "@/components/feedback/ExportFeedbackButton";
import { Button } from "@/components/ui/Button";
import { feedbackExportNotes, feedbackLoopSteps } from "@/data/mlFeedbackContent";
import type { Ticket } from "@/types/ticket";

type FeedbackExportPanelProps = {
  correctedTickets: Ticket[];
  totalCount: number;
  lowConfidenceCount: number;
};

export function FeedbackExportPanel({
  correctedTickets,
  totalCount,
  lowConfidenceCount,
}: FeedbackExportPanelProps) {
  return (
    <aside className="rounded-xl border border-line bg-card p-5 shadow-command">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-700">
            Dataset out
          </p>
          <h2 className="mt-1 font-display text-2xl font-black text-ink">
            Export feedback sạch
          </h2>
        </div>
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-pill border border-line bg-brand-50 text-brand-700">
          <Download className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg border border-line bg-panel px-3 py-2">
          <p className="font-mono text-lg font-black text-ink">{correctedTickets.length}</p>
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-command-muted">
            Corrected
          </p>
        </div>
        <div className="rounded-lg border border-line bg-panel px-3 py-2">
          <p className="font-mono text-lg font-black text-signal-amber">{lowConfidenceCount}</p>
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-command-muted">
            Review
          </p>
        </div>
        <div className="rounded-lg border border-line bg-panel px-3 py-2">
          <p className="font-mono text-lg font-black text-brand-700">{totalCount}</p>
          <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-command-muted">
            Total
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-2 rounded-lg border border-line bg-command-elevated p-4">
        {feedbackLoopSteps.map((step, index) => (
          <p key={step} className="grid grid-cols-[auto_1fr] gap-3 text-sm font-semibold text-command-muted">
            <span className="font-mono text-brand-700">0{index + 1}</span>
            <span>{step}</span>
          </p>
        ))}
      </div>

      <div className="mt-5 space-y-2">
        {feedbackExportNotes.map((note) => (
          <p key={note} className="flex gap-2 text-xs font-semibold leading-5 text-command-muted">
            <Database className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-700" aria-hidden="true" />
            <span>{note}</span>
          </p>
        ))}
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <ExportFeedbackButton tickets={correctedTickets} />
        <Link href="/admin/review" className="block">
          <Button
            variant="secondary"
            fullWidth
            icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
          >
            Mở AI Review Queue
          </Button>
        </Link>
      </div>
    </aside>
  );
}
