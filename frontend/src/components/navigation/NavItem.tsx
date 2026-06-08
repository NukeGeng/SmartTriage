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
    "group flex min-h-10 min-w-0 items-center gap-2.5 rounded-md border border-transparent px-2.5 py-2 text-sm font-medium transition duration-150 ease-smooth";
  const stateClasses = active
    ? "text-brand-700"
    : "text-neutral-600 hover:border-line hover:bg-white hover:text-ink";
  const disabledClasses = "cursor-not-allowed opacity-50 hover:border-transparent hover:bg-transparent hover:text-neutral-600";

  const content = (
    <>
      <Icon
        className={cn("h-4 w-4 shrink-0", active ? "text-brand-700" : "text-neutral-500 group-hover:text-ink")}
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1 truncate">{item.label}</span>
      {!available ? (
        <span className="text-[10px] font-semibold uppercase tracking-[0.1em] text-neutral-400">
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
