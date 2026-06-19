// ReviewCaseSummary.tsx - AI signals and review reasons for the selected ticket.
import { BrainCircuit } from "lucide-react";

import { cn, formatPercent } from "@/lib/utils";
import type { TriageTicket } from "@/types/triage";

type ReviewCaseSummaryProps = {
  ticket: TriageTicket;
};

function getReviewReasons(ticket: TriageTicket) {
  const reasons: string[] = [];
  if ((ticket.category_confidence ?? 0) < 0.45) {
    reasons.push("Confidence rất thấp, AI có thể đang nhầm category.");
  } else if ((ticket.category_confidence ?? 0) < 0.65) {
    reasons.push("Confidence dưới ngưỡng tự động chấp nhận.");
  }
  if (ticket.priority === "high") {
    reasons.push("Priority cao nên cần chắc route và mức ưu tiên trước khi xử lý.");
  }
  if (!ticket.suggested_department && !ticket.assigned_department) {
    reasons.push("Chưa có department xử lý rõ ràng.");
  }
  return reasons.length > 0 ? reasons : ["Staff xác nhận để biến dự đoán AI thành nhãn tin cậy."];
}

export function ReviewCaseSummary({ ticket }: ReviewCaseSummaryProps) {
  const confidence = Math.round((ticket.category_confidence ?? 0) * 100);
  const reasons = getReviewReasons(ticket);

  return (
    <div className="min-w-0">
      <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-700">
        Selected case
      </p>
      <h2 className="mt-2 font-display text-3xl font-black leading-tight text-ink">
        {ticket.title}
      </h2>
      <p className="mt-3 rounded-lg border border-line bg-panel p-4 text-sm font-semibold leading-6 text-command-muted">
        {ticket.description}
      </p>

      <div className="mt-5 grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-line bg-command-elevated p-4">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-command-muted">
            AI category
          </p>
          <p className="mt-2 text-sm font-black text-ink">
            {ticket.category_label ?? ticket.category ?? "Chưa có"}
          </p>
        </div>
        <div className="rounded-lg border border-line bg-command-elevated p-4">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-command-muted">
            Priority score
          </p>
          <p className="mt-2 text-sm font-black text-ink">{ticket.priority_score ?? "N/A"} / 100</p>
        </div>
        <div className="rounded-lg border border-line bg-command-elevated p-4">
          <p className="text-xs font-bold uppercase tracking-[0.1em] text-command-muted">
            Suggested route
          </p>
          <p className="mt-2 text-sm font-black text-ink">
            {ticket.suggested_department ?? ticket.assigned_department ?? "Chưa có"}
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-lg border border-line bg-command-elevated p-4">
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-command-muted">
            Confidence cần kiểm định
          </p>
          <span className="font-mono text-sm font-black text-signal-amber">
            {formatPercent(ticket.category_confidence)}
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-pill bg-panel">
          <span
            className={cn(
              "st-bar-grow block h-full rounded-pill",
              confidence < 45 ? "bg-signal-rose" : "bg-signal-amber",
            )}
            style={{ width: `${confidence}%` }}
          />
        </div>
        <ul className="mt-4 space-y-2">
          {reasons.map((reason) => (
            <li key={reason} className="flex gap-2 text-sm font-semibold text-command-muted">
              <BrainCircuit className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" aria-hidden="true" />
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
