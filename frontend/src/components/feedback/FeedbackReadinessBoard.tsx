// FeedbackReadinessBoard.tsx - Dataset quality gates and label distribution for retraining.
import { CheckCircle2, CircleDashed, Gauge, Layers3 } from "lucide-react";

import { feedbackQualityRules } from "@/data/mlFeedbackContent";
import { getAiCategoryLabel, getTicketConfidence } from "@/lib/feedback";
import type { Ticket } from "@/types/ticket";

type FeedbackReadinessBoardProps = {
  tickets: Ticket[];
  correctedTickets: Ticket[];
  lowConfidenceCount: number;
};

export function FeedbackReadinessBoard({
  tickets,
  correctedTickets,
  lowConfidenceCount,
}: FeedbackReadinessBoardProps) {
  const correctedLowConfidence = correctedTickets.filter(
    (ticket) => (getTicketConfidence(ticket) ?? 1) < 0.65,
  ).length;
  const priorityCorrections = correctedTickets.filter((ticket) => ticket.manual_priority).length;
  const labelCounts = correctedTickets.reduce<Record<string, number>>((counts, ticket) => {
    const label = ticket.manual_category ?? getAiCategoryLabel(ticket);
    counts[label] = (counts[label] ?? 0) + 1;
    return counts;
  }, {});
  const distribution = Object.entries(labelCounts).sort((a, b) => b[1] - a[1]);
  const maxLabelCount = Math.max(1, ...distribution.map(([, count]) => count));
  const readinessScore = Math.min(
    100,
    Math.round(
      Math.min(correctedTickets.length / 5, 1) * 40 +
        Math.min(distribution.length / 3, 1) * 30 +
        Math.min(correctedLowConfidence / Math.max(lowConfidenceCount, 1), 1) * 20 +
        Math.min(priorityCorrections / Math.max(correctedTickets.length, 1), 1) * 10,
    ),
  );

  const gateStatus = {
    sample_count: {
      passed: correctedTickets.length >= 5,
      detail: `${correctedTickets.length}/5 sample`,
    },
    category_coverage: {
      passed: distribution.length >= 3,
      detail: `${distribution.length}/3 category`,
    },
    priority_signal: {
      passed: priorityCorrections > 0,
      detail: `${priorityCorrections} priority correction`,
    },
    low_confidence_reviewed: {
      passed: correctedLowConfidence > 0 || (lowConfidenceCount === 0 && correctedTickets.length > 0),
      detail: `${correctedLowConfidence}/${lowConfidenceCount} uncertainty`,
    },
  };

  return (
    <section className="rounded-xl border border-line bg-card p-5 shadow-command md:p-6">
      <div className="grid gap-5 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className="rounded-lg border border-line bg-command-elevated p-5 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-pill bg-brand-50 text-brand-700">
            <Gauge className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-command-muted">
            Retrain readiness
          </p>
          <p className="mt-2 font-display text-5xl font-black leading-none text-ink">
            {readinessScore}
          </p>
          <p className="mt-2 text-xs font-semibold text-command-muted">
            {correctedTickets.length} corrected / {tickets.length} loaded tickets
          </p>
        </div>

        <div className="min-w-0">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-700">
                Quality gates
              </p>
              <h2 className="mt-1 font-display text-2xl font-black text-ink">
                Dataset đã đủ sạch để retrain chưa?
              </h2>
            </div>
            <Layers3 className="hidden h-6 w-6 text-command-muted md:block" aria-hidden="true" />
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {feedbackQualityRules.map((rule) => {
              const status = gateStatus[rule.id];
              const Icon = status.passed ? CheckCircle2 : CircleDashed;
              return (
                <div key={rule.id} className="rounded-lg border border-line bg-panel p-4">
                  <div className="flex items-start gap-3">
                    <Icon
                      className={status.passed ? "h-5 w-5 text-emerald-700" : "h-5 w-5 text-signal-amber"}
                      aria-hidden="true"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-black text-ink">{rule.label}</p>
                      <p className="mt-1 text-xs font-semibold text-command-muted">
                        {status.detail} · target {rule.target}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-5 rounded-lg border border-line bg-command-elevated p-4">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-command-muted">
              Manual label distribution
            </p>
            <div className="mt-3 space-y-3">
              {distribution.length === 0 ? (
                <p className="text-sm font-semibold text-command-muted">
                  Chưa có manual label. Hãy xử lý case ở AI Review Queue trước.
                </p>
              ) : (
                distribution.slice(0, 6).map(([label, count]) => (
                  <div key={label}>
                    <div className="flex items-center justify-between gap-3 text-sm font-bold">
                      <span className="truncate text-ink">{label}</span>
                      <span className="font-mono text-command-muted">{count}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-pill bg-panel">
                      <span
                        className="st-bar-grow block h-full rounded-pill bg-brand-600"
                        style={{ width: `${Math.round((count / maxLabelCount) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
