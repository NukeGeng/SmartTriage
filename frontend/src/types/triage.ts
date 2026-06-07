import type { TicketPriority, TicketStatus } from "./ticket";

export type TriageSummary = {
  total_open: number;
  high_priority: number;
  low_confidence: number;
  possible_incidents: number;
};

export type TriageTicket = {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  assigned_department: string | null;
  category: string | null;
  category_label: string | null;
  priority: TicketPriority | null;
  priority_score: number | null;
  category_confidence: number | null;
  suggested_department: string | null;
  created_at: string;
  updated_at: string;
};

export type IncidentRelatedTicket = {
  ticket_id: string;
  title: string;
  similarity: number;
  reason: string;
};

export type IncidentGroupSuggestion = {
  group_key: string;
  title: string;
  category: string | null;
  average_similarity: number;
  related_count: number;
  related_tickets: IncidentRelatedTicket[];
  recommendation: string;
};

export type RoutingRecommendation = {
  ticket: TriageTicket;
  recommended_department: string;
  reason: string;
};

export type TriageOverview = {
  summary: TriageSummary;
  critical_queue: TriageTicket[];
  low_confidence_cases: TriageTicket[];
  possible_incident_groups: IncidentGroupSuggestion[];
  routing_recommendations: RoutingRecommendation[];
  recent_tickets: TriageTicket[];
};
