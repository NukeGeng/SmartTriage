// ReviewDecisionPanel.tsx - Two-column decision area for the selected review case.
import { ReviewCaseSummary } from "@/components/review/ReviewCaseSummary";
import { ReviewCorrectionForm } from "@/components/review/ReviewCorrectionForm";
import type { TriageTicket } from "@/types/triage";

type ReviewDecisionPanelProps = {
  ticket: TriageTicket | null;
  saving: boolean;
  onSave: (ticketId: string, category: string, priority: string) => Promise<void>;
};

export function ReviewDecisionPanel({ ticket, saving, onSave }: ReviewDecisionPanelProps) {
  if (!ticket) {
    return (
      <section className="rounded-xl border border-dashed border-line bg-card p-8 text-center shadow-soft">
        <p className="font-display text-2xl font-black text-ink">Chưa chọn case</p>
        <p className="mt-2 text-sm font-semibold text-command-muted">
          Chọn một phản ánh bên trái để đọc tín hiệu AI và sửa nhãn thủ công.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-line bg-card p-5 shadow-command md:p-6">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <ReviewCaseSummary ticket={ticket} />
        <ReviewCorrectionForm ticket={ticket} saving={saving} onSave={onSave} />
      </div>
    </section>
  );
}
