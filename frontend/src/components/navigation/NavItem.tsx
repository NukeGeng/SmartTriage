// NavItem.tsx - Role-aware sidebar navigation atom. Props: NavigationItem, active state.
import Link from "next/link";

import type { NavigationItem as NavigationItemType } from "@/data/navigation";
import { cn } from "@/lib/utils";

interface NavItemProps {
  item: NavigationItemType;
  active: boolean;
}

export function NavItem({ item, active }: NavItemProps) {
  const Icon = item.icon;
  const available = item.available !== false;
  const baseClasses =
    "group flex min-h-11 min-w-0 items-center gap-3 rounded-md border px-3 py-2 text-sm font-semibold transition duration-150 ease-smooth";
  const stateClasses = active
    ? "border-brand-100 bg-brand-50 text-brand-700"
    : "border-transparent text-neutral-600 hover:border-line hover:bg-panel hover:text-ink";
  const disabledClasses = "cursor-not-allowed opacity-55 hover:border-transparent hover:bg-transparent hover:text-neutral-600";

  const content = (
    <>
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition",
          active
            ? "border-brand-100 bg-white text-brand-700"
            : "border-line bg-white text-neutral-500 group-hover:text-ink",
        )}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {!available ? (
        <span className="rounded-sm border border-line bg-white px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-500">
          Sắp mở
        </span>
      ) : null}
    </>
  );

  if (!available) {
    return (
      <div className={cn(baseClasses, stateClasses, disabledClasses)} aria-disabled="true" title={item.context}>
        {content}
      </div>
    );
  }

  return (
    <Link className={cn(baseClasses, stateClasses)} href={item.href} title={item.context}>
      {content}
    </Link>
  );
}
