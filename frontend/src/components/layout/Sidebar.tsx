"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, Brain, ClipboardList, FilePlus2, Radar, ShieldCheck } from "lucide-react";

import { cn } from "@/lib/utils";
import type { User } from "@/types/auth";

const navItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: BarChart3,
    roles: ["staff", "admin"],
  },
  {
    href: "/admin/triage",
    label: "Triage Cockpit",
    icon: Radar,
    roles: ["staff", "admin"],
  },
  {
    href: "/tickets",
    label: "Phản ánh",
    icon: ClipboardList,
    roles: ["student", "staff", "admin"],
  },
  {
    href: "/tickets/new",
    label: "Tạo mới",
    icon: FilePlus2,
    roles: ["student", "staff", "admin"],
  },
  {
    href: "/admin/tickets",
    label: "Quản lý",
    icon: ShieldCheck,
    roles: ["staff", "admin"],
  },
  {
    href: "/admin/model-info",
    label: "Model Info",
    icon: Brain,
    roles: ["staff", "admin"],
  },
];

export function Sidebar({ user }: { user: User | null }) {
  const pathname = usePathname();
  const role = user?.role ?? "student";
  const visibleItems = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside className="border-b border-line bg-ink text-white lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r lg:border-neutral-800">
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b border-neutral-800 px-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-500 text-sm font-bold">
              ST
            </span>
            <span className="text-base font-semibold">SmartTriage</span>
          </Link>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-3 py-3 lg:flex-col lg:overflow-visible">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-10 shrink-0 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white",
                  active && "bg-brand-600 text-white",
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
