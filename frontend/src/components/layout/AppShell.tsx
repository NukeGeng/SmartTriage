"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getStoredUser, getToken } from "@/lib/auth";
import type { User } from "@/types/auth";
import { Loading } from "@/components/ui/Loading";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function syncAuth() {
      const token = getToken();
      const storedUser = getStoredUser();
      if (!token) {
        router.replace("/login");
        return;
      }
      setUser(storedUser);
      setReady(true);
    }

    syncAuth();
    window.addEventListener("smarttriage-auth-change", syncAuth);
    return () => window.removeEventListener("smarttriage-auth-change", syncAuth);
  }, [router]);

  if (!ready) {
    return <Loading label="Đang mở SmartTriage..." />;
  }

  return (
    <div className="min-h-screen bg-panel text-ink lg:flex">
      <Sidebar user={user} />
      <div className="min-w-0 flex-1">
        <Topbar user={user} />
        <main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6">{children}</main>
      </div>
    </div>
  );
}
