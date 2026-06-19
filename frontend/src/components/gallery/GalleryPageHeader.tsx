// GalleryPageHeader.tsx - Centered Dribbble-style page heading for SmartTriage screens.
import { cn } from "@/lib/utils";

type GalleryPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  related?: string[];
  className?: string;
};

export function GalleryPageHeader({
  eyebrow,
  title,
  description,
  related = [],
  className,
}: GalleryPageHeaderProps) {
  return (
    <header className={cn("mx-auto max-w-4xl px-4 pb-8 pt-4 text-center", className)}>
      {eyebrow ? (
        <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-neutral-500">{eyebrow}</p>
      ) : null}
      <h1 className="font-display text-[clamp(2rem,4vw,3.5rem)] font-black leading-[1.02] text-ink">
        {title}
      </h1>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-neutral-500 md:text-base">{description}</p>
      {related.length > 0 ? (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs md:text-sm">
          <span className="text-neutral-500">Related:</span>
          {related.map((item) => (
            <span
              key={item}
              className="st-link font-medium text-ink hover:text-brand-700"
            >
              {item}
            </span>
          ))}
        </div>
      ) : null}
    </header>
  );
}
