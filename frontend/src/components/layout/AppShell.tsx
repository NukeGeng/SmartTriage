// AppShell.tsx - Auth-protected application shell for the SmartTriage console.
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { Sidebar } from "@/components/layout/Sidebar";
import { Loading } from "@/components/ui/Loading";
import { getStoredUser, getToken } from "@/lib/auth";
import type { User } from "@/types/auth";

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
    <div className="st-canvas min-h-screen text-command-text">
      <Sidebar user={user} />
      <main className="mx-auto w-full max-w-[1440px] px-4 pb-32 pt-6 md:px-6 xl:px-8">
        <div className="st-page-enter min-w-0">{children}</div>
      </main>
    </div>
  );
}
