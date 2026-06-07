import { Brain, Gauge } from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatPercent } from "@/lib/utils";
import type { TicketAnalysis } from "@/types/ticket";
import { DuplicateCandidates } from "./DuplicateCandidates";
import { SuggestedActions } from "./SuggestedActions";

export function TicketAnalysisPanel({ analysis }: { analysis: TicketAnalysis | null | undefined }) {
  if (!analysis) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Kết quả AI</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-neutral-500">Ticket đã được tạo nhưng chưa có kết quả phân tích AI.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kết quả AI</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-md border border-line bg-panel p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Brain className="h-4 w-4 text-brand-600" aria-hidden="true" />
              Category
            </div>
            <p className="mt-2 text-lg font-semibold text-ink">{analysis.category_label}</p>
            <p className="text-xs text-neutral-500">{analysis.predicted_category}</p>
          </div>
          <div className="rounded-md border border-line bg-panel p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Gauge className="h-4 w-4 text-brand-600" aria-hidden="true" />
              Độ tin cậy
            </div>
            <p className="mt-2 text-lg font-semibold text-ink">
              {formatPercent(analysis.category_confidence)}
            </p>
            <p className="text-xs text-neutral-500">Model {analysis.model_version}</p>
          </div>
          <div className="rounded-md border border-line bg-panel p-3">
            <p className="text-sm font-semibold text-ink">Ưu tiên</p>
            <div className="mt-2 flex items-center gap-2">
              <Badge priority={analysis.priority} />
              <span className="text-sm font-semibold text-ink">{analysis.priority_score}/100</span>
            </div>
            <p className="mt-1 text-xs text-neutral-500">{analysis.suggested_department}</p>
          </div>
        </div>
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-ink">Phản ánh tương tự</h3>
          <DuplicateCandidates candidates={analysis.duplicate_candidates} />
        </section>
        <section className="space-y-2">
          <h3 className="text-sm font-semibold text-ink">Gợi ý xử lý</h3>
          <SuggestedActions actions={analysis.suggested_actions} />
        </section>
      </CardContent>
    </Card>
  );
}
