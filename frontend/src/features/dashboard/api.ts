import { apiFetch } from "@/lib/api";
import type {
  CategoryStat,
  DashboardStats,
  PriorityStat,
  RecentTicket,
  StatusStat,
} from "@/types/dashboard";

export function getDashboardStats() {
  return apiFetch<DashboardStats>("/api/v1/dashboard/stats");
}

export function getTicketsByCategory() {
  return apiFetch<CategoryStat[]>("/api/v1/dashboard/tickets-by-category");
}

export function getTicketsByPriority() {
  return apiFetch<PriorityStat[]>("/api/v1/dashboard/tickets-by-priority");
}

export function getTicketsByStatus() {
  return apiFetch<StatusStat[]>("/api/v1/dashboard/tickets-by-status");
}

export function getRecentTickets(limit = 10) {
  return apiFetch<RecentTicket[]>(`/api/v1/dashboard/recent-tickets?limit=${limit}`);
}
