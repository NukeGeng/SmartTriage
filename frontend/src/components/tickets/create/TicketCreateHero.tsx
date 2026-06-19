// TicketCreateHero.tsx - Student-facing intro for the AI-assisted ticket intake flow.
import { Sparkles } from "lucide-react";

import { ticketCreateHero } from "@/data/newTicketContent";

export function TicketCreateHero() {
  return (
    <section className="st-card overflow-hidden rounded-xl border border-line bg-card p-6 text-ink shadow-command md:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_280px] lg:items-end">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 rounded-pill bg-brand-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-brand-700">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {ticketCreateHero.eyebrow}
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-4xl font-black leading-none text-ink md:text-5xl">
            {ticketCreateHero.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-command-muted md:text-base">
            {ticketCreateHero.description}
          </p>
        </div>

        <div className="rounded-lg border border-line bg-command-elevated p-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">AI will inspect</p>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {["category", "priority", "duplicates"].map((item) => (
              <span key={item} className="rounded-md border border-line bg-card px-2 py-3 text-xs font-bold text-ink">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
