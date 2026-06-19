// GallerySortMenu.tsx - Click-to-open sort dropdown for gallery toolbars.
"use client";

import { Check, ChevronDown } from "lucide-react";

import { useDismissable } from "@/hooks/useDismissable";
import { cn } from "@/lib/utils";
import type { GalleryFilterTab } from "./GalleryFilterBar";

type GallerySortMenuProps = {
  options: GalleryFilterTab[];
  activeKey: string;
  className?: string;
  buttonClassName?: string;
  onChange: (key: string) => void;
};

export function GallerySortMenu({ options, activeKey, className, buttonClassName, onChange }: GallerySortMenuProps) {
  const { open, setOpen, ref } = useDismissable<HTMLDivElement>();
  const active = options.find((option) => option.key === activeKey) ?? options[0];

  return (
    <div ref={ref} className={cn("relative w-fit", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "st-button inline-flex h-11 items-center gap-2 rounded-md border border-line bg-card px-4 text-sm font-medium text-ink shadow-[0_1px_0_rgba(23,23,37,0.08)] hover:bg-neutral-50",
          buttonClassName,
        )}
        onClick={() => setOpen(!open)}
      >
        {active.label}
        <ChevronDown
          className={cn("h-4 w-4 text-neutral-500 transition-transform duration-300 ease-out-expo", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label="Sắp xếp danh sách"
          className="st-pop-in absolute left-0 top-[calc(100%+8px)] z-30 w-48 rounded-md bg-card p-1.5 shadow-command"
        >
          {options.map((option) => {
            const selected = option.key === activeKey;
            return (
              <button
                key={option.key}
                type="button"
                role="option"
                aria-selected={selected}
                className={cn(
                  "flex w-full items-center justify-between rounded-sm px-3 py-2 text-sm font-semibold",
                  selected ? "bg-brand-50 text-brand-700" : "text-ink hover:bg-neutral-50",
                )}
                onClick={() => {
                  onChange(option.key);
                  setOpen(false);
                }}
              >
                {option.label}
                {selected ? <Check className="h-4 w-4" aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
