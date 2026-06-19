"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { LoginForm } from "@/components/auth/LoginForm";
import { LoginShowcase } from "@/components/auth/LoginShowcase";
import { getStoredUser, isAuthenticated } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated()) {
      const user = getStoredUser();
      router.replace(user?.role === "student" ? "/tickets" : "/dashboard");
    }
  }, [router]);

  return (
    <main className="st-canvas min-h-screen px-4 py-6 md:px-6">
      <div className="mx-auto grid min-h-[calc(100vh-48px)] w-full max-w-[1180px] items-stretch gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <LoginShowcase />
        <div className="flex min-w-0 items-center justify-center">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
