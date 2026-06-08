import { Brain, Building2, Gauge, ListChecks, Route, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { getPriorityLabel } from "@/lib/utils";
import type { TicketAnalysis } from "@/types/ticket";
import { DuplicateCandidates } from "@/components/tickets/DuplicateCandidates";
import { ConfidenceMeter } from "./ConfidenceMeter";
import { DetectedSignals } from "./DetectedSignals";
import { PriorityBadge } from "./PriorityBadge";
import { SuggestedActions } from "./SuggestedActions";

function scoreWidth(score: number) {
  return `${Math.max(0, Math.min(score, 100))}%`;
}

export function AIAnalysisPanel({ analysis }: { analysis: TicketAnalysis | null | undefined }) {
  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Triage Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-500">Ticket đã được tạo nhưng chưa có kết quả phân tích AI.</p>
        </CardContent>
      </Card>
    );
  }

  const explanation = analysis.explanation;
  const priorityBreakdown = analysis.priority_breakdown;
  const detectedSignals = explanation?.detected_signals ?? [];

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-700">AI Triage Analysis</p>
            <CardTitle>Phân tích điều phối phản ánh</CardTitle>
          </div>
          <Badge tone="cyan">Model {analysis.model_version}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-md border border-line bg-panel p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Brain className="h-4 w-4 text-brand-600" aria-hidden="true" />
              Nhóm phản ánh
            </div>
            <p className="mt-2 text-lg font-semibold text-ink">{analysis.category_label}</p>
            <p className="text-xs text-neutral-500">{analysis.predicted_category}</p>
            <div className="mt-3">
              <ConfidenceMeter value={analysis.category_confidence} />
            </div>
          </div>

          <div className="rounded-md border border-line bg-panel p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Gauge className="h-4 w-4 text-brand-600" aria-hidden="true" />
              Priority Score
            </div>
            <div className="mt-2 flex items-center gap-2">
              <PriorityBadge priority={analysis.priority} />
              <span className="text-sm font-semibold text-ink">{analysis.priority_score}/100</span>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-100">
              <div className="h-full rounded-full bg-amber-500" style={{ width: scoreWidth(analysis.priority_score) }} />
            </div>
            <p className="mt-2 text-xs text-neutral-500">Mức {getPriorityLabel(analysis.priority)}</p>
          </div>

          <div className="rounded-md border border-line bg-panel p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Building2 className="h-4 w-4 text-brand-600" aria-hidden="true" />
              Suggested Department
            </div>
            <p className="mt-2 text-lg font-semibold text-ink">{analysis.suggested_department}</p>
            <p className="text-xs text-neutral-500">Dựa trên category và rule routing</p>
          </div>
        </div>

        {explanation ? (
          <section className="space-y-3 rounded-md border border-line bg-white p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Sparkles className="h-4 w-4 text-brand-600" aria-hidden="true" />
              Explanation Summary
            </div>
            <p className="text-sm leading-6 text-neutral-700">{explanation.summary}</p>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-md bg-panel p-3">
                <p className="text-xs font-semibold uppercase text-neutral-500">Category reason</p>
                <p className="mt-1 text-sm text-neutral-700">{explanation.category_reason}</p>
              </div>
              <div className="rounded-md bg-panel p-3">
                <p className="text-xs font-semibold uppercase text-neutral-500">Priority reason</p>
                <p className="mt-1 text-sm text-neutral-700">{explanation.priority_reason}</p>
              </div>
              <div className="rounded-md bg-panel p-3">
                <p className="text-xs font-semibold uppercase text-neutral-500">Department reason</p>
                <p className="mt-1 text-sm text-neutral-700">{explanation.department_reason}</p>
              </div>
            </div>
          </section>
        ) : null}

        <section className="space-y-2">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
            <Route className="h-4 w-4 text-brand-600" aria-hidden="true" />
            Detected Signals
          </h3>
          <DetectedSignals signals={detectedSignals} />
        </section>

        {priorityBreakdown ? (
          <section className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-ink">Priority Breakdown</h3>
              <span className="text-sm font-semibold text-ink">{priorityBreakdown.total_score}/100</span>
            </div>
            <div className="space-y-2">
              {priorityBreakdown.items.map((item) => (
                <div key={item.name} className="rounded-md border border-line bg-panel p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-ink">
                        {item.score > 0 ? `+${item.score}` : item.score} {item.name}
                      </p>
                      <p className="mt-1 text-sm text-neutral-600">{item.reason}</p>
                    </div>
                    <div className="h-2 w-24 shrink-0 overflow-hidden rounded-full bg-neutral-100">
                      <div className="h-full rounded-full bg-brand-600" style={{ width: scoreWidth(item.score) }} />
                    </div>
                  </div>
                  {item.matched_terms && item.matched_terms.length > 0 ? (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.matched_terms.map((term) => (
                        <Badge key={`${item.name}-${term}`} tone="neutral">
                          {term}
                        </Badge>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}

        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-ink">Phản ánh tương tự</h3>
          <DuplicateCandidates candidates={analysis.duplicate_candidates} />
        </section>

        <section className="space-y-2">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
            <ListChecks className="h-4 w-4 text-brand-600" aria-hidden="true" />
            Suggested Actions
          </h3>
          <SuggestedActions actions={analysis.suggested_actions} />
        </section>
      </CardContent>
    </Card>
  );
}
