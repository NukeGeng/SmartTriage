// TicketAnalysisPreview.tsx - Post-submit AI preview before redirecting to the ticket detail.
import { ArrowRight, GitMerge, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import type { Ticket } from "@/types/ticket";

type TicketAnalysisPreviewProps = {
  ticket: Ticket | null;
};

export function TicketAnalysisPreview({ ticket }: TicketAnalysisPreviewProps) {
  if (!ticket) {
    return null;
  }

  return (
    <section className="st-pop-in rounded-xl border border-brand-100 bg-card p-5 shadow-command">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-brand-700">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            AI analysis preview
          </p>
          <h2 className="mt-2 font-display text-2xl font-black text-ink">Ticket đã vào hàng chờ triage.</h2>
        </div>
        <span className="inline-flex items-center gap-2 rounded-pill bg-panel px-3 py-2 text-xs font-bold text-neutral-600">
          Đang mở chi tiết
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>

      {ticket.analysis ? (
        <div className="mt-4 flex flex-wrap gap-3">
          <Badge tone="cyan" className="rounded-pill bg-cyan-50 px-3">
            {ticket.analysis.category_label}
          </Badge>
          <Badge priority={ticket.analysis.priority} className="rounded-pill bg-panel px-3" />
          <Badge tone="green" className="rounded-pill bg-emerald-50 px-3">
            {ticket.analysis.suggested_department}
          </Badge>
          <Badge tone="amber" className="rounded-pill bg-amber-50 px-3">
            <GitMerge className="h-3.5 w-3.5" aria-hidden="true" />
            {ticket.analysis.duplicate_candidates.length} liên quan
          </Badge>
        </div>
      ) : (
        <p className="mt-4 rounded-lg bg-panel p-4 text-sm font-semibold leading-6 text-neutral-600">
          Ticket đã tạo. AI analysis đang được xử lý hoặc backend đang dùng fallback; trang chi tiết sẽ hiển thị trạng thái mới nhất.
        </p>
      )}
    </section>
  );
}
