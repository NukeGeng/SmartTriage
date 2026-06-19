// ReviewQueueHero.tsx - Header for the human review workflow.
import { Workflow } from "lucide-react";

import { reviewQueueHero, reviewSignals } from "@/data/reviewQueueContent";

export function ReviewQueueHero() {
  return (
    <section className="st-card overflow-hidden rounded-xl border border-line bg-card p-6 text-ink shadow-command md:p-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-end">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 rounded-pill bg-brand-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-brand-700">
            <Workflow className="h-3.5 w-3.5" aria-hidden="true" />
            {reviewQueueHero.eyebrow}
          </p>
          <h1 className="mt-5 font-display text-4xl font-black leading-none md:text-5xl">{reviewQueueHero.title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-command-muted md:text-base">{reviewQueueHero.description}</p>
        </div>

        <div className="rounded-lg border border-line bg-command-elevated p-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">Review signals</p>
          <div className="mt-3 space-y-2">
            {reviewSignals.map((signal) => (
              <p key={signal} className="rounded-md border border-line bg-card px-3 py-2 text-xs font-bold text-ink">
                {signal}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
