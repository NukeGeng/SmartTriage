// TriageBotNote.tsx - Contextual TriageBot assistant note. Props: ticket. Data: data/triageBotContent.ts
import { Bot } from "lucide-react";

import { getTriageBotNote, triageBotMoodMeta } from "@/data/triageBotContent";
import { cn } from "@/lib/utils";
import type { Ticket } from "@/types/ticket";

export function TriageBotNote({ ticket }: { ticket: Ticket }) {
  const note = getTriageBotNote(ticket);
  const meta = triageBotMoodMeta[note.mood];

  return (
    <aside className="st-card relative overflow-hidden rounded-lg border border-line bg-card p-5 text-ink shadow-command">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-pill bg-brand-100/70" aria-hidden="true" />
      <div className="absolute -bottom-12 -left-8 h-28 w-28 rounded-pill bg-amber-50" aria-hidden="true" />
      <div className="relative flex items-start gap-3">
        <span className="st-idle-float grid h-11 w-11 shrink-0 place-items-center rounded-pill bg-brand-600 text-white">
          <Bot className="h-6 w-6" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-command-muted">
            TriageBot
            <span className={cn("h-1.5 w-1.5 rounded-pill", meta.dotClass)} aria-hidden="true" />
            {meta.label}
          </p>
          <p className="mt-1.5 font-display text-base font-black leading-snug">{note.headline}</p>
          <p className="mt-1.5 text-sm leading-6 text-command-muted">{note.message}</p>
        </div>
      </div>
    </aside>
  );
}
