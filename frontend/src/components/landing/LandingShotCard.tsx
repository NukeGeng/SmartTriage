// LandingShotCard.tsx - Product capability card for the SmartTriage landing grid.
import { Eye, Heart, PlayCircle } from "lucide-react";

import type { LandingShot } from "@/data/landingContent";
import { cn } from "@/lib/utils";

type LandingShotCardProps = {
  shot: LandingShot;
  index: number;
  featured?: boolean;
  className?: string;
};

export function LandingShotCard({ shot, index, featured = false, className }: LandingShotCardProps) {
  const Icon = shot.icon;

  return (
    <article className={cn("group min-w-0", className)}>
      <div
        className={cn(
          "st-card relative flex h-full min-h-[300px] overflow-hidden rounded-xl border border-line bg-gradient-to-br shadow-soft",
          featured ? "min-h-[390px] md:min-h-[420px]" : "min-h-[300px]",
          shot.imageTone,
        )}
      >
        <div className="absolute inset-x-5 top-5 z-10 flex min-w-0 items-center gap-3 text-sm">
          <span className={cn("grid h-7 w-7 shrink-0 place-items-center rounded-pill text-xs font-black text-white", shot.accentTone)}>
            {shot.owner.slice(0, 1)}
          </span>
          <p className="min-w-0 flex-1 truncate font-bold text-ink">{shot.owner}</p>
          <span className="inline-flex shrink-0 items-center gap-1 text-neutral-500">
            <Heart className="h-4 w-4 fill-current" aria-hidden="true" />
            {shot.likes}
          </span>
          <span className="hidden shrink-0 items-center gap-1 text-neutral-500 sm:inline-flex">
            <Eye className="h-4 w-4" aria-hidden="true" />
            {shot.views}
          </span>
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-pill bg-card/80 text-ink">
            <PlayCircle className="h-4 w-4" aria-hidden="true" />
          </span>
        </div>

        <div className="absolute left-5 top-[4.35rem] z-10 rounded-pill bg-card/90 px-3 py-1 text-xs font-black text-ink">
          {shot.category}
        </div>

        <div className="absolute inset-x-5 bottom-5 rounded-xl border border-line bg-card/90 p-5 shadow-command backdrop-blur">
          <div className={cn("flex gap-4", featured ? "items-end" : "items-start")}>
            <span className={cn("grid shrink-0 place-items-center rounded-lg text-white", featured ? "h-16 w-16" : "h-12 w-12", shot.accentTone)}>
              <Icon className={featured ? "h-8 w-8" : "h-6 w-6"} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-neutral-500">Mô-đun 0{index + 1}</p>
              <h3 className={cn("st-title-lift mt-2 line-clamp-2 font-display font-black leading-none text-ink", featured ? "text-3xl" : "text-2xl")}>
                {shot.title}
              </h3>
              <p className="mt-2 line-clamp-3 text-sm font-semibold leading-6 text-neutral-500">{shot.description}</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
