export type TicketStatus =
  | "new"
  | "analyzing"
  | "open"
  | "in_progress"
  | "resolved"
  | "rejected";

export type TicketPriority = "low" | "medium" | "high" | string;

export type DuplicateCandidate = {
  ticket_id: string;
  title: string;
  similarity: number;
};

export type TicketAnalysis = {
  id: string;
  ticket_id: string;
  predicted_category: string;
  category_label: string;
  category_confidence: number;
  priority: TicketPriority;
  priority_score: number;
  suggested_department: string;
  duplicate_candidates: DuplicateCandidate[];
  suggested_actions: string[];
  model_version: string;
  created_at: string;
};

export type Ticket = {
  id: string;
  title: string;
  description?: string;
  status: TicketStatus;
  created_by_id?: string;
  assigned_department: string | null;
  assigned_to_id?: string | null;
  manual_category?: string | null;
  manual_priority?: string | null;
  category?: string | null;
  priority?: TicketPriority | null;
  priority_score?: number | null;
  created_at: string;
  updated_at: string;
  resolved_at?: string | null;
  analysis?: TicketAnalysis | null;
};

export type TicketListResponse = {
  items: Ticket[];
  total: number;
  page: number;
  page_size: number;
};

export type TicketCreateRequest = {
  title: string;
  description: string;
};

export type TicketUpdateRequest = {
  manual_category?: string | null;
  manual_priority?: string | null;
  assigned_department?: string | null;
  assigned_to_id?: string | null;
};

export type TicketFilters = {
  status?: string;
  priority?: string;
  category?: string;
  assigned_department?: string;
  search?: string;
};
