// NavItem.tsx - Icon-only floating dock item with above-label hover context.
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
    "st-icon-button group relative flex h-12 w-12 shrink-0 items-center justify-center rounded-pill text-sm font-medium";
  const stateClasses = active
    ? "bg-brand-600 text-white shadow-[0_12px_28px_rgba(37,99,235,0.24)]"
    : "text-neutral-500 hover:bg-brand-50 hover:text-brand-700 focus-visible:bg-brand-50 focus-visible:text-brand-700";
  const disabledClasses = "cursor-not-allowed opacity-45 hover:bg-transparent hover:text-neutral-500";

  const content = (
    <>
      <Icon className="h-5 w-5 shrink-0 text-current" aria-hidden="true" />
      <span className="sr-only">{item.label}</span>
      <span className="st-tooltip absolute bottom-[calc(100%+12px)] left-1/2 w-64 rounded-2xl border border-line bg-card px-4 py-3 text-left text-xs text-ink shadow-command">
        <span className="block font-bold">{item.label}</span>
        <span className="mt-1 block leading-5 text-command-muted">
          {item.context}
          {!available ? " Sắp mở." : ""}
        </span>
      </span>
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
    <Link className={cn(baseClasses, stateClasses)} href={item.href} aria-label={item.label}>
      {content}
    </Link>
  );
}
