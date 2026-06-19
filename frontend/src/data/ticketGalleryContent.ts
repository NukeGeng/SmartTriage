// ticketGalleryContent.ts - Filter tabs and sort labels for paginated ticket galleries.
import type { GalleryFilterTab } from "@/components/gallery/GalleryFilterBar";
import type { TicketFilters } from "@/types/ticket";

export type TicketGalleryTab = GalleryFilterTab & {
  filters: TicketFilters;
};

export type AdminTicketSortKey = "created_at" | "priority";

export type AdminGalleryTab = GalleryFilterTab & {
  filters: TicketFilters;
  sortBy?: AdminTicketSortKey;
};

export const ticketSortOptions: GalleryFilterTab[] = [
  { key: "newest", label: "Mới nhất" },
  { key: "oldest", label: "Cũ nhất" },
  { key: "priority", label: "Điểm ưu tiên" },
];

export const ticketGalleryTabs: TicketGalleryTab[] = [
  { key: "discover", label: "Discover", filters: {} },
  { key: "new", label: "Mới", filters: { status: "new" } },
  { key: "open", label: "Đang mở", filters: { status: "open" } },
  { key: "progress", label: "Đang xử lý", filters: { status: "in_progress" } },
  { key: "high", label: "Ưu tiên cao", filters: { priority: "high" } },
  { key: "learning", label: "Nền tảng học", filters: { category: "learning_platform" } },
  { key: "network", label: "Mạng", filters: { category: "network" } },
  { key: "resolved", label: "Đã xử lý", filters: { status: "resolved" } },
];

export const adminGalleryTabs: AdminGalleryTab[] = [
  { key: "discover", label: "Discover", filters: {} },
  { key: "new", label: "Mới", filters: { status: "new" } },
  { key: "open", label: "Đang mở", filters: { status: "open" } },
  { key: "progress", label: "Đang xử lý", filters: { status: "in_progress" } },
  { key: "high", label: "Ưu tiên cao", filters: { priority: "high" }, sortBy: "priority" },
  { key: "exam", label: "Thi / lịch", filters: { category: "schedule_exam" } },
  { key: "it", label: "CNTT", filters: { category: "account_system" } },
  { key: "feedback", label: "Feedback", filters: { category: "feedback" } },
];

export const priorityRank: Record<string, number> = {
  high: 3,
  medium: 2,
  low: 1,
};
