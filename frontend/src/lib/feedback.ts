import type { Ticket, TicketPriority } from "@/types/ticket";

export function isCorrectedTicket(ticket: Ticket) {
  return Boolean(ticket.manual_category || ticket.manual_priority);
}

export function getTicketConfidence(ticket: Ticket) {
  return ticket.analysis?.category_confidence ?? ticket.category_confidence ?? null;
}

export function getAiCategory(ticket: Ticket) {
  return ticket.analysis?.predicted_category ?? ticket.ai_category ?? ticket.category ?? "";
}

export function getAiCategoryLabel(ticket: Ticket) {
  return ticket.analysis?.category_label ?? ticket.category_label ?? getAiCategory(ticket) ?? "N/A";
}

export function getAiPriority(ticket: Ticket): TicketPriority | null {
  return ticket.analysis?.priority ?? ticket.ai_priority ?? ticket.priority ?? null;
}

export function getManualLabel(ticket: Ticket) {
  return ticket.manual_category ?? ticket.manual_priority ?? "";
}
