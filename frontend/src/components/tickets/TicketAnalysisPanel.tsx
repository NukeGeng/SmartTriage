import { AIAnalysisPanel } from "@/components/ai/AIAnalysisPanel";
import type { TicketAnalysis } from "@/types/ticket";

export function TicketAnalysisPanel({ analysis }: { analysis: TicketAnalysis | null | undefined }) {
  return <AIAnalysisPanel analysis={analysis} />;
}
