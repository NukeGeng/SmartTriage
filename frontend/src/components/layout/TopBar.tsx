// TopBar.tsx - Auth-aware console header with current route context.
"use client";

import { usePathname, useRouter } from "next/navigation";
import { LogOut, UserCircle } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { getNavigationContext } from "@/data/navigation";
import { clearToken } from "@/lib/auth";
import type { User } from "@/types/auth";

const roleLabels: Record<string, string> = {
  admin: "Admin",
  staff: "Staff",
  student: "Sinh viên",
};

export function TopBar({ user }: { user: User | null }) {
  const router = useRouter();
  const pathname = usePathname();
  const role = user?.role ?? "student";
  const context = getNavigationContext(pathname, role);

  function handleLogout() {
    clearToken();
    router.replace("/login");
  }

  return (
    <header className="sticky top-0 z-sticky border-b border-line bg-card px-5 md:px-6 xl:px-8">
      <div className="mx-auto flex min-h-16 w-full max-w-[1440px] items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-700">
            SmartTriage Console
          </p>
          <h1 className="truncate font-display text-lg font-bold tracking-tight text-ink md:text-xl">
            {context.label}
          </h1>
          <p className="hidden max-w-2xl truncate text-sm font-normal text-neutral-500 md:block">
            {context.context}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden items-center gap-2 border-l border-line pl-3 md:flex">
            <UserCircle className="h-5 w-5 text-neutral-500" aria-hidden="true" />
            <div className="min-w-0">
              <p className="max-w-44 truncate text-sm font-semibold text-ink">
                {user?.full_name ?? "Người dùng"}
              </p>
              <p className="text-xs font-medium text-neutral-500">{roleLabels[role]}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="text-neutral-700 hover:border-line hover:bg-card hover:text-ink"
            icon={<LogOut className="h-4 w-4" aria-hidden="true" />}
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
        </div>
      </div>
    </header>
  );
}
