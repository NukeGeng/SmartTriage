// MLFeedbackHero.tsx - Header for the ML feedback loop screen.
import { Sparkles } from "lucide-react";

import { feedbackBoardQuestions, mlFeedbackHero } from "@/data/mlFeedbackContent";

export function MLFeedbackHero() {
  return (
    <section className="st-card rounded-xl border border-line bg-card p-6 text-ink shadow-command md:p-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
        <div className="min-w-0">
          <p className="inline-flex items-center gap-2 rounded-pill bg-brand-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-brand-700">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            {mlFeedbackHero.eyebrow}
          </p>
          <h1 className="mt-5 font-display text-4xl font-black leading-none md:text-5xl">{mlFeedbackHero.title}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-6 text-command-muted md:text-base">{mlFeedbackHero.description}</p>
        </div>
        <div className="rounded-lg border border-line bg-command-elevated p-4">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-command-muted">
            Board answers
          </p>
          <div className="mt-3 space-y-2">
            {feedbackBoardQuestions.map((question, index) => (
              <p key={question} className="rounded-md border border-line bg-card px-3 py-2 text-xs font-bold text-ink">
                <span className="mr-2 font-mono text-brand-700">Q{index + 1}</span>
                {question}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
