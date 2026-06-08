// Sidebar.tsx - Role-aware command navigation for student and staff workflows.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bot, Signal } from "lucide-react";

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
    <aside className="border-b border-white/10 bg-command-soft text-command-text lg:sticky lg:top-0 lg:min-h-screen lg:w-72 lg:border-b-0 lg:border-r">
      <div className="flex h-full flex-col">
        <div className="flex h-20 items-center border-b border-white/10 px-4 lg:px-5">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-brand-500/30 bg-brand-500/15 text-sm font-black text-brand-100 shadow-glow">
              ST
              <Signal className="absolute -right-1 -top-1 h-3.5 w-3.5 text-brand-100" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-base font-black tracking-tight">SmartTriage</span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-command-muted">
                <Bot className="h-3.5 w-3.5" aria-hidden="true" />
                AI triage command center
              </span>
            </span>
          </Link>
        </div>
        <nav className="triage-scrollbar flex gap-2 overflow-x-auto px-3 py-3 lg:flex-1 lg:flex-col lg:gap-5 lg:overflow-visible lg:px-4 lg:py-5">
          {visibleSections.map((section) => {
            const sectionItems = visibleItems.filter((item) => item.section === section.id);
            return (
              <section key={section.id} className="min-w-max space-y-2 lg:min-w-0">
                <p className="hidden px-3 text-[11px] font-black uppercase tracking-[0.16em] text-command-muted lg:block">
                  {section.label}
                </p>
                <div className="flex gap-2 lg:flex-col">
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
