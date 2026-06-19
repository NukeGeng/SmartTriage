// GalleryFilterFlyout.tsx - "Bộ lọc" button that drops a custom filter panel.
"use client";

import type { ReactNode } from "react";
import { SlidersHorizontal } from "lucide-react";

import { useDismissable } from "@/hooks/useDismissable";

type GalleryFilterFlyoutProps = {
  active?: boolean;
  children: (close: () => void) => ReactNode;
};

export function GalleryFilterFlyout({ active = false, children }: GalleryFilterFlyoutProps) {
  const { open, setOpen, ref } = useDismissable<HTMLDivElement>();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        className="st-button relative inline-flex h-11 items-center gap-2 rounded-pill border border-line bg-card px-4 text-sm font-semibold text-ink shadow-[0_1px_0_rgba(23,23,37,0.08)] hover:bg-neutral-50"
        onClick={() => setOpen(!open)}
      >
        <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
        Bộ lọc
        {active ? (
          <span
            className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-pill bg-brand-600 ring-2 ring-card"
            aria-hidden="true"
          />
        ) : null}
      </button>

      {open ? (
        <div className="st-pop-in absolute right-0 top-[calc(100%+8px)] z-30 w-[300px] rounded-lg bg-card p-4 shadow-command">
          {children(() => setOpen(false))}
        </div>
      ) : null}
    </div>
  );
}
