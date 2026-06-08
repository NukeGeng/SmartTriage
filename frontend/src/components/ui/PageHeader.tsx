// PageHeader.tsx - Page-level heading block with optional actions.
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, title, description, actions, className }: PageHeaderProps) {
  return (
    <header className={cn("flex min-w-0 flex-col justify-between gap-4 md:flex-row md:items-end", className)}>
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-xs font-black uppercase tracking-[0.14em] text-brand-700">{eyebrow}</p>
        ) : null}
        <h1 className="mt-1 max-w-4xl font-display text-3xl font-black tracking-tight text-ink md:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-neutral-600">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}
