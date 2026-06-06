import { Badge } from "@/components/ui/Badge";
import type { DuplicateCandidate } from "@/types/ticket";

export function DuplicateCandidates({ candidates }: { candidates: DuplicateCandidate[] }) {
  if (candidates.length === 0) {
    return <p className="text-sm text-neutral-500">Không phát hiện phản ánh tương tự.</p>;
  }

  return (
    <div className="space-y-2">
      {candidates.map((candidate) => (
        <div
          key={candidate.ticket_id}
          className="flex items-center justify-between gap-3 rounded-md border border-line bg-panel px-3 py-2"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-ink">{candidate.title}</p>
            <p className="text-xs text-neutral-500">{candidate.ticket_id}</p>
          </div>
          <Badge tone="amber">{Math.round(candidate.similarity * 100)}%</Badge>
        </div>
      ))}
    </div>
  );
}
