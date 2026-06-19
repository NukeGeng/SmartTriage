// ModelPipelinePanel.tsx - Visual pipeline explaining how SmartTriage turns text into triage output.
import { ArrowRight } from "lucide-react";

import { modelPipelineSteps } from "@/data/modelInfoContent";

export function ModelPipelinePanel() {
  return (
    <section className="rounded-xl bg-card p-5 shadow-command md:p-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-700">Inference pipeline</p>
          <h2 className="mt-1 font-display text-2xl font-black text-ink">Text vào, quyết định triage ra.</h2>
        </div>
        <p className="text-sm font-semibold text-neutral-500">Backend gọi AI service qua HTTP</p>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-4">
        {modelPipelineSteps.map((step, index) => (
          <article key={step.label} className="relative rounded-lg border border-line bg-panel p-4">
            <p className="font-mono text-xs font-bold text-brand-700">0{index + 1}</p>
            <h3 className="mt-3 text-sm font-black text-ink">{step.label}</h3>
            <p className="mt-2 text-xs font-semibold leading-5 text-neutral-500">{step.detail}</p>
            {index < modelPipelineSteps.length - 1 ? (
              <ArrowRight className="absolute right-4 top-4 hidden h-4 w-4 text-neutral-300 md:block" aria-hidden="true" />
            ) : null}
          </article>
        ))}
      </div>
    </section>
  );
}
