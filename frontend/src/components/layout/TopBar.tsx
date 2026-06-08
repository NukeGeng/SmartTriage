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
    <header className="sticky top-0 z-sticky border-b border-white/10 bg-command-bg/[0.88] px-4 backdrop-blur-xl md:px-6 xl:px-8">
      <div className="mx-auto flex min-h-20 w-full max-w-[1440px] items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-black uppercase tracking-[0.16em] text-brand-100">
            SmartTriage Console
          </p>
          <h1 className="truncate font-display text-xl font-black tracking-tight text-command-text md:text-2xl">
            {context.label}
          </h1>
          <p className="mt-1 hidden max-w-2xl truncate text-sm font-medium text-command-muted md:block">
            {context.context}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden items-center gap-2 rounded-md border border-white/10 bg-white/[0.05] px-3 py-2 md:flex">
            <UserCircle className="h-5 w-5 text-brand-100" aria-hidden="true" />
            <div className="min-w-0">
              <p className="max-w-44 truncate text-sm font-bold text-command-text">
                {user?.full_name ?? "Người dùng"}
              </p>
              <p className="text-xs font-semibold text-command-muted">{roleLabels[role]}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="border-white/10 text-command-text hover:bg-white/10 hover:text-command-text"
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
