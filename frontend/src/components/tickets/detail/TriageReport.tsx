// TriageReport.tsx - Main-column AI triage report; composes explanation, breakdown, follow-up.
import { Bot } from "lucide-react";

import { TriageBreakdownCard } from "./TriageBreakdownCard";
import { TriageExplanationCard } from "./TriageExplanationCard";
import { TriageFollowupCard } from "./TriageFollowupCard";
import type { TicketAnalysis } from "@/types/ticket";

export function TriageReport({ analysis }: { analysis: TicketAnalysis | null | undefined }) {
  if (!analysis) {
    return (
      <section className="flex items-center gap-4 rounded-lg border-2 border-dashed border-line bg-card/60 p-6">
        <span className="st-idle-float grid h-11 w-11 shrink-0 place-items-center rounded-pill bg-brand-50 text-brand-700">
          <Bot className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="font-display text-base font-black text-ink">Chưa có kết quả AI Triage Analysis</p>
          <p className="mt-1 text-sm leading-6 text-neutral-600">
            Ticket đã được tạo nhưng AI chưa trả về kết quả phân tích. Tải lại trang sau ít phút để xem
            phân loại, điểm ưu tiên và gợi ý xử lý.
          </p>
        </div>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <TriageExplanationCard analysis={analysis} />
      {analysis.priority_breakdown ? <TriageBreakdownCard breakdown={analysis.priority_breakdown} /> : null}
      <TriageFollowupCard analysis={analysis} />
    </div>
  );
}
