"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCcw } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Loading } from "@/components/ui/Loading";
import { CriticalQueue } from "@/components/triage/CriticalQueue";
import { IncidentSuggestionList } from "@/components/triage/IncidentSuggestionList";
import { LowConfidenceCases } from "@/components/triage/LowConfidenceCases";
import { RoutingRecommendations } from "@/components/triage/RoutingRecommendations";
import { TriageSummaryCards } from "@/components/triage/TriageSummaryCards";
import { TriageTicketCard } from "@/components/triage/TriageTicketCard";
import { getTriageOverview } from "@/features/triage/api";
import { getStoredUser } from "@/lib/auth";
import type { TriageOverview } from "@/types/triage";

export default function TriageCockpitPage() {
  const router = useRouter();
  const [overview, setOverview] = useState<TriageOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOverview(showLoading = true) {
    if (showLoading) setLoading(true);
    setError("");
    try {
      setOverview(await getTriageOverview());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không tải được triage cockpit");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const user = getStoredUser();
    if (user?.role === "student") {
      router.replace("/tickets");
      return;
    }

    void loadOverview(true);
  }, [router]);

  return (
    <AppShell>
      <div className="space-y-5">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-brand-700">Smart Triage Cockpit</p>
            <h1 className="text-2xl font-semibold text-ink">Điều phối phản ánh dựa trên phân tích AI</h1>
            <p className="mt-1 text-sm text-neutral-600">
              Ưu tiên ticket cần xử lý ngay, rà soát confidence thấp và gợi ý nhóm phản ánh cùng chủ đề.
            </p>
          </div>
          <Button
            variant="secondary"
            icon={<RefreshCcw className="h-4 w-4" aria-hidden="true" />}
            onClick={() => loadOverview(true)}
          >
            Refresh
          </Button>
        </div>

        {error ? (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
            {error}
          </div>
        ) : null}

        {loading || !overview ? (
          <Loading />
        ) : (
          <>
            <TriageSummaryCards summary={overview.summary} />

            <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
              <Card>
                <CardHeader>
                  <CardTitle>Critical Queue</CardTitle>
                </CardHeader>
                <CardContent>
                  <CriticalQueue tickets={overview.critical_queue} />
                </CardContent>
              </Card>

              <div className="space-y-5">
                <Card>
                  <CardHeader>
                    <CardTitle>Low Confidence Cases</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LowConfidenceCases tickets={overview.low_confidence_cases} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>AI Routing Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <RoutingRecommendations recommendations={overview.routing_recommendations} />
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Possible Incident Groups</CardTitle>
                </CardHeader>
                <CardContent>
                  <IncidentSuggestionList groups={overview.possible_incident_groups} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Tickets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {overview.recent_tickets.length === 0 ? (
                    <p className="text-sm text-neutral-500">Chưa có ticket gần đây.</p>
                  ) : (
                    overview.recent_tickets.map((ticket) => (
                      <TriageTicketCard key={ticket.id} ticket={ticket} />
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
