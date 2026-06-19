// LandingCategoryBar.tsx - Module rail that anchors the SmartTriage landing sections.
import { SlidersHorizontal } from "lucide-react";

type LandingCategoryBarProps = {
  categories: string[];
};

export function LandingCategoryBar({ categories }: LandingCategoryBarProps) {
  return (
    <section className="mx-auto w-full max-w-[1280px] px-5 py-4 md:px-8">
      <div className="flex flex-col gap-4 rounded-xl border border-line bg-card/82 p-3 shadow-soft backdrop-blur xl:flex-row xl:items-center">
        <div className="flex shrink-0 items-center gap-3 rounded-lg border border-line bg-command-elevated px-4 py-3 text-sm font-black text-ink">
          <SlidersHorizontal className="h-4 w-4 text-brand-700" aria-hidden="true" />
          Mô-đun điều phối
        </div>

        <nav className="flex min-w-0 flex-1 gap-2 overflow-x-auto triage-scrollbar" aria-label="Nhóm tính năng trên landing page">
          {categories.map((category, index) => (
            <button
              key={category}
              className={
                index === 0
                  ? "st-chip shrink-0 rounded-pill bg-brand-50 px-4 py-2.5 text-sm font-black text-brand-700"
                  : "st-chip shrink-0 rounded-pill px-4 py-2.5 text-sm font-bold text-ink hover:bg-card"
              }
            >
              {category}
            </button>
          ))}
        </nav>
      </div>
    </section>
  );
}
