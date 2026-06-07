"use client";

import { useRouter } from "next/navigation";
import { LogOut, UserCircle } from "lucide-react";

import { clearToken } from "@/lib/auth";
import type { User } from "@/types/auth";
import { Button } from "@/components/ui/Button";

const roleLabels: Record<string, string> = {
  admin: "Admin",
  staff: "Staff",
  student: "Student",
};

export function Topbar({ user }: { user: User | null }) {
  const router = useRouter();

  function handleLogout() {
    clearToken();
    router.replace("/login");
  }

  return (
    <header className="flex min-h-16 items-center justify-between border-b border-line bg-white px-4 md:px-6">
      <div>
        <p className="text-xs font-semibold uppercase text-brand-700">SmartTriage Console</p>
        <h1 className="text-lg font-semibold text-ink">Điều phối phản ánh sinh viên</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden items-center gap-2 rounded-md border border-line bg-panel px-3 py-2 md:flex">
          <UserCircle className="h-5 w-5 text-brand-600" aria-hidden="true" />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{user?.full_name ?? "Người dùng"}</p>
            <p className="text-xs text-neutral-500">{roleLabels[user?.role ?? "student"]}</p>
          </div>
        </div>
        <Button
          variant="secondary"
          icon={<LogOut className="h-4 w-4" aria-hidden="true" />}
          onClick={handleLogout}
        >
          Đăng xuất
        </Button>
      </div>
    </header>
  );
}
