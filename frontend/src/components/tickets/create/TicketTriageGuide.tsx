// TicketTriageGuide.tsx - Contextual TriageBot guidance for the ticket creation screen.
import { CheckCircle2 } from "lucide-react";

import { TriageBotAvatar } from "@/components/assistant/TriageBotAvatar";
import { ticketQualitySignals, ticketTriageStages } from "@/data/newTicketContent";

export function TicketTriageGuide() {
  return (
    <aside className="space-y-4">
      <section className="st-card overflow-hidden rounded-xl bg-card p-5 shadow-command">
        <div className="flex items-center gap-4">
          <TriageBotAvatar compact className="shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-700">TriageBot</p>
            <h2 className="mt-1 font-display text-xl font-black text-ink">Mô tả càng cụ thể, AI càng chắc.</h2>
          </div>
        </div>
        <div className="mt-5 space-y-3">
          {ticketQualitySignals.map((signal) => (
            <div key={signal} className="flex gap-3 rounded-lg bg-panel p-3 text-sm font-semibold text-ink">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
              <span>{signal}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-line bg-card/72 p-5 shadow-soft backdrop-blur">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">Pipeline sau khi gửi</p>
        <div className="mt-4 space-y-3">
          {ticketTriageStages.map((stage) => (
            <div key={stage.label} className="rounded-lg border border-line bg-card p-3">
              <p className="text-sm font-black text-ink">{stage.label}</p>
              <p className="mt-1 text-xs font-semibold leading-5 text-neutral-500">{stage.value}</p>
            </div>
          ))}
        </div>
      </section>
    </aside>
  );
}
