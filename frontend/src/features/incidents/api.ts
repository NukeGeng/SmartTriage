import { apiFetch } from "@/lib/api";
import type { IncidentGroup, IncidentGroupDetail, IncidentGroupStatus } from "@/types/incident";

export function listIncidentGroups() {
  return apiFetch<IncidentGroup[]>("/api/v1/admin/incident-groups");
}

export function getIncidentGroup(groupId: string) {
  return apiFetch<IncidentGroupDetail>(`/api/v1/admin/incident-groups/${groupId}`);
}

export function updateIncidentGroupStatus(groupId: string, status: IncidentGroupStatus) {
  return apiFetch<IncidentGroupDetail>(`/api/v1/admin/incident-groups/${groupId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}
