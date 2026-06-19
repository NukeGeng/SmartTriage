// LandingWorkflowStrip.tsx - Compact AI workflow strip for the SmartTriage landing page.
import { ArrowRight } from "lucide-react";

type LandingWorkflowStripProps = {
  steps: string[];
};

export function LandingWorkflowStrip({ steps }: LandingWorkflowStripProps) {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-5 py-10 md:px-8">
      <div className="rounded-xl border border-line bg-card p-6 text-ink shadow-command md:p-8">
        <div className="grid gap-4 lg:grid-cols-[0.8fr_1fr] lg:items-end">
          <div>
            <p className="text-sm font-bold text-brand-700">Quy trình AI</p>
            <h2 className="mt-2 max-w-xl font-display text-4xl font-black leading-none">
              Một phản ánh, năm bước xử lý.
            </h2>
          </div>
          <p className="text-sm font-semibold leading-6 text-command-muted">
            SmartTriage biến mô tả tự do thành phân loại, ưu tiên, nhóm sự cố và hành động tiếp theo cho nhân viên xử lý.
          </p>
        </div>

        <div className="mt-7 grid gap-3 md:grid-cols-5">
          {steps.map((step, index) => (
            <div key={step} className="relative rounded-lg border border-line bg-command-elevated p-4">
              <span className="font-mono text-xs font-bold text-brand-700">0{index + 1}</span>
              <p className="mt-3 text-sm font-black">{step}</p>
              {index < steps.length - 1 ? (
                <ArrowRight className="absolute right-4 top-4 hidden h-4 w-4 text-neutral-500 md:block" aria-hidden="true" />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
