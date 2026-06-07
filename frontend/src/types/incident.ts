import type { TicketStatus } from "./ticket";

export type IncidentGroupStatus = "open" | "in_progress" | "resolved" | "closed";

export type IncidentGroup = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  priority: string | null;
  suggested_department: string | null;
  status: IncidentGroupStatus;
  related_count: number;
  created_at: string;
  updated_at: string;
};

export type IncidentGroupTicket = {
  id: string;
  ticket_id: string;
  title: string;
  status: TicketStatus;
  similarity_score: number | null;
  reason: string | null;
  created_at: string;
};

export type IncidentGroupDetail = IncidentGroup & {
  tickets: IncidentGroupTicket[];
};
