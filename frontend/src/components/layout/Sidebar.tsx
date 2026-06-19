// Sidebar.tsx - Floating bottom navigation dock for student and staff workflows.
"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut, Sparkles } from "lucide-react";

import { NavItem } from "@/components/navigation/NavItem";
import { getVisibleNavigation, isNavigationItemActive } from "@/data/navigation";
import { clearToken } from "@/lib/auth";
import type { User } from "@/types/auth";

export function Sidebar({ user }: { user: User | null }) {
  const router = useRouter();
  const pathname = usePathname();
  const role = user?.role ?? "student";
  const visibleItems = getVisibleNavigation(role);

  function handleLogout() {
    clearToken();
    router.replace("/login");
  }

  return (
    <aside className="fixed inset-x-0 bottom-4 z-sticky flex justify-center px-3 text-ink">
      <div className="flex max-w-[calc(100vw-24px)] flex-wrap items-center justify-center gap-2 rounded-[28px] border border-line bg-white/95 px-3 py-2 shadow-command backdrop-blur sm:rounded-pill">
        <div className="group relative hidden h-12 w-12 shrink-0 items-center justify-center rounded-pill bg-brand-600 text-white sm:flex">
          <Sparkles className="h-5 w-5" aria-hidden="true" />
          <div className="st-tooltip absolute bottom-[calc(100%+12px)] left-1/2 w-52 rounded-2xl border border-line bg-card px-4 py-3 text-left text-xs text-ink shadow-command">
            <p className="font-bold">SmartTriage</p>
            <p className="mt-1 text-command-muted">{user?.full_name ?? "AI-assisted triage console"}</p>
          </div>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-1.5" aria-label="SmartTriage console navigation">
          {visibleItems.map((item) => (
            <NavItem key={item.href} item={item} active={isNavigationItemActive(item, pathname)} />
          ))}
        </nav>

        <span className="mx-1 h-8 w-px shrink-0 bg-line" aria-hidden="true" />

        <button
          type="button"
          className="st-icon-button group relative flex h-12 w-12 shrink-0 items-center justify-center rounded-pill text-neutral-500 hover:bg-brand-50 hover:text-brand-700 focus-visible:bg-brand-50 focus-visible:text-brand-700"
          onClick={handleLogout}
          aria-label="Đăng xuất"
        >
          <LogOut className="h-5 w-5" aria-hidden="true" />
          <span className="st-tooltip absolute bottom-[calc(100%+12px)] left-1/2 w-max rounded-2xl border border-line bg-card px-4 py-2 text-xs font-bold text-ink shadow-command">
            Đăng xuất
          </span>
        </button>
      </div>
    </aside>
  );
}
