// Sidebar.tsx - Role-aware navigation for student and staff workflows.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { NavItem } from "@/components/navigation/NavItem";
import {
  getVisibleNavigation,
  getVisibleSections,
  isNavigationItemActive,
} from "@/data/navigation";
import type { User } from "@/types/auth";

export function Sidebar({ user }: { user: User | null }) {
  const pathname = usePathname();
  const role = user?.role ?? "student";
  const visibleItems = getVisibleNavigation(role);
  const visibleSections = getVisibleSections(role);

  return (
    <aside className="border-b border-line bg-white text-ink lg:sticky lg:top-0 lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-line px-5">
          <Link href="/" className="min-w-0">
            <span className="block truncate text-lg font-bold tracking-tight text-ink">SmartTriage</span>
            <span className="block truncate text-xs font-medium text-neutral-500">AI-assisted triage</span>
          </Link>
        </div>
        <nav className="triage-scrollbar flex gap-2 overflow-x-auto px-3 py-3 lg:flex-1 lg:flex-col lg:gap-5 lg:overflow-visible lg:px-3 lg:py-5">
          {visibleSections.map((section) => {
            const sectionItems = visibleItems.filter((item) => item.section === section.id);
            return (
              <section key={section.id} className="min-w-max space-y-1.5 lg:min-w-0">
                <p className="hidden px-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-neutral-500 lg:block">
                  {section.label}
                </p>
                <div className="flex gap-1 lg:flex-col">
                  {sectionItems.map((item) => (
                    <NavItem
                      key={item.href}
                      item={item}
                      active={isNavigationItemActive(item, pathname)}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
