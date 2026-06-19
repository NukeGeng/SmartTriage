// ModelInfoHero.tsx - Header panel for model transparency and live AI service status.
import { CheckCircle2, RefreshCcw, XCircle } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { modelInfoHero } from "@/data/modelInfoContent";

type ModelInfoHeroProps = {
  loaded?: boolean;
  loading: boolean;
  onRefresh: () => void;
};

export function ModelInfoHero({ loaded, loading, onRefresh }: ModelInfoHeroProps) {
  const ready = Boolean(loaded);

  return (
    <section className="st-card overflow-hidden rounded-xl border border-line bg-card p-6 text-ink shadow-command md:p-8">
      <div className="grid gap-6 lg:grid-cols-[1fr_320px] lg:items-end">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-700">{modelInfoHero.eyebrow}</p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-black leading-none md:text-5xl">
            {modelInfoHero.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-command-muted md:text-base">
            {modelInfoHero.description}
          </p>
        </div>

        <div className="rounded-lg border border-line bg-command-elevated p-4">
          <div className="flex items-center gap-3">
            {ready ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-700" aria-hidden="true" />
            ) : (
              <XCircle className="h-5 w-5 text-rose-700" aria-hidden="true" />
            )}
            <div className="min-w-0">
              <p className="text-sm font-black">{ready ? "Model loaded" : "Model not loaded"}</p>
              <p className="text-xs font-semibold text-neutral-500">Status from AI service</p>
            </div>
          </div>
          <Button
            variant="secondary"
            icon={<RefreshCcw className="h-4 w-4" aria-hidden="true" />}
            onClick={onRefresh}
            disabled={loading}
            className="mt-4 w-full rounded-pill"
          >
            Làm mới
          </Button>
        </div>
      </div>
    </section>
  );
}
