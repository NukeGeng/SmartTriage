import type { TicketPriority, TicketStatus } from "@/types/ticket";

export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(value?: string | null) {
  if (!value) {
    return "Chưa có";
  }
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatPercent(value?: number | null) {
  if (value === null || value === undefined) {
    return "0%";
  }
  return `${Math.round(value * 100)}%`;
}

export const statusLabels: Record<TicketStatus, string> = {
  new: "Mới",
  analyzing: "Đang phân tích",
  open: "Đang mở",
  in_progress: "Đang xử lý",
  resolved: "Đã xử lý",
  rejected: "Từ chối",
};

export const priorityLabels: Record<"high" | "medium" | "low", string> = {
  high: "Cao",
  medium: "Trung bình",
  low: "Thấp",
};

export function getPriorityLabel(priority?: TicketPriority | null) {
  if (!priority) {
    return "Chưa có";
  }
  if (priority === "high" || priority === "medium" || priority === "low") {
    return priorityLabels[priority];
  }
  return priority;
}

export function getStatusLabel(status?: TicketStatus | null) {
  return status ? statusLabels[status] : "Chưa có";
}

export function toQueryString(params: Record<string, string | number | undefined | null>) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      query.set(key, String(value));
    }
  });
  const value = query.toString();
  return value ? `?${value}` : "";
}
