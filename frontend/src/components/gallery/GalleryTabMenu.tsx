// GalleryTabMenu.tsx - Compact mobile dropdown for gallery quick-view tabs.
"use client";

import { Check, ChevronDown } from "lucide-react";

import { useDismissable } from "@/hooks/useDismissable";
import { cn } from "@/lib/utils";
import type { GalleryFilterTab } from "./GalleryFilterBar";

interface GalleryTabMenuProps {
  tabs: GalleryFilterTab[];
  activeKey: string;
  className?: string;
  onSelect: (key: string) => void;
}

export function GalleryTabMenu({ tabs, activeKey, className, onSelect }: GalleryTabMenuProps) {
  const { open, setOpen, ref } = useDismissable<HTMLDivElement>();
  const active = tabs.find((tab) => tab.key === activeKey) ?? tabs[0];

  return (
    <div ref={ref} className={cn("relative min-w-0", className)}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        className="st-button flex h-11 w-full min-w-0 items-center justify-between gap-2 rounded-md border border-line bg-card px-4 text-left text-sm font-semibold text-ink shadow-[0_1px_0_rgba(23,23,37,0.08)] hover:bg-neutral-50"
        onClick={() => setOpen(!open)}
      >
        <span className="min-w-0 truncate">{active?.label ?? "Góc nhìn"}</span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-neutral-500 transition-transform duration-300 ease-out-expo", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>

      {open ? (
        <div
          role="listbox"
          aria-label="Chọn bộ lọc nhanh"
          className="st-pop-in absolute right-0 top-[calc(100%+8px)] z-30 max-h-72 w-full min-w-56 overflow-y-auto rounded-lg border border-line bg-card p-1.5 shadow-command"
        >
          {tabs.map((tab) => {
            const selected = tab.key === activeKey;
            return (
              <button
                key={tab.key}
                type="button"
                role="option"
                aria-selected={selected}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm font-semibold",
                  selected ? "bg-brand-50 text-brand-700" : "text-ink hover:bg-neutral-50",
                )}
                onClick={() => {
                  onSelect(tab.key);
                  setOpen(false);
                }}
              >
                <span className="truncate">{tab.label}</span>
                {selected ? <Check className="h-4 w-4 shrink-0" aria-hidden="true" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
