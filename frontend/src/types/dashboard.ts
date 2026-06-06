import type { Ticket, TicketPriority, TicketStatus } from "./ticket";

export type DashboardStats = {
  total_tickets: number;
  open_tickets: number;
  resolved_tickets: number;
  high_priority_tickets: number;
  avg_resolution_hours: number;
};

export type CategoryStat = {
  category: string;
  count: number;
};

export type PriorityStat = {
  priority: TicketPriority;
  count: number;
};

export type StatusStat = {
  status: TicketStatus;
  count: number;
};

export type RecentTicket = Pick<
  Ticket,
  "id" | "title" | "status" | "priority" | "category" | "assigned_department" | "created_at"
>;
