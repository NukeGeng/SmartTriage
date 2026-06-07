import { apiFetch } from "@/lib/api";
import type { TriageOverview } from "@/types/triage";

export function getTriageOverview() {
  return apiFetch<TriageOverview>("/api/v1/admin/triage/overview");
}
