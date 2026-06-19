"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { DashboardBarChart } from "@/components/dashboard/DashboardBarChart";
import { DashboardMetricStrip } from "@/components/dashboard/DashboardMetricStrip";
import { DashboardRecentTickets } from "@/components/dashboard/DashboardRecentTickets";
import { GalleryFilterBar, type GalleryFilterTab } from "@/components/gallery/GalleryFilterBar";
import { GalleryPageHeader } from "@/components/gallery/GalleryPageHeader";
import { AppShell } from "@/components/layout/AppShell";
import { Loading } from "@/components/ui/Loading";
import { Toast } from "@/components/ui/Toast";
import {
  getDashboardStats,
  getRecentTickets,
  getTicketsByCategory,
  getTicketsByPriority,
  getTicketsByStatus,
} from "@/features/dashboard/api";
import { getStoredUser } from "@/lib/auth";
import { getPriorityLabel, getStatusLabel } from "@/lib/utils";
import type {
  CategoryStat,
  DashboardStats,
  PriorityStat,
  RecentTicket,
  StatusStat,
} from "@/types/dashboard";
const dashboardTabs: GalleryFilterTab[] = [
  { key: "discover", label: "Discover" },
  { key: "priority", label: "AI Priority" },
  { key: "category", label: "Category" },
  { key: "status", label: "Status" },
  { key: "routing", label: "Routing" },
  { key: "recent", label: "Recent" },
  { key: "resolved", label: "Resolved" },
];

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [categories, setCategories] = useState<CategoryStat[]>([]);
  const [priorities, setPriorities] = useState<PriorityStat[]>([]);
  const [statuses, setStatuses] = useState<StatusStat[]>([]);
  const [recentTickets, setRecentTickets] = useState<RecentTicket[]>([]);
  const [activeTab, setActiveTab] = useState("discover");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notification, setNotification] = useState("");
  const latestTicketIdRef = useRef<string | null>(null);

  const loadDashboard = useCallback(async (showLoading = false) => {
    if (showLoading) setLoading(true);
    setError("");

    try {
      const [nextStats, nextCategories, nextPriorities, nextStatuses, nextRecent] = await Promise.all([
        getDashboardStats(),
        getTicketsByCategory(),
        getTicketsByPriority(),
        getTicketsByStatus(),
        getRecentTickets(8),
      ]);

      const latestTicketId = nextRecent[0]?.id ?? null;
      if (!showLoading && latestTicketId && latestTicketIdRef.current && latestTicketId !== latestTicketIdRef.current) {
        setNotification("Có phản ánh mới vừa được gửi.");
      }
      latestTicketIdRef.current = latestTicketId;

      setStats(nextStats);
      setCategories(nextCategories);
      setPriorities(nextPriorities);
      setStatuses(nextStatuses);
      setRecentTickets(nextRecent);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được dashboard");
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    const user = getStoredUser();
    if (user?.role === "student") {
      router.replace("/tickets");
      return;
    }

    void loadDashboard(true);
    const intervalId = window.setInterval(() => {
      void loadDashboard(false);
    }, 10000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [loadDashboard, router]);
  return (
    <AppShell>
      <Toast message={notification} onClose={() => setNotification("")} />
      <div className="space-y-8">
        <GalleryPageHeader
          eyebrow="Dashboard"
          title="Tổng quan phản ánh"
          description="Theo dõi ticket, ưu tiên AI và luồng xử lý trong một giao diện gallery dễ scan hơn."
          related={["ticket", "AI priority", "category", "routing", "resolution"]}
        />

        <GalleryFilterBar
          sortLabel="Live"
          tabs={dashboardTabs}
          activeKey={activeTab}
          onSelect={setActiveTab}
          onReset={() => setActiveTab("discover")}
        />

        {loading ? (
          <Loading />
        ) : error ? (
          <div className="rounded-lg bg-rose-50 p-4 text-sm font-medium text-rose-700 shadow-sm">{error}</div>
        ) : (
          <>
            <DashboardMetricStrip stats={stats} />
            <div className="grid gap-5 xl:grid-cols-3">
              <DashboardBarChart
                title="Ticket theo category"
                data={categories.map((item) => ({ label: item.category, count: item.count }))}
              />
              <DashboardBarChart
                title="Ticket theo priority"
                data={priorities.map((item) => ({ label: getPriorityLabel(item.priority), count: item.count }))}
              />
              <DashboardBarChart
                title="Ticket theo status"
                data={statuses.map((item) => ({ label: getStatusLabel(item.status), count: item.count }))}
              />
            </div>
            <DashboardRecentTickets tickets={recentTickets} />
          </>
        )}
      </div>
    </AppShell>
  );
}
