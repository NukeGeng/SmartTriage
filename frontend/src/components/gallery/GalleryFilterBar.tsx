// GalleryFilterBar.tsx - Pill-based gallery filters with optional live sort menu + filter flyout.
"use client";

import type { ReactNode } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";
import { GalleryFilterFlyout } from "./GalleryFilterFlyout";
import { GallerySortMenu } from "./GallerySortMenu";
import { GalleryTabMenu } from "./GalleryTabMenu";

export type GalleryFilterTab = {
  key: string;
  label: string;
};

type GalleryFilterBarProps = {
  sortLabel?: string;
  sortOptions?: GalleryFilterTab[];
  sortKey?: string;
  onSortChange?: (key: string) => void;
  tabs: GalleryFilterTab[];
  activeKey: string;
  action?: ReactNode;
  className?: string;
  filterActive?: boolean;
  renderFilterPanel?: (close: () => void) => ReactNode;
  onSelect: (key: string) => void;
  onReset?: () => void;
};

export function GalleryFilterBar({
  sortLabel = "Popular",
  sortOptions,
  sortKey,
  onSortChange,
  tabs,
  activeKey,
  action,
  className,
  filterActive = false,
  renderFilterPanel,
  onSelect,
  onReset,
}: GalleryFilterBarProps) {
  const hasSortMenu = Boolean(sortOptions && sortOptions.length > 0 && onSortChange);

  return (
    <nav
      className={cn(
        "grid items-center gap-4 py-4 lg:grid-cols-[auto_minmax(0,1fr)_auto]",
        className,
      )}
      aria-label="Ticket filters"
    >
      <div className="grid min-w-0 grid-cols-2 gap-2 lg:block">
        <div className="min-w-0">
          {hasSortMenu ? (
            <GallerySortMenu
              options={sortOptions!}
              activeKey={sortKey ?? sortOptions![0].key}
              className="w-full lg:w-fit"
              buttonClassName="w-full justify-between lg:w-fit"
              onChange={onSortChange!}
            />
          ) : (
            <button
              type="button"
              className="st-button inline-flex h-11 w-full items-center justify-between gap-2 rounded-md border border-line bg-card px-4 text-sm font-medium text-ink shadow-[0_1px_0_rgba(23,23,37,0.08)] hover:bg-neutral-50 lg:w-fit"
            >
              <span className="truncate">{sortLabel}</span>
              <ChevronDown className="h-4 w-4 shrink-0 text-neutral-500" aria-hidden="true" />
            </button>
          )}
        </div>

        <GalleryTabMenu tabs={tabs} activeKey={activeKey} onSelect={onSelect} className="lg:hidden" />
      </div>

      <div className="triage-scrollbar hidden min-w-0 items-center gap-2 overflow-x-auto lg:flex lg:justify-center">
        {tabs.map((tab) => {
          const active = tab.key === activeKey;

          return (
            <button
              key={tab.key}
              type="button"
              className={cn(
                "st-chip h-10 shrink-0 rounded-pill px-4 text-sm font-semibold",
                active
                  ? "bg-brand-50 text-brand-700 shadow-[0_8px_20px_rgba(23,23,37,0.08)]"
                  : "text-ink hover:bg-card/70",
              )}
              onClick={() => onSelect(tab.key)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-end">
        {renderFilterPanel ? (
          <GalleryFilterFlyout active={filterActive}>{renderFilterPanel}</GalleryFilterFlyout>
        ) : (
          <button
            type="button"
            className="st-button inline-flex h-11 items-center gap-2 rounded-pill border border-line bg-card px-4 text-sm font-semibold text-ink shadow-[0_1px_0_rgba(23,23,37,0.08)] hover:bg-neutral-50"
            onClick={onReset}
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Bộ lọc
          </button>
        )}
        {action}
      </div>
    </nav>
  );
}
