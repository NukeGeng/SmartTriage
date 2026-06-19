// ModelCategoryCloud.tsx - Supported category list for AI service model info.
import { Badge } from "@/components/ui/Badge";
import { modelTrustSignals } from "@/data/modelInfoContent";

type ModelCategoryCloudProps = {
  categories: string[];
};

export function ModelCategoryCloud({ categories }: ModelCategoryCloudProps) {
  return (
    <aside className="space-y-4">
      <section className="rounded-xl bg-card p-5 shadow-command">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-700">Supported categories</p>
        {categories.length === 0 ? (
          <p className="mt-4 rounded-lg bg-panel p-4 text-sm font-semibold text-neutral-500">
            Chưa có danh sách category từ AI service.
          </p>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge key={category} tone="cyan" className="rounded-pill bg-cyan-50 px-3">
                {category}
              </Badge>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-line bg-card/72 p-5 shadow-soft backdrop-blur">
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">Why this matters</p>
        <div className="mt-4 space-y-3">
          {modelTrustSignals.map((signal) => (
            <p key={signal} className="rounded-lg bg-card p-3 text-sm font-semibold leading-6 text-ink">
              {signal}
            </p>
          ))}
        </div>
      </section>
    </aside>
  );
}
