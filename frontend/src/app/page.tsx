"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { getStoredUser, isAuthenticated } from "@/lib/auth";
import { Loading } from "@/components/ui/Loading";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    const user = getStoredUser();
    router.replace(user?.role === "student" ? "/tickets" : "/dashboard");
  }, [router]);

  return <Loading label="Đang điều hướng..." />;
}
