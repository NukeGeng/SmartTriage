import { apiFetch } from "@/lib/api";
import { toQueryString } from "@/lib/utils";
import type {
  Ticket,
  TicketCreateRequest,
  TicketFilters,
  TicketListResponse,
  TicketPaginationParams,
  TicketReanalyzeResult,
  TicketStatus,
  TicketUpdateRequest,
} from "@/types/ticket";

export const TICKET_PAGE_SIZE = 30;

export function reanalyzeAllTickets() {
  return apiFetch<TicketReanalyzeResult>("/api/v1/tickets/reanalyze", { method: "POST" });
}

export function listTickets(filters: TicketFilters = {}, pagination: TicketPaginationParams = {}) {
  return apiFetch<TicketListResponse>(
    `/api/v1/tickets${toQueryString({
      ...filters,
      page: pagination.page ?? 1,
      page_size: pagination.page_size ?? TICKET_PAGE_SIZE,
    })}`,
  );
}

export function createTicket(payload: TicketCreateRequest) {
  return apiFetch<Ticket>("/api/v1/tickets", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function getTicket(ticketId: string) {
  return apiFetch<Ticket>(`/api/v1/tickets/${ticketId}`);
}

export function updateTicketStatus(ticketId: string, status: TicketStatus) {
  return apiFetch<Ticket>(`/api/v1/tickets/${ticketId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function updateTicket(ticketId: string, payload: TicketUpdateRequest) {
  return apiFetch<Ticket>(`/api/v1/tickets/${ticketId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
